(() => {
  'use strict';
  if (window.__ATM_CLOUD_V61__) return;
  window.__ATM_CLOUD_V61__ = true;

  const cfg = window.ATM_CLOUD_BRAIN || {};
  const endpoint = String(cfg.endpoint || '').replace(/\/+$/,'').trim();
  const configured = endpoint && !endpoint.includes('PASTE_CLOUDFLARE');
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const english = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const t = (it,en) => english()?en:it;

  /* Always fix actual visual viewport, even before Cloud AI is configured. */
  const syncViewport = () => {
    const vv = window.visualViewport;
    const height = Math.max(240, Math.round(vv ? vv.height : window.innerHeight));
    document.documentElement.style.setProperty('--atm-visible-height', `${height}px`);
    const feed = $('.atm-guide-feed');
    if (document.body.classList.contains('atm-guide-open') && feed) {
      requestAnimationFrame(()=>feed.scrollTop=feed.scrollHeight);
    }
  };
  syncViewport();
  window.addEventListener('resize',syncViewport,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(syncViewport,80),{passive:true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize',syncViewport,{passive:true});
    window.visualViewport.addEventListener('scroll',syncViewport,{passive:true});
  }

  /* Repair old media references. This prevents repeated broken reloads after V6.1 starts. */
  const mediaFixes = [
    ['assets/ai-animation-flow-1.mp4','ai-animation-flow-1.mp4'],
    ['assets/atm-v7-intro.mp4','atm-v7-intro.mp4']
  ];
  const changedVideos = new Set();
  $$('video[src],video source[src]').forEach(node=>{
    let src=node.getAttribute('src')||'';
    for(const [oldPath,newPath] of mediaFixes){
      if(src.includes(oldPath)){
        src=src.replace(oldPath,newPath);
        node.setAttribute('src',src);
        changedVideos.add(node.tagName==='VIDEO'?node:node.closest('video'));
      }
    }
  });
  changedVideos.forEach(video=>{
    if(!video)return;
    try{video.load();video.play().catch(()=>{})}catch(_){}
  });

  const setEngineBadge = () => {
    const small=$('.atm-guide-title small');
    if(!small)return;
    if(configured){
      small.textContent=t('CLOUD AI · attivazione…','CLOUD AI · starting…');
      small.style.color='#a9b7a5';
    }else{
      small.textContent=t('LOCAL MODE · Cloud Brain non configurato','LOCAL MODE · Cloud Brain not configured');
      small.style.color='#e7bd69';
    }
  };

  const observeUI = () => {
    setEngineBadge();
    const shell=$('.atm-guide-shell');
    if(shell && !shell.dataset.v61Observed){
      shell.dataset.v61Observed='1';
      new MutationObserver(()=>{
        syncViewport();
        if(shell.classList.contains('is-open')){
          document.body.classList.add('atm-guide-open');
          const launcher=$('.atm-guide-launcher');
          if(launcher)launcher.style.display='none';
        }
      }).observe(shell,{attributes:true,attributeFilter:['class']});
    }
  };

  if ($('.atm-guide-shell')) observeUI();
  else new MutationObserver(()=>{
    if($('.atm-guide-shell')){observeUI()}
  }).observe(document.documentElement,{childList:true,subtree:true});

  /*
   * IMPORTANT:
   * This file intentionally does not implement a second AI engine.
   * When the Cloudflare endpoint/sitekey are configured, load assistant-cf-v6.js
   * immediately after this file. It will clone the old form and take ownership
   * of submissions, removing the V3 keyword listeners.
   */
})();