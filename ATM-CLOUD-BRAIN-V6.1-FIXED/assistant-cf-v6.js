(() => {
  'use strict';
  if (window.__ATM_CLOUD_BRAIN_V6__) return;
  window.__ATM_CLOUD_BRAIN_V6__ = true;

  const cfg = window.ATM_CLOUD_BRAIN || {};
  const endpoint = String(cfg.endpoint || '').replace(/\/+$/,'');
  const requireTurnstile = cfg.requireTurnstile !== false;
  const sitekey = String(cfg.turnstileSitekey || '').trim();

  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const english = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const t = (it,en) => english() ? en : it;

  if (!endpoint || endpoint.includes('PASTE_CLOUDFLARE')) {
    console.info('[ATM Cloud Brain V6] Worker endpoint is not configured. Existing local guide remains active.');
    return;
  }

  /* ---------- Mobile/tablet viewport hardening ---------- */
  const style = document.createElement('style');
  style.id = 'atm-cloud-brain-v6-style';
  style.textContent = `
    :root{--atm-vv-height:100dvh;--atm-vv-top:0px}
    body.atm-guide-open{overflow:hidden!important;overscroll-behavior:none!important}
    body.atm-guide-open .atm-guide-launcher{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
    .atm-guide-shell{
      top:var(--atm-vv-top)!important;bottom:auto!important;height:var(--atm-vv-height)!important;
      max-height:var(--atm-vv-height)!important;box-sizing:border-box!important;overflow:hidden!important
    }
    .atm-guide{min-height:0!important;max-height:100%!important;grid-template-rows:auto minmax(0,1fr) auto!important}
    .atm-guide-feed{min-height:0!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important}
    .atm-guide-message.bot.cloud-v6{position:relative;padding-top:23px}
    .atm-guide-message.bot.cloud-v6::before{
      content:"CLOUD AI";position:absolute;right:10px;top:8px;color:rgba(145,255,22,.76);
      font:800 7px/1 Inter,system-ui;letter-spacing:.13em
    }
    .atm-guide-message.bot.cloud-v6-fallback{border-color:rgba(255,190,75,.3)!important}
    .atm-cloud-status{display:inline-flex!important;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .atm-cloud-status i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#91ff16;box-shadow:0 0 9px #91ff16;flex:0 0 auto}
    .atm-cloud-verify{
      max-width:100%;padding:13px 14px;margin:8px 0 12px;border:1px solid rgba(145,255,22,.18);
      border-radius:16px;background:#101812;color:#dfe8dd
    }
    .atm-cloud-verify b{display:block;margin-bottom:8px;font:700 12px Inter,system-ui}
    .atm-cloud-turnstile{min-height:65px;display:flex;align-items:center;overflow:hidden}
    .atm-guide-chip.cloud-v6-chip{border-color:rgba(145,255,22,.34);background:rgba(145,255,22,.045)}
    .atm-guide-input{font-size:14px}
    @media(max-width:700px){
      .atm-guide-shell{padding:0!important;align-items:stretch!important;justify-content:stretch!important;background:#071008!important;backdrop-filter:none!important}
      .atm-guide{width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;border:0!important;border-radius:0!important}
      .atm-guide-head{
        grid-template-columns:54px minmax(0,1fr) 40px!important;gap:11px!important;
        padding:max(10px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 11px max(12px,env(safe-area-inset-left))!important
      }
      .atm-guide-face{width:54px!important;height:54px!important;border-radius:16px!important}
      .atm-guide-title{min-width:0!important}.atm-guide-title b,.atm-guide-title small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .atm-guide-title b{font-size:15px!important}.atm-guide-title small{font-size:9px!important}
      .atm-guide-feed{padding:13px max(12px,env(safe-area-inset-right)) 11px max(12px,env(safe-area-inset-left))!important}
      .atm-guide-message{max-width:95%!important;font-size:14px!important;line-height:1.55!important}
      .atm-guide-chips{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;gap:7px!important;padding:2px 1px 7px!important;scrollbar-width:none!important}
      .atm-guide-chips::-webkit-scrollbar{display:none}.atm-guide-chip{flex:0 0 auto!important}
      .atm-guide-form{
        padding:9px max(10px,env(safe-area-inset-right)) max(9px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))!important;
        grid-template-columns:minmax(0,1fr) 48px!important
      }
      .atm-guide-input{height:48px!important;font-size:16px!important}.atm-guide-send{height:48px!important}
      .atm-guide-note{font-size:8.7px!important}
      .atm-cloud-turnstile{max-width:100%;transform-origin:left center}
    }
    @media(max-width:380px){
      .atm-guide-head{grid-template-columns:48px minmax(0,1fr) 38px!important}
      .atm-guide-face{width:48px!important;height:48px!important}
      .atm-guide-title small{display:none!important}.atm-guide-note{display:none!important}
      .atm-guide-message{max-width:98%!important}
    }
    @media(min-width:701px) and (max-width:1050px){
      .atm-guide-shell{padding:14px!important}
      .atm-guide{width:min(560px,calc(100vw - 28px))!important;height:min(800px,calc(var(--atm-vv-height) - 28px))!important}
    }
    @media(max-height:620px) and (min-width:701px){
      .atm-guide-shell{padding:7px!important}
      .atm-guide{width:min(680px,calc(100vw - 14px))!important;height:calc(var(--atm-vv-height) - 14px)!important}
      .atm-guide-head{grid-template-columns:48px minmax(0,1fr) 38px!important;padding:8px 11px!important}
      .atm-guide-face{width:48px!important;height:48px!important;border-radius:14px!important}
      .atm-guide-title small,.atm-guide-note{display:none!important}
      .atm-guide-feed{padding:9px 13px!important}.atm-guide-message{padding:9px 12px!important;line-height:1.45!important}
      .atm-guide-form{padding:7px 11px!important}.atm-guide-chips{flex-wrap:nowrap!important;overflow-x:auto!important}
    }
  `;
  document.head.appendChild(style);

  const syncViewport = () => {
    const vv = window.visualViewport;
    const h = Math.max(240, Math.round(vv ? vv.height : innerHeight));
    const top = Math.max(0, Math.round(vv ? vv.offsetTop : 0));
    document.documentElement.style.setProperty('--atm-vv-height', `${h}px`);
    document.documentElement.style.setProperty('--atm-vv-top', `${top}px`);
    const feed = $('.atm-guide-feed');
    if (document.body.classList.contains('atm-guide-open') && feed) {
      requestAnimationFrame(()=>feed.scrollTop=feed.scrollHeight);
    }
  };
  syncViewport();
  addEventListener('resize',syncViewport,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(syncViewport,80),{passive:true});
  if (visualViewport) {
    visualViewport.addEventListener('resize',syncViewport,{passive:true});
    visualViewport.addEventListener('scroll',syncViewport,{passive:true});
  }

  const loadTurnstile = () => new Promise((resolve,reject)=>{
    if (window.turnstile) return resolve(window.turnstile);
    const existing = document.querySelector('script[data-atm-turnstile]');
    if (existing) {
      const wait=()=>window.turnstile?resolve(window.turnstile):setTimeout(wait,50);
      wait(); return;
    }
    const s=document.createElement('script');
    s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async=true;s.defer=true;s.dataset.atmTurnstile='1';
    s.onload=()=>resolve(window.turnstile);
    s.onerror=()=>reject(new Error('Turnstile failed to load'));
    document.head.appendChild(s);
  });

  const pageProduct = document.body.dataset.product || 'ecosystem';
  const pageContext = () => {
    const parts=[];
    $$('main h1,main h2,main h3,main p,main li').forEach(n=>{
      if(n.closest('.atm-guide-shell'))return;
      const x=(n.textContent||'').replace(/\s+/g,' ').trim();
      if(x.length>=25 && x.length<=260) parts.push(x);
    });
    return [...new Set(parts)].join('\n').slice(0,3200);
  };

  const boot = () => {
    const oldForm=$('.atm-guide-form'), feed=$('.atm-guide-feed'), shell=$('.atm-guide-shell'), oldChips=$('.atm-guide-chips');
    if(!oldForm||!feed||!shell||!oldChips){setTimeout(boot,80);return}
    if(oldForm.dataset.cloudBrainV6==='1')return;

    /* Cloning removes old V3/V4/V5 submit/chip listeners. */
    const form=oldForm.cloneNode(true);form.dataset.cloudBrainV6='1';oldForm.replaceWith(form);
    const chips=oldChips.cloneNode(false);oldChips.replaceWith(chips);
    const input=$('.atm-guide-input',form), send=$('.atm-guide-send',form);
    const titleSmall=$('.atm-guide-title small');

    if(titleSmall){
      titleSmall.innerHTML=`<span class="atm-cloud-status"><i></i>${t('Cloudflare AI · sessione protetta','Cloudflare AI · protected session')}</span>`;
    }

    let history=[];
    let sessionToken='';
    let sessionExpires=0;
    let busy=false;
    const MAX_HISTORY=8;

    const add=(value,who,extra='')=>{
      const node=document.createElement('div');
      node.className=`atm-guide-message ${who} ${extra}`.trim();
      node.textContent=value;feed.appendChild(node);feed.scrollTop=feed.scrollHeight;return node;
    };

    const localFallback=(q)=>{
      const words=q.toLowerCase().split(/\s+/).filter(w=>w.length>3);
      const candidates=[];
      $$('main h2,main h3,main p,main li').forEach(node=>{
        const text=(node.textContent||'').replace(/\s+/g,' ').trim();
        if(text.length<30||text.length>450)return;
        let score=0;for(const w of words)if(text.toLowerCase().includes(w))score++;
        if(score)candidates.push({text,score});
      });
      candidates.sort((a,b)=>b.score-a.score);
      return candidates[0]?.score>=2
        ? t(`Il cervello cloud non è disponibile in questo momento. Dal contenuto pubblico della pagina trovo questo:\n${candidates[0].text}`,
            `The cloud brain is unavailable right now. From the public page I found this:\n${candidates[0].text}`)
        : t('Il cervello cloud non è disponibile e non voglio inventare una risposta. Riprova tra poco.',
            'The cloud brain is unavailable and I do not want to invent an answer. Please try again shortly.');
    };

    const post=async(path,data,auth=true)=>{
      const headers={'Content-Type':'application/json'};
      if(auth&&sessionToken)headers.Authorization=`Bearer ${sessionToken}`;
      const res=await fetch(`${endpoint}${path}`,{method:'POST',headers,body:JSON.stringify(data)});
      const body=await res.json().catch(()=>({}));
      if(!res.ok){
        const err=new Error(body.message||body.error||`HTTP ${res.status}`);
        err.code=body.code||'HTTP_ERROR';throw err;
      }
      return body;
    };

    const obtainTurnstileToken=async()=>{
      if(!requireTurnstile)return '';
      if(!sitekey||sitekey.includes('PASTE_TURNSTILE'))throw new Error('Turnstile sitekey not configured');
      const ts=await loadTurnstile();
      const wrap=document.createElement('div');wrap.className='atm-cloud-verify';
      wrap.innerHTML=`<b>${t('Verifica rapida anti-bot','Quick anti-bot verification')}</b><div class="atm-cloud-turnstile"></div>`;
      feed.appendChild(wrap);feed.scrollTop=feed.scrollHeight;
      const holder=$('.atm-cloud-turnstile',wrap);
      return await new Promise((resolve,reject)=>{
        let widgetId=null;
        const done=(fn,val)=>{try{if(widgetId!==null)ts.remove(widgetId)}catch(_){}wrap.remove();fn(val)};
        widgetId=ts.render(holder,{
          sitekey,
          theme:'dark',
          size:'flexible',
          action:'atm_chat',
          callback:token=>done(resolve,token),
          'error-callback':()=>done(reject,new Error('Turnstile verification failed')),
          'expired-callback':()=>{try{ts.reset(widgetId)}catch(_){}}
        });
      });
    };

    const ensureSession=async()=>{
      if(!requireTurnstile)return;
      if(sessionToken&&Date.now()<sessionExpires-60000)return;
      const turnstileToken=await obtainTurnstileToken();
      const data=await post('/session',{turnstileToken},false);
      sessionToken=data.session;
      sessionExpires=Date.now()+(Number(data.expiresIn||3600)*1000);
    };

    const suggestions=()=>{
      const last=(history.filter(x=>x.role==='user').slice(-1)[0]?.content||'').toLowerCase();
      if(/bridge|chrome|firefox|estension/.test(last))return [
        t('Perché servono quei permessi?','Why are those permissions needed?'),
        t('È sicuro per i miei dati?','Is it safe for my data?'),
        t('Cosa succede dopo?','What happens next?')
      ];
      if(/v7|geojson|kml|genera/.test(last))return [
        t('Spiegamelo passo passo','Explain it step by step'),
        t('GeoJSON o KML?','GeoJSON or KML?'),
        t('E dopo v7?','What comes after v7?')
      ];
      if(/manager|ruol|space|assegn/.test(last))return [
        t('Spiegami bene i ruoli','Explain the roles clearly'),
        t('Come funziona un’assegnazione?','How does an assignment work?'),
        t('E la sicurezza?','What about security?')
      ];
      return [t('Quale prodotto mi serve?','Which product do I need?'),'ATM Version 7','ATM Bridge','ATM Manager'];
    };
    const renderChips=()=>{
      chips.replaceChildren();
      suggestions().forEach(label=>{
        const b=document.createElement('button');b.type='button';b.className='atm-guide-chip cloud-v6-chip';b.textContent=label;
        b.addEventListener('click',()=>ask(label));chips.appendChild(b);
      });
    };

    const callAI=async(message)=>{
      await ensureSession();
      return await post('/chat',{
        message,
        history:history.slice(-MAX_HISTORY),
        page:{
          product:pageProduct,
          title:document.title.slice(0,160),
          context:pageContext()
        },
        language:document.documentElement.lang||'it'
      },requireTurnstile);
    };

    const ask=async(question)=>{
      const q=(question||'').trim();
      if(!q||busy)return;
      busy=true;add(q,'user');history.push({role:'user',content:q});history=history.slice(-MAX_HISTORY);
      const typing=add(t('Il compare sta collegando i neuroni… 🍉🧠','The buddy is connecting neurons… 🍉🧠'),'bot','typing');
      input.disabled=true;send.disabled=true;
      try{
        const data=await callAI(q);
        typing.remove();
        add(data.reply,'bot','cloud-v6');
        history.push({role:'assistant',content:data.reply});history=history.slice(-MAX_HISTORY);
      }catch(err){
        console.warn('[ATM Cloud Brain V6]',err);
        typing.remove();
        if(err.code==='SESSION_REQUIRED'||err.code==='SESSION_EXPIRED'){
          sessionToken='';sessionExpires=0;
        }
        const msg=err.code==='RATE_LIMIT'
          ? t('Troppe domande tutte insieme 😅. Aspetta un minuto e riprova.','Too many questions at once 😅. Wait a minute and try again.')
          : err.code==='AI_QUOTA'
            ? t('Abbiamo finito la quota AI gratuita di oggi. Il cervello cloud tornerà disponibile quando la quota giornaliera si resetta.','Today’s free AI quota is exhausted. The cloud brain will return when the daily quota resets.')
            : localFallback(q);
        add(msg,'bot','cloud-v6-fallback');
      }finally{
        renderChips();input.disabled=false;send.disabled=false;busy=false;
        input.focus({preventScroll:true});syncViewport();requestAnimationFrame(()=>feed.scrollTop=feed.scrollHeight);
      }
    };

    form.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';ask(q)});
    input.addEventListener('focus',()=>setTimeout(syncViewport,60));
    input.addEventListener('blur',()=>setTimeout(syncViewport,120));
    renderChips();

    const first=$('.atm-guide-message.bot',feed);
    if(first){
      first.textContent=t(
        'Ciao 👋 Il compare cocomero ora ha un vero cervello cloud 🍉🧠. Posso seguire conversazioni lunghe, capire “perché?”, “e dopo?”, confrontare v7/Bridge/Manager e dirti quando qualcosa non è documentato invece di inventarlo.',
        'Hello 👋 The watermelon buddy now has a real cloud brain 🍉🧠. I can follow longer conversations, understand “why?”, “what next?”, compare v7/Bridge/Manager, and tell you when something is undocumented instead of inventing it.'
      );
    }

    new MutationObserver(()=>{syncViewport();if(shell.classList.contains('is-open'))setTimeout(()=>input.focus({preventScroll:true}),60)})
      .observe(shell,{attributes:true,attributeFilter:['class']});
  };

  boot();
})();