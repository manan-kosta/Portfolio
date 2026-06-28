  // ---- Mobile viewport height fix ----
  function setVH(){ document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px'); }
  setVH();
  window.addEventListener('resize', setVH);

  // ---- Intro sequence ----
  document.body.style.overflow = 'hidden';
  const introEl = document.getElementById('intro');
  setTimeout(()=>{ document.body.style.overflow = ''; }, 4350);
  setTimeout(()=>{ introEl.style.display='none'; }, 5200);

  // ---- Custom cursor dot ----
  if (window.matchMedia("(pointer: fine)").matches) {
  const cursorDot = document.createElement('div');
  cursorDot.id = 'cursorDot';
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  const hoverTargets = 'a, button, .proj-arrow, .contact-link, .nav-cta';

  window.addEventListener('mousemove', (event) => {
    cursorDot.style.left = event.clientX + 'px';
    cursorDot.style.top = event.clientY + 'px';
    cursorDot.classList.add('visible');
  });
  window.addEventListener('mouseleave', () => cursorDot.classList.remove('visible'));
  window.addEventListener('mouseenter', () => cursorDot.classList.add('visible'));

  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('pointerenter', () => cursorDot.classList.add('hovered'));
    el.addEventListener('pointerleave', () => cursorDot.classList.remove('hovered'));
  });
  }

  // ---- Scrub bar driven by scroll ----
  const fill = document.getElementById('scrubFill');
  const head = document.getElementById('scrubHead');
  const tcLeft = document.getElementById('tcLeft');

  function toTimecode(sec){
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = Math.floor(sec%60);
    const f = Math.floor((sec*24)%24);
    const p = n => String(n).padStart(2,'0');
    return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
  }
  function updateScrub(){
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(scrollTop / max, 1) : 0;
    fill.style.width = (pct*100) + '%';
    head.style.left = (pct*100) + '%';
    tcLeft.textContent = toTimecode(pct * 102);
  }
  window.addEventListener('scroll', updateScrub, { passive:true });
  window.addEventListener('resize', updateScrub);
  updateScrub();

  // ---- Waveform generator ----
const wf = document.getElementById('waveform');
let bars = '';

for(let i=0;i<113;i++){
  const h = 6 + Math.abs(Math.sin(i*0.45))*36 + Math.random()*6;
  bars += `<span style="height:${h.toFixed(1)}px"></span>`;
}

wf.innerHTML = bars;

// Animation
const waveBars = document.querySelectorAll('#waveform span');

let t = 0;

function animateWave(){

    t += 0.05;

    waveBars.forEach((bar,i)=>{

       const glow =
Math.sin((i * 0.22) + t * 2) * 0.5 + 0.5;

if(glow > 0.75){
    bar.style.background = "var(--red)";
    bar.style.boxShadow = "0 0 12px var(--red-glow)";
}
else if(glow > 0.45){
    bar.style.background = "rgba(255,22,50,.55)";
    bar.style.boxShadow = "0 0 6px rgba(255,22,50,.25)";
}
else{
    bar.style.background = "var(--panel-2)";
    bar.style.boxShadow = "none";
}

    });

    requestAnimationFrame(animateWave);

}

