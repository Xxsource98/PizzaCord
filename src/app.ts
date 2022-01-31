import 'dotenv/config'
import betterLogging from 'better-logging'
import Client from './classes/client'
import Voice from './classes/voice'
import Speech from './classes/speech'
import HandleChatMessages from './messages/chatMessages'
import HandleVoiceMessages from './messages/voiceMessages'

// Env
const BotToken = process.env.TOKEN
const MessagePrefix = process.env.MESSAGE_PREFIX
const SpeechPrefix = process.env.SPEECH_PREFIX
const SpeechLanguage = process.env.SPEECH_LANGUAGE

// Init Better Logging
betterLogging(console)

// Variables
const BotClient = new Client(BotToken!, MessagePrefix!)
const BotSpeech = new Speech(BotClient, SpeechLanguage!, SpeechPrefix!)
const BotVoice = new Voice()

// Handle Voice Messages
HandleVoiceMessages(BotClient, BotVoice, BotSpeech)
BotSpeech.Init()

// Handle Chat Messages
HandleChatMessages(BotClient, BotVoice, BotSpeech)

// Bot Final Login
BotClient.End()