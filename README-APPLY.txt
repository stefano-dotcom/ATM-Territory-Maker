ATM ECOSYSTEM GUIDE — SMART V4
=================================

Questa V4 NON sostituisce la WOW V3: la potenzia.

COSA CAMBIA
-----------
• Capisce prodotto + intento + browser + follow-up.
• Ricorda il contesto locale della conversazione.
• Evita di ripetere lo stesso identico paragrafo.
• Se ripeti una domanda, aggiunge un dettaglio nuovo.
• Cerca anche nel testo della pagina quando la knowledge base non basta.
• Suggerimenti dinamici dopo ogni risposta.
• Responsive completo per mobile, tablet e landscape.
• Gestione della tastiera mobile con VisualViewport.
• Safe-area iPhone / notch / gesture bar.
• Il campo input usa 16px su mobile per evitare lo zoom automatico iOS.

INSTALLAZIONE
-------------
1. Carica `assistant-v4.js` nella ROOT del repository, accanto ad `assistant.js`.

2. In `index.html`, subito DOPO la riga che carica assistant.js, aggiungi:

   <script src="assistant-v4.js?v=20260812-1"></script>

3. Fai la stessa cosa in:
   - atm-v7.html
   - atm-bridge.html

Esempio:

   <script src="assistant.js?v=20260812-wow3"></script>
   <script src="assistant-v4.js?v=20260812-1"></script>

IMPORTANTE
----------
`assistant-v4.js` deve essere caricato DOPO `assistant.js`.
Non eliminare assistant.js: contiene la UI e le animazioni WOW V3.

Dopo l'upload:
• fai Ctrl + F5 su desktop;
• su telefono chiudi e riapri la scheda oppure svuota la cache del sito.

TEST CONSIGLIATO
----------------
Apri il chatbot e prova questa conversazione:

1. Cos'è ATM Bridge?
2. Come lo installo?
3. Su Chrome
4. Perché usa quei permessi?
5. È sicuro?
6. E dopo il trasferimento?
7. E ATM Manager cosa fa invece?

Le risposte devono cambiare seguendo il contesto, senza ripetere sempre
lo stesso paragrafo.
