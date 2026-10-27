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

  /* form (front-end only: connect to your backend / form handler) */
  const f=document.querySelector('.form');
  if(f)f.addEventListener('submit',e=>{
    e.preventDefault();
    if(!f.checkValidity()){f.reportValidity();return}
    const ok=f.querySelector('.form-ok');if(ok)ok.style.display='block';f.reset();
  });
})();
