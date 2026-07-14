#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多硬碟照片盤點 — 以相機機身為主(Sony focus)
"""

import os
import sys
import csv
import shutil
import subprocess
import argparse
from collections import Counter, defaultdict

# 只掃這些照片副檔名
RAW_EXTS = {"arw", "dng", "cr2", "cr3", "nef", "nrw", "raf", "orf", "rw2",
            "pef", "srw", "x3f", "3fr", "iiq", "gpr", "sr2"}
JPG_EXTS = {"jpg", "jpeg", "jpe", "heic", "heif", "tif", "tiff", "png", "bmp", "webp"}
PHOTO_EXTS = RAW_EXTS | JPG_EXTS

EXIF_TAGS = ["-Model", "-LensModel", "-LensID", "-DateTimeOriginal", "-CreateDate", "-FileType"]

def run_exiftool_dir(root):
    """對一個資料夾遞迴跑 exiftool,只挑照片副檔名,回傳 list of dict。"""
    ext_args = []
    for e in sorted(PHOTO_EXTS):
        ext_args += ["-ext", e]
    cmd = [
        "exiftool", "-r", "-q", "-n", "-fast", "-csv",
        "-charset", "filename=utf8",
        "-Directory", "-FileName", "-FileSize", "-FileModifyDate",
        *EXIF_TAGS, *ext_args, root,
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    text = proc.stdout.decode("utf-8", errors="replace")
    if not text.strip():
        return []
    return list(csv.DictReader(text.splitlines()))

def to_row(e, drive):
    """轉換 exiftool 資料列，增加安全性檢查避免 NoneType 錯誤"""
    if not e:
        return None
        
    src = e.get("SourceFile") or ""
    name = e.get("FileName") or os.path.basename(src) or "unknown_file"
    
    # 強制將 name 轉為字串，確保 splitext 不會報錯
    ext = os.path.splitext(str(name))[1].lower().lstrip(".")
    
    try:
        raw_size = e.get("FileSize")
        size_mb = round(float(raw_size) / (1024 * 1024), 2) if raw_size else 0
    except (ValueError, TypeError):
        size_mb = 0
        
    return {
        "drive": drive,
        "path": src,
        "filename": name,
        "ext": ext,
        "is_raw": "Y" if ext in RAW_EXTS else "N",
        "size_mb": size_mb,
        "modified": (e.get("FileModifyDate") or "")[:19],
        "camera": e.get("Model", "") or "",
        "lens": e.get("LensModel") or e.get("LensID") or "",
        "date_taken": (e.get("DateTimeOriginal") or e.get("CreateDate") or "")[:19],
        "filetype": e.get("FileType", "") or "",
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("roots", nargs="+", help="要盤點的硬碟或資料夾")
    ap.add_argument("--out", default="photos_inventory.csv", help="輸出 CSV 檔名")
    args = ap.parse_args()

    if not shutil.which("exiftool"):
        print("錯誤:找不到 exiftool。")
        sys.exit(1)

    roots = [os.path.abspath(os.path.expanduser(r)) for r in args.roots if os.path.isdir(os.path.abspath(os.path.expanduser(r)))]
    
    fields = ["drive", "path", "filename", "ext", "is_raw", "size_mb",
              "modified", "camera", "lens", "date_taken", "filetype"]
    all_rows = []
    SKIP = {".Spotlight-V100", ".Trashes", ".fseventsd", ".TemporaryItems",
            ".DocumentRevisions-V100", "$RECYCLE.BIN", "System Volume Information"}

    for root in roots:
        try:
            subs = sorted(d for d in os.listdir(root)
                          if os.path.isdir(os.path.join(root, d))
                          and d not in SKIP and not d.startswith("."))
        except OSError:
            subs = []
        targets = [os.path.join(root, s) for s in subs] or [root]
        print(f"→ 掃描 {root}(共 {len(targets)} 個資料夾)…")
        drive_count = 0
        for i, t in enumerate(targets, 1):
            raw_data = run_exiftool_dir(t)
            drive_count += len(raw_data)
            for e in raw_data:
                row = to_row(e, root)
                if row:
                    all_rows.append(row)
            print(f"  [{i}/{len(targets)}] {os.path.basename(t)} : {len(raw_data):,} 張(累計 {drive_count:,})")
        print(f"  → {root} 小計 {drive_count:,} 張\n")

    # (後續 CSV 輸出與彙總程式碼保持不變，可直接接續在下方)
    # ... (下方省略，請保留原檔中後續的彙總邏輯)