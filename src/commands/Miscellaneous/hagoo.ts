import { Command } from '@sapphire/framework'

export class HagooCommand extends Command {
  constructor(context) {
    super(context, {
      name: 'hagoo',
      description: 'go hagoo someone',
    })
  }

  async messageRun(message, args) {
    const user = args.finished ? 
      message.guild.members.cache.filter(member => !member.user.bot).random() :
      await args.pick('member')
      
    await message.channel.send(`lmao ${user} just got hagooed`)
  }
}