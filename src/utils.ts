import * as Discord from 'discord.js'
import * as ytSearch from 'yt-search'

const GetCommandParams = (prefix: string, message: string) => {
    if (prefix && message) {
        const lowerMessage = message.toLowerCase()
        const index = lowerMessage.indexOf(prefix.toLowerCase())

        if (index !== -1) {
            const endIndexToErase = prefix.length + 1
            const newString = message.slice(index + endIndexToErase, message.length)

            return newString
        }
    }

    return ''
}

const FindYoutubeVideo = async (keywords: string): Promise<ytSearch.VideoSearchResult>  => {
    const results = await ytSearch.search(keywords)
    const videos = results.videos.slice(0, 3)

    return videos[0]
}

const IsUserModerator = (Message: Discord.Message<boolean>): boolean => {
    if (Message) {
        const author = Message.guild?.members.cache.get(Message.author.id)

        return author?.permissions.has('ADMINISTRATOR') as boolean
    }

    return false
}

export { GetCommandParams, FindYoutubeVideo, IsUserModerator }