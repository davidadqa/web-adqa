/* Modo corrección de textos (solo vista previa: base.njk lo carga si ELEVENTY_ENV=preview).
   Interfaz en catalán. Guarda en localStorage 'adqa-correccions-v1' y copia un Markdown para Claude.
   Todo lo que añade lleva el prefijo revisio-; con el modo apagado solo existe el botón flotante. */
(() => {
  const KEY = 'adqa-correccions-v1', MODE = 'adqa-correccions-mode', MAX = 1500;
  const BLOCK = 'p,li,h1,h2,h3,h4,h5,h6,dt,dd,td,th,summary,figcaption,blockquote,label,.btn,.eyebrow';
  const EXCL = 'script,style,noscript,template,select,textarea,input,.sr,.revisio-ui', SKIP = EXCL + ',svg,[aria-hidden="true"]';
  const STRUCT = /^(HTML|BODY|MAIN|HEADER|FOOTER|NAV|SECTION|ARTICLE|ASIDE|UL|OL|DL|TABLE|TBODY|THEAD|TR|FORM|DETAILS)$/;
  const d = document, root = d.documentElement;
  const narrow = matchMedia('(max-width: 640px)'), calm = matchMedia('(prefers-reduced-motion: reduce)');
  const scr = d.currentScript || d.querySelector('script[src*="revisio/revisio.js"]');
  const prefix = scr ? new URL(scr.src, location.href).pathname.replace(/\/assets\/revisio\/revisio\.js$/, '') : '';
  const here = () => { const p = location.pathname; return (prefix && p.startsWith(prefix + '/') ? p.slice(prefix.length) : p.replace(/^\/web-adqa(?=\/)/, '')) || '/'; };

  /* almacenamiento: si no hay, funciona en memoria y avisa una vez */
  const get = (k, s) => { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } };
  const set = (k, v, s) => { try { const st = s ? sessionStorage : localStorage; v == null ? st.removeItem(k) : st.setItem(k, v); return true; } catch (e) { return false; } };
  const load = () => { try { const a = JSON.parse(get(KEY) || '[]'); return Array.isArray(a) ? a.filter((i) => i && typeof i.original === 'string') : []; } catch (e) { return []; } };
  let items = load();
  // al guardar o borrar, el botón vuelve a la vista (se había apartado al bajar) y enseña el contador nuevo
  // devuelve si se ha podido guardar (sin storage, las correcciones solo viven en esta página)
  const persist = () => { const ok = set(KEY, JSON.stringify(items)); dock.classList.remove('is-away'); refresh(); return ok; };

  /* texto: como innerText (espacios normalizados) pero con las mayúsculas del original y sin lo decorativo */
  const norm = (s) => (s || '').replace(/[\s\u200b]+/g, ' ').trim();
  const squash = (s) => (s || '').toLowerCase().replace(/[\s\u200b]+/g, '');
  const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
  const inline = (el) => /^(inline|contents)/.test(getComputedStyle(el).display);
  // cifra animada (cards): el valor real vive en un .sr y lo que se ve es un rodillo aria-hidden con texto
  const twin = (n) => n.classList.contains('sr') && !!n.nextElementSibling && n.nextElementSibling.matches('[aria-hidden="true"]:not(svg)') && !!n.nextElementSibling.textContent.trim();
  const textOf = (el) => {
    if (el.dataset && el.dataset.count) return el.dataset.count; // contador: su valor final, aunque esté contando
    let o = '';
    (function w(n) {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) o += c.data;
        else if (c.nodeType === 1 && twin(c)) o += c.textContent;
        else if (c.nodeType === 1 && !c.matches(SKIP)) {
          if (c.tagName === 'BR') { o += ' '; continue; }
          if (c.dataset.count) { o += c.dataset.count; continue; }
          if (getComputedStyle(c).display === 'none') continue;
          const b = !inline(c); if (b) o += ' '; w(c); if (b) o += ' ';
        }
      }
    })(el);
    return norm(o);
  };
  const plural = (n) => `${n} correcci${n === 1 ? 'ó' : 'ons'}`;

  /* el bloque de texto más cercano: p, li, h*, … o el span de una tarjeta; nunca más de 1.500 caracteres */
  function pick(t) {
    let el = t && t.nodeType === 3 ? t.parentElement : t;
    if (!el || !el.closest) return null;
    const roll = el.closest('[aria-hidden="true"]'); if (roll && roll.previousElementSibling && twin(roll.previousElementSibling)) el = roll.parentElement; // el rodillo de una cifra cuenta como la cifra
    if (el.closest('svg')) el = el.closest('svg').parentElement; // un icono, como su contenedor
    if (!el || el.closest(EXCL)) return null;
    const b = el.closest(BLOCK);
    let l = el, c = null;
    while (l !== b && l.parentElement && own(l.parentElement) && !STRUCT.test(l.parentElement.tagName)) l = l.parentElement;
    if (b && l !== b && own(l) && !inline(l)) c = l;
    else if (b) c = b;
    else if (own(l) || (l.matches('a,button,summary,label') && !l.querySelector(BLOCK))) c = l; // una tarjeta-enlace entera, nunca
    else for (let x = el; x && !STRUCT.test(x.tagName); x = x.parentElement) if (!inline(x)) { // «30+»: cifra y unidad en una misma línea
      if (![...x.children].some((k) => !inline(k) && !k.matches(SKIP)) && !x.querySelector(BLOCK)) c = x;
      break;
    }
    if (!c || STRUCT.test(c.tagName)) return null;
    const n = norm(c.textContent).length;
    return n && (n <= MAX || textOf(c).length <= MAX) && textOf(c) ? c : null;
  }
  // texto con pointer-events:none (las cápsulas de la órbita): se busca bajo el puntero dentro de un contenedor pequeño
  const under = (t, x, y) => {
    if (!t || !t.getElementsByTagName || t.getElementsByTagName('*').length > 80) return null;
    for (const s of t.getElementsByTagName('*')) {
      if (!own(s) || getComputedStyle(s).pointerEvents !== 'none') continue;
      const r = s.getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return s;
    }
    return null;
  };
  const hit = (e) => pick(e.target) || pick(under(e.target, e.clientX, e.clientY));

  /* ---------- interfaz ---------- */
  const mk = (tag, cls, txt) => { const e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const html = (s) => { const t = d.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };
  const pencil = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3zM13.5 8.5l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const dock = html(`<div class="revisio-ui revisio-dock" lang="ca" role="group" aria-label="Correcció de textos">
    <button type="button" class="revisio-toggle" aria-pressed="false" title="Activa o desactiva el mode correcció">${pencil}<span>Corregir textos</span></button>
    <button type="button" class="revisio-count" aria-haspopup="dialog" aria-expanded="false" hidden><b></b></button></div>`);
  const panel = html(`<div class="revisio-ui revisio-panel" lang="ca" role="dialog" aria-modal="true" aria-labelledby="revisio-p-l">
    <div class="revisio-grip" aria-hidden="true"></div>
    <div class="revisio-head"><p class="revisio-label" id="revisio-p-l">Text actual</p><button type="button" class="revisio-x" aria-label="Tanca">×</button></div>
    <p class="revisio-orig" lang="es"></p>
    <label class="revisio-label" for="revisio-new">Com ha de quedar</label>
    <textarea class="revisio-field" id="revisio-new" rows="3" spellcheck="true" lang="es"></textarea>
    <label class="revisio-label" for="revisio-note">Nota per a Claude <span>(opcional)</span></label>
    <input class="revisio-field" id="revisio-note" type="text" autocomplete="off" lang="ca" placeholder="p. ex. més curt, treu la broma…">
    <div class="revisio-actions"><button type="button" class="revisio-del">Esborra</button><button type="button" class="revisio-cancel revisio-ghost">Cancel·la</button><button type="button" class="revisio-save revisio-main">Desa</button></div></div>`);
  const drawer = html(`<div class="revisio-ui revisio-drawer" lang="ca" role="dialog" aria-modal="true" aria-labelledby="revisio-d-t">
    <div class="revisio-grip" aria-hidden="true"></div>
    <div class="revisio-head"><p class="revisio-title" id="revisio-d-t"></p><button type="button" class="revisio-x" aria-label="Tanca">×</button></div>
    <div class="revisio-list"></div>
    <div class="revisio-manual" hidden><label class="revisio-label" for="revisio-md">No s'ha pogut copiar sol: selecciona aquest text i copia'l.</label><textarea class="revisio-field" id="revisio-md" readonly rows="6"></textarea></div>
    <div class="revisio-confirm" hidden><p></p><button type="button" class="revisio-yes revisio-main">Sí, esborra-ho tot</button><button type="button" class="revisio-no revisio-ghost">No</button></div>
    <div class="revisio-foot"><button type="button" class="revisio-copy revisio-main">Copia per a Claude</button><button type="button" class="revisio-share revisio-ghost" hidden>Comparteix</button><button type="button" class="revisio-clear">Esborra-ho tot</button></div></div>`);
  const scrim = mk('div', 'revisio-ui revisio-scrim'), toastEl = mk('div', 'revisio-ui revisio-toast');
  toastEl.setAttribute('role', 'status'); toastEl.lang = 'ca';
  const $ = (box, s) => box.querySelector(s);
  const tog = $(dock, '.revisio-toggle'), cnt = $(dock, '.revisio-count');
  const pLbl = $(panel, '#revisio-p-l'), pOrig = $(panel, '.revisio-orig'), ta = $(panel, 'textarea'), nt = $(panel, 'input'), del = $(panel, '.revisio-del'), save = $(panel, '.revisio-save');
  const list = $(drawer, '.revisio-list'), conf = $(drawer, '.revisio-confirm'), manual = $(drawer, '.revisio-manual'), share = $(drawer, '.revisio-share');
  // el botón, justo después de «Saltar al contenido»: segunda parada del tabulador (sigue fijo abajo a la izquierda)
  const skip = d.querySelector('body > .skip'); if (skip) skip.after(dock); else d.body.prepend(dock);
  d.body.append(scrim, panel, drawer, toastEl);
  share.hidden = !navigator.share;

  // aviso breve; con el cajón abierto solo se anuncia (el propio cajón ya muestra el cambio)
  let tt; const toast = (m) => { toastEl.textContent = m; clearTimeout(tt); toastEl.classList.toggle('is-open', !drawerOpen); tt = setTimeout(() => toastEl.classList.remove('is-open'), 3200); };
  const flash = (b, t) => { const o = b.dataset.t || (b.dataset.t = b.textContent); b.textContent = t; clearTimeout(b.tm); b.tm = setTimeout(() => (b.textContent = o), 2200); };

  /* capas de marcas: superposiciones fijas, nunca tocan el layout de la página. La de la página va por debajo de la
     navegación (z 99 < 100), para no pintar encima de la cápsula ni del menú abierto; la de la navegación, por encima. */
  let layer = null, layerTop = null, hl, sl, marks = [], hover = null, raf = 0;
  const box = (cls) => { const e = mk('div', cls); layer.append(e); return e; };
  const onPink = (el) => { // el contorno rosa no se ve sobre el bloque rosa: allí va en blanco
    for (let x = el.parentElement; x; x = x.parentElement) { const m = getComputedStyle(x).backgroundColor.match(/[\d.]+/g); if (m && (m[3] == null || +m[3] > 0.5)) return +m[0] > 180 && +m[1] < 110; }
    return false;
  };
  // lo que está en un menú cerrado (móvil o megamenú) existe y ocupa sitio, pero no se ve: su marca tampoco
  const shown = (el) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : getComputedStyle(el).visibility !== 'hidden');
  const put = (e, el, p) => {
    const r = el && el.isConnected && shown(el) && el.getBoundingClientRect();
    if (!r || (!r.width && !r.height)) { if (e.dataset.s) { e.style.display = 'none'; e.dataset.s = ''; } return; }
    if (e.el !== el) { e.el = el; e.classList.toggle('is-pink', onPink(el)); (el.closest('.nav-shell') ? layerTop : layer).append(e); }
    const s = `display:block;transform:translate(${Math.round(r.left - p)}px,${Math.round(r.top - p / 2)}px);width:${Math.round(r.width + 2 * p)}px;height:${Math.round(r.height + p)}px`;
    if (e.dataset.s !== s) { e.style.cssText = s; e.dataset.s = s; }
  };
  // sigue a lo marcado mientras haga falta (las cápsulas de la órbita giran; .rv y los <details> mueven el layout sin scroll)
  const draw = () => { if (!raf) raf = requestAnimationFrame(() => {
    raf = 0; place(); if (!layer) return;
    put(hl, mode && hover !== (panelOpen && cur.el) ? hover : null, 4); put(sl, panelOpen && cur.el, 4); marks.forEach(([e, el]) => put(e, el, 6));
    if (mode && (hover || panelOpen || marks.length)) draw();
  }); };

  /* dónde está cada texto corregido en esta página */
  function locate(originals) {
    const keys = originals.map((o) => [o, squash(o)]), found = new Map();
    for (const el of d.body.querySelectorAll('*')) {
      if (STRUCT.test(el.tagName) || el.closest(EXCL)) continue;
      const tc = squash(el.textContent); if (!tc) continue;
      for (const [o, k] of keys) if (tc.length <= k.length * 1.6 + 40 && tc.includes(k) && textOf(el) === o) { if (!found.has(o)) found.set(o, []); found.get(o).push(el); }
    }
    for (const [o, els] of found) found.set(o, els.filter((el) => !els.some((x) => x !== el && el.contains(x))).map((el) => { const b = el.closest(BLOCK); return inline(el) && b && b !== el && textOf(b) === o ? b : el; }));
    return found;
  }
  function scan() {
    marks.forEach(([e]) => e.remove()); marks = [];
    if (!mode || !layer) return;
    const mine = items.filter((i) => i.url === here());
    if (mine.length) for (const els of locate(mine.map((i) => i.original)).values()) for (const el of els) marks.push([box('revisio-mark'), el]);
    draw();
  }

  /* modo on/off */
  let mode = false, tabbed = [];
  function setMode(on, quiet) {
    if (on === mode) return;
    mode = on; tog.setAttribute('aria-pressed', on); set(MODE, on ? '1' : null, 1);
    if (on) {
      if (!layer) {
        layer = mk('div', 'revisio-ui revisio-layer'); layerTop = mk('div', 'revisio-ui revisio-layer is-top');
        layer.setAttribute('aria-hidden', 'true'); layerTop.setAttribute('aria-hidden', 'true'); d.body.append(layer, layerTop);
        hl = box('revisio-hl'); sl = box('revisio-hl is-sel');
      }
      layer.hidden = layerTop.hidden = false;
      // también los bloques dentro de una tarjeta-enlace (el enlace entero no se corrige: es la suma de varios textos)
      d.querySelectorAll(BLOCK).forEach((e) => { if (e.matches('a[href],button,summary,[tabindex]') || e.closest(EXCL + ',[aria-hidden="true"],button,summary') || e.querySelector('a[href],button,input,select,textarea,summary,[tabindex]') || !e.getClientRects().length) return; e.tabIndex = 0; tabbed.push(e); });
      scan();
      if (!quiet) toast(narrow.matches ? 'Toca un text per corregir-lo.' : 'Fes clic en un text per corregir-lo. Esc per sortir.');
    } else {
      closePanel(); hover = null; tabbed.forEach((e) => e.removeAttribute('tabindex')); tabbed = [];
      marks.forEach(([e]) => e.remove()); marks = []; if (layer) layer.hidden = layerTop.hidden = true;
    }
  }

  /* panel de corrección */
  let cur = null, panelOpen = false, back = null, lastSel = null, quiet = 0, lastY = scrollY;
  const drafts = new Map();
  const clean = (s) => s.split('\n').map((l) => l.replace(/[ \t\u00a0\u200b]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const tight = () => panel.classList.contains('is-compact');
  const sync = () => { save.disabled = !cur || (clean(ta.value) === cur.original && !nt.value.trim() && !cur.it); ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, (cur && cur.cap) || innerHeight * (tight() ? 0.25 : 0.45)) + 'px'; };
  function open(el, it, key) {
    const url = it ? it.url : here(), original = it ? it.original : textOf(el);
    if (!original) return;
    it = it || items.find((i) => i.url === url && i.original === original);
    if (panelOpen && cur && clean(ta.value) !== (cur.it ? cur.it.text : cur.original)) drafts.set(cur.k, [ta.value, nt.value]);
    const k = url + '\n' + original, dr = drafts.get(k);
    if (!panelOpen) back = key ? d.activeElement : null;
    const c = cur = { el, url, original, it, k };
    pOrig.textContent = original; pLbl.textContent = el ? 'Text actual' : `Text actual · ${url}`; // sin bloque a la vista: de qué página es
    ta.value = dr ? dr[0] : it ? it.text : original; nt.value = dr ? dr[1] : (it && it.note) || '';
    del.hidden = !it; panelOpen = true; toastEl.classList.remove('is-open');
    panel.classList.toggle('is-free', !el); panel.classList.remove('is-compact'); panel.classList.add('is-open');
    sync(); place(); draw();
    // si había un trozo seleccionado dentro del bloque, queda marcado en el área de texto
    let a = ta.value.length, z = a; const s = lastSel; lastSel = null;
    if (el && s && Date.now() - s.at < 60000 && (el.contains(s.r.startContainer) || el.contains(s.r.endContainer))) {
      const q = norm(s.r.toString()).toLowerCase(), v = ta.value.toLowerCase();
      if (q) {
        const pre = d.createRange(); pre.selectNodeContents(el);
        try { pre.setEnd(s.r.startContainer, s.r.startOffset); } catch (e) { /* fuera del bloque */ }
        const est = norm(pre.toString()).length; let best = -1;
        for (let i = v.indexOf(q); i >= 0; i = v.indexOf(q, i + 1)) if (best < 0 || Math.abs(i - est) < Math.abs(best - est)) best = i;
        if (best >= 0) { a = best; z = best + q.length; }
      }
    }
    ta.focus({ preventScroll: true }); ta.setSelectionRange(a, z);
    if (el) requestAnimationFrame(() => { // con la altura real del panel ya lleno
      if (cur !== c || !panelOpen) return;
      if (!narrow.matches) settle();
      else { const r = el.getBoundingClientRect(); if (r.top < 84 || r.bottom > innerHeight - panel.offsetHeight - 12) go(r.top - 96); } // hoja inferior: el bloque, encima
      c.ready = true;
    });
  }
  const go = (dy) => { if (Math.abs(dy) > 1) { quiet = Date.now() + 900; scrollBy({ top: dy, behavior: calm.matches ? 'instant' : 'smooth' }); } };
  // escritorio: bloque y panel a la vista a la vez. Si ya caben (el bloque se ve, o el principio si es muy alto, y el panel va
  // debajo, encima o al lado sin taparlo), nada se mueve; si no, el bloque sube bajo la navegación, y si ni así cabe el panel
  // entero en ningún lado, se compacta (texto actual y área de texto más bajos, con scroll propio) hasta el próximo bloque
  function settle() {
    const r = cur.el.getBoundingClientRect(), vh = innerHeight, w = panel.offsetWidth;
    if (r.top >= 84 && (r.bottom <= vh - 12 || r.top <= 120) && spot(r, w, panel.offsetHeight)[2]) return;
    const dy = Math.max(-scrollY, Math.min(r.top - 96, root.scrollHeight - vh - scrollY)); // lo que de verdad podrá moverse
    const r2 = { top: r.top - dy, bottom: r.bottom - dy, left: r.left, right: r.right };
    if (!tight() && !spot(r2, w, panel.offsetHeight)[2]) {
      panel.classList.add('is-compact'); sync();
      // si aún le falta poco para caber debajo o encima, el área de texto encoge lo justo (nunca por debajo de unas tres líneas)
      const room = Math.max(vh - 12 - Math.max(12, r2.bottom + 12), r2.top - 12 <= vh - 12 ? r2.top - 24 : vh - 24);
      const cap = Math.max(88, ta.offsetHeight - (panel.offsetHeight - room));
      if (cap < ta.offsetHeight) { cur.cap = cap; sync(); }
      // el área de texto ha encogido: que el cursor (o lo seleccionado) siga a la vista
      if (d.activeElement === ta) ta.scrollTop = ta.selectionEnd >= ta.value.length ? ta.scrollHeight : ta.scrollHeight * ta.selectionStart / ta.value.length - ta.clientHeight / 3;
    }
    go(dy); place();
  }
  /* dónde va el panel (escritorio): debajo del bloque, encima o al lado (derecha o izquierda) sin taparlo; si nada de eso
     cabe, abajo del todo como último recurso. Devuelve [left, top, ¿sin taparlo?]. Si el bloque sale de la ventana (el
     usuario se desplaza), el panel se va con él: no se queda clavado tapando la página */
  function spot(r, w, h) {
    const vw = root.clientWidth, vh = innerHeight, m = 12, g = 12, x = Math.max(m, Math.min(r.left - 4, vw - w - m));
    const below = r.bottom + g, above = r.top - g - h;
    if (below + h <= vh - m) return [x, below, 1];
    if (above >= m) return [x, above, 1];
    const y = Math.max(m, Math.min(r.top - 2, vh - m - h));
    if (r.right + g + w <= vw - m) return [r.right + g, y, 1];
    if (r.left - g - w >= m) return [r.left - g - w, y, 1];
    return [x, Math.max(m, vh - m - h), 0];
  }
  let kbWas = -1;
  function place() {
    const vv = window.visualViewport, kb = vv ? Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)) : 0;
    if (kb !== kbWas) { kbWas = kb; panel.style.setProperty('--revisio-kb', kb + 'px'); drawer.style.setProperty('--revisio-kb', kb + 'px'); }
    if (!panelOpen) return;
    if (narrow.matches || !cur.el || !cur.el.isConnected) { panel.style.left = panel.style.top = ''; return; }
    const s = spot(cur.el.getBoundingClientRect(), panel.offsetWidth, panel.offsetHeight);
    const left = Math.round(s[0]) + 'px', top = Math.round(s[1]) + 'px';
    if (panel.style.left !== left) panel.style.left = left;
    if (panel.style.top !== top) panel.style.top = top;
  }
  function closePanel() {
    if (!panelOpen) return;
    panelOpen = false; panel.classList.remove('is-open'); draw();
    const b = back; back = null;
    if (b && b.isConnected && b !== d.body) b.focus({ preventScroll: true });
  }
  function commit() {
    if (save.disabled) return;
    const text = clean(ta.value), note = nt.value.trim(), { url, original, k } = cur, it = cur.it && items.find((i) => i.id === cur.it.id);
    drafts.delete(k);
    if (text === original && !note) { if (it) items = items.filter((i) => i !== it); }
    else if (it) Object.assign(it, { text, note, date: new Date().toISOString() });
    else items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), url, original, text, note, date: new Date().toISOString() });
    const ok = persist(); closePanel(); scan();
    toast(ok ? `Desat · ${plural(items.length)}` : `${plural(items.length)} només en aquesta pàgina: aquest navegador no deixa desar. Copia-${items.length === 1 ? 'la' : 'les'} abans de sortir.`);
  }

  /* cajón con la lista */
  let drawerOpen = false, back2 = null;
  const groups = () => { const g = new Map(); items.forEach((i) => { if (!g.has(i.url)) g.set(i.url, []); g.get(i.url).push(i); }); return g; };
  const words = (s) => s.replace(/\n/g, ' \n ').split(' ').filter(Boolean); // cada salto de línea, una «palabra» aparte
  function diff(a, b) { // diferencia por palabras (LCS) para ver de un vistazo qué cambia
    const A = words(a), B = words(b), n = A.length, m = B.length;
    if (n * m > 250000) return [[[a, 0]], [[b, 0]]];
    const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const was = [], now = []; let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && A[i] === B[j]) { was.push([A[i++], 0]); now.push([B[j++], 0]); }
      else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) now.push([B[j++], 1]);
      else was.push([A[i++], 1]);
    }
    return [was, now];
  }
  // tramos seguidos con el mismo estado; un salto de línea va suelto, sin marcar y sin espacios alrededor (el <p> es pre-wrap)
  const runs = (p, toks, tag, pre) => {
    const nl = (x) => x && x[0] === '\n', r = [];
    toks.forEach(([w, c]) => { const l = r[r.length - 1]; if (w !== '\n' && l && !nl(l) && l[1] === c) l[0] += ' ' + w; else r.push([w, w === '\n' ? 0 : c]); });
    p.append(pre + '«'); r.forEach(([t, c], i) => { if (i && !nl(r[i]) && !nl(r[i - 1])) p.append(' '); p.append(c ? mk(tag, '', t) : t); }); p.append('»'); return p;
  };
  function render() {
    const n = items.length;
    $(drawer, '.revisio-title').textContent = `Correccions (${n})`;
    list.textContent = ''; conf.hidden = true; manual.hidden = true;
    $(drawer, '.revisio-copy').disabled = $(drawer, '.revisio-clear').disabled = share.disabled = !n;
    if (!n) list.append(mk('p', 'revisio-empty', 'Encara no n’hi ha cap. Activa «Corregir textos» i toca el text que vulguis canviar.'));
    let k = 0;
    groups().forEach((arr, url) => {
      const g = mk('section', 'revisio-group'), a = mk('a', 'revisio-page', url);
      a.href = prefix + url; g.append(a);
      if (url === here()) { a.setAttribute('aria-current', 'page'); g.append(mk('span', 'revisio-here', 'aquesta pàgina')); }
      const ol = mk('ol', 'revisio-items');
      arr.forEach((it) => {
        const li = mk('li', 'revisio-item'), body = mk('div'); body.lang = 'es';
        li.append(mk('span', 'revisio-n', ++k + '.'), body);
        if (it.text !== it.original) { const [w, v] = diff(it.original, it.text); body.append(runs(mk('p', 'revisio-was'), w, 'del', ''), runs(mk('p', 'revisio-now'), v, 'ins', '→ ')); }
        else body.append(mk('p', 'revisio-now', `«${it.original}»`));
        if (it.note) { const nn = mk('p', 'revisio-note', 'Nota: ' + it.note); nn.lang = 'ca'; body.append(nn); }
        const act = mk('div', 'revisio-item-act'); act.lang = 'ca'; const ed = mk('button', 'revisio-ghost', 'Edita'), rm = mk('button', '', 'Esborra');
        ed.type = rm.type = 'button'; ed.setAttribute('aria-label', `Edita la correcció ${k}`); rm.setAttribute('aria-label', `Esborra la correcció ${k}`);
        ed.onclick = () => edit(it.id);
        rm.onclick = () => { items = items.filter((i) => i.id !== it.id); persist(); scan(); toast(`Esborrada · ${plural(items.length)}`); (list.querySelector('button') || $(drawer, '.revisio-x')).focus(); };
        act.append(ed, rm); body.append(act); ol.append(li);
      });
      g.append(ol); list.append(g);
    });
  }
  function openDrawer() {
    closePanel(); render(); drawerOpen = true; back2 = d.activeElement; toastEl.classList.remove('is-open');
    drawer.classList.add('is-open'); scrim.classList.add('is-open'); cnt.setAttribute('aria-expanded', 'true'); place();
    $(drawer, '.revisio-x').focus({ preventScroll: true });
  }
  function closeDrawer(noFocus) {
    if (!drawerOpen) return;
    drawerOpen = false; drawer.classList.remove('is-open'); scrim.classList.remove('is-open'); cnt.setAttribute('aria-expanded', 'false');
    if (!noFocus && back2 && back2.isConnected) back2.focus({ preventScroll: true });
  }
  function edit(id) {
    const it = items.find((i) => i.id === id); if (!it) return;
    closeDrawer(true);
    let el = null;
    if (it.url === here()) { if (!mode) setMode(true, 1); el = (locate([it.original]).get(it.original) || [])[0] || null; }
    if (el) { quiet = Date.now() + 900; el.scrollIntoView({ block: 'center', behavior: 'instant' }); }
    open(el, it);
  }
  const pad = (x) => String(x).padStart(2, '0');
  const ind = (s) => s.replace(/\n/g, '\n     ');
  function md() {
    const t = new Date(), n = items.length;
    let o = `## Correccions · web ADQA · ${n} ${n === 1 ? 'canvi' : 'canvis'} · ${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}\n`, k = 0, first = true;
    groups().forEach((arr, url) => {
      o += `${first ? '' : '\n'}### ${url}\n`; first = false;
      arr.forEach((it) => {
        o += `${++k}. «${it.original}»\n`;
        if (it.text !== it.original) o += `   → «${ind(it.text)}»\n`;
        if (it.note) o += `   Nota: ${ind(it.note)}\n`;
      });
    });
    return o;
  }
  async function copy() {
    const t = md();
    const btn = $(drawer, '.revisio-copy'), done = () => { flash(btn, 'Copiat ✓'); toast('Copiat. Enganxa-ho al xat amb Claude.'); };
    try { await navigator.clipboard.writeText(t); done(); return; } catch (e) { /* alternativa */ }
    const area = $(manual, 'textarea'); area.value = t; manual.hidden = false; area.focus(); area.select();
    let ok = false; try { ok = d.execCommand('copy'); } catch (e) { /* manual */ }
    if (ok) { manual.hidden = true; done(); btn.focus(); }
  }

  /* contador del botón flotante */
  function refresh() {
    const n = items.length;
    cnt.hidden = !n; $(cnt, 'b').textContent = n;
    cnt.setAttribute('aria-label', `Correccions (${n})`); cnt.title = `Correccions (${n}): revisa-les i copia-les per a Claude`;
    if (drawerOpen) render();
  }

  /* ---------- eventos ---------- */
  tog.addEventListener('click', () => { closeDrawer(true); setMode(!mode); });
  cnt.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer()));
  $(panel, '.revisio-x').addEventListener('click', closePanel);
  $(panel, '.revisio-cancel').addEventListener('click', closePanel);
  save.addEventListener('click', commit);
  del.addEventListener('click', () => { const id = cur.it && cur.it.id; drafts.delete(cur.k); items = items.filter((i) => i.id !== id); persist(); closePanel(); scan(); toast(`Esborrada · ${plural(items.length)}`); });
  // al escribir, el área de texto crece: si el panel ya no cabe sin tapar el bloque, se recoloca como al abrirlo
  ta.addEventListener('input', () => {
    sync();
    if (panelOpen && cur.ready && cur.el && cur.el.isConnected && !narrow.matches && Date.now() > quiet && !spot(cur.el.getBoundingClientRect(), panel.offsetWidth, panel.offsetHeight)[2]) settle();
  });
  nt.addEventListener('input', sync);
  $(drawer, '.revisio-x').addEventListener('click', () => closeDrawer());
  scrim.addEventListener('click', () => closeDrawer());
  $(drawer, '.revisio-copy').addEventListener('click', copy);
  share.addEventListener('click', async () => { try { await navigator.share({ title: 'Correccions · web ADQA', text: md() }); } catch (e) { if (e.name !== 'AbortError') copy(); } });
  $(drawer, '.revisio-clear').addEventListener('click', () => { $(conf, 'p').textContent = `Vols esborrar ${items.length === 1 ? 'la correcció' : `les ${items.length} correccions`}? No es pot desfer.`; conf.hidden = false; $(conf, '.revisio-no').focus(); });
  $(conf, '.revisio-no').addEventListener('click', () => { conf.hidden = true; $(drawer, '.revisio-clear').focus(); });
  $(conf, '.revisio-yes').addEventListener('click', () => { items = []; drafts.clear(); persist(); scan(); toast('Totes les correccions esborrades.'); $(drawer, '.revisio-x').focus(); });

  // con el modo activo, un clic en un texto abre el panel; enlaces y <details> no navegan ni se abren
  addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest || t.closest('.revisio-ui')) return;
    if (!mode) { if (panelOpen) closePanel(); return; }
    const c = hit(e), ia = t.closest('a,summary,label,button,[role="tab"],[role="button"]');
    if (c || (ia && (ia.matches('a,summary,label') || norm(ia.textContent)))) { e.preventDefault(); e.stopImmediatePropagation(); }
    if (c) open(c, null, e.detail === 0); else if (panelOpen) closePanel();
  }, true);
  addEventListener('submit', (e) => { if (mode) e.preventDefault(); }, true);
  let lastT = null;
  d.addEventListener('pointermove', (e) => {
    if (!mode || e.pointerType !== 'mouse' || e.target === lastT) return;
    lastT = e.target; const c = hit(e); if (c !== hover) { hover = c; draw(); }
  }, { passive: true });
  root.addEventListener('pointerleave', () => { lastT = null; if (hover) { hover = null; draw(); } });
  d.addEventListener('focusin', (e) => { if (mode && tabbed.includes(e.target)) { hover = e.target; draw(); } });
  d.addEventListener('selectionchange', () => {
    if (!mode) return;
    const s = getSelection(); if (!s || !s.rangeCount || s.isCollapsed) return;
    const r = s.getRangeAt(0), a = r.commonAncestorContainer, ae = a.nodeType === 1 ? a : a.parentElement;
    if (ae && !ae.closest('.revisio-ui')) lastSel = { r: r.cloneRange(), at: Date.now() };
  });
  addEventListener('keydown', (e) => {
    const box = panelOpen ? panel : drawerOpen ? drawer : null;
    if (e.key === 'Escape') {
      if (box) { e.preventDefault(); e.stopImmediatePropagation(); if (drawerOpen && !conf.hidden) { conf.hidden = true; $(drawer, '.revisio-clear').focus(); } else if (panelOpen) closePanel(); else closeDrawer(); }
      // Esc con el menú móvil o el megamenú abiertos los cierra (site.js) y el modo sigue
      else if (mode && !(e.target.closest && e.target.closest('input,textarea,select')) && !d.body.classList.contains('menu-open') && !d.querySelector('.nav-shell [aria-expanded="true"]')) setMode(false);
      return;
    }
    if (e.key === 'Tab' && box) { // el foco no sale del panel abierto (ni hacia botones ocultos, como el pie mientras se confirma)
      const f = [...box.querySelectorAll('button,a[href],textarea,input')].filter((x) => !x.disabled && x.getClientRects().length);
      const i = f.indexOf(d.activeElement), j = i < 0 ? 0 : (i + (e.shiftKey ? -1 : 1) + f.length) % f.length;
      if (f.length && (i < 0 || (e.shiftKey ? i === 0 : i === f.length - 1))) { e.preventDefault(); f[j].focus(); }
      return;
    }
    if (panelOpen && e.key === 'Enter' && (e.ctrlKey || e.metaKey || e.target === nt)) { e.preventDefault(); commit(); return; }
    if (mode && !box && (e.key === 'Enter' || e.key === ' ') && tabbed.includes(e.target)) { e.preventDefault(); open(e.target, null, 1); }
  }, true);
  const redraw = () => { if (mode || panelOpen) draw(); };
  addEventListener('scroll', redraw, { capture: true, passive: true });
  addEventListener('resize', redraw);
  if (window.visualViewport) { visualViewport.addEventListener('resize', redraw); visualViewport.addEventListener('scroll', redraw); }
  addEventListener('storage', (e) => { if (e.key === KEY) { items = load(); refresh(); scan(); } });
  // al bajar leyendo, el botón se encoge a un círculo con el lápiz (no tapa el principio de las líneas, pero siempre
  // se ve) y recupera el texto al subir, al pasar el ratón, al recibir el foco o al guardar
  addEventListener('scroll', () => {
    const y = scrollY; if (Date.now() < quiet) { lastY = y; return; } // los desplazamientos propios no cuentan
    if (Math.abs(y - lastY) < 6) return;
    dock.classList.toggle('is-away', !panelOpen && !drawerOpen && y > lastY && y > 160); lastY = y;
  }, { passive: true });

  refresh();
  // ?corregir en la dirección activa el modo directamente (para enlaces del tipo …/web-adqa/redes/?corregir)
  if (get(MODE, 1) === '1') setMode(true, 1);
  else if (/[?&]corregir(=|&|$)/.test(location.search)) setMode(true);
})();
