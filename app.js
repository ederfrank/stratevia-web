/* ===== STRATEVIA AI — app.js con Supabase + Resend via Edge Function ===== */
(function(){
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
  }));

  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ===== CONFIG ===== */
  const SUPABASE_URL  = 'https://niauybhdvijbxlhpuivp.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYXV5YmhkdmlqYnhsaHB1aXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzUwNzAsImV4cCI6MjA5NTE1MTA3MH0.cBkbJTfDaKV7YrzInZN09D1aM4Vwa9x4GQBdOJ2icVI';

  /* ===== FORMULARIO ===== */
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('form-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if(!data.nombre || !data.correo){
      msg.style.color = '#ff8080';
      msg.textContent = 'Completa nombre y correo, por favor.';
      return;
    }

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    msg.style.color = '#8fb0b8';
    msg.textContent = 'Enviando...';

    try {
      /* PASO 1: Guardar en Supabase */
      const res = await fetch(SUPABASE_URL + '/rest/v1/contactos', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_ANON,
          'Authorization': 'Bearer ' + SUPABASE_ANON,
          'Prefer':        'return=representation'
        },
        body: JSON.stringify({
          nombre:  data.nombre,
          empresa: data.empresa || null,
          correo:  data.correo,
          mensaje: data.mensaje || null
        })
      });

      if(!res.ok){
        const txt = await res.text();
        throw new Error('Supabase ' + res.status + ': ' + txt);
      }

      const [record] = await res.json();

      /* PASO 2: Llamar Edge Function para enviar correos */
      fetch(SUPABASE_URL + '/functions/v1/notify-contacto', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + SUPABASE_ANON
        },
        body: JSON.stringify({ record })
      }).catch(err => console.warn('Email notification error:', err));
      // No esperamos la respuesta del email para no bloquear al usuario

      msg.style.color = '#3ad1c5';
      msg.textContent = '¡Gracias, ' + data.nombre + '! Recibimos tu mensaje. Te contactaremos en menos de 24 horas.';
      form.reset();

    } catch(err){
      console.error('Error:', err);
      msg.style.color = '#ff8080';
      msg.textContent = 'Hubo un problema al enviar. Escríbenos a contacto@strateviaapp.com';
    } finally {
      btn.disabled = false;
    }
  });

  /* ===== PARALLAX VIDEO ===== */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const frame = document.querySelector('.robot-frame');
  if(!frame) return;
  let tx=0, ty=0, cx=0, cy=0;
  document.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth  - .5) * 8;
    ty = (e.clientY / window.innerHeight - .5) * 8;
  });
  (function loop(){
    cx += (tx - cx) * .06;
    cy += (ty - cy) * .06;
    frame.style.transform =
      `perspective(1000px) rotateY(${cx*0.12}deg) rotateX(${-cy*0.1}deg)`;
    requestAnimationFrame(loop);
  })();

})();
