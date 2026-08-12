(() => {
  if (window.__ATM_WOW_V3__) return;
  window.__ATM_WOW_V3__ = true;

  const support = 'atmsupportcentre@gmail.com';
  const isEnglish = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const t = (it, en) => isEnglish() ? en : it;
  const pageProduct = document.body.dataset.product || 'ecosystem';

  /* Critical anti-cache/failsafe style. Even if an older CSS file is cached,
     the launcher can never sit over an open dialog. */
  const critical = document.createElement('style');
  critical.id = 'atm-wow-v3-critical';
  critical.textContent = `
    body.atm-guide-open .atm-guide-launcher{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
    .atm-guide-shell.is-open{z-index:1600!important}
    .product-story:not(.story-manager) .story-link-quiet{color:#0a110b!important;border-color:rgba(10,17,11,.24)!important;background:rgba(10,17,11,.035)!important}
  `;
  document.head.appendChild(critical);

  const normalize = value => (value || '')
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s.-]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = value => normalize(value).split(' ').filter(x => x.length > 1);

  /* Repair media paths from earlier showcase versions. */
  const repairMediaPaths = () => {
    const replacements = [
      ['assets/ai-animation-flow-1.mp4', 'ai-animation-flow-1.mp4'],
      ['assets/atm-v7-intro.mp4', 'atm-v7-intro.mp4']
    ];
    const videos = new Set();
    document.querySelectorAll('video[src], video source[src]').forEach(node => {
      let current = node.getAttribute('src') || '';
      replacements.forEach(([wrong,right]) => {
        if (current.includes(wrong)) {
          current = current.replace(wrong,right);
          node.setAttribute('src',current);
          videos.add(node.tagName === 'VIDEO' ? node : node.closest('video'));
        }
      });
    });
    videos.forEach(video => {
      if (!video) return;
      try { video.load(); video.play().catch(() => {}); } catch (_) {}
    });
  };
  repairMediaPaths();

  document.querySelectorAll('a[href="https://atm-v7.netlify.app/website/"]').forEach(link => {
    const label = normalize(link.textContent);
    link.href = (label.includes('installa') || label.includes('install'))
      ? 'https://addons.mozilla.org/it/firefox/addon/atm-bridge/'
      : 'atm-bridge.html';
  });

  /* ---------------------- Knowledge system ---------------------- */
  let lastProduct = pageProduct === 'v7' ? 'v7' : pageProduct === 'bridge' ? 'bridge' : null;
  let lastTopicId = null;
  const recentQuestions = [];

  const topics = [
    {id:'ecosystem',product:'ecosystem',phrases:['ecosistema atm','atm ecosystem','come funziona tutto','come funzionano insieme','flusso completo','quale prodotto','tutto il sistema'],keys:['ecosistema','ecosystem','insieme','suite','flusso','workflow','prodotti','products'],it:'ATM è un flusso in tre fasi: 1) ATM Version 7 crea e controlla i territori; 2) ATM Bridge accompagna il GeoJSON verso Territory Helper; 3) ATM Manager organizza persone, richieste, assegnazioni, restituzioni, riposo e sicurezza. v7 crea, Bridge trasferisce, Manager gestisce.',en:'ATM is a three-stage workflow: 1) ATM Version 7 creates and reviews territories; 2) ATM Bridge assists the GeoJSON handoff to Territory Helper; 3) ATM Manager organizes people, requests, assignments, returns, rest periods and security. v7 creates, Bridge transfers, Manager manages.'},
    {id:'v7',product:'v7',phrases:['atm v7','atm version 7','version 7','creare territori','generare territori','territory creation'],keys:['v7','version','genera','generate','crea','create','territori','territory','mappa','map','confini','boundaries'],it:'ATM Version 7 è il modulo creativo. Parti da un’area geografica, imposti la suddivisione, generi i territori, controlli i perimetri sulla mappa e solo dopo esporti. Il risultato resta visibile e verificabile prima di entrare nel flusso operativo.',en:'ATM Version 7 is the creative module. Start from a geographic area, configure the subdivision, generate territories, inspect boundaries on the map and export only after review. The result stays visible and verifiable before entering the operational workflow.'},
    {id:'v7-workflow',product:'v7',phrases:['come si usa v7','workflow v7','flusso v7','passaggi v7','come creo un territorio','how to use v7'],keys:['seleziona','select','parametri','parameters','genera','verifica','review','esporta','export'],it:'Flusso v7: seleziona area/località → imposta parametri e quantità → genera → controlla visivamente perimetri e territori → esporta. Il GeoJSON può poi passare a Bridge o essere usato nel flusso operativo.',en:'v7 workflow: select the area/location → set parameters and quantity → generate → visually review boundaries and territories → export. The GeoJSON can then move through Bridge or into the operational workflow.'},
    {id:'v7-files',product:'v7',phrases:['geojson o kml','formati v7','file v7','cosa esporta','output v7','export format'],keys:['geojson','kml','file','formato','format','output','esporta','export'],it:'ATM v7 prepara dati territoriali esportabili. GeoJSON è il formato centrale del flusso con Bridge; la vetrina documenta anche KML. Prima dell’esportazione puoi controllare il risultato sulla mappa.',en:'ATM v7 prepares exportable territory data. GeoJSON is the central format for the Bridge flow; the showcase also documents KML. You can inspect the result on the map before exporting.'},
    {id:'bridge',product:'bridge',phrases:['atm bridge','bridge extension','estensione bridge','plugin bridge','territory helper connector'],keys:['bridge','estensione','extension','plugin','connector','trasferimento','transfer','territory helper'],it:'ATM Bridge è il collegamento assistito tra ATM e Territory Helper. Rileva il GeoJSON pronto, conserva temporaneamente lo stato nel browser, mostra file e quantità rilevati e lascia all’utente la conferma prima di aprire o riutilizzare Territory Helper.',en:'ATM Bridge is the assisted connection between ATM and Territory Helper. It detects the ready GeoJSON, temporarily keeps transfer state in the browser, shows the detected file and count, and leaves confirmation to the user before opening or reusing Territory Helper.'},
    {id:'bridge-install',product:'bridge',phrases:['come installare bridge','come si installa bridge','installazione bridge','install bridge','come si installa'],keys:['installazione','installation','installa','install'],it:'ATM Bridge ha due percorsi desktop: Firefox dalla pagina pubblica Add-ons; Chrome dal pacchetto ZIP. Su Chrome: estrai lo ZIP → chrome://extensions → Modalità sviluppatore → “Carica estensione non pacchettizzata”.',en:'ATM Bridge has two desktop installation paths: Firefox through the public Add-ons page; Chrome through the ZIP package. On Chrome: extract ZIP → chrome://extensions → Developer mode → “Load unpacked”.'},
    {id:'bridge-firefox',product:'bridge',phrases:['installare bridge firefox','bridge firefox','firefox addons','add to firefox'],keys:['firefox','addons','aggiungi'],it:'Su Firefox desktop apri la pagina pubblica ATM Bridge su Firefox Add-ons, scegli “Aggiungi a Firefox” e approva i permessi mostrati dal browser.',en:'On desktop Firefox open the public ATM Bridge Firefox Add-ons page, choose “Add to Firefox” and approve the permissions shown by the browser.'},
    {id:'bridge-chrome',product:'bridge',phrases:['installare bridge chrome','bridge chrome','chrome extension','load unpacked','carica estensione non pacchettizzata'],keys:['chrome','zip','sviluppatore','developer','unpacked','scarica','download'],it:'Su Chrome desktop: scarica lo ZIP, estrailo, apri chrome://extensions, abilita Modalità sviluppatore e scegli “Carica estensione non pacchettizzata”. Il flusso è pensato per desktop, non per Chrome mobile.',en:'On desktop Chrome: download and extract the ZIP, open chrome://extensions, enable Developer mode and choose “Load unpacked”. The flow targets desktop browsers, not Chrome mobile.'},
    {id:'bridge-privacy',product:'bridge',phrases:['bridge privacy','privacy bridge','permessi bridge','bridge permissions','dati bridge'],keys:['storage','tabs','scripting','notifications','permessi','permissions','privacy','dati','data'],it:'Bridge usa permessi browser per mantenere il trasferimento in sospeso, individuare o aprire le pagine supportate e mostrare notifiche. La vetrina descrive storage, tabs, scripting, unlimitedStorage e notifications; il manifest Firefox indicato dichiara raccolta dati richiesta “none”.',en:'Bridge uses browser permissions to keep a pending transfer, find or open supported pages and show notifications. The showcase describes storage, tabs, scripting, unlimitedStorage and notifications; the referenced Firefox manifest declares required data collection as “none”.'},
    {id:'manager',product:'manager',phrases:['atm manager','manager workspace','gestire territori','territory management'],keys:['manager','space','workspace','assegnazioni','assignments','richieste','requests','persone','people'],it:'ATM Manager è il centro operativo. Ogni organizzazione lavora in uno Space separato; ruoli diversi controllano ciò che ogni persona può fare. Richieste, assegnazioni, restituzioni, riposo, notifiche e registro attività mantengono tutto tracciabile.',en:'ATM Manager is the operating center. Each organization works in a separate Space; different roles control what each person can do. Requests, assignments, returns, rest periods, notifications and activity logs keep everything traceable.'},
    {id:'manager-roles',product:'manager',phrases:['ruoli manager','manager roles','utente avanzato','space owner','proprietario space'],keys:['ruoli','roles','utente','user','advanced','admin','amministratore','owner','proprietario'],it:'I ruoli documentati sono Utente, Utente avanzato, Amministratore e Proprietario dello Space. L’utente lavora sui propri territori; l’utente avanzato gestisce operazioni territoriali; l’amministratore coordina persone e attività; il proprietario governa lo Space e le operazioni più sensibili.',en:'The documented roles are User, Advanced user, Administrator and Space owner. Users work with their own territories; advanced users manage territory operations; administrators coordinate people and activity; owners govern the Space and its most sensitive operations.'},
    {id:'manager-security',product:'manager',phrases:['sicurezza manager','manager security','mfa passkey','space isolation','spazi separati'],keys:['sicurezza','security','mfa','passkey','rls','sessioni','sessions','isolamento','isolation'],it:'La vetrina descrive separazione degli Space, controlli per ruolo, policy RLS, MFA, passkey, sessioni e registro attività. Le azioni sensibili richiedono il ruolo corretto e, quando previsto, una sessione MFA verificata.',en:'The showcase documents Space isolation, role controls, RLS policies, MFA, passkeys, sessions and activity logging. Sensitive actions require the correct role and, where configured, a verified MFA session.'},
    {id:'manager-rest',product:'manager',phrases:['periodo di riposo','rest period','territorio lavorato','restituzione territorio','return territory'],keys:['riposo','rest','restituzione','return','lavorato','worked','cronologia','history'],it:'Quando un territorio viene restituito, l’utente può indicare se è stato lavorato o non lavorato e aggiungere una nota. Un territorio completato entra nel periodo di riposo previsto; notifiche e registro attività documentano il ciclo.',en:'When a territory is returned, the user can record whether it was worked or not and add a note. A completed territory enters the configured rest period; notifications and the activity log document the cycle.'},
    {id:'compare',product:'ecosystem',phrases:['differenza tra','difference between','v7 bridge manager','v7 vs bridge','bridge vs manager','v7 vs manager'],keys:['differenza','difference','vs','confronto','compare'],it:'La differenza è il momento del flusso: v7 CREA il dato geografico; Bridge TRASFERISCE in modo assistito verso Territory Helper; Manager GESTISCE il ciclo operativo con persone, ruoli e assegnazioni. Sono tre responsabilità complementari.',en:'The difference is the workflow stage: v7 CREATES geographic data; Bridge ASSISTS TRANSFER to Territory Helper; Manager MANAGES the operational lifecycle with people, roles and assignments. They are complementary responsibilities.'},
    {id:'assistant',product:'ecosystem',phrases:['sei una vera ai','sei un ai','come funzioni','how do you work','external ai','chatbot'],keys:['ai','assistente','assistant','chatbot','intelligenza','intelligence'],it:'Sono la guida informativa della vetrina ATM. Uso una knowledge base locale e ricerca contestuale: non invio domande a servizi AI esterni, non accedo agli account e non leggo file, password, sessioni o territori. Tengo anche il contesto delle domande recenti.',en:'I am the informational guide for the ATM showcase. I use a local knowledge base and contextual retrieval: I do not send questions to external AI services, access accounts or read files, passwords, sessions or territories. I also keep context from recent questions.'},
    {id:'support',product:'ecosystem',phrases:['contattare supporto','contact support','ho un bug','problema tecnico','technical issue'],keys:['supporto','support','email','bug','errore','error','problema','problem','aiuto','help'],it:`Per assistenza scrivi a ${support}. Indica prodotto, browser, dispositivo, passaggi eseguiti e messaggio di errore. Non inviare password, OTP, token o chiavi API.`,en:`For support email ${support}. Include product, browser, device, steps and the error message. Never send passwords, OTP codes, tokens or API keys.`}
  ];

  const greetings = ['ciao','hey','hei','yo','hello','hi','buongiorno','buonasera'];
  const followUpWords = ['come','perche','perché','e poi','e dopo','installarlo','funziona','quindi','dati','sicuro','mobile','telefono','quello','questa','questo'];

  const scoreTopic = (topic, question) => {
    const q = normalize(question);
    const qTokens = new Set(tokens(q));
    let score = 0;
    topic.phrases.forEach(p => { if (q.includes(normalize(p))) score += 8; });
    topic.keys.forEach(k => {
      const nk = normalize(k);
      if (q.includes(nk)) score += nk.includes(' ') ? 4.5 : 2.3;
      if (qTokens.has(nk)) score += 1.1;
    });
    if (lastProduct && topic.product === lastProduct && followUpWords.some(w => q.includes(normalize(w)))) score += 3.2;
    if (lastTopicId && topic.id === lastTopicId) score += .8;
    if (pageProduct !== 'ecosystem' && topic.product === pageProduct) score += .8;
    return score;
  };

  const answer = question => {
    const q = normalize(question);
    if (!q) return '';
    recentQuestions.push(q); if (recentQuestions.length > 6) recentQuestions.shift();
    if (greetings.some(g => q === g || q.startsWith(`${g} `)) && tokens(q).length <= 3) {
      return t('Ciao 👋 Posso seguirti dall’inizio alla fine: creazione con v7, trasferimento con Bridge e gestione con Manager. Dimmi cosa vuoi fare.', 'Hello 👋 I can guide you end-to-end: creation with v7, transfer with Bridge and management with Manager. Tell me what you want to do.');
    }
    const ranked = topics.map(topic => ({topic,score:scoreTopic(topic,q)})).filter(x => x.score > 0).sort((a,b)=>b.score-a.score);
    if (!ranked.length || ranked[0].score < 2.2) {
      if (lastProduct && q.length < 55) {
        const contextual = topics.find(x => x.product === lastProduct && (x.id === lastTopicId || x.id === lastProduct)) || topics.find(x => x.product === lastProduct);
        if (contextual) return isEnglish() ? contextual.en : contextual.it;
      }
      return t(`Non trovo una risposta verificata abbastanza precisa. Prova a dirmi se parli di ATM v7, Bridge o Manager, oppure scrivi a ${support}.`, `I cannot find a precise enough verified answer. Tell me whether you mean ATM v7, Bridge or Manager, or email ${support}.`);
    }
    const best = ranked[0];
    lastProduct = best.topic.product === 'ecosystem' ? lastProduct : best.topic.product;
    lastTopicId = best.topic.id;
    const second = ranked[1];
    if (second && second.score >= Math.max(4.4,best.score*.74) && second.topic.product !== best.topic.product) {
      return `${isEnglish()?best.topic.en:best.topic.it}\n\n${isEnglish()?second.topic.en:second.topic.it}`;
    }
    return isEnglish() ? best.topic.en : best.topic.it;
  };

  /* ---------------------- Cinematic showcase ---------------------- */
  const cinemaMarkup = () => `
    <section class="atm-cinema atm-wow-reveal" id="atm-live-flow" aria-label="ATM ecosystem live flow">
      <div class="atm-cinema-head">
        <span class="atm-cinema-kicker"><i></i> ATM LIVE FLOW · REAL-TIME CONCEPT</span>
        <h2>${t('Dal primo confine.<br><em>Fino al lavoro reale.</em>','From the first boundary.<br><em>To real operations.</em>')}</h2>
        <p>${t('Non tre prodotti separati. Un’unica catena visuale: v7 costruisce il territorio, Bridge accompagna il dato e Manager accende il ciclo operativo.','Not three separate products. One visual chain: v7 builds the territory, Bridge carries the data and Manager activates the operational lifecycle.')}</p>
      </div>
      <div class="atm-cinema-stage">
        <div class="atm-flow-rail"></div><div class="atm-flow-packet" aria-hidden="true"></div>
        <div class="atm-cinema-products">
          <article class="atm-cine-product">
            <div class="atm-cine-label"><span>01 · CREATE</span><b>ATM v7</b></div>
            <h3>ATM Version 7</h3><p>${t('L’area prende forma. I territori nascono davanti ai tuoi occhi.','The area takes shape. Territories are created in front of you.')}</p>
            <div class="atm-cine-screen"><div class="atm-map-grid"></div><i class="atm-map-poly p1"></i><i class="atm-map-poly p2"></i><i class="atm-map-poly p3"></i><span class="atm-map-cursor"></span></div>
          </article>
          <article class="atm-cine-product">
            <div class="atm-cine-label"><span>02 · CONNECT</span><b>ATM BRIDGE</b></div>
            <h3>ATM Bridge</h3><p>${t('Il GeoJSON viene rilevato, controllato e preparato per il passaggio.','The GeoJSON is detected, reviewed and prepared for handoff.')}</p>
            <div class="atm-cine-screen"><div class="atm-bridge-mini"><div class="atm-bridge-head"><i>ATM</i><span><b>ATM Bridge</b><small>Territory Helper connector</small></span><em></em></div><div class="atm-bridge-doc"><i>GEO</i><span><b>ATM_Territories.geojson</b><small>12 territories · ready</small></span><strong>✓</strong></div><div class="atm-bridge-bar"><i></i></div><div class="atm-bridge-btn">${t('Continua su Territory Helper','Continue to Territory Helper')}</div></div></div>
          </article>
          <article class="atm-cine-product">
            <div class="atm-cine-label"><span>03 · MANAGE</span><b>ATM MANAGER</b></div>
            <h3>ATM Manager</h3><p>${t('Persone, territori e assegnazioni diventano un sistema operativo vivo.','People, territories and assignments become a living operating system.')}</p>
            <div class="atm-cine-screen"><div class="atm-manager-mini"><aside class="atm-manager-side"><b>ATM</b><i></i><i></i><i></i><i></i></aside><div class="atm-manager-main"><small>LIVE SPACE</small><h4>Territory operations.</h4><div class="atm-manager-kpis"><span><small>TOTAL</small><b>1,693</b></span><span><small>AVAILABLE</small><b>1,691</b></span><span><small>ACTIVE</small><b>02</b></span></div><div class="atm-manager-map"><i></i><i></i></div></div></div></div>
          </article>
        </div>
        <div class="atm-cinema-caption"><span><i></i><b data-atm-flow-caption>${t('01 · Generazione territoriale in corso','01 · Territory generation in progress')}</b></span><small>CREATE → CONNECT → MANAGE</small></div>
      </div>
    </section>`;

  const injectCinema = () => {
    if (pageProduct !== 'ecosystem' || document.querySelector('#atm-live-flow')) return;
    const anchor = document.querySelector('.suite-products');
    if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', cinemaMarkup());
    const caption = document.querySelector('[data-atm-flow-caption]');
    if (caption) {
      const captions = isEnglish()
        ? ['01 · Territory generation in progress','02 · GeoJSON detected by ATM Bridge','03 · Transfer confirmed by the user','04 · Manager workspace synchronized']
        : ['01 · Generazione territoriale in corso','02 · GeoJSON rilevato da ATM Bridge','03 · Trasferimento confermato dall’utente','04 · Workspace Manager sincronizzato'];
      let i=0; setInterval(()=>{ i=(i+1)%captions.length; caption.animate([{opacity:.2,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:360}); caption.textContent=captions[i]; },2100);
    }
  };

  const enhanceAIShowcase = () => {
    const box = document.querySelector('.ai-showcase-media');
    if (!box || box.classList.contains('atm-ai-enhanced')) return;
    box.classList.add('atm-ai-enhanced');
    const scene = document.createElement('div');
    scene.className = 'atm-ai-core-scene';
    scene.setAttribute('aria-hidden','true');
    scene.innerHTML = `
      <div class="atm-ai-orbit-node n1"><b>ATM v7</b><small>Creation</small></div>
      <div class="atm-ai-orbit-node n2"><b>Bridge</b><small>Transfer</small></div>
      <div class="atm-ai-orbit-node n3"><b>Manager</b><small>Operations</small></div>
      <i class="atm-ai-data-dot d1"></i><i class="atm-ai-data-dot d2"></i><i class="atm-ai-data-dot d3"></i>
      <div class="atm-ai-core"><b>AI</b><span></span><span></span><span></span></div>`;
    box.prepend(scene);
  };

  injectCinema();
  enhanceAIShowcase();

  /* ---------------------- Motion + parallax polish ---------------------- */
  const revealTargets = document.querySelectorAll('.atm-wow-reveal, body.product-page .feature-card, body.product-page .install-card, body.product-page .truth-panel');
  revealTargets.forEach(el => el.classList.add('atm-wow-reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }),{threshold:.12});
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('is-visible'));

  document.querySelectorAll('.suite-card').forEach(card => card.addEventListener('pointermove',e => {
    const r=card.getBoundingClientRect(); card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`); card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
  }));
  const productHero = document.querySelector('body.product-page .product-hero');
  if (productHero) productHero.addEventListener('pointermove',e => {
    const r=productHero.getBoundingClientRect(); productHero.style.setProperty('--hero-x',`${((e.clientX-r.left)/r.width)*100}%`); productHero.style.setProperty('--hero-y',`${((e.clientY-r.top)/r.height)*100}%`);
  });

  /* ---------------------- AI Guide ---------------------- */
  const videoSource = 'ai-animation-flow-1.mp4';
  const markup = `
    <button class="atm-guide-launcher" aria-label="${t('Apri la guida ATM','Open ATM guide')}"><span>${t('Chiedi alla guida ATM','Ask the ATM guide')}</span><i class="atm-guide-spark" aria-hidden="true">✦</i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3a7 7 0 0 0-7 7v1a5 5 0 0 0 5 5h1l4 3v-3a5 5 0 0 0 4-5v-1a7 7 0 0 0-7-7Z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></svg></button>
    <div class="atm-guide-shell" aria-hidden="true"><section class="atm-guide" role="dialog" aria-modal="true" aria-label="ATM Ecosystem Guide"><header class="atm-guide-head"><div class="atm-guide-face"><video autoplay muted loop playsinline preload="auto"><source src="${videoSource}" type="video/mp4"></video><div class="atm-guide-fallback"><b>AI</b></div><span class="atm-guide-status"></span></div><div class="atm-guide-title"><b>ATM Ecosystem Guide</b><small>${t('Guida contestuale · v7 · Bridge · Manager','Context-aware guide · v7 · Bridge · Manager')}</small></div><button class="atm-guide-close" aria-label="${t('Chiudi','Close')}">×</button></header><div class="atm-guide-feed"><div class="atm-guide-message bot">${t('Ciao 👋 Posso seguirti attraverso tutto l’ecosistema. Chiedimi come creare territori, installare Bridge, trasferire GeoJSON o gestire ruoli e assegnazioni in Manager.','Hello 👋 I can guide you through the entire ecosystem. Ask how to create territories, install Bridge, transfer GeoJSON or manage roles and assignments in Manager.')}</div><div class="atm-guide-chips"></div></div><form class="atm-guide-form"><input class="atm-guide-input" autocomplete="off" maxlength="360" placeholder="${t('Chiedi qualcosa su ATM…','Ask something about ATM…')}" aria-label="${t('Domanda','Question')}"><button class="atm-guide-send" aria-label="${t('Invia','Send')}">↑</button><small class="atm-guide-note">${t('Knowledge base locale · nessun accesso ai tuoi dati','Local knowledge base · no access to your data')}</small></form></section></div>`;
  document.body.insertAdjacentHTML('beforeend',markup);
  const launcher=document.querySelector('.atm-guide-launcher'), shell=document.querySelector('.atm-guide-shell'), close=document.querySelector('.atm-guide-close'), feed=document.querySelector('.atm-guide-feed'), form=document.querySelector('.atm-guide-form'), input=document.querySelector('.atm-guide-input'), face=document.querySelector('.atm-guide-face'), video=face.querySelector('video'), chips=document.querySelector('.atm-guide-chips');

  const chipSets={ecosystem:[t('Come funziona tutto?','How does it all work?'),'ATM Version 7','ATM Bridge','ATM Manager',t('Qual è la differenza?','What is the difference?')],v7:[t('Come si usa v7?','How do I use v7?'),t('Cosa esporta?','What does it export?'),'ATM Bridge',t('Come continua il flusso?','What comes next?')],bridge:[t('Come funziona Bridge?','How does Bridge work?'),t('Installa su Firefox','Install on Firefox'),t('Installa su Chrome','Install on Chrome'),t('Privacy e permessi','Privacy & permissions')]};
  (chipSets[pageProduct]||chipSets.ecosystem).forEach(label=>{const b=document.createElement('button');b.type='button';b.className='atm-guide-chip';b.textContent=label;chips.appendChild(b)});

  const open=()=>{shell.classList.add('is-open');shell.setAttribute('aria-hidden','false');document.body.classList.add('atm-guide-open');launcher.classList.add('is-hidden');launcher.style.display='none';setTimeout(()=>input.focus(),80)};
  const shut=()=>{shell.classList.remove('is-open');shell.setAttribute('aria-hidden','true');document.body.classList.remove('atm-guide-open');launcher.classList.remove('is-hidden');launcher.style.removeProperty('display')};
  launcher.addEventListener('click',open);document.querySelectorAll('[data-open-atm-guide]').forEach(button=>button.addEventListener('click',open));close.addEventListener('click',shut);shell.addEventListener('click',e=>{if(e.target===shell)shut()});document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
  const markVideoMissing=()=>face.classList.add('video-missing');video.addEventListener('error',markVideoMissing);video.addEventListener('canplay',()=>face.classList.remove('video-missing'));setTimeout(()=>{if(video.error||video.networkState===3)markVideoMissing()},1800);
  const add=(value,who,extra='')=>{const node=document.createElement('div');node.className=`atm-guide-message ${who} ${extra}`.trim();node.textContent=value;feed.appendChild(node);feed.scrollTop=feed.scrollHeight;return node};
  const ask=question=>{const q=question.trim();if(!q)return;add(q,'user');const typing=add(t('Sto collegando i punti dell’ecosistema…','Connecting the ecosystem dots…'),'bot','typing');input.disabled=true;setTimeout(()=>{typing.remove();add(answer(q),'bot');input.disabled=false;input.focus()},360+Math.min(480,q.length*7))};
  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';ask(q)});chips.querySelectorAll('.atm-guide-chip').forEach(chip=>chip.addEventListener('click',()=>ask(chip.textContent)));
})();
