from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "icons"
ICON_DIR.mkdir(exist_ok=True)


def draw_icon(size: int, maskable: bool = False) -> Image.Image:
    scale = size / 512
    image = Image.new("RGB", (size, size), "#101923")
    draw = ImageDraw.Draw(image)

    radius = int(42 * scale)
    line_width = max(1, int(18 * scale))
    draw.line(
        [(116 * scale, 190 * scale), (396 * scale, 190 * scale)],
        fill="#294049",
        width=line_width,
    )
    draw.line(
        [(116 * scale, 322 * scale), (396 * scale, 322 * scale)],
        fill="#294049",
        width=line_width,
    )
    for x in (126, 256, 386):
        draw.ellipse(
            [
                ((x * scale) - radius, (190 * scale) - radius),
                ((x * scale) + radius, (190 * scale) + radius),
            ],
            fill="#35b9ad",
        )

    plus_width = max(1, int(28 * scale))
    draw.line(
        [(256 * scale, 266 * scale), (256 * scale, 378 * scale)],
        fill="#f2f8f7",
        width=plus_width,
    )
    draw.line(
        [(200 * scale, 322 * scale), (312 * scale, 322 * scale)],
        fill="#f2f8f7",
        width=plus_width,
    )

    if maskable:
        return image

    alpha = Image.new("L", (size, size), 0)
    alpha_draw = ImageDraw.Draw(alpha)
    corner_radius = int(112 * scale)
    alpha_draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=corner_radius, fill=255)
    image.putalpha(alpha)
    return image


draw_icon(180).save(ICON_DIR / "apple-touch-icon.png")
draw_icon(192).save(ICON_DIR / "icon-192.png")
draw_icon(512).save(ICON_DIR / "icon-512.png")
draw_icon(512, maskable=True).save(ICON_DIR / "icon-maskable-512.png")
