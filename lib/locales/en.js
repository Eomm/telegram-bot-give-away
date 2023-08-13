'use strict'

module.exports = {
  welcome: `🎉 Unleash the Excitement with GiveAwayBot! 🎁
Are you looking to organize exciting GIVEAWAY events hassle-free? GiveAwayBot is here to make your events unforgettable!

🎈 Participants: Dive into the fun by joining our events using the exclusive event secret code. Get ready for the chance to win fantastic prizes! 🏆✨

🌟 Content Creators: Ignite the excitement by creating your own events! Receive a unique code to share with enthusiastic participants. Then, with a simple touch, reveal the lucky winners and surprise them with well-deserved prizes!

Created by @ManuEomm for Come to Code 2023`,
  welcome_back: '👋 Welcome back, @{{username}}!',
  not_supported: '🚫 To interact with me, use the commands. Type `/` to see the list!',
  help: `Available commands:
/join - Enter a code to join a "give away" event!
/list - Show your "give away" events
/promote - Ask the admin to become an event creator
/create - Create a "give away" event and get your code to share
/extract - Ask the bot to select the "give away" winners!`,
  create_start_event_name: 'Step 1️⃣ of 5️⃣ - Enter the event name',
  create_event_description: 'Step 2️⃣ of 5️⃣ - Enter the extended event description. Remember to specify when you will draw the winners!',
  create_event_prize: 'Step 3️⃣ of 5️⃣ - Enter the prize description',
  create_event_winner: 'Step 4️⃣ of 5️⃣ - Enter the number of winners to be drawn',
  create_event_code: 'Step 5️⃣ of 5️⃣ - Enter the code to share with participants',
  create_event_done: '🎉 The event has been created\\! 🎉\nSpread your code `{{code}}` to get users registered\\!',

  join_done: '🎉 Successfully joined the event {{name}}! 🎉\nYou will receive a notification when the final drawing takes place!',

  event_info: `📣 {{name}}

🔑 {{code}}

📝 {{description}}

🎁 Prize: {{prize}}

🏆 Number of Winners: {{requiredWinners}}

🗓️ Drawing: {{endedAt}}`,

  list_events: '📋 Here is the list of your events.\nClick on the buttons to see details:',
  list_no_events: '📋 You haven\'t created any events yet!',

  extract_winners: '🏆 Here are the results of the drawing for {{requiredWinners}} out of {{count}} participants:\n',
  extract_winner: '🏆 Congratulations! You\'ve won the giveaway {{name}} !\n\nContact @{{owner}} for your prize!',

  error_invalid_value: '🚫 The entered value is not valid! Please try again',
  error_code_unique: '🚫 The code {{code}} has already been used for another event! Please enter a different one',

  error_event_not_found: '🚫 The event with code {{code}} was not found\\! Try again by typing `/join code`',
  error_event_ended: '🚫 The event ended on {{when}}',

  error_extract_not_found: '🚫 The event with code {{code}} was not found\\! Try again by typing `/extract code`',
  error_event_no_participants: '🚫 There are no participants in the {{name}} event 😔!',

  fatal_error: '🚫 A serious error has occurred! Please try again later!'
}
