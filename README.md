<div align="center">

<img src="assets/atm-manager-logo.png" alt="ATM Manager" width="112">

# ATM Manager

### Territory Operations · Version 1.0.8

Territori, persone, assegnazioni e sicurezza in un unico workspace.

[![Apri la vetrina](https://img.shields.io/badge/APRI_LA_VETRINA-91ff16?style=for-the-badge&labelColor=101510)](https://stefano-dotcom.github.io/ATM-Territory-Maker/)
[![Apri ATM Manager](https://img.shields.io/badge/APRI_ATM_MANAGER-f1f3ee?style=for-the-badge&labelColor=101510)](https://atm-manager.netlify.app/)
[![Supporto](https://img.shields.io/badge/SUPPORTO-101510?style=for-the-badge)](mailto:atmsupportcentre@gmail.com)

</div>

---

## Il progetto

ATM Manager è una piattaforma web per coordinare l’intero ciclo operativo dei territori. Riunisce mappe, persone, richieste, assegnazioni, notifiche e sicurezza in Space organizzativi separati.

La piattaforma nasce attorno a un modello a girasole: **ATM Manager è il fulcro**, mentre territori, persone, ATM v7 e sicurezza sono moduli connessi dello stesso ecosistema.

## Cosa permette di fare

- Creare, importare e organizzare territori e sezioni.
- Consultare e modificare i confini direttamente sulla mappa.
- Gestire richieste, assegnazioni, ritiri e periodi di riposo.
- Controllare persone e autorizzazioni attraverso ruoli distinti.
- Separare dati e attività in Space indipendenti.
- Ricevere notifiche operative e messaggi email localizzati.
- Usare MFA, passkey e registro attività per proteggere le operazioni.
- Accedere da computer, tablet e telefono attraverso un’interfaccia responsive.

## Come funziona ATM Manager

1. **Creazione dello Space.** Il responsabile crea uno spazio organizzativo indipendente e protetto.
2. **Ingresso del team.** Le persone entrano tramite invito o richiesta controllata e ricevono un ruolo preciso.
3. **Creazione o importazione.** I territori possono essere importati da KML/JSON, organizzati in sezioni oppure generati con ATM v7.
4. **Richiesta.** Un utente può localizzare un territorio disponibile e richiederlo; i dettagli operativi restano protetti fino all’approvazione.
5. **Assegnazione.** Un amministratore o utente avanzato approva e assegna il territorio alla persona corretta.
6. **Lavorazione.** L’assegnatario consulta mappa, perimetro, note e strade da completare.
7. **Restituzione.** Il territorio viene restituito come lavorato o non lavorato, con eventuali note.
8. **Riposo e cronologia.** Un territorio completato entra nel periodo di riposo previsto; notifiche, email e registro attività documentano il ciclo.

## Le sezioni della piattaforma

| Sezione | Funzione |
| --- | --- |
| Panoramica | Stato dello Space, indicatori, attività recenti e accesso rapido alle operazioni. |
| ATM v7 | Modulo creativo integrato per generare nuovi perimetri territoriali. |
| Territori | Mappa, elenco, sezioni, importazione, visualizzazione e modifica dei confini. |
| I miei territori | Assegnazioni personali, richieste, dettagli operativi e restituzione. |
| Assegnazioni | Richieste in attesa, territori attivi, riposo e storico. |
| Persone | Approvazione degli account e gestione dei ruoli autorizzati. |
| Registro attività | Cronologia delle operazioni importanti eseguite nello Space. |
| Sicurezza | MFA, passkey, sessioni e verifiche rafforzate per azioni sensibili. |
| Supporto | Contatto diretto con il centro assistenza ATM. |
| Profilo e impostazioni | Dati personali, lingua individuale, sessione e gestione account. |

## Space indipendenti

Ogni organizzazione lavora nel proprio **Space**. Territori, membri, assegnazioni, notifiche ed email sono legati esclusivamente a quello spazio. Un gruppo non può leggere o modificare i dati di un altro gruppo.

Il proprietario dello Space può invitare il proprio team e gestire il ciclo di vita dello spazio senza influenzare altre organizzazioni presenti sulla piattaforma.

## Ruoli

| Ruolo | Responsabilità |
| --- | --- |
| Utente | Consulta i propri territori, invia richieste e restituisce il lavoro. |
| Utente avanzato | Gestisce le operazioni territoriali senza amministrare gli account. |
| Amministratore | Coordina persone, ruoli, territori, notifiche e attività del proprio Space. |
| Proprietario dello Space | Governa il ciclo di vita dello Space e le operazioni più sensibili. |

## Ecosistema ATM

- **ATM Manager:** centro operativo per gestione, persone e assegnazioni.
- **ATM Version 7:** modulo creativo per la generazione dei territori.
- **ATM Bridge:** collegamento assistito verso Territory Helper.
- **Centro sicurezza:** accesso, MFA, passkey e controllo delle sessioni.

ATM v7 e ATM Manager svolgono due compiti diversi ma collegati: ATM v7 crea i territori; ATM Manager li organizza e ne governa l’intero ciclo operativo.

### ATM Version 7

ATM Version 7 è il modulo creativo dell’ecosistema. Parte da un’area geografica, genera una suddivisione territoriale e permette di controllare visivamente i perimetri prima dell’esportazione.

Il suo flusso essenziale è:

1. Selezione dell’area su cui lavorare.
2. Generazione e suddivisione dei territori.
3. Controllo del risultato sulla mappa.
4. Esportazione in GeoJSON.
5. Importazione o sincronizzazione nel flusso operativo di ATM Manager.

[Apri ATM Version 7](https://atm-v7.netlify.app/)

### ATM Bridge

ATM Bridge è l’estensione Firefox che accompagna il passaggio del file generato verso Territory Helper. Rileva il GeoJSON, presenta una conferma chiara e consente di proseguire con l’importazione.

- Non richiede di copiare manualmente il contenuto del file.
- Mostra il file rilevato prima di continuare.
- Mantiene il controllo nelle mani dell’utente.
- È distribuita pubblicamente tramite Firefox Add-ons.

[Installa ATM Bridge](https://addons.mozilla.org/it/firefox/addon/atm-bridge/)

### Il flusso completo

**ATM Version 7 genera → ATM Bridge trasferisce → ATM Manager organizza e gestisce.**

I tre prodotti hanno responsabilità diverse e complementari: creazione cartografica, trasferimento assistito e gestione operativa.

## Dispositivi supportati

ATM Manager è una web app responsive utilizzabile da computer, tablet e telefono. Le funzioni e la navigazione si adattano allo spazio disponibile, mentre le operazioni cartografiche più complesse risultano più comode su uno schermo ampio.

## Collegamenti ufficiali

- [Vetrina GitHub Pages](https://stefano-dotcom.github.io/ATM-Territory-Maker/)
- [ATM Manager](https://atm-manager.netlify.app/)
- [ATM Version 7](https://atm-v7.netlify.app/)
- [ATM Bridge per Firefox](https://addons.mozilla.org/it/firefox/addon/atm-bridge/)
- [Supporto via email](mailto:atmsupportcentre@gmail.com)

## Repository pubblico di presentazione

Questo repository contiene esclusivamente la vetrina pubblica statica di ATM Manager. Il codice sorgente dell’applicazione, il backend, le migrazioni SQL, le configurazioni Supabase, le chiavi e i dati degli utenti **non sono inclusi**.

Il codice HTML, CSS e JavaScript presente qui serve soltanto a visualizzare questa pagina promozionale e non contiene la logica privata della piattaforma.

## Diritti

Copyright © 2026 ATM Manager. Tutti i diritti riservati. Consulta [LICENSE.md](LICENSE.md).
