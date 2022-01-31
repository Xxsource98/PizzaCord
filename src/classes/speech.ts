import Client from 'src/classes/client'
import { addSpeechEvent, VoiceMessage } from 'discord-speech-recognition'

// Types
type SpeechConfigType = {
    duringSpeech?: boolean
}

type CommandActionType = (message: VoiceMessage) => void
type CommandType = {
    commandName: string,
    commandAction: CommandActionType,
    config: SpeechConfigType,
    commandDescription?: string
}

// Class
class Speech {
    #BotClient: Client
    #BotCommands: CommandType[]
    #BotLanguage: string
    #BotPrefix: string
    #DefaultConfig: SpeechConfigType

    /**
     * 
     * @param Client 
     * @param Language Speech Language in ISO 639-1 standard e.g. en-US 
     * @param Prefix 
     */
    constructor(Client: Client, Language: string, Prefix: string) {
        this.#BotClient = Client
        this.#BotCommands = []
        this.#BotLanguage = Language
        this.#BotPrefix = Prefix
        this.#DefaultConfig = {
            duringSpeech: true
        }
    }

    #GetCommands(message: VoiceMessage) {
        this.#BotCommands.forEach(CommandObject => {            
            const lowerMessage = message.content?.toLowerCase()
            const lowerCommandName = CommandObject.commandName.toLowerCase()
            const isFine = CommandObject.config.duringSpeech ? 
                            lowerMessage?.indexOf(lowerCommandName) !== -1 
                            : lowerMessage?.indexOf(lowerCommandName) === 0

            if (isFine) {
                CommandObject.commandAction(message)
            }
        })
    }

    AddCommand(commandName: string, commandAction: CommandActionType, commandDescription?: string, config?: SpeechConfigType) {
        if (commandName && commandAction) {
            const commandWithPrefix = `${this.#BotPrefix} ${commandName}`
            const Config: SpeechConfigType = config || this.#DefaultConfig

            this.#BotCommands.push({
                commandName: commandWithPrefix,
                commandAction: commandAction,
                config: Config,
                commandDescription: commandDescription
            })
        }
    }

    Init() {
        addSpeechEvent(this.#BotClient.GetClient(), {
            "lang": this.#BotLanguage
        })
        
        this.#BotClient.GetClient().on('speech', async (msg: VoiceMessage) => {
            if (msg.content !== undefined && msg.content !== '') {
                this.#GetCommands(msg)
            }
        })
    }

    GetPrefix() {
        return this.#BotPrefix
    }

    GetAllCommands() {
        const commands: string[] = []

        this.#BotCommands.forEach(command => {
            commands.push(` -> ${command.commandName} - ${command.commandDescription}`)
        })

        return `Speech Commands: \`\`\`${commands.join('\n')}\`\`\``
    }
}

export default Speech