<script context="module" lang="ts">
    import type {IRCMessage} from '$lib/IRCMessage'

    export async function load({ page, fetch }) {
        let {channel}: {channel: string} = page.params ?? ''
        const {messages}: {messages: IRCMessage[]} = await fetch(`latest.json?channel=${channel}`).then(r => r.json())
        return { props: { channel, messages } }
    }
</script>

<script lang="ts">
    export let channel: string
    export let messages: IRCMessage[]
</script>

<p>Latest 500 messages in #{channel}</p>
{#if messages.length > 0}
    <ul>
        {#each messages as message}
            <li>{message.event.original}</li>
        {/each}
    </ul>
{:else}
    <p>No messages found.</p>
{/if}
