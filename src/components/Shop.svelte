<script lang="ts">
	import Svg from '@components/common/Svg.svelte';
	import Upgrade from '@components/Upgrade.svelte';

	export let numberOfCoins: number;

	let rotate = '0';
	const onShopClick = () => {
		rotate = rotate === '0' ? '180' : '0';
	};


</script>

{#if rotate === "180"}
  <div class="absolute bottom-20 bg-[#23607B] h-72 w-fit rounded-tr-2xl rounded-br-2xl">
    <Upgrade
      bind:numberOfCoins
      upgrade={{name: "Propagation", cost: 20, maxLevel: 4, currentLevel: 0}}
    />
    <Upgrade
      bind:numberOfCoins
      upgrade={{name: "Disease", cost: 25, maxLevel: 3, currentLevel: 0}}
    />
    <Upgrade
      bind:numberOfCoins
      upgrade={{name: "Mortality", cost: 35, maxLevel: 1, currentLevel: 0}}
    />
  </div>
{/if}

<div class="fixed lg:w-[20%] w-full rounded-tr-2xl rounded-br-2xl h-20 left-0 bottom-0 bg-[#0B4F6D]">
  <div class="my-auto h-full flex items-center ml-8 gap-2">
    <span class="text-white text-3xl font-poppins-bold">{numberOfCoins}</span>
    <img
      src="/argent_coins.png"
      alt="argent-coins"
      class="w-10 h-10"
    />
    <Svg
      on:click={onShopClick}
      src="/icons/ChevronDown.svg"
      className="ml-auto mr-8 cursor-pointer transition-all ease-in rotate-{rotate}"
      color="white"
      size={8}
    />
  </div>

</div>
