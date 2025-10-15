<script lang="ts">
  import {funcList} from "./functionList";
</script>

<main>
  <div class="func-container">
    {#each funcList as func}
      <div class="func-entry">{func}</div>
    {/each}
  </div>
</main>

<style>
  .func-container {
    position: absolute;
    right: 0;
    bottom: 0;
    text-align: right;
    z-index: 997;
  }
</style>
