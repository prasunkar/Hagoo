import { Command } from '@sapphire/framework'

export class SetupCommand extends Command {
  constructor(context) {
    super(context, {
      name: 'setup',
      description: 'setup the interaction commands or sum idk'
    })
  }

  async messageRun(message) {
    await message.guild.commands.set([
      {
        name: 'rundat',
        aliases: ['play'],
        description: 'Plays a song',
        options: [
          {
            name: 'song',
            type: 'STRING' as const,
            description: 'The URL of the song to play',
            required: true,
          },
        ],
      },
      {
        name: 'diddlemypickle',
        aliases: ['skip'],
        description: 'Skip to the next song in the queue',
      },
      {
        name: 'gimmetheaux',
        aliases: ['queue'],
        description: 'See the music queue',
      },
      {
        name: 'stopthisgarbageassmusic',
        aliases: ['pause'],
        description: 'Pauses the song that is currently playing',
      },
      {
        name: 'nvmthisight',
        aliases: ['resume', 'letmesuffermore'],
        description: 'Resume playback of the current song',
      },
      {
        name: 'wankoff',
        aliases: ['leave', 'disconnect'],
        description: 'Leave the voice channel',
      },
    ])

    await message.reply('i think i just came')
  }
}