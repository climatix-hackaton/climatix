<script lang="ts">
	export let type: "submit" | "button" = "submit";
	export let className = "";
</script>

<button on:click {type} class="border-secondary border-2 text-black font-poppins-bold py-2 rounded {className}">
  <slot />
</button>