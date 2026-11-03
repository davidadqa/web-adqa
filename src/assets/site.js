(()=>{
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* hero: split headline into words for blur-in */
  const h = document.querySelector('[data-words]');
  if (h && !reduce){
    let i = 0;
    const wrap = node => {
      [...node.childNodes].forEach(n=>{
        if(n.nodeType===3){
          const frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t=>{
            if(!t) return;
            if(/^\s+$/.test(t)){frag.append(t);return}
            const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=t;frag.append(s);
          });
          n.replaceWith(frag);
        } else if(n.nodeType===1) wrap(n);
      });
    };
    wrap(h);
  }

  /* nav shrink on scroll */
  const onScroll=()=>document.body.classList.toggle('scrolled',scrollY>30);
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* mega menu: hover on desktop, click/keyboard everywhere */
  const trig=document.querySelector('[data-mega]'), mega=document.getElementById('mega-servicios');
  const burger=document.querySelector('.burger');
  let t;
  const open=v=>{if(!mega)return;clearTimeout(t);mega.classList.toggle('open',v);trig.setAttribute('aria-expanded',v)};
  if(trig&&mega){trig.addEventListener('click',()=>open(!mega.classList.contains('open')));
  [trig,mega].forEach(el=>{
    el.addEventListener('mouseenter',()=>matchMedia('(hover:hover)').matches&&open(true));
    el.addEventListener('mouseleave',()=>{t=setTimeout(()=>open(false),180)});
  });}
  addEventListener('keydown',e=>{if(e.key==='Escape'){open(false);document.body.classList.remove('menu-open');burger&&burger.setAttribute('aria-expanded',false)}});
  document.addEventListener('click',e=>{if(!e.target.closest('.nav, .mega'))open(false)});

  /* mobile menu */
  if(burger)burger.addEventListener('click',()=>{const v=document.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',v)});
  document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded',false)}));

  /* marquee: duplicate track for seamless loop */
  document.querySelectorAll('[data-marquee]').forEach(m=>{const c=m.querySelector('.track').cloneNode(true);c.setAttribute('aria-hidden','true');c.querySelectorAll('img').forEach(i=>i.alt='');m.append(c)});

  /* reveal + counters */
  const count=el=>{
    const end=+el.dataset.count;if(reduce){el.textContent=end;return}
    const t0=performance.now(),d=1600;
    const step=now=>{const p=Math.min(1,(now-t0)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(end*e);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  };
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target;el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(count);
    el.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');
    io.unobserve(el);
  }),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  window.__adqaRv=1; /* el script del <head> deja html.adqa-js (contenido oculto hasta aparecer) solo si llegamos aquí */
  addEventListener('beforeprint',()=>document.querySelectorAll('.rv:not(.in)').forEach(el=>{
    el.classList.add('in');el.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');
  }));

  /* card spotlight follows pointer */
  document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{
    const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');
  }));

  /* projects rail: arrows + drag */
  const rail=document.getElementById('rail');
  if(rail){
  document.querySelectorAll('[data-rail]').forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:+b.dataset.rail*(rail.querySelector('.proj').offsetWidth+14),behavior:reduce?'auto':'smooth'})));
  let down=false,sx=0,sl=0,moved=false;
  rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=rail.scrollLeft;rail.style.scrollSnapType='none';rail.style.cursor='grabbing'});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;rail.scrollLeft=sl-dx});
  addEventListener('pointerup',()=>{if(!down)return;down=false;rail.style.scrollSnapType='';rail.style.cursor=''});
  rail.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation()}},true);
  }

  /* client tabs */
  const tabs=document.querySelectorAll('.wall-tabs [role="tab"]');
  tabs.forEach(tb=>tb.addEventListener('click',()=>{
    tabs.forEach(x=>{const on=x===tb;x.setAttribute('aria-selected',on);const p=document.getElementById(x.getAttribute('aria-controls'));p.hidden=!on;if(on){p.classList.remove('in');requestAnimationFrame(()=>p.classList.add('rv','in'))}});
  }));

  /* form (front-end only: connect to your backend / form handler).
     No válido: .p-content-tried (bordes en rosa) y la burbuja del navegador. Válido: .form-ok, aviso «adqa:sent» y el texto
     se desvanece 250 ms (.p-content-clear) antes de vaciarse; con reduced-motion, se vacía al instante. */
  document.querySelectorAll('.form').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();
    if(!f.checkValidity()){f.classList.add('p-content-tried');f.reportValidity();return}
    f.classList.remove('p-content-tried');
    const ok=f.querySelector('.form-ok');if(ok)ok.style.display='block';
    f.dispatchEvent(new CustomEvent('adqa:sent')); /* cuando haya backend: solo con la respuesta OK del servidor */
    if(reduce)return f.reset();
    f.classList.add('p-content-clear');
    setTimeout(()=>{f.reset();f.classList.remove('p-content-clear')},250);
  }));
})();

