'use strict'

module.exports = {
  welcome: `🎉 Scatena l'Entusiasmo con GiveAwayBot! 🎁
Sei alla ricerca di organizzare eventi GIVEAWAY emozionanti senza problemi? GiveAwayBot è qui per rendere i tuoi eventi indimenticabili!

🎈 Partecipanti: Tuffati nel divertimento unendoti ai nostri eventi utilizzando il codice segreto esclusivo dell'evento. Preparati per la possibilità di vincere fantastici premi! 🏆✨

🌟 Creatori di Contenuti: Accendi l'entusiasmo creando i tuoi eventi! Ricevi un codice unico da condividere con i partecipanti entusiasti. Poi, con un semplice tocco, svela i fortunati vincitori e sorprendili con premi ben meritati!

Realizzato da @ManuEomm per Come to Code 2023\nSeguimi su Twitter https://twitter.com/ManuEomm`,
  welcome_back: '👋 Ci si rivede @{{{username}}}!',
  help: `Comandi disponibili:
/join - Inserisci un codice per partecipare a un evento "give away"!
/list - Mostra i tuoi eventi "give away"
/promote - Richiedi all'amministratore di diventare un creatore di eventi
/create - Crea un evento "give away" e ottieni il tuo codice da condividere
/extract - Chiedi al bot di selezionare i vincitori dell'evento "give away"!
/abort - Annulla l'azione in corso
`,

  create_start_event_name: 'Step 1️⃣ di 5️⃣ - Inserisci il nome dell\'evento',
  create_event_description: 'Step 2️⃣ di 5️⃣ - Inserisci la descrizione estesa dell\'evento. Ricorda di specificare quando farai l\'estrazione dei vincitori!',
  create_event_prize: 'Step 3️⃣ di 5️⃣ - Inserisci la descrizione del premio in palio',
  create_event_winner: 'Step 4️⃣ di 5️⃣ - Inserisci il numero di vincitori che saranno estratti',
  create_event_code: 'Step 5️⃣ di 5️⃣ - Inserisci il codice da condividere con i partecipanti',
  create_event_done: '🎉 L\'evento è stato creato! 🎉\nDiffondi il tuo codice `{{{code}}}` per far registrare gli utenti!',

  join_start: '❓ Invia un messaggio con il codice dell\'evento a cui vuoi partecipare:',
  join_done: '🎉 Iscrizione all\'evento {{{name}}} fatta! 🎉\nRiceverai una notifica quando avverrà l\'estrazione finale!',

  event_info: `📣 {{{name}}}

🔑 Codice: {{{code}}}

📝 {{{description}}}

🎁 Premio: {{{prize}}}

🏆 N. Vincitori: {{{requiredWinners}}}

🗓️ Estrazione: {{{endedAt}}}`,

  list_events: '📋 Ecco la lista dei tuoi eventi.\nClicca sui pulsanti per vederne i dettagli:',
  list_no_events: '📋 Non hai ancora creato eventi!',

  extract_start: '❓ Seleziona l\'evento per cui vuoi fare l\'estrazione:',
  extract_winners: '🏆 Ecco il risultato del sorteggio di {{{requiredWinners}}} vincitori su {{{count}}} partecipanti:\n',
  extract_winner: '🏆 Complimenti! Hai vinto il gave-away {{{name}}}!\n\nContatta @{{{owner}}} per il premio!',

  abort_done: '👍 Azione annullata!',

  error_extract_not_owner: '🚫 Solo il creatore dell\'evento può estrarre i vincitori!',

  error_invalid_value: '🚫 Il valore inserito non è valido! Riprova',
  error_code_unique: '🚫 Il codice {{{code}}} è già stato utilizzato per un altro evento! Inseriscine un altro',

  error_event_not_found: '🚫 L\'evento con codice {{{code}}} non è stato trovato! Riprova scrivendo facendo attenzione a maiusole e minuscole',
  error_event_ended: '🚫 L\'evento è terminato il {{{when}}}',

  error_event_no_participants: '🚫 Non ci sono partecipanti all\'evento {{{name}}} 😔! Dobbiamo aspettare ancora un po\'',

  not_implemented: '🚫 Questa funzionalità non è ancora stata implementata!\nSeguimi su Twitter per aggiornamenti https://twitter.com/ManuEomm',
  not_supported: '🚫 Per interagire con me, usa i comandi Telegram. Digita `/` per vedere la lista!',

  fatal_error: '🚫 Si è verificato un errore grave! Riprova più tardi!'
}
