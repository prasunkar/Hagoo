// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import { SapphireClient } from '@sapphire/framework'

const client = new SapphireClient({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
  defaultPrefix: '.',
  typing: true,
  caseInsensitiveCommands: true,
  presence: {
    activities: [
      {
        name: 'tawsif\'s mom squirt',
        type: 'LISTENING'
      },
      {
        name: 'with my balls',
        type: 'PLAYING'
      }
    ]
  }
})

client.once('ready', () => {
  console.log('I am real and ready to hagoo')
})

client.login(process.env.DISCORD_TOKEN).catch(console.error)