/* ==========================================================================
   Poesía: un IIFE por familia, en el orden en que se cargaban (chrome, heroes, cards, proof, content, blog).
   ========================================================================== */

/* ======================= Poesía · chrome */
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* iOS solo aplica :active si hay un listener táctil: así las teclas se hunden también con el dedo. */
  document.addEventListener('touchstart', () => {}, { passive: true });

  /* Nav: «la cápsula que se desliza». Una sola cápsula viaja entre los enlaces; en reposo, bajo aria-current. */
  const nav = document.querySelector('.nav');
  const items = nav ? [...nav.querySelectorAll('.nav-links>li>a, .nav-links>li>button, .nav-cta .link')] : [];
  if (items.length) {
    const pill = document.createElement('span');
    pill.className = 'p-chrome-pill'; pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill); nav.classList.add('p-chrome-pilled');
    const trig = nav.querySelector('[data-mega]');
    let at = null, inside = false;
    const home = () => (trig && trig.getAttribute('aria-expanded') === 'true') ? trig : items.find(i => i.hasAttribute('aria-current')) || null;
    const go = (el, jump) => {
      if (el && !el.offsetWidth) el = null;
      if (!el) { pill.style.opacity = 0; at = null; return; }
      const n = nav.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (!at || jump) pill.classList.add('p-chrome-jump');
      pill.style.width = r.width + 'px'; pill.style.height = r.height + 'px';
      pill.style.transform = `translate(${r.left - n.left - nav.clientLeft}px,${r.top - n.top - nav.clientTop}px)`;
      pill.style.opacity = 1;
      pill.getBoundingClientRect(); pill.classList.remove('p-chrome-jump');
      at = el;
    };
    items.forEach(i => {
      i.addEventListener('pointerenter', () => go(i));
      i.addEventListener('focus', () => { if (i.matches(':focus-visible')) go(i); });
    });
    nav.addEventListener('pointerenter', () => { inside = true; });
    nav.addEventListener('pointerleave', () => { inside = false; go(home()); });
    nav.addEventListener('focusout', e => { if (!items.includes(e.relatedTarget) && !inside) go(home()); });
    if (trig) new MutationObserver(() => { if (!inside) go(home()); }).observe(trig, { attributes: true, attributeFilter: ['aria-expanded'] });
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => go(at || home(), true));
      ro.observe(nav); ro.observe(nav.querySelector('.nav-links') || nav);
    }
    go(home(), true);
  }

  /* Eyebrows fuera del hero y de un .rv: hacen ping al entrar (solo si empiezan fuera de pantalla). */
  if (!calm && hasIO) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('p-in'); io.unobserve(e.target); }
    }), { threshold: .2, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.eyebrow').forEach(el => {
      if (el.closest('.hero, .rv')) return;
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('p-armed'); io.observe(el); }
    });
  }

  /* P2-03 · Teclado: el foco nunca aterriza en algo invisible. El CSS ya muestra al instante el bloque (.rv:not(.in):focus-within);
     aquí, después de fijar ese estado, se marca como aparecido (.in) para que no vuelva a esconderse. Lo armado (.p-armed) se
     desarma: queda en su estado de base, el final, sin la entrada (que empezaría desde invisible). Y si el bloque ya estaba
     apareciendo (el scroll del foco lo acaba de mostrar), su fundido termina ya. */
  document.addEventListener('focusin', e => {
    for (let el = e.target; el && el.matches; el = el.parentElement) {
      if (el.matches('.rv:not(.in)')) { getComputedStyle(el).opacity; el.classList.add('in'); }
      if (el.matches('.p-armed:not(.p-in)')) el.classList.replace('p-armed', 'p-in');
      if (el.getAnimations) el.getAnimations().forEach(a => /^(opacity|transform|filter)$/.test(a.transitionProperty) && a.finish());
    }
  });

  /* «Saltar al contenido»: con Enter, la tecla también se hunde. */
  const skip = document.querySelector('.skip');
  if (skip && !calm) skip.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    skip.classList.add('p-chrome-down'); setTimeout(() => skip.classList.remove('p-chrome-down'), 260);
  });

  /* Pie: «la tecla tiene consecuencia». Al hundirse «una», sale una señal por el filete inferior. */
  const fc = document.querySelector('.foot-claim'), key = fc && fc.querySelector('.key');
  if (fc && key && !calm) {
    const fire = () => {
      const a = fc.getBoundingClientRect(), k = key.getBoundingClientRect();
      const from = Math.round(k.left + k.width / 2 - a.left);
      fc.style.setProperty('--p-from', from + 'px');
      fc.style.setProperty('--p-dur', Math.min(2, Math.max(1.2, (a.width - from) / 600)).toFixed(2) + 's');
      fc.classList.remove('p-chrome-run'); fc.offsetWidth; fc.classList.add('p-chrome-run');
    };
    fc.addEventListener('animationend', e => { if (e.animationName === 'p-chrome-sig') fc.classList.remove('p-chrome-run'); });
    if (fine) fc.addEventListener('mouseenter', fire);
    else if (hasIO) {
      let done = false;
      try { done = sessionStorage.getItem('p-chrome-key') === '1'; } catch (e) {}
      if (!done) {
        const io = new IntersectionObserver(es => {
          if (!es[0].isIntersecting) return;
          io.disconnect();
          try { sessionStorage.setItem('p-chrome-key', '1'); } catch (e) {}
          fc.classList.add('p-chrome-press'); fire();
          setTimeout(() => fc.classList.remove('p-chrome-press'), 450);
        }, { threshold: .6 });
        io.observe(fc);
      }
    }
  }
})();

