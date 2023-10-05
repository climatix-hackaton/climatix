<script lang="ts">
	import Svg from '@components/common/Svg.svelte';
	import { goto } from '$app/navigation';
</script>

<Svg
  size={8}
  className="m-4 rotate-180 cursor-pointer absolute z-20"
  on:click={() => goto("/")}
  src="/icons/Arrow.svg"
/>

<slot />