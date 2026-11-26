import io
import os
import urllib.request
import urllib.parse
from PIL import Image

BASE = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main"
OUT_ROOT = os.path.join(os.getcwd(), "assets", "img")

ASSETS = [
    # Animals (256x256)
    ("animals/rabbit.webp", "Rabbit face", "rabbit_face_3d.png", 256),
    ("animals/bear.webp", "Bear", "bear_3d.png", 256),
    ("animals/cat.webp", "Cat face", "cat_face_3d.png", 256),
    ("animals/fox.webp", "Fox", "fox_3d.png", 256),
    ("animals/elephant.webp", "Elephant", "elephant_3d.png", 256),
    ("animals/owl.webp", "Owl", "owl_3d.png", 256),
    ("animals/monkey.webp", "Monkey face", "monkey_face_3d.png", 256),
    ("animals/penguin.webp", "Penguin", "penguin_3d.png", 256),
    ("animals/lion.webp", "Lion", "lion_3d.png", 256),
    # Objects (128x128)
    ("objects/carrot.webp", "Carrot", "carrot_3d.png", 128),
    ("objects/apple.webp", "Red apple", "red_apple_3d.png", 128),
    ("objects/fish.webp", "Fish", "fish_3d.png", 128),
    ("objects/ball.webp", "Soccer ball", "soccer_ball_3d.png", 128),
    ("objects/balloon.webp", "Balloon", "balloon_3d.png", 128),
    ("objects/firefly.webp", "Sparkles", "sparkles_3d.png", 128),
    ("objects/banana.webp", "Banana", "banana_3d.png", 128),
    ("objects/candy.webp", "Candy", "candy_3d.png", 128),
    ("objects/lantern.webp", "Red paper lantern", "red_paper_lantern_3d.png", 128),
    ("objects/star.webp", "Glowing star", "glowing_star_3d.png", 128),
]


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "MathZoo-AssetFetcher/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read()


def main() -> None:
    lic = fetch_bytes(f"{BASE}/LICENSE").decode("utf-8", errors="replace")
    print("=== LICENSE START ===")
    print("\n".join(lic.splitlines()[:10]))
    print("=== LICENSE END ===")

    for rel, folder, filename, size in ASSETS:
        out_path = os.path.join(OUT_ROOT, rel)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        url = f"{BASE}/assets/{urllib.parse.quote(folder)}/3D/{filename}"
        raw = fetch_bytes(url)
        img = Image.open(io.BytesIO(raw)).convert("RGBA")
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(out_path, "WEBP", quality=90, method=6)
        print(f"OK {rel} ({os.path.getsize(out_path)} bytes)")


if __name__ == "__main__":
    main()