/* ======================= Poesía · heroes — pausa de los bucles fuera de pantalla, ilustración de área y firma móvil */
(() => {
  const d = document, area = d.body.dataset.area;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Las ilustraciones (assets/art), relativas a este script: así también funcionan con la web en una subcarpeta (vista previa /web-adqa/). */
  const me = d.currentScript || d.querySelector('script[src*="assets/site.js"]');
  const src = me ? me.src : location.origin + '/assets/site.js';
  /* Icono de la firma (≤ 720 px) por área de servicio; las demás áreas llevan el hero sobrio (solo CSS). */
  const ico = { redes: 'net', ciberseguridad: 'shield', telecomunicaciones: 'signal', 'sistemas-cloud': 'cloud', 'soporte-it': 'tool',
    'diseno-programacion-web': 'code', 'desarrollo-software-medida': 'code', 'google-workspace': 'grid', 'microsoft-365': 'grid' }[area];

  /* .p-live mientras el elemento está en pantalla: el glow, la órbita y la ilustración solo se mueven entonces. */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('p-live', e.isIntersecting)));
    d.querySelectorAll('.hero, .orbit-wrap').forEach(el => {
      const r = el.getBoundingClientRect();
      el.classList.toggle('p-live', r.bottom > 0 && r.top < innerHeight);
      el.classList.add('p-heroes-io'); io.observe(el);
    });
  }

  /* .answer (home): cada palabra en su <span> para que la lectura «se encienda» al avanzar (solo con scroll-timeline).
     El texto no cambia: los lectores de pantalla leen lo mismo. */
  const ans = d.querySelector('.answer');
  if (ans && !calm && window.CSS && CSS.supports('animation-timeline: view()')) {
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 1) return walk(c);
      if (c.nodeType !== 3 || !c.textContent.trim()) return;
      const f = d.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) return f.append(t);
        const s = d.createElement('span'); s.className = 'p-heroes-w'; s.textContent = t; f.append(s);
      });
      c.replaceWith(f);
    });
    walk(ans);
  }

  const hero = d.querySelector('.page-hero:not(.doc-hero)');
  if (!hero || !ico) return;

  /* Firma (≤ 900 px): filete + nodo con el icono del área. */
  const m = d.createElement('div');
  m.className = 'p-heroes-mark'; m.setAttribute('aria-hidden', 'true');
  m.innerHTML = `<i><svg><use href="#i-${ico}"/></svg></i>`;
  hero.append(m);

  /* Ilustración (> 900 px): se pide solo cuando se va a ver. Si falla, no pasa nada. */
  const wide = matchMedia('(min-width: 901px)');
  let asked = false;
  const load = () => {
    if (asked || !wide.matches) return;
    asked = true;
    fetch(new URL(`art/heroes-${area}.svg`, src)).then(r => r.ok ? r.text() : Promise.reject()).then(t => {
      const a = d.createElement('div');
      a.className = 'p-heroes-art'; a.setAttribute('aria-hidden', 'true'); a.dataset.scene = area;
      a.innerHTML = t;
      const svg = a.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('focusable', 'false');
      a.querySelectorAll('.t, .l, .a').forEach(e => e.setAttribute('pathLength', 1));
      hero.prepend(a);
      /* Hueco del texto: la máscara vacía la ilustración detrás del H1, el lead, los CTA y .trust, midan lo que midan
         (el SVG es fijo y el texto, fluido). Se mide por líneas y se rehace si cambia el tamaño o carga la fuente. */
      const fit = () => {
        const h = hero.getBoundingClientRect(), cx = h.left + h.width / 2;
        let x = 0, y0 = 1e4, y1 = -1e4;
        hero.querySelectorAll('h1, .lead, .hero-ctas, .trust').forEach(el => {
          const r = el.getBoundingClientRect(), g = d.createRange();
          g.selectNodeContents(el);
          for (const q of g.getClientRects()) if (q.width) x = Math.max(x, cx - q.left, q.right - cx);
          y0 = Math.min(y0, r.top - h.top); y1 = Math.max(y1, r.bottom - h.top);
        });
        if (y1 < y0) return;
        a.style.setProperty('--x', (x + 10 | 0) + 'px');
        a.style.setProperty('--y0', (y0 - 8 | 0) + 'px');
        a.style.setProperty('--y1', (y1 + 8 | 0) + 'px');
      };
      fit();
      if (window.ResizeObserver) new ResizeObserver(fit).observe(hero.querySelector('.hero-inner') || hero);
      if (d.fonts) d.fonts.ready.then(fit);
      if (calm) return;
      /* El señal: dos colas y una cabeza que recorren cada camino .s */
      a.querySelectorAll('.s').forEach(p => {
        const len = p.getTotalLength().toFixed(1);
        ['k1', 'k2', 'k3'].forEach(k => {
          const c = p.cloneNode();
          c.setAttribute('class', p.getAttribute('class').replace(/\bs\b/, 'p-heroes-run ' + k));
          c.style.setProperty('--len', len);
          svg.append(c);
        });
      });
    }).catch(() => {});
  };
  load();
  if (wide.addEventListener) wide.addEventListener('change', load);
})();

