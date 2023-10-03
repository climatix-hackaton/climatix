<script lang="ts">
	export let type: "submit" | "button" = "submit";
	export let className = "";
</script>

<button {type} class="border-primary border-2 text-black font-poppins-bold py-2 rounded {className}">
  <slot />
</button>