import { elasticsearch } from '$lib/elasticsearch'
import type { IRCMessage } from '$lib/IRCMessage'

export async function get({ query, locals }): Promise<{ body: { latest: IRCMessage[] } }> {
    const usernames = query.get('usernames').split(',') ?? []

    const response = await elasticsearch.search<IRCMessage>({
        body: {
            size: 500,
            sort: [
                { '@timestamp': { format: 'epoch_second', order: 'desc' } },
            ],
            query: {
                "terms": {
                    "nick": usernames,
                },
            },
        }
    })

    return {
        body: {
            latest:  response.hits.hits.map(hit => hit._source),
        }
    }
}
