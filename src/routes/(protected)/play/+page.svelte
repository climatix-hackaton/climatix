<script lang="ts">
	import Svg from '@components/common/Svg.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import type { Element } from 'svelte/types/compiler/interfaces';
	import { getLevelsOfUpgrades, hasDynamicPercentageChance, simulateInfection } from '$lib';
	import Shop from '@components/Shop.svelte';
	import { regions } from '../../../data/region.json';
	import { neighborsRegions } from '../../../data/neighbor.json';
	import { ChanceOfSpreadToAdjacentRegions, Infectiousness, Mortality, MosquitoesResistColderTemperatures } from '../../../data/upgrade.json';
	import type { Region } from '@models/payload';
	import SecondaryButton from '@components/common/SecondaryButton.svelte';
	import { INPUT } from '$lib/helpers/form.helper';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;


	type InfectiousnessKeys = keyof typeof Infectiousness
	type MortalityKeys = keyof typeof Mortality
	type ChanceOfSpreadToAdjacentRegionsKeys = keyof typeof ChanceOfSpreadToAdjacentRegions
	type MosquitoesResistColderTemperaturesKeys = keyof typeof MosquitoesResistColderTemperatures

	type neighborsRegionsKeys = keyof typeof neighborsRegions

	const infectiousnessLevel = getLevelsOfUpgrades(
		data.upgrades,
		'Infectiousness'
	) as InfectiousnessKeys;

	const mortalityLevel = getLevelsOfUpgrades(
		data.upgrades,
		'Mortality'
	) as MortalityKeys;

	const chanceOfSpreadToAdjacentRegionsLevel = getLevelsOfUpgrades(
		data.upgrades,
		'Chance of spread to adjacent regions'
	) as ChanceOfSpreadToAdjacentRegionsKeys;

	const mosquitoesResistColderTemperaturesLevel = getLevelsOfUpgrades(
		data.upgrades,
		'Mosquitoes resist colder temperatures'
	) as MosquitoesResistColderTemperaturesKeys;

	const infectiousness = Infectiousness[infectiousnessLevel];
	const mortality = Mortality[mortalityLevel];
	const chanceOfSpread = ChanceOfSpreadToAdjacentRegions[chanceOfSpreadToAdjacentRegionsLevel];
	const resitance = MosquitoesResistColderTemperatures[mosquitoesResistColderTemperaturesLevel];

	let dataRegions: Region[] = [...regions] as unknown as Region[];
	let dataRegion: Region | null = null;
	let haveInfectedFirstRegions = false;

	const regionsAt50PercentDeath: string[] = [];
	const deadRegions: string[] = [];

	let numberOfCoins = 0;

	let interval: any = null;
	let seconds = 0;
	let minutes = 0;

	$: minutes = Math.floor(seconds / 60);

	const handleSubmit: SubmitFunction = () => {
		return async ({ result,  }) => {
			await applyAction(result);
		};
	};

	onMount(() => {
		interval = setInterval(() => {
			if (!haveInfectedFirstRegions) return;

			seconds += 1;
			if (seconds === 3600) {
				seconds = 0;
			}

			if (seconds % 20 === 0) {
				numberOfCoins += 1;
			}
		}, 1000);

		const tick = () => {
			if (!haveInfectedFirstRegions) {
				return;
			}

			for (const [idx, region] of dataRegions.entries()) {
				if (region.numberOfInfected === 0) {
					continue;
				}

				const newInfectedPerson = simulateInfection(
					region.population - region.numberOfInfected - region.numberOfDeath,
					infectiousness.efficiency
				);

				const newDeathPerson = simulateInfection(
					region.numberOfInfected,
					mortality.efficiency
				);

				const percentInfected = +((dataRegions[idx].numberOfInfected / region.population) * 100).toFixed(
					1);
				const percentDeath = +((dataRegions[idx].numberOfDeath / region.population) * 100).toFixed(
					1);

				let opacity = '';
				if (+percentDeath <= 9.9) {
					opacity = `0.0${percentDeath.toString()
						.split('.')[0]}`;
				} else {
					opacity = `0.${percentDeath.toString()
						.split('.')[0]}`;
				}

				if (opacity === '0.100') {
					opacity = '1';
				}

				if (percentDeath > 5) {
					const neighbors = neighborsRegions[region.name as neighborsRegionsKeys].neighbors;

					for (const neighbor of neighbors) {
						const neighborIdx = dataRegions.findIndex(
							(region) => region.name === neighbor
						)!;

						const neighborRegion = dataRegions[neighborIdx];

						if (neighborRegion.numberOfInfected > 0) continue;

						if (hasDynamicPercentageChance(
							chanceOfSpread.efficiency)) {
							dataRegions[neighborIdx].numberOfInfected = 1;
							break;
						}

					}
				}

				if (percentDeath > 50 && !regionsAt50PercentDeath.includes(
					region.name)) {
					numberOfCoins += 3;
					regionsAt50PercentDeath.push(region.name);
				}

				if (percentDeath == 100 && !deadRegions.includes(
					region.name)) {
					numberOfCoins += 5;
					deadRegions.push(region.name);
				}

				dataRegions[idx] = {
					...dataRegions[idx],
					numberOfInfected: percentDeath !== 100 ? (newInfectedPerson + dataRegions[idx].numberOfInfected) : 0,
					numberOfDeath: newDeathPerson + dataRegions[idx].numberOfDeath,
					opacity: opacity,
					percentDeath,
					percentInfected
				};

				dataRegions[idx].numberOfInfected -= newDeathPerson;

				const group = document.querySelector(
					`g[data-region='${dataRegions[idx].name}']`)!;
				(group.children[1] as any).style.opacity = opacity;


				if (dataRegion?.name === region.name) {
					dataRegion = dataRegions[idx];
				}

			}

			requestAnimationFrame(tick);
		};


		setTimeout(() => {
			const franceSVG = [...document.getElementsByTagName(
				'svg')[1].children] as unknown as Element[];

			franceSVG.forEach((group) => {
				group.addEventListener('click', (e: Element) => {
					const regionName = e.target.getAttribute(
						'data-region')!;

					const idx = dataRegions.findIndex(
						(region) => region.name === regionName)!;

					if (!haveInfectedFirstRegions) {
						dataRegions[idx].numberOfInfected = 1;
						haveInfectedFirstRegions = true;
						tick();
					}

					dataRegion = dataRegions[idx];
				});
			});

		}, 200);
	});

	let finish = false;
	$: {
		const isFinish = dataRegions.map(
				(region) => region.percentDeath === 100)
			.every((region) => region === true);
		if (isFinish) {
			finish = true;
			clearInterval(interval);
		}
	}

	onDestroy(() => {
		clearInterval(interval);
	});

	let earnedCoins = 0;

	$: if (finish) {
		switch (minutes) {
			case 0:
				earnedCoins = 50;
				break;
			case 1:
				earnedCoins = 40;
				break;
			case 2:
				earnedCoins = 30;
				break;
			case 3:
				earnedCoins = 20;
				break;
			case 4:
				earnedCoins = 10;
				break;
			default:
				earnedCoins = 5;
				break;
		}
	}
