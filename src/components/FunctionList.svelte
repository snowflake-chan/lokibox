<script lang="ts">
  const funcList: string[] = [];
  export function switchFunc(name: string) {
    if (funcList.includes(name)) {
      funcList.push(name);
    } else {
      funcList.splice(funcList.indexOf(name), 1);
    }
  }
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
  }
</style>
