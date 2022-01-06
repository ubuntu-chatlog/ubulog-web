import { elasticsearch } from '$lib/elasticsearch'
import type { TimelineEntry } from '$lib/TimelineEntry'

export async function get({ query, locals }): Promise<{ body: { activity: TimelineEntry[], totalMessages: number} }> {
    const response = await elasticsearch.search({
        body: {
            "aggregations": {
                "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "calendar_interval": "1M",
                        "time_zone": "UTC",
                    },
                },
            },
            "size": 0,
        },
    })

    const data = response.aggregations?.date?.buckets as TimelineEntry[] ?? [];
    return {
        body: {
            activity:  data,
            totalMessages: data.reduce((final_value, bucket) => final_value + bucket.doc_count, 0),
        }
    }
}
