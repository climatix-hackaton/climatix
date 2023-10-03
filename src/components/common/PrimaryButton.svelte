<script lang="ts">
	export let type: "submit" | "button" = "submit";
	export let className = "";
</script>

<button {type} class="bg-primary text-white font-poppins-bold py-2 rounded {className}">
  <slot />
</button>