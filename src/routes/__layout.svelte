<script context="module" lang="ts">
    export async function load({ page, fetch }) {
        const {channels} = await fetch('/channels.json').then(r => r.json())
        return { props: { channels } }
    }
</script>

<script lang="ts">
    import { navigating } from '$app/stores'
	import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
    
    import '../styles/style.scss'

    export let channels

    let searchBox
    let sideNavigation
    let drawer

    function toggleDrawerOnly(e) {
        e.preventDefault()
        toggleDrawer()
    }
    function toggleDrawer() {
        if (window.getComputedStyle(sideNavigation).position === 'fixed') {
            if (!drawer.classList.contains('is-expanded')) {
                drawer.classList.remove('is-collapsed');
                drawer.classList.add('is-expanded');
            } else {
                drawer.classList.remove('is-expanded');
                drawer.classList.add('is-collapsed');
            }
        }
    }

    function resetSearch(e) {
        searchBox.value = ''
        searchBox.focus()
        e.preventDefault()
    }
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<header id="navigation" class="p-navigation is-dark">
    <div class="p-navigation__row">
        <div class="p-navigation__banner">
            <div class="p-navigation__logo">
                <a class="p-navigation__item" href="/">
                    <span class="p-navigation__link">
                        Ubulog: The Ubuntu IRC Chatlogs
                    </span>
                </a>
            </div>
            <a href="#navigation" class="p-navigation__toggle--open" title="menu">Menu</a>
            <a href="#navigation-closed" class="p-navigation__toggle--close" title="close menu">Close menu</a>
        </div>
        <nav class="p-navigation__nav" aria-label="Main navigation">
            <ul class="p-navigation__items">
                <!-- <li class="p-navigation__item "><a class="p-navigation__link" href="/docs">Docs</a></li>
                <li class="p-navigation__item "><a class="p-navigation__link" href="/docs/examples">Examples</a></li>
                <li class="p-navigation__link"><a href="/accessibility">Accessibility</a></li>
                <li class="p-navigation__link"><a href="/browser-support">Browser support</a></li>
                <li class="p-navigation__link"><a href="/contribute">Contribute</a></li> -->
            </ul>
        </nav>
    </div>
</header>

<section id="search-docs" class="p-strip--light is-shallow">
    <div class="row">
        <form class="p-search-box u-no-margin--bottom">
            <input type="search" class="p-search-box__input" name="q" placeholder="Search IRC Logs" required autocomplete="on" bind:this={searchBox}>
            <button type="reset" class="p-search-box__reset" name="close on:click={resetSearch}"><i class="p-icon--close">Close</i></button>
            <button type="submit" class="p-search-box__button" name="submitSearch"><i class="p-icon--search">Search</i></button>
        </form>
    </div>
</section>

<div class="p-strip is-shallow">
    <div class="row">
        <aside class="col-3">
            <nav class="p-side-navigation is-sticky" id="drawer" aria-label="Logged IRC channels list" bind:this={drawer}>
                <a href="#drawer" class="p-side-navigation__toggle js-drawer-toggle" aria-controls="drawer" on:click={toggleDrawerOnly}>
                    Toggle logged channels list
                </a>
        
                <div class="p-side-navigation__overlay js-drawer-toggle" aria-controls="drawer"></div>
        
                <div class="p-side-navigation__drawer" bind:this={sideNavigation}>
                    <div class="p-side-navigation__drawer-header">
                        <a href="#" class="p-side-navigation__toggle--in-drawer js-drawer-toggle" aria-controls="drawer" on:click={toggleDrawerOnly}>
                            Toggle logged channels list
                        </a>
                    </div>
                    <ul class="p-side-navigation__list">
                        <li class="p-side-navigation__item--title">
                            <span class="p-side-navigation__text">
                                Logged channels
                            </span>
                        </li>
                        {#if channels}
                            {#each channels as channel}
                                <li class="p-side-navigation__item--title">
                                    <span class="p-side-navigation__text">
                                        <a class="p-side-navigation__link" href="/channel/{channel}" on:click={toggleDrawer}>#{channel}</a>
                                    </span>
                                </li>
                            {/each}
                        {:else}
                            <li class="p-side-navigation__item--title">
                                <span class="p-side-navigation__text">
                                    None found
                                </span>
                            </li>
                        {/if}
                    </ul>
                </div>
            </nav>
        </aside>

        <main class="col-9" id="main-content">
            <slot />
        </main>

    </div>
</div>

<footer class="p-strip--light">
    <nav class="row" aria-label="Footer navigation">
        <div>
            <p>© 2021 Dani Llewellyn. This site is not affiliated with, or endorsed by, Ubuntu or Canonical Ltd. <a href="https://ubuntu.com/">Ubuntu</a> and <a href="https://canonical.com/">Canonical</a> are registered trademarks of Canonical Ltd.</p>
        </div>
    </nav>
</footer>
