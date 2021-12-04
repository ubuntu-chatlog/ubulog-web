import { Client as esClient } from 'elasticsearch'

import { dev } from '$app/env'

let es_url = 'http://localhost:9200'
if (!dev) {
    es_url = 'http://elasticsearch-master:9200'
}

export const elasticsearch = new esClient({
    host: es_url,
    log: 'info'
})
