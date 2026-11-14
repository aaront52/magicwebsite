#!/usr/bin/env python3
"""
Prepare photos for the website.

  python3 tools/optimize_images.py path/to/photo.jpg assets/img/gallery/05-my-show

Creates web-ready copies next to the output name:
  05-my-show-800.webp, 05-my-show-1600.webp, 05-my-show-1600.jpg
It fixes rotation, strips hidden metadata (GPS location, camera info)
and resizes, so pages stay fast. Requires Pillow:  pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

WIDTHS = (800, 1600)


def optimize(src: str, out_base: str) -> None:
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    out = Path(out_base)
    out.parent.mkdir(parents=True, exist_ok=True)
    for w in WIDTHS:
        copy = im.copy()
        if copy.width > w:
            copy = copy.resize((w, round(copy.height * w / copy.width)), Image.LANCZOS)
        copy.save(f"{out}-{w}.webp", "WEBP", quality=80, method=6)
        if w == max(WIDTHS):
            copy.save(f"{out}-{w}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{out.name}: {im.width}x{im.height} -> {', '.join(str(w) for w in WIDTHS)}px")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    optimize(sys.argv[1], sys.argv[2])
