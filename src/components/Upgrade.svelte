<script lang="ts">
	type Upgrade = {
		name: string
		cost: number
		maxLevel: number
		currentLevel: number
	}

	export let upgrade: Upgrade;
	export let numberOfCoins: number = 1000;

	const onUpgrade = () => {
		numberOfCoins -= upgrade.cost;
		upgrade.cost *= 1.5;
		upgrade.currentLevel += 1;
	};
</script>


<div class="m-4">
  <span class="text-white font-poppins-regular text-lg">{upgrade.name}</span>
  <div class="flex gap-8">
    <div class="flex gap-2">
      <button
        disabled={upgrade.currentLevel >= upgrade.maxLevel || numberOfCoins < upgrade.cost}
        on:click={onUpgrade}
        class="w-8 h-8 border-2 text-center text-lg border-white text-white rounded"
      >
        +
      </button>
      <ul class="ml-2 flex gap-2 list-none">
        {#each new Array(upgrade.maxLevel) as _, i}
          <li class="h-8 w-8 border-2 border-white {upgrade.currentLevel > i && 'bg-red-600'}"></li>
        {/each}

      </ul>
    </div>

    <div class="flex gap-2 ml-auto">
    <span class="font-poppins-bold text-center text-lg border-white text-white rounded-full">
      {upgrade.cost}
    </span>
      <div class="w-8 h-8 border-2 text-center text-lg border-white text-white rounded-full">
        €
      </div>
    </div>
    <div>
    </div>
  </div>
</div>