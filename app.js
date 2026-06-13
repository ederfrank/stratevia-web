/* ===== STRATEVIA AI — V2 (moderado) ===== */
(function(){
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
  }));

  const io = new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ===== FORMULARIO → SUPABASE ===== */
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');
  const SUPABASE_URL = 'sb_publishable_i7S-SCCEn4qIgM3SvYVCcg_LNGCIj4c';
  const SUPABASE_ANON = 'sb_publishable_i7S-SCCEn4qIgM3SvYVCcg_LNGCIj4c';
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if(!data.nombre || !data.correo){ msg.style.color='#ff8080'; msg.textContent='Completa nombre y correo, por favor.'; return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled=true; msg.style.color=''; msg.textContent='Enviando...';
    if(SUPABASE_URL.startsWith('TU_')){
      msg.textContent='¡Gracias, '+data.nombre+'! (modo demo: configura Supabase para recibir el mensaje)';
      form.reset(); btn.disabled=false; return;
    }
    try{
      const res = await fetch(SUPABASE_URL+'/rest/v1/contactos',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Prefer':'return=minimal'},
        body:JSON.stringify({nombre:data.nombre,empresa:data.empresa||null,correo:data.correo,mensaje:data.mensaje||null})
      });
      if(!res.ok) throw new Error(res.status);
      msg.style.color=''; msg.textContent='¡Gracias, '+data.nombre+'! Te contactaremos pronto.'; form.reset();
    }catch(err){ msg.style.color='#ff8080'; msg.textContent='Hubo un problema. Escríbenos a eder.escobedo@strateviaapp.com'; }
    finally{ btn.disabled=false; }
  });

  /* parallax suave del robot */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const frame = document.querySelector('.robot-frame');
  if(!frame) return;
  let tx=0,ty=0,cx=0,cy=0;
  document.addEventListener('mousemove',(e)=>{
    tx=(e.clientX/window.innerWidth-.5)*8;
    ty=(e.clientY/window.innerHeight-.5)*8;
  });
  (function loop(){
    cx+=(tx-cx)*.06; cy+=(ty-cy)*.06;
    frame.style.transform = `perspective(1000px) rotateY(${cx*0.12}deg) rotateX(${-cy*0.1}deg)`;
    requestAnimationFrame(loop);
  })();
})();
