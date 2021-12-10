import { elasticsearch } from '$lib/elasticsearch'

export async function get({ query, locals }) {
    const response = await elasticsearch.search({
        body: {
            "aggregations": {
                "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "calendar_interval": "1M",
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
