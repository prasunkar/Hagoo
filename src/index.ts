/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import { SapphireClient } from '@sapphire/framework'
import { Interaction, Snowflake, GuildMember } from 'discord.js'
import {
  AudioPlayerStatus,
  AudioResource,
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { MusicSubscription } from './music/subscription'
import { Track } from './music/track'

global.subscriptions = new Map<Snowflake, MusicSubscription>()

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

const subscriptions = new Map<Snowflake, MusicSubscription>()

// Handles slash command interactions
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return
  let subscription = subscriptions.get(interaction.guildId)

  if (interaction.commandName === 'rundat') {
    await interaction.deferReply()
    // Extract the video URL from the command
    const url = interaction.options.get('song')!.value! as string

    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
      if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
        const channel = interaction.member.voice.channel
        subscription = new MusicSubscription(
          joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
          }),
        )
        subscription.voiceConnection.on('error', console.warn)
        subscriptions.set(interaction.guildId, subscription)
      }
    }

    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
      await interaction.followUp('Join a voice channel and then try that again!')
      return
    }

    // Make sure the connection is ready before processing the user's request
    try {
      await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3)
    } catch (error) {
      console.warn(error)
      await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!')
      return
    }

    try {
      // Attempt to create a Track from the user's video URL
      const track = await Track.from(url, {
        onStart() {
          interaction.followUp({ content: 'Now playing!', ephemeral: true }).catch(console.warn)
        },
        onFinish() {
          interaction.followUp({ content: 'Now finished!', ephemeral: true }).catch(console.warn)
        },
        onError(error) {
          console.warn(error)
          interaction.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn)
        },
      })
      // Enqueue the track and reply a success message to the user
      subscription.enqueue(track)
      await interaction.followUp(`Queued up **${track.title}**`)
    } catch (error) {
      console.warn(error)
      await interaction.reply('Failed to play track, please try again later!')
    }
  } else if (interaction.commandName === 'diddlemypickle') {
    if (subscription) {
      // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
      // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
      // will be loaded and played.
      subscription.audioPlayer.stop()
      await interaction.reply('Skipped song!')
    } else {
      await interaction.reply('Not playing in this server!')
    }
  } else if (interaction.commandName === 'gimmetheaux') {
    // Print out the current queue, including up to the next 5 tracks to be played.
    if (subscription) {
      const current =
				subscription.audioPlayer.state.status === AudioPlayerStatus.Idle ? 'Nothing is currently playing!' : `Playing **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`

      const queue = subscription.queue
        .slice(0, 10)
        .map((track, index) => `${index + 1}) ${track.title}`)
        .join('\n')

      await interaction.reply(`${current}\n\n${queue}`)
    } else {
      await interaction.reply('Not playing in this server!')
    }
  } else if (interaction.commandName === 'stopthisgarbageassmusic') {
    if (subscription) {
      subscription.audioPlayer.pause()
      await interaction.reply({ content: 'Paused!', ephemeral: true })
    } else {
      await interaction.reply('Not playing in this server!')
    }
  } else if (interaction.commandName === 'nvmthisight') {
    if (subscription) {
      subscription.audioPlayer.unpause()
      await interaction.reply({ content: 'Unpaused!', ephemeral: true })
    } else {
      await interaction.reply('Not playing in this server!')
    }
  } else if (interaction.commandName === 'wankoff') {
    if (subscription) {
      subscription.voiceConnection.destroy()
      subscriptions.delete(interaction.guildId)
      await interaction.reply({ content: 'Left channel!', ephemeral: true })
    } else {
      await interaction.reply('Not playing in this server!')
    }
  } else {
    await interaction.reply('Unknown command')
  }
})

client.on('error', console.warn)

client.login(process.env.DISCORD_TOKEN).catch(console.error)