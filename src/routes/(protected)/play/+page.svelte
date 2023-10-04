<script lang="ts">
	import Svg from '@components/common/Svg.svelte';
	import { onMount } from 'svelte';
	let here: any

  onMount(() => {
		setTimeout(() => {
			const test = [...document.getElementsByTagName('svg')[1].children]
      console.log(test)
			test.forEach((path) => {
				path.addEventListener('click', (e) => {
					console.log(e.target)
				})
      })
    }, 200)
  })
</script>

<div class="flex justify-center">
  <Svg size={192} src="/regions/france.svg" />
</div>