/* ======================= Poesía · cards */
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* .metric .bar: «el nodo en la punta». Cuando la barra termina de llenarse, el nodo hace un solo ping. */
  document.querySelectorAll('.metric .bar i').forEach((i) => {
    const end = (e) => {
      if (e.propertyName !== 'width') return;
      i.removeEventListener('transitionend', end);
      i.parentNode.classList.add('p-cards-ping');
    };
    i.addEventListener('transitionend', end);
  });

  /* «El contador mecánico»: cada dígito es una columna 0–9 que se desliza en vertical, primero las unidades
     (que dan una vuelta entera) y después las decenas. Se quita data-count para que site.js no cuente también;
     el valor queda en un .sr para los lectores de pantalla y el rodillo es aria-hidden.
     Con reduced-motion no hay rodillo: el valor final y la barra llena se escriben ya al cargar (sin esperar a que
     la cifra entre en pantalla, para que nunca se vea un «0»). */
  if (calm) {
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    document.querySelectorAll('.metric [data-w]').forEach((b) => { b.style.width = b.dataset.w + '%'; });
    return;
  }
  document.querySelectorAll('.stat [data-count], .metric [data-count]').forEach((el) => {
    const v = el.dataset.count;
    if (!/^\d{1,4}$/.test(v)) return;
    const out = document.createElement('span'), sr = document.createElement('span'), odo = document.createElement('span');
    sr.className = 'sr'; sr.textContent = v;
    odo.className = 'p-cards-odo'; odo.setAttribute('aria-hidden', 'true');
    [...v].forEach((d, k) => {
      const j = v.length - 1 - k, cell = document.createElement('span'), reel = document.createElement('span');
      cell.className = 'p-cards-d'; cell.textContent = d;
      reel.className = 'p-cards-r';
      reel.style.setProperty('--p-y', (j ? 0 : 10) + +d);
      reel.style.setProperty('--p-j', j);
      cell.append(reel); odo.append(cell);
    });
    out.append(sr, odo);
    el.replaceWith(out); /* si site.js ya hubiera empezado a contar, escribe en el nodo viejo, ya fuera del DOM */
  });
})();

