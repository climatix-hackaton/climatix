<script lang="ts">
	import "@styles/app.css";
	import Navbar from '@components/Navbar.svelte';
	import { page } from '$app/stores';

	$: isAuthPage = $page.url.pathname === "/login" || $page.url.pathname === "/register";
</script>

{#if !isAuthPage}
  <Navbar />
{/if}

<slot />