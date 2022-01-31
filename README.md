<p align="center">
  <img src="https://user-images.githubusercontent.com/36642285/151784727-5117af8c-c5fb-41d9-a6a5-a5e375e27e62.svg" width=128 />
</p>

# <p align="center">PizzaCord</p>

## What is PizzaCord?
PizzaCord is a discord bot base written in Typescript with Discord.JS library. It's very friendly and easy to use. It even has a speech recognition commands!

## Requiremets
```css
Node >= 16.9.0
npm >= 7.21.1
```

## Setup
It's very easy to setup. Just clone and install all necessary packages and later let's create and modify .env file (just copy **.env.example** and delete **.example** extension). You have to assign valid Discord Bot Token on <code>TOKEN</code> variable (You can find it here: https://discord.com/developers/applications) and choose prefix for Chat and Speech commands with language of Speech Recognition.

After it, you are able to start your application with <code>pm run start</code> or <code>yarn run start</code> and use your bot! Check for help command for get list of all commands.

## Functions
<ul>
    <li><b>Easy Way to Add Custom Commands</b></li>
    <li><b>Automatically Adding Custom Commands to help Command</b></li>
    <li><b>Working Speech Recognition! (Better to use without Krispy in voice settings)</b></li>
    <li><b>Simple Music Bot with Queue</b></li>
    <li><b>Ready User Class with Standard Function (e.g. mute, ban, kick, info...)</b></li>
</ul>

## How to Add Commands
#### Chat Message: <br>
Go to <code>src/messages/chatMessages.ts</code> file and inside <code>HandleChatMessages</code> function add your custom command with:
```ts
BotClient.AddCommand('command', msg => {
    msg.channel.send(`:gear: It's your custom command!`)
}, 'Command description for help command')
```
Inside you can put anything you want.

#### Speech Message: <br>
Go to <code>src/messages/voiceMessages.ts</code> file and inside <code>HandleVoiceMessages</code> function add your custom command with:
```ts
BotSpeech.AddCommand('command', (msg) => {
    BotVoice.SendMessage(`You said: ${msg.content}`)
}, 'Command description for help command')
```
Inside you can put anything you want.
<br>
There are some basic User functions in <code>src/classes/user/</code> which you can use

## License
Project is under GNU General Public License v3.0. You can read more there: www.gnu.org