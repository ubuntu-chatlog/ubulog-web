<script context="module" lang="ts">
    import type {IRCMessage} from '$lib/IRCMessage'
    
    interface Activity {
        key_as_string: string
        key: number
        doc_count: number
    }

    export async function load({ page, fetch }) {
        let {usernames} = page.params ?? ''
        usernames = usernames.split('/')
        const queryNames = usernames.join(',')
        const [{activity, totalMessages}, {latest}] = await Promise.all<{activity: Activity; totalMessages: number}, {latest: IRCMessage[]}>([
            await fetch(`activity.json?usernames=${queryNames}`).then(r => r.json()),
            await fetch(`latest.json?usernames=${queryNames}`).then(r => r.json()),
        ])
        return { props: { activity, latest, usernames: usernames.join(', '), totalMessages: totalMessages ?? 0 } }
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Chart } from 'frappe-charts';

    export let usernames: string
    export let totalMessages: number = 0
    export let activity: Activity[]
    export let latest: IRCMessage[]

    let chart
  
    onMount(() => {
        const arrData = activity.map(entry => [(entry.key / 1000).toString(), entry.doc_count])
        if (arrData.length > 0 ) {
            const dataPoints = Object.fromEntries(arrData)

            console.dir(dataPoints)
            chart = new Chart(chart, {
                type: 'heatmap',
                data: {
                    dataPoints,
                    start: new Date(activity[0].key),
                    end: new Date(activity[activity.length - 1].key),
                },
                countLabel: 'Messages',
                discreteDomains: 1,
                colors: ['#ebedf0', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'],
                radius: 2,
            })
        }
    })

    onDestroy(() => {
        chart = null
    })
</script>

<p>User activity for {usernames} over the past year (total messages: {totalMessages})</p>
<div bind:this={chart} on:data-select></div>

<p>Latest 500 messages by {usernames} across all channels for all time</p>
{#if latest.length > 0}
    <ul>
        {#each latest as message}
            <li>#{message.channel} : {message.event.original}</li>
        {/each}
    </ul>
{:else}
    <p>No messages found.</p>
{/if}
