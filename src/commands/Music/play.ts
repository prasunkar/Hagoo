import ytdl from 'ytdl-core'
import { AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice'

import { Command } from '@sapphire/framework'

export class PlayCommand extends Command {
  constructor(context) {
    super(context, {
      name: 'play',
      description: 'play music'
    })
  }

  async messageRun(message, args) {
    const url = await args.pick('string')
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channelId,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator
    })
    const stream = ytdl(url, { filter: 'audioonly' })
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary })
    const player = createAudioPlayer()

    player.play(resource)
    connection.subscribe(player)

    player.on(AudioPlayerStatus.Idle, () => connection.destroy())

    await message.channel.send('ight')
  }
}