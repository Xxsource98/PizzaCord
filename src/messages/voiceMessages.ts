import Client from 'src/classes/client'
import Voice from 'src/classes/voice'
import Speech from 'src/classes/speech'
// Extra Modules
import { FindYoutubeVideo, GetCommandParams } from '../utils'

const HandleVoiceMessages = (BotClient: Client, BotVoice: Voice, BotSpeech: Speech) => {

    BotSpeech.AddCommand('play', (msg) => {
        const prefix = `${BotSpeech.GetPrefix()} play`
        const message = GetCommandParams(prefix, msg.content as string)

        if (message && message !== '') {
            FindYoutubeVideo(message).then(video => {
                console.info(`I found: ${video.title}`)
                BotVoice.Play(video, message)
            })
        }
    }, `Play with speech recognition! Say ${BotSpeech.GetPrefix()} with command name and song's name!`)

    BotSpeech.AddCommand('skip', (msg) => {
        BotVoice.Skip()
    }, 'Skip song with speech recognition')

    BotSpeech.AddCommand('pause', (msg) => {
        BotVoice.Pause()
    }, 'Pause song with speech recognition')

    BotSpeech.AddCommand('resume', (msg) => {
        BotVoice.Unpause()
    }, 'Resumie song with speech recognition')
    
    BotSpeech.AddCommand('stop', (msg) => {
        BotVoice.Stop()
    }, 'Stop player with speech recognition')

    BotSpeech.AddCommand('quit', (msg) => {
        BotVoice.Disconnect()
    }, 'Disconnect bot with speech recognition')

}

export default HandleVoiceMessages