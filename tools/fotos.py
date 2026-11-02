# Prepara las fotos definitivas de la web a partir de las que envía el cliente.
#
# Uso:  python3 -I tools/fotos.py <carpeta_con_las_fotos> [--focus foto-007=0.5,0.3] [--dry]
#
# - Los nombres de fichero son los de tools/fotos-espais.csv (foto-001.jpg … foto-066.jpg); vale cualquier
#   extensión que lea Pillow (jpg, jpeg, png, webp, heic si está soportado, tif…).
# - Cada foto se endereza según su EXIF, se recorta a la proporción de su espacio (centrada, o en el punto
#   --focus en fracciones 0–1 de ancho y alto) y se exporta a src/assets/fotos/<slug>-<ancho>.{avif,webp,jpg}
#   a 640, 960, 1280 y 1920 px de ancho (sin ampliar nunca la original). Se eliminan todos los metadatos
#   (EXIF, GPS, modelo de cámara…).
# - Actualiza src/_data/fotos.json: { "<etiqueta del espacio>": { base, widths, ratio, w, h, alt, archivo } }.
#   La etiqueta es la descripción del espacio provisional en el código (m.placeholder("…") o «imagen:» del
#   artículo), y la macro placeholder la usa para pintar la foto en lugar de la imagen provisional.
# - El «alt» se inicializa con la descripción del espacio y se marca como pendiente de revisar: hay que
#   describir lo que sale DE VERDAD en la foto (fotos.json, campo alt; altRevisado: true cuando esté hecho).
# - Avisa si una foto es más pequeña que el mínimo recomendado o si el recorte se come mucha imagen.
import csv, io, json, os, re, sys, unicodedata, glob

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "tools", "fotos-espais.csv")
OUT = os.path.join(ROOT, "src", "assets", "fotos")
DATA = os.path.join(ROOT, "src", "_data", "fotos.json")
WIDTHS = [640, 960, 1280, 1920]


def slug(text, words=7):
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    t = re.sub(r"\(.*?\)", " ", t)
    stop = {"de", "del", "la", "el", "los", "las", "y", "con", "en", "un", "una", "a", "al", "por", "para", "sobre", "junto", "entre", "sus", "su"}
    parts = [w for w in re.findall(r"[a-z0-9]+", t) if w not in stop]
    return "-".join(parts[:words]) or "foto"


def code_labels():
    labels = set()
    for f in glob.glob(os.path.join(ROOT, "src", "**", "*.njk"), recursive=True):
        labels.update(re.findall(r'm\.placeholder\("([^"]+)"', open(f, encoding="utf-8").read()))
    for f in glob.glob(os.path.join(ROOT, "src", "recursos", "articulos", "*.md")):
        m = re.search(r'^imagen:\s*"([^"]+)"', open(f, encoding="utf-8").read(), re.M)
        if m:
            labels.add(m.group(1))
    return labels


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print(__doc__ if __doc__ else "Uso: python3 -I tools/fotos.py <carpeta>")
        sys.exit(1)
    src_dir, dry = args[0], "--dry" in args
    focus = {}
    for i, a in enumerate(args):
        if a == "--focus" and i + 1 < len(args):
            k, v = args[i + 1].split("=")
            x, y = (float(n) for n in v.split(","))
            focus[k.replace(".jpg", "")] = (x, y)

    rows = list(csv.reader(io.open(CSV, encoding="utf-8-sig"), delimiter=";"))[1:]
    slots = {os.path.splitext(r[5])[0]: {"num": r[0], "pagina": r[1], "label": r[2], "ratio": r[3], "min": r[4]} for r in rows}
    labels = code_labels()
    data = json.load(open(DATA, encoding="utf-8")) if os.path.exists(DATA) else {}
    os.makedirs(OUT, exist_ok=True)

    files = {os.path.splitext(f)[0].lower(): os.path.join(src_dir, f) for f in os.listdir(src_dir) if not f.startswith(".")}
    done, warn = [], []
    for key, path in sorted(files.items()):
        if key not in slots:
            warn.append(f"{os.path.basename(path)}: no corresponde a ningún espacio de tools/fotos-espais.csv")
            continue
        s = slots[key]
        if s["label"] not in labels:
            warn.append(f"{key}: la descripción del espacio ya no está en el código ({s['pagina']}); revisa tools/fotos-espais.csv")
            continue
        try:
            im = ImageOps.exif_transpose(Image.open(path))
        except Exception as e:
            warn.append(f"{key}: no se puede abrir ({e})")
            continue
        im = im.convert("RGB")
        rw, rh = (int(n) for n in s["ratio"].split("/"))
        W, H = im.size
        target = rw / rh
        if W / H > target:  # sobra ancho
            nw = round(H * target); fx = focus.get(key, (0.5, 0.5))[0]
            left = min(max(0, round(fx * W - nw / 2)), W - nw)
            box = (left, 0, left + nw, H)
        else:  # sobra alto
            nh = round(W / target); fy = focus.get(key, (0.5, 0.5))[1]
            top = min(max(0, round(fy * H - nh / 2)), H - nh)
            box = (0, top, W, top + nh)
        lost = 1 - ((box[2] - box[0]) * (box[3] - box[1])) / (W * H)
        im = im.crop(box)
        cw, ch = im.size
        minw = int(re.findall(r"\d+", s["min"])[0])
        if cw < minw:
            warn.append(f"{key}: {cw}px de ancho tras el recorte (recomendado ≥ {minw}px); se verá algo blanda en pantallas grandes")
        if lost > 0.3:
            warn.append(f"{key}: el recorte a {s['ratio']} descarta el {lost:.0%} de la foto; revisa el encuadre o usa --focus")
        name = slug(s["label"])
        widths = [w for w in WIDTHS if w <= cw] or [cw]
        if not dry:
            for w in widths:
                h = round(w * rh / rw)
                r = im.resize((w, h), Image.LANCZOS)
                base = os.path.join(OUT, f"{name}-{w}")
                r.save(base + ".avif", quality=52)
                r.save(base + ".webp", quality=80, method=6)
                r.save(base + ".jpg", quality=82, optimize=True, progressive=True)
        prev = data.get(s["label"], {})
        data[s["label"]] = {
            "base": f"/assets/fotos/{name}",
            "widths": widths,
            "ratio": s["ratio"],
            "w": widths[-1],
            "h": round(widths[-1] * rh / rw),
            "alt": prev.get("alt") or s["label"],
            "altRevisado": prev.get("altRevisado", False),
            "archivo": os.path.basename(path),
            "pagina": s["pagina"],
        }
        done.append(f"{key} → {name} ({', '.join(map(str, widths))} px) · {s['pagina']}")

    if not dry:
        json.dump(dict(sorted(data.items())), open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    missing = [f"{k} · {v['pagina']}" for k, v in sorted(slots.items()) if v["label"] not in data]
    print(f"Fotos procesadas: {len(done)}" + (" (simulación, no se ha escrito nada)" if dry else ""))
    for d in done:
        print("  ✓", d)
    for w in warn:
        print("  △", w)
    print(f"Espacios todavía sin foto: {len(missing)}")
    pend = [k for k, v in data.items() if not v.get("altRevisado")]
    if pend:
        print(f"Textos alternativos por revisar (describir lo que sale en la foto): {len(pend)}")


if __name__ == "__main__":
    main()
