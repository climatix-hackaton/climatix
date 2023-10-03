<script lang="ts">
	export let data;

	let numberOfCoins = 10;

	const prices = []

	const onUpgradeUp = (name: string, cost: number) => {
		if (cost > numberOfCoins) return;

	};

	const onUpgradeDown = (name: string, cost: number) => {

	};

	$: console.log(data)

</script>

<p class="text-red-500">{numberOfCoins}</p>

<div class="flex justify-center items-center flex-col h-full gap-6">
  {#each data.upgrades as upgrade}
    <p>{upgrade.name}</p>
    <div class="flex gap-4">
      <button class="{upgrade.cost >= numberOfCoins ? 'cursor-not-allowed': 'cursor-pointer'}" on:click={() => onUpgradeDown(upgrade.name, upgrade.cost)}>
        -
      </button>
      <p>{upgrade.level}</p>
      <button class="{upgrade.cost >= numberOfCoins ? 'cursor-not-allowed': 'cursor-pointer'}" on:click={() => onUpgradeUp(upgrade.name, upgrade.cost)}>
        +
      </button>
    </div>
  {/each}
</div>