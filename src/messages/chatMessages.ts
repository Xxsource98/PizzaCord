import Client from 'src/classes/client'
import Voice from 'src/classes/voice'
import Speech from 'src/classes/speech'
// Extra Modules
import { FindYoutubeVideo, GetCommandParams } from '../utils'
import User from '../classes/user/user'

const HandleChatMessages = (BotClient: Client, BotVoice: Voice, BotSpeech: Speech) => {

    BotClient.AddCommand('core', msg => {
        msg.channel.send(`:gear: I'm using PizzaCord Base! :pizza:\nhttps://github.com/Xxsource98/PizzaCord`)
    }, "Bot's Core")

    BotClient.AddCommand('connect', msg => {
        BotVoice.JoinToVoiceChannel(msg)
    }, 'Connect to voice channel')
    
    BotClient.AddCommand('disconnect', msg => {
        BotVoice.Disconnect()
    }, 'Disconnect from voice channel')

    BotClient.AddCommand('play', msg => {
        const message = GetCommandParams(`${BotClient.GetPrefix()}play`, msg.content as string)

        if (message && message !== '') {
            FindYoutubeVideo(message).then(video => {
                console.info(`I found: ${video.title}`)
                BotVoice.Play(video)
            })
        }
    }, 'Play song! e.g. .play <url | song name>')

    BotClient.AddCommand('skip', (msg) => {
        BotVoice.Skip()
    }, 'Skip current song')

    BotClient.AddCommand('pause', (msg) => {
        BotVoice.Pause()
    }, 'Pause current song')

    BotClient.AddCommand('resume', (msg) => {
        BotVoice.Unpause()
    }, 'Resume current song')
    
    BotClient.AddCommand('stop', (msg) => {
        BotVoice.Stop()
    }, 'Stop player')

    BotClient.AddCommand('help', (msg) => {
        msg.channel.send(`${BotClient.GetAllCommands()}\n${BotSpeech.GetAllCommands()}`)

    }, 'Display all commands')

    BotClient.AddCommand('info', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            const userData = new User(msg, mentionedUser.id)
            const userInfo = userData.GetInfo()

            const infoString = `ID: ${userInfo!.id}\nTag: ${userInfo!.tag}\nNickname: ${userInfo!.nickname}\nJoined At: ${userInfo!.joinedAt}\nIs Bot: ${userInfo?.isBot}\n`

            msg.channel.send(`\`\`\`yaml\n${infoString}\`\`\` ${userData.GetProfilePicture()}`)
        })
    }, 'Info about mentioned users e.g. .info <mentioned users>')

    BotClient.AddCommand('kick', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            new User(msg, mentionedUser.id).Kick('You has been kicked by .')
        })
    }, 'Kick mentioned users e.g. .kick <mentioned users> (Only for moderators)')

    BotClient.AddCommand('ban', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            new User(msg, mentionedUser.id).Kick('You has been banned by .')
        })
    }, 'Ban mentioned users e.g. .kick <mentioned users> (Only for moderators)')

    BotClient.AddCommand('mute', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            new User(msg, mentionedUser.id).GetVoiceChannel().Mute()
        })
    }, 'Mute mentioned users on voice chat e.g. .mute <mentioned users> (Only for moderators)')

    BotClient.AddCommand('unmute', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            new User(msg, mentionedUser.id).GetVoiceChannel().Unmute()
        })
    }, 'Unmute mentioned users on voice chat e.g. .unmute <mentioned users> (Only for moderators)')

    BotClient.AddCommand('disc', (msg) => {
        const users = msg.mentions.users

        users.forEach(mentionedUser => {
            new User(msg, mentionedUser.id).GetVoiceChannel().Disconnect()
        })
    }, 'Disconnect mentioned users from voice chat e.g. .disc <mentioned users> (Only for moderators)')

}

export default HandleChatMessages