import { elasticsearch } from '$lib/elasticsearch'
import type { IRCMessage } from '$lib/IRCMessage'

export async function get({ query, locals }): Promise<{ body: { messages: IRCMessage[] } }> {
    const channel: string = query.get('channel') ?? ''

    const response = await elasticsearch.search<IRCMessage>({
        body: {
            size: 500,
            sort: [
                { '@timestamp': { format: 'epoch_second', order: 'desc' } },
            ],
            query: {
                "term": {
                    "channel": channel,
                },
            },
        }
    })

    return {
        body: {
            messages:  response.hits.hits.map(hit => hit._source),
        }
    }
}