animateWave();
  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.12 });
  revealEls.forEach(el=>io.observe(el));

  // ================= PROJECTS: stacked-deck carousel(jaha pr saaari photo video dalegi 
  // ) =================
  const PROJECTS = [
    { ratio:'16-9', cat:'PODCAST Intro', title:"BENIFETS OF GAUMUTRA", tools:'Premiere Pro · DaVinci Resolve grade · sfx design', video:'https://res.cloudinary.com/dqwcoigxe/video/upload/q_auto,f_auto/intro_o47kmz.mp4' },
    { ratio:'9-16', cat:'Instagram Reel', title:'travel insta reel', tools:'Premiere Pro · DaVinci Resolve grade · music design', video:'https://res.cloudinary.com/dqwcoigxe/video/upload/q_auto,f_auto/2_cm0snf.mp4' },
    { ratio:'9-16', cat:'podcast intro', title:"Raj Shamani intro", tools:'Premiere pro · DaVinci Resolve grade', video:'https://res.cloudinary.com/dqwcoigxe/video/upload/q_auto,f_auto/3_dikdpc.mp4' },
    { ratio:'9-16', cat:'podcast edit', title:'Mr. Beast intro', tools:'Premiere Pro · subtitles · color grading · ai photos',video:'https://res.cloudinary.com/dqwcoigxe/video/upload/q_auto,f_auto/4_n80u9e.mp4' },
    { ratio:'16-9', cat:'podcast edit', title:'iman and his watches', tools:'Premiere Pro · captioning · color grading',video:'https://res.cloudinary.com/dqwcoigxe/video/upload/q_auto,f_auto/5_dz92ly.mp4' },
    // { ratio:'9-16', cat:'Product Reel', title:'Launch Teaser — 15 Sec Cut', tools:'Resolve grade · fast hook pacing' }
  ];

  const stage = document.getElementById('deckStage');
  const dotsWrap = document.getElementById('projDots');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');

  let current = 0;
  const N = PROJECTS.length;
  const playSvg = '<svg viewBox="0 0 24 24" fill="none"><path d="M7 4L20 12L7 20V4Z" fill="#F5F2ED"/></svg>';

  function buildCard(p){
    const el = document.createElement('div');
    el.className = 'deck-card ratio-' + p.ratio;

    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    
  const videoHtml = p.video ? `
  <div class="video-wrap">
    <video
    src="${encodeURI(p.video)}"
    playsinline
    preload="metadata"
    ${window.matchMedia("(min-width: 769px)").matches ? "controls" : ""}
></video>

    <button
      type="button"
      class="play-overlay"
      aria-label="Play video"
    >
      ${playSvg}
    </button>
  </div>
` : `
  <div class="proj-thumb-placeholder">
    <div class="play-icon">${playSvg}</div>
  </div>
`;
    el.innerHTML = `
      <div class="proj-thumb">
        <span class="ratio-badge mono">${p.ratio.replace('-',':')}</span>
        ${videoHtml}
      </div>
      <div class="proj-body">
        <div class="proj-cat">${p.cat}</div>
        <div class="proj-title">${p.title}</div>
        <div class="proj-tools">${p.tools}</div>
      </div>`;
    if(p.video){
      const video = el.querySelector('video');
      const overlay = el.querySelector('.play-overlay');
overlay.addEventListener('click', () => {
        if(video.paused){
          pauseAllProjectVideos();
          video.play();
        }
      });
      video.addEventListener('play', () => overlay.classList.add('hidden'));
      video.addEventListener('pause', () => overlay.classList.remove('hidden'));
    }
    return el;
  }

  function pauseAllProjectVideos(){
    cardEls.forEach(card => {
      const vid = card.querySelector('video');
      const overlay = card.querySelector('.play-overlay');
      if(vid){
        vid.pause();
        if(overlay) overlay.classList.remove('hidden');
      }
    });
  }

  const cardEls = PROJECTS.map(buildCard);
  cardEls.forEach(el => stage.appendChild(el));

  function renderDeck(){
    cardEls.forEach((el, i)=>{
      let offset = i - current;
      if(offset > N/2) offset -= N;
      if(offset < -N/2) offset += N;
      const abs = Math.abs(offset);
      el.style.zIndex = 100 - abs;
      el.style.position='absolute'; el.style.left='50%'; el.style.top='50%';

      if(abs > 2){
        el.style.opacity = '0';
        el.style.transform = `translate(-50%,-50%) translateX(${offset>0?'60%':'-60%'}) scale(0.7)`;
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = offset===0 ? 'auto' : 'none';

      if(offset === 0){
        el.style.opacity = '1'; el.style.filter = 'none';
        el.style.transform = 'translate(-50%,-50%) translateY(0%) scale(1) rotate(0deg)';
      } else if(offset === -1){
        el.style.opacity = '0.35'; el.style.filter = 'blur(1px)';
        el.style.transform = 'translate(-50%,-50%) translateY(-14%) scale(0.86) rotate(-3deg)';
      } else if(offset === 1){
        el.style.opacity = '0.55'; el.style.filter = 'blur(0.5px)';
        el.style.transform = 'translate(-50%,-50%) translateY(14%) scale(0.9) rotate(3deg)';
      } else if(offset === -2){
        el.style.opacity = '0'; el.style.filter = 'blur(2px)';
        el.style.transform = 'translate(-50%,-50%) translateY(-22%) scale(0.78) rotate(-5deg)';
      } else if(offset === 2){
        el.style.opacity = '0'; el.style.filter = 'blur(2px)';
        el.style.transform = 'translate(-50%,-50%) translateY(22%) scale(0.78) rotate(5deg)';
      }
    });
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
  }

  function goTo(i){ current = ((i % N) + N) % N; pauseAllProjectVideos(); renderDeck(); }
  function next(){ goTo(current+1); }
  function prev(){ goTo(current-1); }

  PROJECTS.forEach((_, i)=>{
    const d = document.createElement('div');
    d.className = 'proj-dot';
    d.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  let dragging = false, dragStartX = 0, dragDX = 0;
  stage.addEventListener('pointerdown', (e)=>{
    dragging = true; dragStartX = e.clientX; dragDX = 0;
    stage.classList.add('grabbing');
  });
  window.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    dragDX = e.clientX - dragStartX;
  });
  window.addEventListener('pointerup', ()=>{
    if(!dragging) return;
    dragging = false;
    stage.classList.remove('grabbing');
    const threshold = 50;
    if(dragDX > threshold) prev();
    else if(dragDX < -threshold) next();
    dragDX = 0;
  });

  stage.setAttribute('tabindex','0');
  stage.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });

  renderDeck();
  // ===== Browser Title Blink =====

function updateTabTitle() {
    const scrollTop = window.scrollY;
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    let progress = Math.round((scrollTop / maxScroll) * 100);

    // 01% se start hoga
    progress = Math.max(1, Math.min(progress, 100));

    if (progress === 100) {
        document.title = "Portfolio Render Complete ✅";
    } else {
        document.title = `Portfolio || Rendering ${String(progress).padStart(2, "0")}%`;
    }
}

window.addEventListener("scroll", updateTabTitle);
updateTabTitle();