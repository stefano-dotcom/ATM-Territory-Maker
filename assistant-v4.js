(() => {
  'use strict';
  if (window.__ATM_GUIDE_SMART_V4__) return;
  window.__ATM_GUIDE_SMART_V4__ = true;

  const support = 'atmsupportcentre@gmail.com';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const isEnglish = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const t = (it, en) => isEnglish() ? en : it;
  const normalize = value => (value || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s:/.-]/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const stop = new Set([
    'il','lo','la','i','gli','le','un','uno','una','di','del','della','dei','degli','delle','a','al','alla',
    'da','dal','dalla','in','nel','nella','con','su','per','tra','fra','e','o','ma','che','come','cosa','cos',
    'questo','questa','quello','quella','mi','ti','si','io','tu','lui','lei','noi','voi','loro','the','a','an',
    'of','to','in','on','for','and','or','but','is','are','it','this','that','how','what','with','can','do'
  ]);

  const stem = word => {
    let w = normalize(word);
    const suffixes = ['mente','zioni','zione','amento','amenti','ando','endo','ato','ata','ati','ate','are','ere','ire','ing','ed','es'];
    for (const s of suffixes) if (w.length > s.length + 3 && w.endsWith(s)) { w = w.slice(0, -s.length); break; }
    return w;
  };
  const tokens = value => normalize(value).split(' ')
    .filter(w => w.length > 1 && !stop.has(w))
    .map(stem);

  const has = (q, terms) => terms.some(term => normalize(q).includes(normalize(term)));
  const uniq = arr => [...new Set(arr.filter(Boolean))];

  /* ---------------- V4 responsive layer ---------------- */
  const style = document.createElement('style');
  style.id = 'atm-guide-smart-v4-css';
  style.textContent = `
    :root{--atm-vv-height:100dvh;--atm-vv-top:0px}
    body.atm-guide-open{overflow:hidden!important;overscroll-behavior:none}
    body.atm-guide-open .atm-guide-launcher{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}

    .atm-guide-shell{
      top:var(--atm-vv-top)!important;bottom:auto!important;
      width:100%!important;height:var(--atm-vv-height)!important;max-height:var(--atm-vv-height)!important;
      box-sizing:border-box!important;overflow:hidden!important
    }
    .atm-guide{max-height:100%!important;min-height:0!important;grid-template-rows:auto minmax(0,1fr) auto!important}
    .atm-guide-feed{
      min-height:0!important;overscroll-behavior:contain!important;
      -webkit-overflow-scrolling:touch!important;scrollbar-gutter:stable;
    }
    .atm-guide-title{min-width:0}
    .atm-guide-title b,.atm-guide-title small{overflow:hidden;text-overflow:ellipsis}
    .atm-guide-title small{white-space:nowrap}
    .atm-guide-feed[aria-live]{outline:none}
    .atm-guide-message.bot.smart-v4{position:relative}
    .atm-guide-message.bot.smart-v4::before{
      content:"V4";position:absolute;right:10px;top:8px;
      color:rgba(145,255,22,.55);font:750 7px/1 Inter,system-ui;letter-spacing:.12em
    }
    .atm-guide-message.bot.smart-v4{padding-top:22px}
    .atm-guide-chip.smart-next{border-color:rgba(145,255,22,.38);background:rgba(145,255,22,.055)}
    .atm-guide-chip:focus-visible,.atm-guide-input:focus-visible,.atm-guide-send:focus-visible,.atm-guide-close:focus-visible{
      outline:2px solid #91ff16!important;outline-offset:2px
    }

    @media(max-width:700px){
      .atm-guide-shell{
        padding:0!important;align-items:stretch!important;justify-content:stretch!important;
        background:#071008!important;backdrop-filter:none!important
      }
      .atm-guide{
        width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;
        border:0!important;border-radius:0!important;
      }
      .atm-guide-head{
        grid-template-columns:54px minmax(0,1fr) 40px!important;gap:11px!important;
        padding:max(10px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 11px max(12px,env(safe-area-inset-left))!important
      }
      .atm-guide-face{width:54px!important;height:54px!important;border-radius:16px!important}
      .atm-guide-title b{font-size:15px!important}
      .atm-guide-title small{font-size:9.5px!important}
      .atm-guide-close{width:40px!important;height:40px!important}
      .atm-guide-feed{padding:14px max(12px,env(safe-area-inset-right)) 12px max(12px,env(safe-area-inset-left))!important}
      .atm-guide-message{max-width:94%!important;font-size:14px!important;line-height:1.55!important}
      .atm-guide-chips{
        display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;
        gap:7px!important;padding:2px 1px 7px!important;margin:11px 0 2px!important;
        scrollbar-width:none!important;scroll-snap-type:x proximity
      }
      .atm-guide-chips::-webkit-scrollbar{display:none}
      .atm-guide-chip{flex:0 0 auto!important;scroll-snap-align:start}
      .atm-guide-form{
        padding:10px max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))!important;
        grid-template-columns:minmax(0,1fr) 48px!important
      }
      .atm-guide-input{font-size:16px!important;height:48px!important}
      .atm-guide-send{height:48px!important}
      .atm-guide-note{font-size:8.8px!important}
    }

    @media(max-width:380px){
      .atm-guide-head{grid-template-columns:48px minmax(0,1fr) 38px!important;padding-bottom:9px!important}
      .atm-guide-face{width:48px!important;height:48px!important}
      .atm-guide-title small{display:none!important}
      .atm-guide-feed{padding-top:11px!important}
      .atm-guide-message{max-width:97%!important;padding-left:12px!important;padding-right:12px!important}
      .atm-guide-note{display:none!important}
      .atm-guide-form{padding-bottom:max(8px,env(safe-area-inset-bottom))!important}
    }

    @media(min-width:701px) and (max-width:1024px){
      .atm-guide-shell{padding:16px!important}
      .atm-guide{width:min(560px,calc(100vw - 32px))!important;height:min(780px,calc(var(--atm-vv-height) - 32px))!important}
    }

    @media(max-height:620px) and (min-width:701px){
      .atm-guide-shell{padding:8px!important}
      .atm-guide{width:min(660px,calc(100vw - 16px))!important;height:calc(var(--atm-vv-height) - 16px)!important}
      .atm-guide-head{grid-template-columns:50px minmax(0,1fr) 38px!important;padding:9px 12px!important}
      .atm-guide-face{width:50px!important;height:50px!important;border-radius:14px!important}
      .atm-guide-title small{display:none!important}
      .atm-guide-feed{padding:10px 14px!important}
      .atm-guide-message{padding:10px 12px!important;line-height:1.45!important}
      .atm-guide-chips{flex-wrap:nowrap!important;overflow-x:auto!important;margin:7px 0 1px!important}
      .atm-guide-form{padding:8px 12px!important}
      .atm-guide-note{display:none!important}
    }
  `;
  document.head.appendChild(style);

  const syncViewport = () => {
    const vv = window.visualViewport;
    const h = Math.max(240, Math.round(vv ? vv.height : window.innerHeight));
    const top = Math.max(0, Math.round(vv ? vv.offsetTop : 0));
    document.documentElement.style.setProperty('--atm-vv-height', `${h}px`);
    document.documentElement.style.setProperty('--atm-vv-top', `${top}px`);
    const feed = $('.atm-guide-feed');
    if (document.body.classList.contains('atm-guide-open') && feed) {
      requestAnimationFrame(() => { feed.scrollTop = feed.scrollHeight; });
    }
  };
  syncViewport();
  window.addEventListener('resize', syncViewport, {passive:true});
  window.addEventListener('orientationchange', () => setTimeout(syncViewport, 80), {passive:true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewport, {passive:true});
    window.visualViewport.addEventListener('scroll', syncViewport, {passive:true});
  }

  /* ---------------- Wait for V3 UI, then upgrade it ---------------- */
  const boot = () => {
    const oldForm = $('.atm-guide-form');
    const feed = $('.atm-guide-feed');
    const titleSmall = $('.atm-guide-title small');
    const shell = $('.atm-guide-shell');
    if (!oldForm || !feed || !shell) {
      setTimeout(boot, 80);
      return;
    }
    if (oldForm.dataset.smartV4 === '1') return;

    /* Replace form and chips to remove V3's old keyword-engine listeners. */
    const form = oldForm.cloneNode(true);
    form.dataset.smartV4 = '1';
    oldForm.replaceWith(form);

    const oldChips = $('.atm-guide-chips');
    const chips = oldChips ? oldChips.cloneNode(false) : document.createElement('div');
    chips.className = 'atm-guide-chips';
    if (oldChips) oldChips.replaceWith(chips);
    else feed.appendChild(chips);

    const input = $('.atm-guide-input', form);
    const send = $('.atm-guide-send', form);
    feed.setAttribute('aria-live','polite');
    feed.setAttribute('aria-relevant','additions');

    if (titleSmall) {
      titleSmall.textContent = t(
        'Conversational Engine V4 · memoria locale · nessun accesso ai dati',
        'Conversational Engine V4 · local memory · no data access'
      );
    }

    const pageProduct = document.body.dataset.product || 'ecosystem';

    /* ---------- structured knowledge ---------- */
    const K = {
      ecosystem:{
        label:'ATM Ecosystem',
        summary:{
          it:'ATM è un ecosistema in tre fasi: ATM Version 7 crea e controlla il dato geografico; ATM Bridge accompagna il GeoJSON verso Territory Helper; ATM Manager gestisce persone, territori, richieste, assegnazioni e sicurezza.',
          en:'ATM is a three-stage ecosystem: ATM Version 7 creates and reviews geographic data; ATM Bridge assists the GeoJSON handoff to Territory Helper; ATM Manager manages people, territories, requests, assignments and security.'
        },
        workflow:{
          it:'Il flusso completo è: 1) definisci e generi i territori in v7 → 2) controlli/esporti il GeoJSON → 3) Bridge rileva il file e chiede conferma → 4) prosegui verso Territory Helper → 5) Manager governa il ciclo operativo.',
          en:'The full flow is: 1) define and generate territories in v7 → 2) review/export the GeoJSON → 3) Bridge detects the file and asks for confirmation → 4) continue to Territory Helper → 5) Manager governs the operational lifecycle.'
        },
        choose:{
          it:'Se il tuo obiettivo è CREARE, usa v7. Se devi TRASFERIRE verso Territory Helper, usa Bridge. Se devi GESTIRE persone, territori e assegnazioni, usa Manager.',
          en:'If your goal is to CREATE, use v7. If you need to TRANSFER to Territory Helper, use Bridge. If you need to MANAGE people, territories and assignments, use Manager.'
        },
        why:{
          it:'L’idea è separare bene le responsabilità: creazione cartografica, trasferimento assistito e gestione operativa. In questo modo ogni strumento resta più chiaro e specializzato.',
          en:'The idea is to separate responsibilities cleanly: map creation, assisted transfer and operational management. Each tool stays clearer and more specialized.'
        }
      },
      v7:{
        label:'ATM Version 7',
        summary:{
          it:'ATM Version 7 è il modulo creativo dell’ecosistema. Parte da un’area geografica, genera una suddivisione in territori, permette di controllare perimetri e risultato sulla mappa e poi esporta il dato.',
          en:'ATM Version 7 is the creative module. It starts from a geographic area, generates a territory subdivision, lets you review boundaries and results on the map, then exports the data.'
        },
        purpose:{
          it:'Serve a trasformare un’area reale in territori geografici organizzati prima che entrino nel flusso operativo.',
          en:'It turns a real geographic area into organized territories before they enter the operational workflow.'
        },
        workflow:{
          it:'Passaggi v7: 1) scegli area/località; 2) imposta i parametri e la quantità; 3) genera; 4) controlla perimetri e territorio attivo; 5) esporta il risultato.',
          en:'v7 steps: 1) choose area/location; 2) set parameters and quantity; 3) generate; 4) review boundaries and active territory; 5) export the result.'
        },
        capabilities:{
          it:'Le funzioni centrali sono generazione e suddivisione, anteprima cartografica, controllo dei perimetri, selezione del territorio attivo ed esportazione del risultato.',
          en:'Core capabilities are generation and subdivision, map preview, boundary review, active-territory selection and result export.'
        },
        input:{
          it:'L’input principale è il contesto geografico scelto dall’utente: località/area e parametri necessari alla generazione.',
          en:'The main input is the geographic context selected by the user: location/area and the parameters required for generation.'
        },
        output:{
          it:'L’output principale documentato per il flusso è GeoJSON; la vetrina descrive anche KML. GeoJSON è quello che Bridge riconosce nel passaggio verso Territory Helper.',
          en:'The main documented workflow output is GeoJSON; the showcase also describes KML. GeoJSON is what Bridge recognizes for the Territory Helper handoff.'
        },
        privacy:{
          it:'La guida pubblica non legge i file creati da v7. I dati geografici servono alla generazione e il file finale viene preparato per il flusso scelto dall’utente.',
          en:'The public guide does not read files created by v7. Geographic data is used for generation and the final file is prepared for the workflow chosen by the user.'
        },
        integration:{
          it:'Dopo v7 puoi usare il GeoJSON con ATM Bridge per il passaggio assistito verso Territory Helper; ATM Manager entra invece nella parte di gestione operativa.',
          en:'After v7 you can use the GeoJSON with ATM Bridge for assisted transfer to Territory Helper; ATM Manager handles the operational-management stage.'
        },
        limits:{
          it:'v7 non sostituisce Manager e non è l’estensione Bridge: il suo compito è creare e verificare il dato geografico.',
          en:'v7 does not replace Manager and is not the Bridge extension: its job is to create and verify geographic data.'
        },
        devices:{
          it:'L’interfaccia è pensata per essere responsive, ma le operazioni cartografiche complesse sono naturalmente più comode su uno schermo ampio.',
          en:'The interface is designed to be responsive, although complex map operations are naturally more comfortable on a larger screen.'
        },
        why:{
          it:'v7 esiste per separare la fase creativa dalla gestione quotidiana: prima costruisci e controlli il territorio, poi lo porti nel resto del flusso.',
          en:'v7 exists to separate the creative stage from daily management: first build and review the territory, then move it into the rest of the workflow.'
        }
      },
      bridge:{
        label:'ATM Bridge',
        summary:{
          it:'ATM Bridge è l’estensione che accompagna il passaggio del GeoJSON da ATM verso Territory Helper. Rileva il file pronto, mostra lo stato e lascia all’utente la conferma prima di proseguire.',
          en:'ATM Bridge is the extension that assists the GeoJSON handoff from ATM to Territory Helper. It detects the ready file, shows status and leaves confirmation to the user before continuing.'
        },
        purpose:{
          it:'Serve a rendere il passaggio più guidato e meno manuale, mantenendo visibile cosa sta per essere trasferito.',
          en:'It makes the handoff more guided and less manual while keeping the transferred item visible to the user.'
        },
        workflow:{
          it:'Flusso Bridge: 1) ATM genera il GeoJSON; 2) Bridge lo rileva; 3) conserva temporaneamente lo stato nel browser; 4) mostra file/quantità; 5) l’utente conferma; 6) Bridge apre o riusa Territory Helper.',
          en:'Bridge flow: 1) ATM generates the GeoJSON; 2) Bridge detects it; 3) temporarily stores transfer state in the browser; 4) shows file/count; 5) the user confirms; 6) Bridge opens or reuses Territory Helper.'
        },
        install:{
          it:'Puoi installarlo su desktop in due modi: Firefox dalla pagina pubblica Add-ons; Chrome tramite il pacchetto ZIP caricato manualmente in modalità sviluppatore.',
          en:'You can install it on desktop in two ways: Firefox through the public Add-ons page; Chrome through the ZIP package loaded manually in Developer mode.'
        },
        firefox:{
          it:'Firefox desktop: apri la pagina pubblica ATM Bridge su Firefox Add-ons → “Aggiungi a Firefox” → controlla e approva i permessi mostrati dal browser.',
          en:'Desktop Firefox: open the public ATM Bridge page on Firefox Add-ons → “Add to Firefox” → review and approve the permissions shown by the browser.'
        },
        chrome:{
          it:'Chrome desktop: scarica lo ZIP → estrailo → apri chrome://extensions → abilita Modalità sviluppatore → “Carica estensione non pacchettizzata” → seleziona la cartella estratta.',
          en:'Desktop Chrome: download the ZIP → extract it → open chrome://extensions → enable Developer mode → “Load unpacked” → select the extracted folder.'
        },
        permissions:{
          it:'I permessi documentati sono storage, tabs, scripting, unlimitedStorage e notifications. Servono a mantenere un trasferimento in sospeso, trovare/aprire le pagine supportate ed eventualmente notificare l’utente.',
          en:'Documented permissions are storage, tabs, scripting, unlimitedStorage and notifications. They support pending-transfer state, finding/opening supported pages and optionally notifying the user.'
        },
        privacy:{
          it:'Il modello descritto dalla vetrina mantiene il trasferimento nel browser; il manifest Firefox indicato dichiara raccolta dati richiesta “none”. Bridge non deve chiedere password di Territory Helper.',
          en:'The model described by the showcase keeps the transfer in the browser; the referenced Firefox manifest declares required data collection as “none”. Bridge should not ask for Territory Helper passwords.'
        },
        data:{
          it:'Bridge lavora con il GeoJSON e con lo stato locale necessario al trasferimento. Non è pensato come database dei territori.',
          en:'Bridge works with the GeoJSON and local state required for the transfer. It is not intended to be a territory database.'
        },
        integration:{
          it:'Bridge sta tra v7 e Territory Helper: riceve il risultato generato da ATM e accompagna l’utente verso la destinazione. Manager rimane il modulo di gestione operativa.',
          en:'Bridge sits between v7 and Territory Helper: it receives the ATM-generated result and guides the user to the destination. Manager remains the operational-management module.'
        },
        limits:{
          it:'Il flusso dell’estensione è progettato soprattutto per browser desktop. Non sostituisce Territory Helper e non sostituisce ATM Manager.',
          en:'The extension workflow is designed mainly for desktop browsers. It does not replace Territory Helper or ATM Manager.'
        },
        devices:{
          it:'Firefox/Chrome desktop sono il flusso documentato. Chrome mobile non offre lo stesso percorso “Load unpacked”, quindi non è il target del pacchetto manuale.',
          en:'Desktop Firefox/Chrome are the documented flow. Chrome mobile does not provide the same “Load unpacked” path, so it is not the target for the manual package.'
        },
        why:{
          it:'Bridge esiste perché un trasferimento importante è meglio quando è visibile e confermato: rileva il file, mostra cosa ha trovato e lascia l’ultima decisione all’utente.',
          en:'Bridge exists because an important handoff is better when it is visible and confirmed: it detects the file, shows what it found and leaves the final decision to the user.'
        }
      },
      manager:{
        label:'ATM Manager',
        summary:{
          it:'ATM Manager è il centro operativo dell’ecosistema: organizza Space, persone, territori, richieste, assegnazioni, restituzioni, notifiche, sicurezza e cronologia.',
          en:'ATM Manager is the ecosystem operating center: it organizes Spaces, people, territories, requests, assignments, returns, notifications, security and history.'
        },
        purpose:{
          it:'Serve a governare il lavoro quotidiano dopo la creazione del dato geografico: chi può fare cosa, quali territori sono disponibili o assegnati e cosa è successo nel tempo.',
          en:'It governs daily work after geographic data has been created: who can do what, which territories are available or assigned and what happened over time.'
        },
        workflow:{
          it:'Flusso Manager: crea/configura lo Space → invita o approva il team → organizza/importa territori → ricevi richieste → assegna → lavora → restituisci → applica riposo e mantieni la cronologia.',
          en:'Manager flow: create/configure the Space → invite or approve the team → organize/import territories → receive requests → assign → work → return → apply rest period and retain history.'
        },
        roles:{
          it:'I ruoli documentati sono quattro: Utente, Utente avanzato, Amministratore e Proprietario dello Space. Aumentano progressivamente le responsabilità operative e amministrative.',
          en:'The documented roles are User, Advanced user, Administrator and Space owner. Operational and administrative responsibilities increase progressively.'
        },
        assignments:{
          it:'Un utente può richiedere un territorio; amministratori o utenti avanzati possono valutarlo e assegnarlo. Il ciclo resta collegato alla cronologia dello Space.',
          en:'A user can request a territory; administrators or advanced users can review and assign it. The lifecycle remains connected to the Space history.'
        },
        returns:{
          it:'Alla restituzione l’utente può indicare se il territorio è stato lavorato o non lavorato e aggiungere una nota. Questo alimenta lo stato successivo del territorio.',
          en:'When returning a territory, the user can record whether it was worked or not and add a note. This feeds the territory’s next state.'
        },
        rest:{
          it:'Un territorio completato entra nel periodo di riposo previsto. La vetrina descrive un riposo automatico di un mese, con possibilità di intervento amministrativo quando necessario.',
          en:'A completed territory enters the configured rest period. The showcase describes an automatic one-month rest period, with administrative intervention when needed.'
        },
        spaces:{
          it:'Ogni organizzazione lavora nel proprio Space: persone, territori, notifiche ed email restano separate dal contesto degli altri Space.',
          en:'Each organization works in its own Space: people, territories, notifications and emails remain separated from other Spaces.'
        },
        security:{
          it:'La sicurezza descritta include isolamento degli Space, controlli per ruolo, policy RLS, MFA, passkey, sessioni e registro attività. Le azioni sensibili richiedono le autorizzazioni corrette.',
          en:'Documented security includes Space isolation, role controls, RLS policies, MFA, passkeys, sessions and activity logging. Sensitive actions require the correct authorization.'
        },
        notifications:{
          it:'Notifiche, email localizzate e registro attività servono a mantenere il team aggiornato e a lasciare una cronologia leggibile delle operazioni importanti.',
          en:'Notifications, localized emails and activity logs keep the team informed and leave a readable history of important operations.'
        },
        devices:{
          it:'ATM Manager è descritto come web app responsive per computer, tablet e telefono; le mappe e le operazioni più dense restano più comode su display grandi.',
          en:'ATM Manager is described as a responsive web app for desktop, tablet and phone; maps and dense operations remain more comfortable on larger displays.'
        },
        integration:{
          it:'Manager non sostituisce v7 o Bridge: v7 crea, Bridge accompagna il trasferimento, Manager governa il ciclo operativo.',
          en:'Manager does not replace v7 or Bridge: v7 creates, Bridge assists transfer, Manager governs the operational lifecycle.'
        },
        why:{
          it:'Manager esiste per evitare che territori, persone e decisioni vivano in file o processi scollegati: riunisce il ciclo operativo in uno Space tracciabile.',
          en:'Manager exists to avoid territories, people and decisions living in disconnected files or processes: it brings the operational lifecycle into one traceable Space.'
        }
      }
    };

    const state = {
      product: pageProduct === 'v7' || pageProduct === 'bridge' ? pageProduct : null,
      intent: null,
      browser: null,
      turn: 0,
      lastSignature: '',
      repeats: 0,
      history: []
    };

    const productAliases = {
      v7:['atm v7','atm version 7','version 7','v7','generatore','generator'],
      bridge:['atm bridge','bridge','estensione','extension','plugin','territory helper connector'],
      manager:['atm manager','manager','space','workspace']
    };

    const detectProducts = q => {
      const found = [];
      for (const [product, aliases] of Object.entries(productAliases)) if (has(q, aliases)) found.push(product);
      if (has(q,['territory helper']) && !found.includes('bridge')) found.push('bridge');
      if (has(q,['mfa','passkey','assegnazione','assegnazioni','richiesta territorio','periodo di riposo','utente avanzato'])) {
        if (!found.includes('manager')) found.push('manager');
      }
      if (has(q,['geojson','kml','generare territori','creare territori']) && found.length === 0) found.push('v7');
      return uniq(found);
    };

    const intentRules = [
      ['compare',['differenza','differenze','confronta','confronto',' vs ','versus','better','meglio','difference','compare']],
      ['install',['installare','installa','installazione','install','setup','scaricare estensione','download extension']],
      ['permissions',['permessi','permission','permissions','tabs','scripting','unlimitedstorage','notifications']],
      ['privacy',['privacy','raccoglie dati','raccolta dati','collect data','dati personali','personal data','vende dati']],
      ['security',['sicurezza','sicuro','security','mfa','passkey','rls']],
      ['roles',['ruoli','ruolo','roles','utente avanzato','amministratore','admin','owner','proprietario']],
      ['assignments',['assegnazione','assegnazioni','assegna','richiesta territorio','request territory','assign']],
      ['returns',['restituire','restituzione','return territory','territorio lavorato','non lavorato']],
      ['rest',['riposo','rest period','periodo di riposo']],
      ['output',['cosa esporta','output','formato','formati','geojson','kml','export']],
      ['input',['input','cosa inserisco','cosa devo inserire','what do i enter','importa']],
      ['devices',['telefono','mobile','tablet','smartphone','iphone','android','responsive','device','devices']],
      ['limits',['limiti','limitazioni','non puo','non può','does not','cannot','cosa non fa']],
      ['troubleshoot',['non funziona','non va','errore','error','bug','problema','problem','bloccato','stuck']],
      ['next',['e poi','e dopo','dopo cosa','passaggio successivo','next','what next','poi che faccio']],
      ['why',['perche','perché','why','a cosa serve','che senso ha','motivo']],
      ['capabilities',['cosa puo fare','cosa può fare','funzioni','features','capabilities','cosa permette']],
      ['workflow',['come funziona','come si usa','workflow','flusso','passaggi','how does','how to use','come faccio']],
      ['what',['cos e','cos è','cos’è','cosa e','cosa è','che cosa e','che cosa è','what is','cosa fa','che fa','descrivi','spiegami']],
      ['support',['supporto','support','contatto','contact','email']],
    ];

    const detectIntents = q => {
      const hits = [];
      for (const [intent, terms] of intentRules) if (has(` ${q} `, terms)) hits.push(intent);
      if (!hits.length && q.endsWith('?')) hits.push('what');
      return uniq(hits);
    };

    const detectBrowser = q => {
      if (has(q,['firefox','mozilla'])) return 'firefox';
      if (has(q,['chrome','chromium','edge'])) return 'chrome';
      return null;
    };

    const isFollowUp = q => {
      const short = tokens(q).length <= 7;
      return short && has(q,[
        'e poi','e dopo','e su','e per','quindi','perche','perché','come','quello','questa','questo',
        'lo posso','si puo','si può','e invece','why','what about','and then','how about'
      ]);
    };

    const fieldForIntent = (product, intent, browser, q) => {
      if (product === 'bridge' && intent === 'install') {
        if (browser === 'firefox') return 'firefox';
        if (browser === 'chrome') return 'chrome';
        return 'install';
      }
      if (intent === 'what') return 'summary';
      if (intent === 'workflow') return 'workflow';
      if (intent === 'capabilities') return 'capabilities';
      if (intent === 'permissions') return product === 'bridge' ? 'permissions' : 'security';
      if (intent === 'privacy') return 'privacy';
      if (intent === 'security') return 'security';
      if (intent === 'roles') return 'roles';
      if (intent === 'assignments') return 'assignments';
      if (intent === 'returns') return 'returns';
      if (intent === 'rest') return 'rest';
      if (intent === 'output') return 'output';
      if (intent === 'input') return 'input';
      if (intent === 'devices') return 'devices';
      if (intent === 'limits') return 'limits';
      if (intent === 'why') {
        if (product === 'bridge' && state.intent === 'permissions') return 'permissions';
        return 'why';
      }
      if (intent === 'next') return 'integration';
      if (intent === 'support') return null;
      if (product === 'ecosystem' && intent === 'compare') return 'choose';
      return 'summary';
    };

    const getText = (obj, field) => {
      const value = obj && obj[field];
      if (!value) return '';
      return isEnglish() ? value.en : value.it;
    };

    const introsIT = ['Certo.','Sì —','In pratica,','La cosa importante è questa:','Qui il punto è:'];
    const introsEN = ['Sure.','Yes —','In practice,','The key point is:','What matters here is:'];
    const freshIntro = () => (isEnglish() ? introsEN : introsIT)[state.turn % (isEnglish() ? introsEN.length : introsIT.length)];

    const comparison = products => {
      const set = products.length ? products : ['v7','bridge','manager'];
      const lines = [];
      if (set.includes('v7')) lines.push(t('• v7 = crea e verifica i territori.','• v7 = creates and verifies territories.'));
      if (set.includes('bridge')) lines.push(t('• Bridge = accompagna il GeoJSON verso Territory Helper.','• Bridge = assists the GeoJSON handoff to Territory Helper.'));
      if (set.includes('manager')) lines.push(t('• Manager = gestisce persone, ruoli, richieste e assegnazioni.','• Manager = manages people, roles, requests and assignments.'));
      return `${t('Non fanno la stessa cosa: lavorano in momenti diversi del flusso.','They do not do the same job: they operate at different workflow stages.')}\n${lines.join('\n')}`;
    };

    const repeatExpansion = (product, field) => {
      const additions = {
        v7:{
          summary:t('Un dettaglio in più: la generazione non è pensata come una “scatola nera”; il risultato viene controllato sulla mappa prima dell’esportazione.','One extra detail: generation is not meant to be a “black box”; the result is reviewed on the map before export.'),
          workflow:t('Se vuoi andare più a fondo, il punto critico è la verifica tra generazione ed esportazione: lì controlli il risultato prima di consegnarlo al flusso successivo.','Going deeper, the critical point is review between generation and export: you verify the result before handing it to the next stage.'),
          output:t('GeoJSON è particolarmente importante perché è il formato che collega naturalmente v7 a Bridge.','GeoJSON is especially important because it naturally connects v7 to Bridge.')
        },
        bridge:{
          summary:t('Un dettaglio in più: Bridge non decide al posto dell’utente; rende visibile il file e mantiene una conferma esplicita prima del passaggio.','One extra detail: Bridge does not decide for the user; it makes the file visible and keeps an explicit confirmation before handoff.'),
          permissions:t('Quindi “tabs” e “scripting” non significano accesso indiscriminato: servono al flusso sulle pagine supportate; storage conserva lo stato del trasferimento e notifications può avvisarti.','So “tabs” and “scripting” do not mean indiscriminate access: they support the flow on supported pages; storage keeps transfer state and notifications can alert you.'),
          privacy:t('Il punto privacy più importante è che la vetrina descrive un trasferimento locale nel browser, non un passaggio attraverso un server ATM intermedio.','The most important privacy point is that the showcase describes a local browser transfer, not a handoff through an intermediate ATM server.')
        },
        manager:{
          summary:t('Un dettaglio in più: il valore di Manager è la continuità del ciclo — richiesta, assegnazione, lavoro, restituzione, riposo e cronologia restano collegati.','One extra detail: Manager’s value is lifecycle continuity — request, assignment, work, return, rest period and history stay connected.'),
          roles:t('La differenza chiave è che l’Utente avanzato gestisce operazioni territoriali, mentre l’Amministratore ha anche responsabilità su persone, ruoli e coordinamento dello Space.','The key difference is that an Advanced user handles territory operations, while an Administrator also has responsibilities for people, roles and Space coordination.'),
          security:t('MFA/passkey proteggono l’identità; ruoli e RLS proteggono cosa può essere letto o modificato; il registro attività aiuta a ricostruire cosa è successo.','MFA/passkeys protect identity; roles and RLS protect what can be read or changed; activity logs help reconstruct what happened.')
        }
      };
      return additions[product]?.[field] || '';
    };

    /* ---------- page semantic fallback ---------- */
    const pageIndex = [];
    $$('main h1, main h2, main h3, main p, main li').forEach(node => {
      if (node.closest('.atm-guide-shell')) return;
      const text = (node.textContent || '').replace(/\s+/g,' ').trim();
      if (text.length < 35 || text.length > 360) return;
      pageIndex.push({text, toks:tokens(text)});
    });

    const semanticSearch = q => {
      const qt = tokens(q);
      if (qt.length < 2) return null;
      const scored = pageIndex.map(item => {
        let score = 0;
        for (const a of qt) {
          for (const b of item.toks) {
            if (a === b) score += 3;
            else if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) score += 1.25;
          }
        }
        score /= Math.sqrt(Math.max(1,item.toks.length));
        return {item,score};
      }).sort((a,b)=>b.score-a.score);
      if (!scored[0] || scored[0].score < 1.7) return null;
      const best = scored.slice(0,2).filter(x => x.score >= scored[0].score * .72).map(x => x.item.text);
      return uniq(best).join('\n\n');
    };

    const fallback = q => {
      const pageHit = semanticSearch(q);
      if (pageHit) return `${freshIntro()} ${t('Nella pagina trovo questo elemento rilevante:','I found this relevant information on the page:')}\n${pageHit}`;
      const options = [
        t('Non voglio inventare una risposta. Dimmi solo quale parte intendi: ATM v7, Bridge oppure Manager?', 'I do not want to invent an answer. Which part do you mean: ATM v7, Bridge or Manager?'),
        t('Questa domanda è un po’ ambigua per la knowledge base locale. Prova ad aggiungere il prodotto o l’azione: per esempio “Bridge su Chrome” oppure “ruoli di Manager”.', 'That question is a little ambiguous for the local knowledge base. Add the product or action, for example “Bridge on Chrome” or “Manager roles”.'),
        t('Posso seguirti meglio se mi dici l’obiettivo: vuoi creare territori, trasferirli o gestirli?', 'I can guide you better if you tell me the goal: create territories, transfer them or manage them?')
      ];
      return options[state.turn % options.length];
    };

    const answer = raw => {
      state.turn++;
      const q = normalize(raw);
      const qTokens = tokens(q);

      if (has(q,['ciao','hey','hei','yo','hello','hi','buongiorno','buonasera']) && qTokens.length <= 2) {
        return t(
          'Ciao 👋 Stavolta provo a non comportarmi come un limone 😄. Puoi farmi domande normali e anche follow-up: “Cos’è Bridge?”, “e su Chrome?”, “perché usa quei permessi?”.',
          'Hello 👋 This time I will try not to behave like a lemon 😄. Ask normal questions and follow-ups: “What is Bridge?”, “what about Chrome?”, “why does it need those permissions?”.'
        );
      }

      if (has(q,['sei una ai','sei un ai','sei intelligente','come ragioni','come funzioni tu','chatbot'])) {
        return t(
          'Sono una guida locale, non un LLM online. V4 però combina intento, prodotto, memoria della conversazione, browser, anti-ripetizione e ricerca nel testo della pagina. Quindi posso seguire meglio domande successive senza inviare i tuoi dati a un servizio AI esterno.',
          'I am a local guide, not an online LLM. V4 combines intent, product, conversation memory, browser, anti-repetition and page-text search, so it can follow later questions without sending your data to an external AI service.'
        );
      }

      const explicitProducts = detectProducts(q);
      const intents = detectIntents(q);
      const browser = detectBrowser(q) || (isFollowUp(q) ? state.browser : null);

      if (browser) state.browser = browser;

      let products = explicitProducts;
      if (!products.length && isFollowUp(q) && state.product) products = [state.product];
      if (!products.length && pageProduct !== 'ecosystem') products = [pageProduct];

      if (intents.includes('compare') || products.length > 1) {
        const response = comparison(products);
        state.intent = 'compare';
        state.product = products.length === 1 ? products[0] : state.product;
        state.history.push({q,products,intent:'compare'}); state.history = state.history.slice(-8);
        return response;
      }

      let product = products[0] || state.product;
      let intent = intents[0] || (isFollowUp(q) ? state.intent : null);

      if (!product && has(q,['creare','genera','mappa','confini'])) product='v7';
      if (!product && has(q,['trasferire','firefox','chrome','estensione','plugin'])) product='bridge';
      if (!product && has(q,['gestire','assegnare','ruoli','space','mfa','passkey'])) product='manager';

      if (!product && (has(q,['tutto','ecosistema','insieme']) || intent === 'workflow')) product='ecosystem';

      if (intent === 'support') {
        state.intent='support';
        return t(
          `Per assistenza tecnica: ${support}. Mandami prodotto, browser/dispositivo, cosa stavi facendo e l’errore esatto; evita password, OTP, token o API key.`,
          `For technical support: ${support}. Include product, browser/device, what you were doing and the exact error; avoid passwords, OTP codes, tokens or API keys.`
        );
      }

      if (intent === 'troubleshoot') {
        const p = product || state.product;
        state.product = p || state.product; state.intent='troubleshoot';
        if (p === 'bridge') return t(
          'Per diagnosticare Bridge mi servono tre cose: browser (Firefox/Chrome), punto in cui si blocca (rilevamento, conferma o apertura di Territory Helper) e messaggio di errore. Se mi dici questi tre dati posso restringere il problema.',
          'To diagnose Bridge I need three things: browser (Firefox/Chrome), where it stops (detection, confirmation or opening Territory Helper) and the error message. With those three details I can narrow it down.'
        );
        if (p === 'v7') return t(
          'Per diagnosticare v7 dimmi se il problema avviene nella selezione dell’area, generazione, visualizzazione dei perimetri o esportazione; aggiungi browser e messaggio di errore.',
          'To diagnose v7 tell me whether the problem happens during area selection, generation, boundary display or export; also include browser and the error message.'
        );
        if (p === 'manager') return t(
          'Per diagnosticare Manager dimmi la schermata, il ruolo dell’utente, l’azione che stavi tentando e l’errore. Se riguarda accesso/MFA/permessi specifica anche quello.',
          'To diagnose Manager tell me the screen, user role, attempted action and error. If it concerns access/MFA/permissions, include that too.'
        );
        return fallback(q);
      }

      if (!product) return fallback(q);
      if (!intent) intent = has(q,['?']) ? 'what' : 'what';

      const field = fieldForIntent(product, intent, browser, q);
      if (!field) return fallback(q);

      const data = K[product];
      let body = getText(data, field);
      if (!body) {
        if (intent === 'privacy' && data.security) body = getText(data,'security');
        else if (intent === 'capabilities') body = getText(data,'summary');
        else if (intent === 'input' && data.workflow) body = getText(data,'workflow');
        else body = getText(data,'summary');
      }
      if (!body) return fallback(q);

      const signature = `${product}:${field}:${browser || ''}`;
      if (signature === state.lastSignature) state.repeats++;
      else state.repeats = 0;

      let response;
      if (state.repeats > 0) {
        const extra = repeatExpansion(product,field);
        response = extra
          ? `${t('Sì. Senza ripeterti lo stesso paragrafo, ti aggiungo questo:','Yes. Instead of repeating the same paragraph, here is an extra detail:')}\n${extra}`
          : `${t('Hai già toccato questo punto. Te lo dico in modo più diretto:','You already touched this point. Here is the shorter version:')}\n${body}`;
      } else {
        response = `${freshIntro()} ${body}`;
      }

      if (product === 'bridge' && field === 'install' && !browser) {
        response += `\n\n${t('Se mi dici “Firefox” o “Chrome”, continuo con i passaggi esatti.', 'Say “Firefox” or “Chrome” and I will continue with the exact steps.')}`;
      }

      if (intent === 'why' && product === 'bridge' && state.intent === 'permissions') {
        response = `${freshIntro()} ${getText(K.bridge,'permissions')}\n\n${t('Il motivo è operativo: Bridge deve conservare lo stato del passaggio, trovare o aprire le pagine supportate e avvisarti quando serve.','The reason is operational: Bridge needs to keep handoff state, find or open supported pages and notify you when needed.')}`;
      }

      state.lastSignature = signature;
      state.product = product === 'ecosystem' ? state.product : product;
      state.intent = intent;
      state.history.push({q,product,intent,browser});
      state.history = state.history.slice(-8);
      return response;
    };

    const suggestionsFor = () => {
      const p = state.product || pageProduct;
      if (p === 'bridge') {
        if (state.intent === 'install' && !state.browser) return [t('Firefox','Firefox'),t('Chrome','Chrome'),t('Perché servono i permessi?','Why are permissions needed?')];
        if (state.browser === 'chrome') return [t('Che permessi usa?','What permissions does it use?'),t('È sicuro?','Is it safe?'),t('E dopo il trasferimento?','What happens after transfer?')];
        return [t('Come funziona?','How does it work?'),t('Come lo installo?','How do I install it?'),t('Privacy e permessi','Privacy & permissions'),t('Cosa non fa?','What does it not do?')];
      }
      if (p === 'v7') return [t('Come si usa?','How do I use it?'),t('Cosa esporta?','What does it export?'),t('E dopo?','What comes next?'),t('Cosa non fa?','What does it not do?')];
      if (p === 'manager') return [t('Come funzionano i ruoli?','How do roles work?'),t('Come si assegna un territorio?','How is a territory assigned?'),t('Cos’è il riposo?','What is the rest period?'),t('Come funziona la sicurezza?','How does security work?')];
      return [t('Quale prodotto mi serve?','Which product do I need?'),'ATM Version 7','ATM Bridge','ATM Manager'];
    };

    const renderSuggestions = () => {
      chips.replaceChildren();
      suggestionsFor().forEach(label => {
        const b=document.createElement('button');
        b.type='button'; b.className='atm-guide-chip smart-next'; b.textContent=label;
        b.addEventListener('click',()=>ask(label));
        chips.appendChild(b);
      });
    };

    const add = (value, who, extra='') => {
      const node=document.createElement('div');
      node.className=`atm-guide-message ${who} ${extra}`.trim();
      node.textContent=value;
      feed.appendChild(node);
      feed.scrollTop=feed.scrollHeight;
      return node;
    };

    let busy = false;
    const ask = question => {
      const q=(question || '').trim();
      if (!q || busy) return;
      busy=true;
      add(q,'user');
      const typing=add(t('Sto capendo cosa intendi…','Understanding what you mean…'),'bot','typing');
      input.disabled=true; send.disabled=true;
      const delay=Math.min(650,240+q.length*5);
      setTimeout(()=>{
        typing.remove();
        const reply=add(answer(q),'bot','smart-v4');
        renderSuggestions();
        input.disabled=false; send.disabled=false; busy=false;
        input.focus({preventScroll:true});
        syncViewport();
        requestAnimationFrame(()=>{feed.scrollTop=feed.scrollHeight});
      },delay);
    };

    form.addEventListener('submit',e=>{
      e.preventDefault();
      const q=input.value;
      input.value='';
      ask(q);
    });

    input.addEventListener('focus',()=>setTimeout(syncViewport,60));
    input.addEventListener('blur',()=>setTimeout(syncViewport,120));

    /* Replace the old generic chips with contextual V4 chips. */
    renderSuggestions();

    /* Improve the initial bubble so users know follow-ups work. */
    const firstBot = $('.atm-guide-message.bot',feed);
    if (firstBot && !firstBot.dataset.v4Intro) {
      firstBot.dataset.v4Intro='1';
      firstBot.textContent=t(
        'Ciao 👋 Sono la V4 della guida ATM. Puoi parlarmi normalmente e continuare con domande brevi: “Cos’è Bridge?” → “su Chrome?” → “perché quei permessi?” → “e dopo?”. Terrò il filo della conversazione.',
        'Hello 👋 I am the V4 ATM guide. You can speak normally and continue with short follow-ups: “What is Bridge?” → “on Chrome?” → “why those permissions?” → “what next?”. I will keep the conversation context.'
      );
    }

    /* Keep viewport in sync when V3 opens/closes the dialog. */
    new MutationObserver(() => {
      syncViewport();
      if (shell.classList.contains('is-open')) {
        setTimeout(()=>input.focus({preventScroll:true}),60);
      }
    }).observe(shell,{attributes:true,attributeFilter:['class']});
  };

  boot();
})();