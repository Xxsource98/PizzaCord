import * as Discord from 'discord.js'

type MessageType = 'success' | 'fail'

class Log {
    static SendMessage(Message: Discord.Message<boolean>, Type: MessageType, Content: string) {
        if (Message) {
            Message.channel.send(`${Type === 'success' ? ':white_check_mark:' : ':x:'}   ${Content}`)
        }
    }
}

export default Log