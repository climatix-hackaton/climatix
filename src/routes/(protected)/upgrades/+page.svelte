<script lang="ts">
	import { user } from '@stores/user.store';
	import type { Upgrade } from '@prisma/client';
	import axios, { AxiosError } from 'axios';
	import { getBaseURL } from '$lib';
	import Cookies from 'js-cookie';
	import { COOKEYS } from '$lib/helpers/cookie.helper';
	import { goto } from '$app/navigation';

	const optimisticUpdate = (upgrade: Upgrade, type: 'down' | 'up') => {
		user.set({
			coins: type === 'up' ? $user?.coins! - upgrade.cost : $user?.coins! + upgrade.cost! / 1.5,
			name: $user?.name!,
			id: $user?.id!,
			email: $user?.email!
		});

		data.upgrades = data.upgrades.map((upgradeItem) => {
			if (upgradeItem.id === upgrade.id) {
				return {
					...upgradeItem,
					level: type === 'up' ? upgradeItem.level + 1 : upgradeItem.level - 1,
					cost: type === 'up' ? upgradeItem.cost * 1.5 : upgradeItem.cost / 1.5,
				};
			}
			return upgradeItem;
		});
	};


	const onUpgrade = (upgrade: Upgrade, type: 'up' | 'down') => {
		optimisticUpdate(upgrade, type);

		axios.put(`${getBaseURL()}/api/upgrades/`, {
			userId: $user?.id!,
			type: 'up',
			upgradeId: upgrade.id,
		}, {
			headers: {
				Authorization: Cookies.get(COOKEYS.JWT_TOKEN) ?? ''
			}
		}).catch((err: AxiosError) => {
			if (err.response?.status === 401) {
				Cookies.remove(COOKEYS.JWT_TOKEN);
				goto('/login');
			}
			optimisticUpdate(
				upgrade,
				type === 'up' ? 'down' : 'up'
			);
		}).then((res) => {
			Cookies.set(COOKEYS.JWT_TOKEN, res?.data?.data);
		});
	};
	export let data;

	$: numberOfCoins = $user?.coins!;
</script>

<div class="flex justify-center mt-4 ml-8 gap-2">
  <span class="text-primary text-3xl font-poppins-bold">{numberOfCoins}</span>
  <img
    src="/gold_coins.png"
    alt="argent-coins"
    class="w-10 h-10"
  />
</div>


<div class="flex justify-center items-center flex-col h-full gap-6">
  {#each data.upgrades as upgrade}
    <span class=" font-poppins-regular text-lg">{upgrade.name}</span>
    <div class="flex gap-8">
      <div class="flex gap-2">
        <button
          disabled={upgrade.level === 0 || upgrade.level === upgrade.maxLevel}
          on:click={() => onUpgrade(upgrade, "down")}
          class="w-8 h-8 border-2 text-center text-lg border-  rounded"
        >
          -
        </button>
        <ul class="ml-2 flex gap-2 list-none">
          {#each new Array(upgrade.maxLevel) as _, i}
            <li class="h-8 w-8 border-2 border- {upgrade.level > i && 'bg-red-600'}"></li>
          {/each}
          <button
            disabled={numberOfCoins < upgrade.cost || upgrade.level === upgrade.maxLevel}
            on:click={() => onUpgrade(upgrade, "up")}
            class="w-8 h-8 border-2 text-center text-lg rounded"
          >
            +
          </button>
        </ul>
      </div>

      <div class="flex gap-2">
    <span class="font-poppins-bold text-center text-lg rounded-full">
      {upgrade.cost}
    </span>
        <div class="w-8 h-8 border-2 text-center text-lg rounded-full">
          €
        </div>
      </div>
      <div>
      </div>
    </div>
  {/each}
</div>