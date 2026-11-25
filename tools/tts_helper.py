import os
import sys
import json
import asyncio
import edge_tts

VOICE_MAP = {
    "vi": {"voice": "vi-VN-HoaiMyNeural"},
    "ja": {"voice": "ja-JP-NanamiNeural", "rate": "-8%", "pitch": "+3Hz"},
}


async def synthesize_one(text: str, lang: str, out_path: str, retries: int = 3) -> bool:
    cfg = VOICE_MAP.get(lang, VOICE_MAP["vi"])
    tmp_path = f"{out_path}.tmp"
    for attempt in range(retries):
        try:
            kwargs = {}
            if attempt == 0 and "rate" in cfg:
                kwargs["rate"] = cfg["rate"]
                kwargs["pitch"] = cfg["pitch"]
            communicate = edge_tts.Communicate(text, cfg["voice"], **kwargs)
            await communicate.save(tmp_path)
            if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                os.replace(tmp_path, out_path)
                return True
        except Exception as err:
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
            if attempt == retries - 1:
                print(f"[FAIL] ({lang}) {text}: {err}", file=sys.stderr, flush=True)
                return False
            await asyncio.sleep(0.8 * (attempt + 1))
    return False


async def run_batch(items: list[dict]) -> None:
    ok_count = 0
    fail_count = 0
    for idx, item in enumerate(items, 1):
        text = str(item.get("text", "")).strip()
        lang = "ja" if item.get("lang") == "ja" else "vi"
        out_path = str(item["out"])
        if not text:
            continue
        ok = await synthesize_one(text, lang, out_path)
        if ok:
            ok_count += 1
        else:
            fail_count += 1
        if idx % 25 == 0:
            print(f"Progress: {idx}/{len(items)} (ok={ok_count}, failed={fail_count})", flush=True)
        await asyncio.sleep(0.05)

    print(f"Batch complete: ok={ok_count}, failed={fail_count}", flush=True)


def main() -> None:
    raw = sys.stdin.buffer.read().decode("utf-8")
    payload = json.loads(raw)
    if "--batch" in sys.argv:
        asyncio.run(run_batch(payload))
        return

    text = str(payload.get("text", "")).strip()
    lang = "ja" if payload.get("lang") == "ja" else "vi"
    out_path = str(payload["out"])
    if not text:
        sys.exit(1)
    ok = asyncio.run(synthesize_one(text, lang, out_path, retries=2))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
