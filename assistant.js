(() => {
  const support = 'atmsupportcentre@gmail.com';
  const isEnglish = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const t = (it, en) => isEnglish() ? en : it;

  // Repair showcase media paths that were previously pointing to /assets even though
  // the video files live in the repository root.
  const repairMediaPaths = () => {
    const replacements = new Map([
      ['assets/ai-animation-flow-1.mp4', 'ai-animation-flow-1.mp4'],
      ['assets/atm-v7-intro.mp4', 'atm-v7-intro.mp4']
    ]);
    const changedVideos = new Set();
    document.querySelectorAll('video[src], video source[src]').forEach(node => {
      const current = node.getAttribute('src') || '';
      for (const [wrong, right] of replacements) {
        if (current.includes(wrong)) {
          node.setAttribute('src', current.replace(wrong, right));
          changedVideos.add(node.tagName === 'VIDEO' ? node : node.closest('video'));
        }
      }
    });
    changedVideos.forEach(video => {
      if (!video) return;
      try { video.load(); video.play().catch(() => {}); } catch (_) {}
    });
  };
  repairMediaPaths();

  const normalize = value => (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = value => normalize(value).split(' ').filter(x => x.length > 1);

  document.querySelectorAll('a[href="https://atm-v7.netlify.app/website/"]').forEach(link => {
    const label = normalize(link.textContent);
    if (label.includes('installa') || label.includes('install')) {
      link.href = 'https://addons.mozilla.org/it/firefox/addon/atm-bridge/';
    } else {
      link.href = 'atm-bridge.html';
    }
  });
  const pageProduct = document.body.dataset.product || 'ecosystem';
  let lastTopic = pageProduct === 'v7' ? 'v7' : pageProduct === 'bridge' ? 'bridge' : null;

  const topics = [
    {
      id: 'ecosystem', product: 'ecosystem',
      phrases: ['ecosistema atm','atm ecosystem','come funziona tutto','come funzionano insieme','flusso completo','quale prodotto'],
      keys: ['ecosistema','ecosystem','insieme','suite','flusso','workflow','prodotti','products'],
      it: 'ATM è un flusso in tre fasi: 1) ATM Version 7 crea e controlla i territori; 2) ATM Bridge accompagna il GeoJSON verso Territory Helper; 3) ATM Manager organizza persone, richieste, assegnazioni, restituzioni, riposo e sicurezza. Se devi creare parti da v7; se devi trasferire usi Bridge; se devi gestire il lavoro quotidiano usi Manager.',
      en: 'ATM is a three-stage workflow: 1) ATM Version 7 creates and reviews territories; 2) ATM Bridge assists the GeoJSON handoff to Territory Helper; 3) ATM Manager organizes people, requests, assignments, returns, rest periods and security. Use v7 to create, Bridge to transfer and Manager for daily operations.'
    },
    {
      id: 'v7', product: 'v7',
      phrases: ['atm v7','atm version 7','version 7','creare territori','generare territori','territory creation'],
      keys: ['v7','version','genera','generate','crea','create','territori','territory','mappa','map','confini','boundaries'],
      it: 'ATM Version 7 è il modulo creativo. Parti da un’area geografica, imposti la suddivisione, generi i territori, controlli i perimetri sulla mappa e solo dopo esporti. Il suo compito è creare un risultato geografico verificabile prima che entri nel flusso operativo.',
      en: 'ATM Version 7 is the creative module. Start from a geographic area, configure the subdivision, generate territories, inspect boundaries on the map and export only after review. Its job is to produce a verifiable geographic result before it enters the operational workflow.'
    },
    {
      id: 'v7-workflow', product: 'v7',
      phrases: ['come si usa v7','workflow v7','flusso v7','passaggi v7','come creo un territorio','how to use v7'],
      keys: ['seleziona','select','parametri','parameters','genera','verifica','review','esporta','export'],
      it: 'Flusso v7: seleziona area/località → imposta i parametri e il numero di territori → genera → controlla visivamente la suddivisione e il territorio attivo → esporta il risultato. Il file può poi entrare nel passaggio Bridge o nel flusso di Manager.',
      en: 'v7 workflow: select the area/location → set parameters and territory count → generate → visually review the subdivision and active territory → export the result. The file can then move through Bridge or into the Manager workflow.'
    },
    {
      id: 'v7-files', product: 'v7',
      phrases: ['geojson o kml','formati v7','file v7','cosa esporta','output v7','export format'],
      keys: ['geojson','kml','file','formato','format','output','esporta','export'],
      it: 'ATM v7 prepara dati territoriali esportabili. La documentazione della vetrina indica GeoJSON come formato principale del flusso e supporta anche KML nelle funzioni descritte. Prima dell’esportazione puoi controllare perimetri e risultato sulla mappa.',
      en: 'ATM v7 prepares exportable territory data. The showcase documents GeoJSON as the main workflow format and also describes KML support. Before export you can inspect boundaries and the generated result on the map.'
    },
    {
      id: 'bridge', product: 'bridge',
      phrases: ['atm bridge','bridge extension','estensione bridge','plugin bridge','territory helper connector'],
      keys: ['bridge','estensione','extension','plugin','connector','trasferimento','transfer','territory','helper'],
      it: 'ATM Bridge è il collegamento assistito tra ATM e Territory Helper. Rileva il GeoJSON pronto, conserva temporaneamente lo stato nel browser, mostra file e quantità rilevati e lascia all’utente la conferma prima di aprire o riutilizzare la scheda di Territory Helper.',
      en: 'ATM Bridge is the assisted connection between ATM and Territory Helper. It detects the ready GeoJSON, temporarily keeps transfer state in the browser, shows the detected file and count, and leaves confirmation to the user before opening or reusing the Territory Helper tab.'
    },
    {
      id: 'bridge-install', product: 'bridge',
      phrases: ['come installare bridge','come si installa bridge','installazione bridge','install bridge','come si installa'],
      keys: ['installazione','installation','installa','install'],
      it: 'Per installare ATM Bridge hai due strade desktop: Firefox usa la pagina pubblica Add-ons; Chrome usa il pacchetto ZIP manuale. Su Chrome: estrai lo ZIP → apri chrome://extensions → abilita Modalità sviluppatore → scegli “Carica estensione non pacchettizzata”. Se mi dici Firefox o Chrome ti do i passaggi specifici.',
      en: 'There are two desktop installation paths for ATM Bridge: Firefox uses the public Add-ons page; Chrome uses the manual ZIP package. On Chrome: extract the ZIP → open chrome://extensions → enable Developer mode → choose “Load unpacked”. Tell me Firefox or Chrome for the exact steps.'
    },
    {
      id: 'bridge-firefox', product: 'bridge',
      phrases: ['installare bridge firefox','bridge firefox','firefox addons','add to firefox'],
      keys: ['firefox','addons','installa','install','aggiungi'],
      it: 'Su Firefox desktop l’installazione più semplice è dalla pagina pubblica Firefox Add-ons di ATM Bridge. Il browser mostra i permessi richiesti e, dopo l’approvazione, l’estensione è pronta per il flusso ATM → Territory Helper.',
      en: 'On desktop Firefox the simplest installation is through the public ATM Bridge Firefox Add-ons page. Firefox shows the requested permissions and, after approval, the extension is ready for the ATM → Territory Helper workflow.'
    },
    {
      id: 'bridge-chrome', product: 'bridge',
      phrases: ['installare bridge chrome','bridge chrome','chrome extension','load unpacked','carica estensione non pacchettizzata'],
      keys: ['chrome','zip','sviluppatore','developer','unpacked','scarica','download'],
      it: 'Su Chrome desktop Bridge viene installato manualmente: scarica lo ZIP, estrailo, apri chrome://extensions, abilita Modalità sviluppatore e scegli “Carica estensione non pacchettizzata”. Il flusso è pensato per browser desktop, non per Chrome mobile.',
      en: 'On desktop Chrome Bridge is installed manually: download and extract the ZIP, open chrome://extensions, enable Developer mode and choose “Load unpacked”. The workflow targets desktop browsers, not Chrome mobile.'
    },
    {
      id: 'bridge-privacy', product: 'bridge',
      phrases: ['bridge privacy','privacy bridge','permessi bridge','bridge permissions','dati bridge'],
      keys: ['storage','tabs','scripting','notifications','permessi','permissions','privacy','dati','data'],
      it: 'Bridge usa permessi browser per mantenere il trasferimento in sospeso, individuare o aprire le pagine supportate e mostrare notifiche. La pagina pubblica descrive storage, tabs, scripting, unlimitedStorage e notifications. Il manifest Firefox indicato dalla vetrina dichiara raccolta dati richiesta “none”.',
      en: 'Bridge uses browser permissions to keep a pending transfer, find or open supported pages and show notifications. The public page describes storage, tabs, scripting, unlimitedStorage and notifications. The Firefox manifest referenced by the showcase declares required data collection as “none”.'
    },
    {
      id: 'manager', product: 'manager',
      phrases: ['atm manager','manager workspace','gestire territori','territory management'],
      keys: ['manager','space','workspace','assegnazioni','assignments','richieste','requests','persone','people'],
      it: 'ATM Manager è il centro operativo. Ogni organizzazione lavora in uno Space separato; utenti, utenti avanzati, amministratori e proprietari hanno responsabilità diverse. Richieste, assegnazioni, restituzioni, periodi di riposo, notifiche e registro attività mantengono il lavoro tracciabile.',
      en: 'ATM Manager is the operating center. Each organization works in a separate Space; users, advanced users, administrators and owners have different responsibilities. Requests, assignments, returns, rest periods, notifications and the activity log keep operations traceable.'
    },
    {
      id: 'manager-roles', product: 'manager',
      phrases: ['ruoli manager','manager roles','utente avanzato','space owner','proprietario space'],
      keys: ['ruoli','roles','utente','user','advanced','admin','amministratore','owner','proprietario'],
      it: 'I ruoli documentati sono quattro: Utente, Utente avanzato, Amministratore e Proprietario dello Space. L’utente lavora sui propri territori; l’utente avanzato gestisce operazioni territoriali; l’amministratore coordina persone, ruoli e attività; il proprietario governa lo Space e le operazioni più sensibili.',
      en: 'The documented roles are User, Advanced user, Administrator and Space owner. Users work with their own territories; advanced users manage territory operations; administrators coordinate people, roles and activity; the owner governs the Space and its most sensitive operations.'
    },
    {
      id: 'manager-security', product: 'manager',
      phrases: ['sicurezza manager','manager security','mfa passkey','space isolation','spazi separati'],
      keys: ['sicurezza','security','mfa','passkey','rls','sessioni','sessions','isolamento','isolation'],
      it: 'La vetrina descrive separazione degli Space, controlli per ruolo, policy RLS, MFA, passkey, sessioni e registro attività. Le operazioni sensibili devono richiedere il ruolo corretto e, quando previsto, una sessione MFA verificata.',
      en: 'The showcase documents Space isolation, role controls, RLS policies, MFA, passkeys, sessions and activity logging. Sensitive operations should require the correct role and, where configured, a verified MFA session.'
    },
    {
      id: 'manager-rest', product: 'manager',
      phrases: ['periodo di riposo','rest period','territorio lavorato','restituzione territorio','return territory'],
      keys: ['riposo','rest','restituzione','return','lavorato','worked','cronologia','history'],
      it: 'Quando un territorio viene restituito, l’utente può indicare se è stato lavorato o non lavorato e aggiungere una nota. Un territorio completato entra nel periodo di riposo previsto; notifiche e registro attività documentano il ciclo.',
      en: 'When a territory is returned, the user can record whether it was worked or not and add a note. A completed territory enters the configured rest period; notifications and the activity log document the cycle.'
    },
    {
      id: 'compare', product: 'ecosystem',
      phrases: ['differenza tra','difference between','v7 bridge manager','v7 vs bridge','bridge vs manager','v7 vs manager'],
      keys: ['differenza','difference','vs','confronto','compare'],
      it: 'La differenza è nel momento del flusso: v7 CREA il dato geografico; Bridge TRASFERISCE in modo assistito verso Territory Helper; Manager GESTISCE il ciclo operativo con persone, ruoli e assegnazioni. Non sono tre versioni dello stesso strumento: sono tre responsabilità complementari.',
      en: 'The difference is the workflow stage: v7 CREATES the geographic data; Bridge ASSISTS TRANSFER to Territory Helper; Manager MANAGES the operational lifecycle with people, roles and assignments. They are not three versions of the same tool; they are complementary responsibilities.'
    },
    {
      id: 'assistant', product: 'ecosystem',
      phrases: ['sei una vera ai','sei un ai','come funzioni','how do you work','external ai','chatbot'],
      keys: ['ai','assistente','assistant','chatbot','intelligenza','intelligence'],
      it: 'Sono la guida informativa della vetrina ATM. Uso una knowledge base locale e regole di ricerca contestuale: non invio le tue domande a servizi AI esterni, non accedo agli account e non posso leggere file, password, sessioni o territori. Ora ricordo anche l’argomento della domanda precedente per capire meglio le domande successive.',
      en: 'I am the informational guide for the ATM showcase. I use a local knowledge base and contextual retrieval rules: I do not send your questions to external AI services, access accounts or read files, passwords, sessions or territories. I also keep the previous topic in context so follow-up questions are easier to understand.'
    },
    {
      id: 'support', product: 'ecosystem',
      phrases: ['contattare supporto','contact support','ho un bug','problema tecnico','technical issue'],
      keys: ['supporto','support','email','bug','errore','error','problema','problem','aiuto','help'],
      it: `Per assistenza scrivi a ${support}. Indica prodotto, browser, dispositivo, passaggi eseguiti e messaggio di errore. Non inviare password, OTP, token o chiavi API.`,
      en: `For support email ${support}. Include product, browser, device, steps and the error message. Never send passwords, OTP codes, tokens or API keys.`
    }
  ];

  const greetings = ['ciao','hey','hei','yo','hello','hi','buongiorno','buonasera'];
  const followUpWords = ['come','perche','perché','e poi','e dopo','installarlo','funziona','quindi','dati','sicuro','mobile','telefono'];

  const scoreTopic = (topic, question) => {
    const q = normalize(question);
    const qTokens = new Set(tokens(q));
    let score = 0;
    topic.phrases.forEach(p => { if (q.includes(normalize(p))) score += 7; });
    topic.keys.forEach(k => {
      const nk = normalize(k);
      if (q.includes(nk)) score += nk.includes(' ') ? 4 : 2.2;
      if (qTokens.has(nk)) score += 1;
    });
    if (lastTopic && topic.product === lastTopic && followUpWords.some(w => q.includes(normalize(w)))) score += 2.6;
    if (pageProduct !== 'ecosystem' && topic.product === pageProduct) score += 0.7;
    return score;
  };

  const answer = question => {
    const q = normalize(question);
    if (!q) return '';
    if (greetings.some(g => q === g || q.startsWith(`${g} `)) && tokens(q).length <= 3) {
      return t('Ciao 👋 Posso spiegarti ATM v7, Bridge, Manager oppure aiutarti a capire quale parte del flusso ti serve.', 'Hello 👋 I can explain ATM v7, Bridge, Manager, or help you choose which part of the workflow you need.');
    }

    const ranked = topics
      .map(topic => ({ topic, score: scoreTopic(topic, q) }))
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score);

    if (!ranked.length || ranked[0].score < 2.2) {
      if (lastTopic) {
        const contextual = topics.find(x => x.id === lastTopic || x.product === lastTopic);
        if (contextual && q.length < 42) return isEnglish() ? contextual.en : contextual.it;
      }
      return t(`Non ho una risposta verificata abbastanza precisa per questa domanda. Prova a nominare ATM v7, Bridge o Manager, oppure scrivi a ${support}.`, `I do not have a precise enough verified answer for that question. Try mentioning ATM v7, Bridge or Manager, or email ${support}.`);
    }

    const best = ranked[0];
    lastTopic = best.topic.product === 'ecosystem' ? best.topic.id : best.topic.product;

    // When the question clearly combines two products/topics, join the two strongest
    // verified answers instead of pretending one keyword was the whole question.
    const second = ranked[1];
    if (second && second.score >= Math.max(4, best.score * 0.72) && second.topic.product !== best.topic.product) {
      return `${isEnglish() ? best.topic.en : best.topic.it}\n\n${isEnglish() ? second.topic.en : second.topic.it}`;
    }
    return isEnglish() ? best.topic.en : best.topic.it;
  };

  const videoSource = 'ai-animation-flow-1.mp4';
  const markup = `
    <button class="atm-guide-launcher" aria-label="${t('Apri la guida ATM','Open ATM guide')}">
      <span>${t('Chiedi alla guida ATM','Ask the ATM guide')}</span>
      <i class="atm-guide-spark" aria-hidden="true">✦</i>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3a7 7 0 0 0-7 7v1a5 5 0 0 0 5 5h1l4 3v-3a5 5 0 0 0 4-5v-1a7 7 0 0 0-7-7Z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></svg>
    </button>
    <div class="atm-guide-shell" aria-hidden="true">
      <section class="atm-guide" role="dialog" aria-modal="true" aria-label="ATM Ecosystem Guide">
        <header class="atm-guide-head">
          <div class="atm-guide-face"><video autoplay muted loop playsinline preload="auto"><source src="${videoSource}" type="video/mp4"></video><div class="atm-guide-fallback"><b>AI</b></div><span class="atm-guide-status"></span></div>
          <div class="atm-guide-title"><b>ATM Ecosystem Guide</b><small>${t('Guida contestuale · v7 · Bridge · Manager','Context-aware guide · v7 · Bridge · Manager')}</small></div>
          <button class="atm-guide-close" aria-label="${t('Chiudi','Close')}">×</button>
        </header>
        <div class="atm-guide-feed">
          <div class="atm-guide-message bot">${t('Ciao 👋 Ora posso seguire meglio il contesto della conversazione. Chiedimi come funziona l’ecosistema, come installare Bridge, cosa esporta v7 o come Manager gestisce ruoli e territori.','Hello 👋 I can now follow conversation context better. Ask how the ecosystem works, how to install Bridge, what v7 exports, or how Manager handles roles and territories.')}</div>
          <div class="atm-guide-chips"></div>
        </div>
        <form class="atm-guide-form">
          <input class="atm-guide-input" autocomplete="off" maxlength="360" placeholder="${t('Chiedi qualcosa su ATM…','Ask something about ATM…')}" aria-label="${t('Domanda','Question')}">
          <button class="atm-guide-send" aria-label="${t('Invia','Send')}">↑</button>
          <small class="atm-guide-note">${t('Knowledge base locale · nessun accesso ai tuoi dati','Local knowledge base · no access to your data')}</small>
        </form>
      </section>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', markup);
  const launcher = document.querySelector('.atm-guide-launcher');
  const shell = document.querySelector('.atm-guide-shell');
  const close = document.querySelector('.atm-guide-close');
  const feed = document.querySelector('.atm-guide-feed');
  const form = document.querySelector('.atm-guide-form');
  const input = document.querySelector('.atm-guide-input');
  const face = document.querySelector('.atm-guide-face');
  const video = face.querySelector('video');
  const chips = document.querySelector('.atm-guide-chips');

  const chipSets = {
    ecosystem: [t('Come funziona tutto?','How does it all work?'),'ATM Version 7','ATM Bridge','ATM Manager',t('Qual è la differenza?','What is the difference?')],
    v7: [t('Come si usa v7?','How do I use v7?'),t('Cosa esporta?','What does it export?'),'ATM Bridge',t('Come continua il flusso?','What comes next?')],
    bridge: [t('Come funziona Bridge?','How does Bridge work?'),t('Installa su Firefox','Install on Firefox'),t('Installa su Chrome','Install on Chrome'),t('Privacy e permessi','Privacy & permissions')]
  };
  (chipSets[pageProduct] || chipSets.ecosystem).forEach(label => {
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'atm-guide-chip'; btn.textContent = label; chips.appendChild(btn);
  });

  const open = () => {
    shell.classList.add('is-open');
    launcher.classList.add('is-hidden');
    shell.setAttribute('aria-hidden','false');
    document.body.classList.add('atm-guide-open');
    setTimeout(() => input.focus(), 80);
  };
  const shut = () => {
    shell.classList.remove('is-open');
    launcher.classList.remove('is-hidden');
    shell.setAttribute('aria-hidden','true');
    document.body.classList.remove('atm-guide-open');
  };

  launcher.addEventListener('click', open);
  document.querySelectorAll('[data-open-atm-guide]').forEach(button => button.addEventListener('click', open));
  close.addEventListener('click', shut);
  shell.addEventListener('click', e => { if (e.target === shell) shut(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

  const markVideoMissing = () => face.classList.add('video-missing');
  video.addEventListener('error', markVideoMissing);
  video.addEventListener('canplay', () => face.classList.remove('video-missing'));
  setTimeout(() => { if (video.error || video.networkState === 3) markVideoMissing(); }, 1800);

  const add = (value, who, extra = '') => {
    const node = document.createElement('div');
    node.className = `atm-guide-message ${who} ${extra}`.trim();
    node.textContent = value;
    feed.appendChild(node);
    feed.scrollTop = feed.scrollHeight;
    return node;
  };

  const ask = question => {
    const q = question.trim();
    if (!q) return;
    add(q, 'user');
    const typing = add(t('Sto cercando nella guida ATM…','Searching the ATM guide…'), 'bot', 'typing');
    input.disabled = true;
    setTimeout(() => {
      typing.remove();
      add(answer(q), 'bot');
      input.disabled = false;
      input.focus();
    }, 320 + Math.min(420, q.length * 7));
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    ask(q);
  });
  chips.querySelectorAll('.atm-guide-chip').forEach(chip => chip.addEventListener('click', () => ask(chip.textContent)));
})();
