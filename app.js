/* ===== STRATEVIA AI — interacciones + fondo 3D ===== */
(function(){
  'use strict';

  /* año footer */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* header al hacer scroll */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* menú móvil */
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
  }));

  /* reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* formulario (demo — sin backend) */
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if(!data.nombre || !data.correo){ msg.textContent='Completa nombre y correo, por favor.'; return; }
    // Aquí conectarás tu backend (Supabase / Render / un mailto).
    msg.textContent = '¡Gracias, ' + data.nombre + '! Te contactaremos pronto.';
    form.reset();
  });

  /* ===== FONDO 3D ===== */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.THREE) return;

  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 14;

  const group = new THREE.Group();
  scene.add(group);

  /* --- malla de wireframe icosaédrico (núcleo "IA") --- */
  const coreGeo = new THREE.IcosahedronGeometry(3.4, 1);
  const coreMat = new THREE.MeshBasicMaterial({color:0x3ad1c5, wireframe:true, transparent:true, opacity:.55});
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const core2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.6, 1),
    new THREE.MeshBasicMaterial({color:0x4f7cff, wireframe:true, transparent:true, opacity:.22})
  );
  group.add(core2);

  /* --- nube de partículas (datos) --- */
  const COUNT = 1100;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const r = 8 + Math.random()*12;
    const t = Math.random()*Math.PI*2;
    const p = Math.acos(2*Math.random()-1);
    pos[i*3]   = r*Math.sin(p)*Math.cos(t);
    pos[i*3+1] = r*Math.sin(p)*Math.sin(t);
    pos[i*3+2] = r*Math.cos(p);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const pMat = new THREE.PointsMaterial({color:0x6fe9df, size:0.06, transparent:true, opacity:.7});
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  /* --- nodos brillantes orbitando --- */
  const nodes = [];
  for(let i=0;i<5;i++){
    const n = new THREE.Mesh(
      new THREE.SphereGeometry(0.12,16,16),
      new THREE.MeshBasicMaterial({color: i%2 ? 0x4f7cff : 0x3ad1c5})
    );
    n.userData = {radius:5.5+i*0.8, speed:0.15+Math.random()*0.25, offset:Math.random()*Math.PI*2, tilt:Math.random()*0.6};
    group.add(n);
    nodes.push(n);
  }

  /* mouse parallax */
  let mx=0,my=0, tx=0,ty=0;
  window.addEventListener('mousemove', (e)=>{
    mx = (e.clientX/window.innerWidth - .5);
    my = (e.clientY/window.innerHeight - .5);
  });

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    core.rotation.y = t*0.12; core.rotation.x = t*0.06;
    core2.rotation.y = -t*0.09; core2.rotation.z = t*0.05;
    points.rotation.y = t*0.02;

    nodes.forEach(n=>{
      const d = n.userData;
      n.position.x = Math.cos(t*d.speed + d.offset)*d.radius;
      n.position.z = Math.sin(t*d.speed + d.offset)*d.radius;
      n.position.y = Math.sin(t*d.speed + d.offset)*d.radius*d.tilt;
    });

    /* parallax suave hacia el mouse */
    tx += (mx*1.2 - tx)*0.05;
    ty += (my*1.2 - ty)*0.05;
    group.rotation.y = tx;
    group.rotation.x = ty;
    camera.position.x = tx*2;
    camera.position.y = -ty*2;
    camera.lookAt(0,0,0);

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
