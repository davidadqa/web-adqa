# Prepara las fotos del equipo (bandas en blanco y negro, m.teamPhoto y fotos de los casos anónimos).
#
# Uso:  python3 -I tools/fotos-equipo.py <carpeta_con_los_originales> [equipo-13.jpg=equipo-pizarra-esquema@0.38 ...]
#                                         [--sin-desenfoque] [--dry]
#
# - Sin pares archivo=slug, vuelve a generar todas las fotos de src/_data/fotos.json con "tipo": "equipo" cuyo
#   «archivo» esté en la carpeta, con el encuadre guardado («foco»). Con pares, añade o actualiza esas fotos.
#   @y (o @x,y) es el punto del original, en fracciones 0–1, que queda en el centro del recorte (por defecto 0.5).
# - Desenfoque: antes de recortar, difumina (gaussiano fuerte, ilegible) las zonas de tools/fotos-desenfoc.json
#   para ese «archivo»: nombres de personas, matrículas, rótulos de terceros y pantallas con datos. Se aplica
#   siempre; --sin-desenfoque genera las fotos sin difuminar (solo para comparar, no para publicar). Para
#   difuminar una zona nueva, añade su rectángulo [x, y, ancho, alto] (fracciones del original) y vuelve a
#   ejecutar el script.
# - Recorta a 1146/400 (la banda de .team-band) y exporta src/assets/fotos/<slug>-<ancho>.{avif,webp,jpg} a 640,
#   960, 1280 y 1920 px (sin ampliar nunca el original), sin metadatos (EXIF, GPS, XMP, ICC…).
# - Las fotos nuevas entran en fotos.json con el alt pendiente (altRevisado: false): hay que describir lo que sale
#   DE VERDAD en la foto. Los originales no se suben al repositorio.
import json, os, sys

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "fotos")
DATA = os.path.join(ROOT, "src", "_data", "fotos.json")
BLUR = os.path.join(ROOT, "tools", "fotos-desenfoc.json")
WIDTHS = [640, 960, 1280, 1920]
RATIO = (1146, 400)


def desenfoca(im, zonas):
    """Difumina cada rectángulo [x, y, w, h] (fracciones) con un gaussiano fuerte y bordes suaves."""
    W, H = im.size
    r = max(18, round(W * 0.014))
    for x, y, w, h in zonas:
        box = (round(x * W), round(y * H), round((x + w) * W), round((y + h) * H))
        pad = r * 3
        outer = (max(0, box[0] - pad), max(0, box[1] - pad), min(W, box[2] + pad), min(H, box[3] + pad))
        trozo = im.crop(outer)
        borroso = trozo.filter(ImageFilter.GaussianBlur(r)).filter(ImageFilter.GaussianBlur(r))
        mask = Image.new("L", trozo.size, 0)
        ImageDraw.Draw(mask).rectangle((box[0] - outer[0], box[1] - outer[1], box[2] - outer[0], box[3] - outer[1]), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(r / 4))
        im.paste(Image.composite(borroso, trozo, mask), outer[:2])
    return im


def recorta(im, foco):
    W, H = im.size
    target = RATIO[0] / RATIO[1]
    fx, fy = foco
    if W / H > target:
        nw = round(H * target)
        left = min(max(0, round(fx * W - nw / 2)), W - nw)
        return im.crop((left, 0, left + nw, H))
    nh = round(W / target)
    top = min(max(0, round(fy * H - nh / 2)), H - nh)
    return im.crop((0, top, W, top + nh))


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        print(open(__file__, encoding="utf-8").read().split("import ")[0])
        sys.exit(1)
    src_dir, dry, sin = args[0], "--dry" in args, "--sin-desenfoque" in args
    data = json.load(open(DATA, encoding="utf-8"))
    zonas = {k: v for k, v in json.load(open(BLUR, encoding="utf-8")).items() if not k.startswith("_")}

    trabajos = {}  # slug -> (archivo, foco)
    for k, v in data.items():
        if v.get("tipo") == "equipo" and os.path.exists(os.path.join(src_dir, v.get("archivo", ""))):
            trabajos[k] = (v["archivo"], tuple(v.get("foco", (0.5, 0.5))))
    for a in args[1:]:
        if a.startswith("--"):
            continue
        archivo, rest = a.split("=", 1)
        slug, _, f = rest.partition("@")
        nums = [float(n) for n in f.split(",")] if f else [0.5]
        trabajos[slug] = (archivo, (nums[0], nums[1]) if len(nums) == 2 else (0.5, nums[0]))

    rw, rh = RATIO
    for slug, (archivo, foco) in sorted(trabajos.items()):
        path = os.path.join(src_dir, archivo)
        if not os.path.exists(path):
            print(f"  △ {archivo}: no está en {src_dir}")
            continue
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        z = [] if sin else zonas.get(archivo, [])
        if z:
            im = desenfoca(im, z)
        im = recorta(im, foco)
        widths = [w for w in WIDTHS if w <= im.width] or [im.width]
        if not dry:
            for w in widths:
                r = im.resize((w, round(w * rh / rw)), Image.LANCZOS)
                r.info.clear()
                base = os.path.join(OUT, f"{slug}-{w}")
                r.save(base + ".avif", quality=52)
                r.save(base + ".webp", quality=80, method=6)
                r.save(base + ".jpg", quality=82, optimize=True, progressive=True)
        prev = data.get(slug, {})
        data[slug] = {
            "base": f"/assets/fotos/{slug}",
            "widths": widths,
            "ratio": f"{rw}/{rh}",
            "w": widths[-1],
            "h": round(widths[-1] * rh / rw),
            "alt": prev.get("alt") or "PENDIENTE: describir la foto",
            "altRevisado": prev.get("altRevisado", False),
            "archivo": archivo,
            "pagina": "(equipo)",
            "tipo": "equipo",
            "foco": list(foco),
        }
        nota = f"{len(z)} zona(s) difuminada(s)" if z else ("SIN desenfoque" if sin and zonas.get(archivo) else "sin zonas")
        print(f"  ✓ {archivo} → {slug} ({', '.join(map(str, widths))} px) · foco {foco[0]:g},{foco[1]:g} · {nota}")

    if not dry:
        with open(DATA, "w", encoding="utf-8") as fh:
            json.dump(dict(sorted(data.items())), fh, ensure_ascii=False, indent=1)
    pend = [k for k, v in data.items() if v.get("tipo") == "equipo" and not v.get("altRevisado")]
    if pend:
        print(f"Textos alternativos por revisar: {', '.join(pend)}")


if __name__ == "__main__":
    main()
