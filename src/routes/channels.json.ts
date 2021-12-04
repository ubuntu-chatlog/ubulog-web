import { elasticsearch } from '$lib/elasticsearch'

export async function get({ query, locals }) {
    const response = await elasticsearch.search({
        body: {
            "size": 0,
            "aggs": {
                "channels": {
                    "terms": {
                        "field": "channel.keyword",
                        "size": 500,
                        "order": {
                            "_term": "desc"
                        }
                    }
                }
            }
        }
    })
    const channels = response.aggregations?.channels?.buckets?.map((v, idx) => v.key).sort()
    return {
        body: {
            channels
        }
    }
}
