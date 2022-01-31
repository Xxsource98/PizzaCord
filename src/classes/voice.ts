import * as DiscordVoice from '@discordjs/voice'
import * as Discord from 'discord.js'
import ytdl from 'discord-ytdl-core'
import { VideoSearchResult } from 'yt-search'

type SongType = {
    video: VideoSearchResult,
    audio: DiscordVoice.AudioResource<null>
}

class Voice {
    #Connection: DiscordVoice.VoiceConnection | null
    #AudioPlayer: DiscordVoice.AudioPlayer | null
    #DefaultMessageChannel: Discord.TextChannel | null
    #SongQueue: SongType[]

    constructor() {
        this.#Connection = null
        this.#AudioPlayer = null
        this.#DefaultMessageChannel = null
        this.#SongQueue = []
    }

    #PlayQueue() {
        if (this.#Connection && this.#SongQueue.length > 0) {
            const currentSong = this.#SongQueue[0]

            this.#AudioPlayer?.play(currentSong.audio)
        }
    }

    JoinToVoiceChannel(Message: Discord.Message<boolean>) {
        const channel = Message.member?.voice.channel as Discord.VoiceBasedChannel
        
        this.#Connection = DiscordVoice.joinVoiceChannel({
            channelId: channel?.id,
            guildId: channel?.guild.id,
            adapterCreator: channel?.guild.voiceAdapterCreator,
            selfDeaf: false,
        })

        this.#AudioPlayer = DiscordVoice.createAudioPlayer()
        this.#Connection!.subscribe(this.#AudioPlayer!)
        this.#DefaultMessageChannel = Message.channel as Discord.TextChannel

        // @ts-ignore
        this.#AudioPlayer.on('stateChange', (oldState, newState) => {
            if (oldState.status === DiscordVoice.AudioPlayerStatus.Playing &&
                newState.status === DiscordVoice.AudioPlayerStatus.Idle) {
                
                if (this.#SongQueue.length > 0) {
                    this.#SongQueue.shift()

                    if (this.#SongQueue.length > 0) {
                        this.#PlayQueue()

                        this.#DefaultMessageChannel?.send(`:notes: Now playing: **${this.#SongQueue[0].video.title}**\n\n ${this.#SongQueue[0].video.url}`)
                    }
                }
            }
        })
    }

    async Play(video: VideoSearchResult, whatHeard?: string) {
        if (this.#Connection) {
            const stream = await ytdl(video.url, {
                filter: "audioonly",
                opusEncoded: true,
                encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
                highWaterMark: 1 << 25
            })

            const resource = DiscordVoice.createAudioResource(stream)

            this.#SongQueue.push({
                video: video,
                audio: resource
            })

            if (whatHeard) {
                this.#DefaultMessageChannel?.send(`:notes: I heard: **${whatHeard}**`)
            }

            if (this.#SongQueue.length > 1) {
                this.#DefaultMessageChannel?.send(`:notes: Added to Queue (${this.#SongQueue.length - 1}): **${video.title}**\n\n ${video.url}`)
            }
            else {
                this.#DefaultMessageChannel?.send(`:notes: Now playing: **${video.title}**\n\n ${video.url}`)
            }

            this.#PlayQueue()
        }
    }

    Stop() {
        this.#SongQueue = []
        this.#AudioPlayer!.stop(true)
        this.#DefaultMessageChannel?.send(':notes: Music stopped')
    }

    Pause() {
        this.#AudioPlayer?.pause()
        this.#DefaultMessageChannel?.send(':notes: Music paused')
    }

    Unpause() {
        this.#AudioPlayer?.unpause()
        this.#DefaultMessageChannel?.send(':notes: Music unpaused')
    }

    Skip() {
        if (this.#SongQueue.length > 1) {
            this.#AudioPlayer?.stop()
            this.#SongQueue.shift()
            this.#PlayQueue()

            this.#DefaultMessageChannel?.send(`:notes: Song Skipped\n :notes: Now playing: **${this.#SongQueue[0].video.title}**\n\n ${this.#SongQueue[0].video.url}`)
        }
    }

    SendMessage(Message: string) {
        if (this.#DefaultMessageChannel) {
            this.#DefaultMessageChannel.send(Message)
        }
    }

    Disconnect() {
        this.Stop()
        this.#Connection!.disconnect()
    }
}

export default Voice