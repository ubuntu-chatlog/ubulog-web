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

<style>
    .chatlog {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.8rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>

<p>Latest 500 messages in #{channel}</p>
{#if messages.length > 0}
    <ul class="chatlog">
        {#each messages as message}
            <li>[<time datetime={message['@timestamp']}>{new Intl.DateTimeFormat([], { dateStyle: "short", timeStyle: "long" }).format(new Date(message['@timestamp']))}</time>] #{message.channel}: &lt;<a href="/user/{message.nick}">{message.nick}</a>&gt; {message.text}</li>
        {/each}
    </ul>
{:else}
    <p>No messages found.</p>
{/if}
