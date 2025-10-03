<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getSelfBody } from "src/tools/arch";
  import { Radar } from "./radar";

  let container: HTMLDivElement;
  let radar: Radar;

  let player: Body = getSelfBody();
  let coords = "";
  let coordsHandler: number;

  const updateCoords = () => {
    coords = `(${player.px.toFixed(2)}, ${player.py.toFixed(2)}, ${player.pz.toFixed(2)})`;
  };
  onMount(async () => {
    radar = new Radar(container);
    radar.mount();
    coordsHandler = setInterval(() => {
      updateCoords();
    }, 50);
  });

  onDestroy(() => {
    radar.destroy();
    clearInterval(coordsHandler);
  });
</script>

<div id="radar-container">
  {#if player}
    <div bind:this={container} id="radar"></div>
    <div id="coordinates">
      {coords}
    </div>
  {/if}
</div>

<style lang="scss">
  #radar {
    position: absolute;
    left: 0;
    width: 200px;
    height: 200px;
    z-index: 998;
    top: 0;
  }

  #radar-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 998;
  }

  #coordinates {
    position: absolute;
    top: 205px;
    font-size: medium;
    z-index: 998;
    color: white;
  }
</style>
