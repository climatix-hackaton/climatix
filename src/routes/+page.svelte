<script lang="ts">
	import SecondayButton from '@components/common/SecondayButton.svelte';
	import PrimaryButton from '@components/common/PrimaryButton.svelte';
</script>

<div class="flex justify-center items-center h-screen flex-col gap-6">
  <span class="text-3xl text-secondary text-center font-poppins-bold">Climatix</span>
  <div class="w-5/12 lg:w-3/12">
    <PrimaryButton
      type="submit"
      className="w-[95%] mx-auto mt-2 font-bold"
    >
      Play
    </PrimaryButton>
    <SecondayButton
      type="submit"
      className="w-[95%] mx-auto mt-2 font-bold"
    >
      Upgrade
    </SecondayButton>
  </div>
</div>