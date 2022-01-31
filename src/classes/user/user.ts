import * as Discord from 'discord.js'
import VoiceChannel from './voiceChannel'
import { IsUserModerator } from '../../utils'
import Log from '../../log'

type UserDataType = {
    id: string,
    tag: string,
    nickname: string,
    joinedAt: string,
    isBot: boolean,
    permissions: Discord.Permissions
}

class User {
    #Message: Discord.Message<boolean>
    #UserData: Discord.GuildMember

    constructor(Message: Discord.Message<boolean>, UserID: string) {
        this.#Message = Message
        this.#UserData = Message.guild?.members.cache.get(UserID) as Discord.GuildMember
    }

    GetVoiceChannel(): VoiceChannel {
        return new VoiceChannel(this, this.#Message, this.#UserData.voice)
    }

    GetInfo(): UserDataType | null {
        if (this.#UserData) {
            return {
                id: this.#UserData.id,
                tag: this.#UserData.user.tag,
                nickname: this.#UserData.nickname as string,
                joinedAt: this.#UserData.joinedAt?.toLocaleDateString('pl-PL') as string, // dd/mm/year format
                isBot: this.#UserData.user.bot,
                permissions: this.#UserData.permissions
            }
        }

        return null
    }

    GetProfilePicture() {
        if (this.#UserData) {
            return this.#UserData.user.avatarURL({
                dynamic: true,
                size: 1024
            })
        }

        return null
    }

    Kick(reason?: string) {
        if (this.#Message && this.#UserData) {
            if (IsUserModerator(this.#Message)) {
                this.#UserData.kick(reason)
                Log.SendMessage(this.#Message, 'success', `${this.#UserData.nickname} is kicked!`)
            }
            else {
                Log.SendMessage(this.#Message, 'fail', `You can't kick other users without Administartor role!`)
            }
        }
    }

    Ban(reason?: string) {
        if (this.#Message && this.#UserData) {
            if (IsUserModerator(this.#Message)) {
                this.#UserData.ban({
                    reason: reason
                })
                Log.SendMessage(this.#Message, 'success', `${this.#UserData.nickname} is banned!`)
            }
            else {
                Log.SendMessage(this.#Message, 'fail', `You can't ban other users without Administartor role!`)
            }
        }
    }
}

export default User