</script>

{#if finish}
  <div class="z-20 bg-black/90 absolute w-screen h-screen flex justify-center items-center">
    <div class="md:w-[25%] h-2/6 w-3/4 border-primary border-4 flex gap-2 flex-col justify-between">

      <div class="flex items-center flex-col text-secondary text-2xl mt-4 gap-4">
        You win !!
        <div class="font-bold">
          {minutes < 10 ? `0${minutes}` : minutes}
          : {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
        </div>
        <Svg
          className="flex justify-center rotate-90"
          size={8}
          src="/icons/Arrow.svg"
          color="#0b4f6c"
        />
        <div>
          You earned
          <span class="font-bold">{earnedCoins}</span> coins
        </div>
      </div>
      <form
        enctype="multipart/form-data"
        use:enhance={handleSubmit}
        method="POST"
        action="?/earnCoins"
        class="flex justify-center mb-4"
      >
        <SecondaryButton
          className="p-4 text-white"
        >
          Back to menu
        </SecondaryButton>
        <input
          value={earnedCoins}
          name={INPUT.COINS}
          hidden
        >
      </form>
    </div>
  </div>
{/if}

<div class="absolute flex items-center w-full gap-4 flex-col">
  <div class="bg-primary p-4 rounded-br-2xl rounded-bl-2xl text-white font-poppins-regular text-xl">
    {minutes < 10 ? `0${minutes}` : minutes}
    :
    {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
  </div>
  {#if !haveInfectedFirstRegions}
    <div class="rounded-br-2xl font-poppins-regular text-xl">
      Please infect your first region !
    </div>
  {/if}
</div>

<div class="flex justify-between h-screen">
  <Svg
    size={192}
    className="m-auto"
    src="/france.svg"
  />

  {#if dataRegion}
    <Dashboard
      handleClose={() => dataRegion = null}
      dataDashboard={dataRegion}
    />
  {/if}
</div>

<Shop bind:numberOfCoins />



