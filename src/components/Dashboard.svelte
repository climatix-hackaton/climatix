<script lang="ts">
	import type { Region } from '@models/payload';
	import Polygon from '@components/Polygon.svelte';
	import Svg from '@components/common/Svg.svelte';
	import { kebabToPascalCase } from '$lib';

	export let dataDashboard: any;

	export let handleClose: () => void;
</script>


<div
  style="clip-path: polygon(0px 0px, 100% 0px, 100% 50%, 100% 100%, 20% 100%, 0px 95%);"
  class="bg-[#23607A] lg:h-screen h-[calc(100vh-5rem)] xl:absolute right-0"
>
  <div class="h-full w-full flex flex-col">
    <Svg
      on:click={handleClose}
      src="/icons/Xmark.svg"
      className="m-4 absolute cursor-pointer"
      color="white"
      size={8}
    />
    <Polygon className="right-0 m-4" />
    <Polygon className="bottom-0 lg:m-4 m-16" />
    <Polygon className="bottom-0 ml-48 lg:mb-0 mb-12" />
    <div
      class="h-8 relative mt-24 break-words font-poppins-regular text-3xl text-center w-full flex justify-center items-end before:-bottom-3 text-white before:absolute before:content-[''] before:w-24 before:h-1 before:bg-white"
    >
      <span class="break-words w-1/2">{kebabToPascalCase(dataDashboard.name)}</span>
    </div>

    <div class="mt-10">
      <ul class="mt-20 mx-12 flex flex-col gap-4 text-white font-poppins-regular text-xl">
        <li class="flex justify-between">
          <span>Healthy population</span>
          <span>{(100 - dataDashboard.percentDeath).toFixed(1)}%</span>
        </li>
        <li class="flex justify-between">
          <span>Infected rate</span>
          <span>{dataDashboard.percentInfected}%</span>
        </li>
        <li class="flex justify-between">
          <span>Infected rate</span>
          <span>{dataDashboard.percentDeath}%</span>
        </li>
      </ul>

      <div class="h-8 relative break-words font-poppins-regular text-3xl text-center w-full flex justify-center items-end before:-bottom-3 text-white before:absolute before:content-[''] before:w-24 before:h-1 before:bg-white"></div>

      <ul class="mt-20 mx-12 flex flex-col gap-4 text-white font-poppins-regular text-xl">
        <li class="flex gap-4 justify-between">
          <span>Total population</span>
          <span>{dataDashboard.population}</span>
        </li>
        <li class="flex justify-between">
          <span>Number of infected</span>
          <span>{dataDashboard.numberOfInfected}</span>
        </li>
        <li class="flex justify-between">
          <span>Number of deaths</span>
          <span>{dataDashboard.percentDeath === 100 ? dataDashboard.population : dataDashboard.numberOfDeath}</span>
        </li>
      </ul>

    </div>
  </div>

</div>