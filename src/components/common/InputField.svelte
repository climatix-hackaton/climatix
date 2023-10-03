<script lang="ts">
	export let title: string;
	export let value = '';

	export let name = '';
	export let placeholder = '';
</script>

<fieldset class="flex gap-1 flex-col">
  <p class="font-poppins-regular mt-2">{title}</p>
  <input
    {name}
    {placeholder}
    class="p-2 border-primary border-2 rounded text-primary w-full"
    bind:value
    type="text"
  />
</fieldset>