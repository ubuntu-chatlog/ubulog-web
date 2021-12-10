<script context="module" lang="ts">
    interface Activity {
        key_as_string: string
        key: number
        doc_count: number
    }

    export async function load({ page, fetch }) {
        const {activity, totalMessages}: {activity: Activity, totalMessages: number} = await fetch(`timeline.json`).then(r => r.json())
        return { props: { activity, totalMessages: totalMessages ?? 0 } }
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Chart } from 'frappe-charts';

    export let totalMessages: number = 0
    export let activity: Activity[]

    let chart

    onMount(() => {
        const arrData = activity.map(entry => [(entry.key / 1000).toString(), entry.doc_count])
        if (activity.length > 0 ) {
            chart = new Chart(chart, {
                type: 'line',
                title: 'Total number of messages over time in all monitored channels',
                data: {
                    labels: activity.map(item => new Date(item.key).toDateString()),
                    datasets: [{
                        name: 'Total messages',
                        values: activity.map(item => item.doc_count),
                    }],
                    start: new Date(activity[0].key),
                    end: new Date(activity[activity.length - 1].key),
                },
                colors: ['#17459e'],
                lineOptions: {
                    hideDots: 1,
                    spline: 1,
                },
                axisOptions: {
                    xIsSeries: true // default: false
                },
            })
        }
    })

    onDestroy(() => {
        chart = null
    })
</script>

<h1>Ubuntu Chatlogs</h1>

<div bind:this={chart} on:data-select></div>
