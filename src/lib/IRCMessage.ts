interface IRCMessage {
    '@timestamp'?: string
    channel?: string
    nick?: string
    action?: string
    text?: string
    event: {original: string}
}

export type {IRCMessage}