/* ======================= Poesía · proof */
(() => {
  const d = document, IO = 'IntersectionObserver' in window;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = (f) => { let q = 0; return () => q || (q = requestAnimationFrame(() => { q = 0; f(); })); };

  /* Marquee: .p-live mientras está en pantalla; fuera, se pausa (CSS de proof en site.css). */
  if (IO) {
    const live = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('p-live', e.isIntersecting)));
    d.querySelectorAll('.marquee').forEach((m) => { m.classList.add('p-proof-io'); live.observe(m); });
  }

  /* Sellos fuera de un .rv y la ficha del certificado: se arman solo si están por debajo de la primera pantalla. */
  if (!calm && IO) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('p-in'); io.unobserve(e.target); }
    }), { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    d.querySelectorAll('.cert-img .seal img, .st .badge, .cert-facts').forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('p-armed'); io.observe(el); }
    });
  }

  /* Muro: índice diagonal (fila + columna, con decimales si la última fila va centrada), 8 pasos como máximo. */
  const wave = () => d.querySelectorAll('.wall:not([hidden])').forEach((ul) => {
    const li = [...ul.children]; if (li.length < 2) return;
    const g = parseFloat(getComputedStyle(ul).columnGap) || 10, x0 = Math.min(...li.map((l) => l.offsetLeft)), y0 = li[0].offsetTop;
    const w = li[0].offsetWidth + g, h = li[0].offsetHeight + g;
    li.forEach((l) => l.style.setProperty('--p-i', Math.min(8, (l.offsetLeft - x0) / w + (l.offsetTop - y0) / h).toFixed(2)));
  });
  wave(); addEventListener('resize', raf(wave));

  /* Pestañas del muro: una sola cápsula blanca que desliza a la pestaña elegida. */
  d.querySelectorAll('.wall-tabs').forEach((t) => {
    const pill = d.createElement('span');
    pill.className = 'p-proof-pill'; pill.setAttribute('aria-hidden', 'true');
    t.classList.add('p-proof-tabs'); t.append(pill);
    const place = () => {
      const b = t.querySelector('[aria-selected="true"]'); if (!b) return;
      pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    };
    place(); requestAnimationFrame(() => t.classList.add('p-proof-on'));
    t.addEventListener('click', () => { place(); wave(); });
    if (window.ResizeObserver) new ResizeObserver(raf(place)).observe(t);
  });

  /* Carril de proyectos: filete con el tramo visible (--w) y su posición (--p). */
  const rail = d.getElementById('rail');
  if (rail) {
    const bar = d.createElement('div');
    bar.className = 'p-proof-rail'; bar.setAttribute('aria-hidden', 'true'); bar.append(d.createElement('i'));
    rail.after(bar);
    const upd = () => {
      const m = rail.scrollWidth - rail.clientWidth;
      bar.hidden = m < 2;
      bar.style.setProperty('--w', (rail.clientWidth / rail.scrollWidth).toFixed(4));
      bar.style.setProperty('--p', m > 0 ? (rail.scrollLeft / m).toFixed(4) : 0);
    };
    upd(); rail.addEventListener('scroll', raf(upd), { passive: true }); addEventListener('resize', raf(upd));
  }
})();

