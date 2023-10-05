<script lang="ts">
	export let type: "submit" | "button" = "submit";
	export let className = "";
</script>

<button on:click {type} class="bg-[#0b4f6c] text-white font-poppins-bold py-2 rounded {className}">
  <slot />
</button>