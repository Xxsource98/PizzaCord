import * as Discord from 'discord.js'
import { IsUserModerator } from '../../utils'
import User from './user'
import Log from '../../log'

class VoiceChannel {
    #User: User
    #Message: Discord.Message<boolean>
    #ChannelData: Discord.VoiceState

    constructor(User: User, Message: Discord.Message<boolean>, ChannelData: Discord.VoiceState) {
        this.#User = User
        this.#Message = Message
        this.#ChannelData = ChannelData
    }

    Mute() {
        if (this.#Message && this.#ChannelData) {
            if (IsUserModerator(this.#Message)) {
                this.#ChannelData.setMute(true)
                Log.SendMessage(this.#Message, 'success', `${this.#User.GetInfo()?.nickname} is muted!`)
            }
            else {
                Log.SendMessage(this.#Message, 'fail', `You can't mute other users without Administartor role!`)
            }
        }
    }

    Unmute() {
        if (this.#Message && this.#ChannelData) {
            if (IsUserModerator(this.#Message)) {
                this.#ChannelData.setMute(false)
                Log.SendMessage(this.#Message, 'success', `${this.#User.GetInfo()?.nickname} is unmuted!`)
            }
            else {
                Log.SendMessage(this.#Message, 'fail', `You can't unmute other users without Administartor role!`)
            }
        }
    }

    Disconnect() {
        if (this.#Message && this.#ChannelData) {
            if (IsUserModerator(this.#Message)) {
                this.#ChannelData.disconnect()
                Log.SendMessage(this.#Message, 'success', `${this.#User.GetInfo()?.nickname} is disconnected!`)
            }
            else {
                Log.SendMessage(this.#Message, 'fail', `You can't disconnect other users without Administartor role!`)
            }
        }
    }
}

export default VoiceChannel