/* ======================= Poesía · content */
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) return;

  /* .contact-info: la onda solo corre mientras el bloque está en pantalla (.p-live) */
  if ('IntersectionObserver' in window) {
    const live = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('p-live', e.isIntersecting)));
    /* En la home no hay onda (CSS): allí no se añade ningún movimiento autónomo. */
    if (document.body.dataset.area !== 'home') document.querySelectorAll('.contact-info').forEach(el => live.observe(el));
  }

  /* Envío correcto («adqa:sent», con .form-ok ya visible): la flecha de «Enviar» sale volando y dos señales recorren el
     borde del formulario (radio 22, a .75 px) en sentidos opuestos, de debajo del botón al centro de arriba, donde aparece
     un nodo con un ping. --p-dur: de 1,2 a 2 s según el tamaño (unos 600 px/s). Se retira al acabar. */
  document.querySelectorAll('.form').forEach(form => form.addEventListener('adqa:sent', () => {
    form.classList.remove('p-content-sent'); void form.offsetWidth; form.classList.add('p-content-sent');
    setTimeout(() => form.classList.remove('p-content-sent'), 950);
    const old = form.querySelector('.p-content-loop'); if (old) old.remove();
    const W = form.offsetWidth, H = form.offsetHeight, i = .75, r = 21.25, m = W / 2, y = H - i, b = form.querySelector('.btn');
    const x = b ? b.offsetLeft + form.clientLeft + b.offsetWidth / 2 : m, d = Math.min(2, Math.max(1.2, (W + H) / 600));
    const side = (s) => `M${x} ${y}H${s ? W - i - r : i + r}A${r} ${r} 0 0 ${1 - s} ${s ? W - i : i} ${y - r}V${i + r}A${r} ${r} 0 0 ${1 - s} ${s ? W - i - r : i + r} ${i}H${m}`;
    const c = (k, rr) => `<circle class="${k}" cx="${m}" cy="${i}" r="${rr}"/>`;
    const box = document.createElement('div');
    box.className = 'p-content-loop'; box.setAttribute('aria-hidden', 'true'); box.style.setProperty('--p-dur', d.toFixed(2) + 's');
    box.innerHTML = `<svg focusable="false"><path pathLength="1" d="${side(0)}"/><path pathLength="1" d="${side(1)}"/><g class="n">${c('h', 7.5)}${c('d', 3.5)}</g>${c('p', 3.5)}</svg>`;
    form.append(box);
    setTimeout(() => box.remove(), (d + 1.95) * 1000);
  }));
})();

/* ======================= Poesía · blog: «el índice sigue la lectura» (.toc del artículo).
   Marca con aria-current="location" el enlace de la sección que se está leyendo (el último h2 que ha pasado del 35 %
   superior de la pantalla) y da a --p la fracción del hilo del índice hasta ella. Sin JS, el índice de siempre. */
(() => {
  const ol = document.querySelector(".toc ol");
  const hs = [...document.querySelectorAll(".art-main .prose h2[id]")];
  if (!ol || !hs.length) return;
  const links = new Map([...ol.querySelectorAll('a[href^="#"]')].map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  let cur = null;
  const fill = () => {
    // El hilo va del centro del primer número (16 px) al del último (16 px antes del final): ver el CSS de blog en site.css.
    const p = cur ? (cur.parentElement.offsetTop - ol.firstElementChild.offsetTop) / Math.max(1, ol.clientHeight - 32) : 0;
    ol.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
  };
  const set = () => {
    const y = innerHeight * 0.35;
    let h = null;
    for (const x of hs) { if (x.getBoundingClientRect().top < y) h = x; else break; }
    const a = (h && links.get(h.id)) || null;
    if (a === cur) return;
    if (cur) cur.removeAttribute("aria-current");
    if (a) a.setAttribute("aria-current", "location");
    cur = a;
    fill();
  };
  // La banda observada es el 35 % superior: cada h2 avisa al cruzar esa línea (en los dos sentidos).
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(set, { rootMargin: "0px 0px -65% 0px" });
    hs.forEach((h) => io.observe(h));
  }
  // Saltos largos (Inicio/Fin, enlaces): el IO no ve un h2 que pasa de abajo a arriba sin cruzar la banda.
  // Donde no hay scrollend (Safari), un scroll con espera de 120 ms hace lo mismo.
  if ("onscrollend" in window) addEventListener("scrollend", set, { passive: true });
  else { let t = 0; addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(set, 120); }, { passive: true }); }
  addEventListener("resize", fill, { passive: true });
  set();
})();
