<script lang="ts">
	import '@styles/app.css';
	import Navbar from '@components/Navbar.svelte';
	import { page } from '$app/stores';

	const hideNavbar = [
		'/play',
		'/upgrades',
		'/login',
		'/register'
	];

	$: needToShowNavbar = hideNavbar.includes($page.url.pathname);
</script>

{#if !needToShowNavbar}
  <Navbar />
{/if}

<slot />