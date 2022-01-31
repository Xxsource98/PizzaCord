import Discord from 'discord.js'

// Types
type CommandActionType = (message: Discord.Message<boolean>) => void
type CommandType = {
    commandName: string,
    commandAction: CommandActionType,
    commandDescription?: string
}

// Class
class Client {
    #Client: Discord.Client<boolean>
    #ClientToken: string
    #BotCommands: CommandType[]
    #BotPrefix: string

    constructor(token: string, Prefix: string) {
        console.info('Bot is starting')

        this.#ClientToken = token
        this.#Client = new Discord.Client({
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_VOICE_STATES,
                Discord.Intents.FLAGS.GUILD_MESSAGES,
            ]
        })
        this.#BotCommands = []
        this.#BotPrefix = Prefix
    }

    #GetCommands(message: Discord.Message<boolean>) {
        this.#BotCommands.forEach(CommandObject => {
            const lowerMessage = message.content?.toLowerCase()
            const lowerCommandName = CommandObject.commandName.toLowerCase()
            const isFine = lowerMessage?.indexOf(lowerCommandName) === 0

            if (isFine) {
                CommandObject.commandAction(message)
            }
        })
    }

    GetClient(): Discord.Client<boolean> {
        return this.#Client
    }

    AddCommand(commandName: string, commandAction: CommandActionType, commandDescription?: string) {
        if (commandName && commandAction) {
            const commandWithPrefix = `${this.#BotPrefix}${commandName}`

            this.#BotCommands.push({
                commandName: commandWithPrefix,
                commandAction: commandAction,
                commandDescription: commandDescription
            })
        }
    }

    End() {
        this.#Client.on('messageCreate', msg => {
            this.#GetCommands(msg)
        })

        this.#Client.on('ready', () => {
            console.info(`${this.#Client.user?.tag} is ready!`) 
            this.#Client.user?.setActivity(`${this.#BotPrefix}help`, {
                type: 'PLAYING'
            })
        })

        this.#Client.login(this.#ClientToken).catch(ex => {
            console.error(`Failed to login: ${ex}`)
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

        return `Chat Commands: \`\`\`${commands.join('\n')}\`\`\``
    }
}

export default Client