import { elasticsearch } from '$lib/elasticsearch'

export async function get({ query, locals }) {
    const usernames = query.get('usernames').split(',') ?? []

    const now = new Date()
    const response = await elasticsearch.search({
        body: {
            "query": {
                "bool": {
                    "must": {
                        "terms": {
                            "nick": usernames,
                        },
                    },
                    "filter": {
                        "range": {
                            "@timestamp": { "gte": new Date(now.setUTCFullYear(now.getUTCFullYear() - 1)).toISOString() },
                        },
                    },
                },
            },
            "aggregations": {
                "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "calendar_interval": "1d",
                        "time_zone": "UTC",
                        "format": "yyyy-MM-dd",
                        "min_doc_count": 1
                    },
                },
            },
        },
    })

    return {
        body: {
            activity:  response.aggregations?.date?.buckets ?? [],
            totalMessages: response.hits.total.value,
        }
    }
}
