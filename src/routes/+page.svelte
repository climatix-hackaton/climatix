<script lang="ts">
	import SecondaryButton from '@components/common/SecondaryButton.svelte';
	import PrimaryButton from '@components/common/PrimaryButton.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="flex justify-center items-center h-full flex-col gap-6">
  <span class="text-3xl text-secondary text-center font-poppins-bold">Climatix</span>
  <div class="w-5/12 lg:w-3/12">
    <PrimaryButton
      on:click={() => goto('/play')}
      className="w-[95%] mx-auto mt-2 font-bold"
    >
      Play
    </PrimaryButton>
    <SecondaryButton
      on:click={() => goto('/upgrades')}
      className="w-[95%] mx-auto mt-2 font-bold"
    >
      Upgrade
    </SecondaryButton>
  </div>
</div>