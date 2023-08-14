'use strict'

module.exports = module.exports = {
  welcome: `🎉 Unleash the Excitement with GiveAwayBot! 🎁
Are you looking to organize exciting GIVEAWAY events hassle-free? GiveAwayBot is here to make your events unforgettable!
\n
🎈 Participants: Dive into the fun by joining our events using the exclusive event code. Get ready for the chance to win fantastic prizes! 🏆✨
\n
🌟 Content Creators: Ignite the excitement by creating your own events! Receive a unique code to share with enthusiastic participants. Then, with a simple touch, reveal the lucky winners and surprise them with well-deserved prizes!

Created by @ManuEomm for Come to Code 2023\nFollow me on Twitter https://twitter.com/ManuEomm`,
  welcome_back: '👋 Welcome back, @{{{username}}}!',
  help: `Available commands:
/join - Enter a code to join a "give away" event!
/list - Show your "give away" events
/promote - Ask the admin to become an event creator
/create - Create a "give away" event and get your code to share
/extract - Ask the bot to select the "give away" winners!
/abort - Cancel the ongoing action
`,

  create_start_event_name: 'Step 1️⃣ of 5️⃣ - Enter the event name',
  create_event_description: 'Step 2️⃣ of 5️⃣ - Enter the extended event description. Remember to specify when the winners will be drawn!',
  create_event_prize: 'Step 3️⃣ of 5️⃣ - Enter the prize description',
  create_event_winner: 'Step 4️⃣ of 5️⃣ - Enter the number of winners to be drawn',
  create_event_code: 'Step 5️⃣ of 5️⃣ - Enter the code to share with participants',
  create_event_done: '🎉 The event has been created! 🎉\nSpread your code `{{{code}}}` to get users registered!',

  join_start: '❓ Send a message with the event code you want to join:',
  join_done: '🎉 Successfully joined the {{{name}}} event! 🎉\nYou will receive a notification when the final drawing takes place!',

  event_info: `📣 {{{name}}}

🔑 Code: {{{code}}}

📝 {{{description}}}

🎁 Prize: {{{prize}}}

🏆 Winners: {{{requiredWinners}}}

🗓️ Drawing: {{{endedAt}}}`,

  list_events: '📋 Here is the list of your events.\nClick on the buttons to view details:',
  list_no_events: '📋 You haven\'t created any events yet!',

  extract_start: '❓ Select the event for which you want to do the drawing:',
  extract_winners: '🏆 Here are the results of the drawing for {{{requiredWinners}}} winners out of {{{count}}} participants:\n',
  extract_winner: '🏆 Congratulations! You won the give-away for {{{name}}}!\n\nContact @{{{owner}}} for your prize!',

  abort_done: '👍 Action canceled!',

  error_extract_not_owner: '🚫 Only the event creator can extract winners!',

  error_invalid_value: '🚫 The entered value is not valid! Please try again',
  error_code_unique: '🚫 The code {{{code}}} has already been used for another event! Please enter a different one',

  error_event_not_found: '🚫 The event with code {{{code}}} was not found! Please try again, paying attention to uppercase and lowercase letters',
  error_event_ended: '🚫 The event ended on {{{when}}}',

  error_event_no_participants: '🚫 There are no participants in the {{{name}}} event 😔! We need to wait a bit longer',

  not_implemented: '🚫 This feature has not been implemented yet!',
  not_supported: '🚫 To interact with me, use Telegram commands. Type `/` to see the list!',

  fatal_error: '🚫 A serious error has occurred! Please try again later!'
}
