<script lang="ts">
  import { funcStore } from "src/functions/funcStatus";
</script>

<main>
  <div class="func-container">
    {#each $funcStore as func}
      <div class="func-entry">{func}</div>
    {/each}
  </div>
</main>

<style lang="scss">
  .func-container {
    position: absolute;
    bottom: 80px;
    right: 0;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    z-index: 1000;
  }

  .func-entry {
    text-align: right;
    background: linear-gradient(
      90deg,
      #ff0000,
      #ff8000,
      #ffff00,
      #00ff00,
      #00ffff,
      #0000ff,
      #ff00ff,
      #ff0000
    );
    background-size: 200% 100%; /* 双倍宽度用于动画 */
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: bold;
    font-size: 1em;
    animation: rainbowFlow 4s ease-in-out infinite alternate;
  }

  @keyframes rainbowFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
</style>
