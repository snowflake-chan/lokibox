<script lang="ts">
  import GUI from "lil-gui";
  import { onMount } from "svelte";

  const { title } = $props<{ title: string }>();

  let menu: HTMLElement | undefined;
  let gui: GUI | undefined;

  let isDragging = false;
  let startX: number, startY: number;
  let initialLeft: number, initialTop: number;
  let isClick: boolean;

  onMount(() => {
    gui = new GUI({ container: menu });
    gui.title(title);

    setupDrag();

    return () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
      gui?.destroy();
    };
  });

  function setupDrag() {
    if (!menu || !gui) return;

    gui.$title.draggable = true;
    gui.$title.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    const originalFunc = gui.openAnimated;
    gui.openAnimated = function (open?: boolean) {
      if (isClick) {
        return originalFunc.call(gui, open);
      }
      return this;
    };
  }

  function startDrag(e: MouseEvent) {
    if (!menu) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = menu.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    e.preventDefault();
    menu.style.cursor = "grabbing";
  }

  function drag(e: MouseEvent) {
    if (!isDragging || !menu) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    menu.style.left = `${initialLeft + dx}px`;
    menu.style.top = `${initialTop + dy}px`;
  }

  function stopDrag(e: MouseEvent) {
    isDragging = false;
    if (menu) {
      menu.style.cursor = "grab";
    }
    const distX = startX - e.clientX;
    const distY = startY - e.clientY;
    const dist = distX * distX + distY * distY;
    isClick = dist < 5;
  }

  export function add(...args: Parameters<GUI["add"]>) {
    return gui!.add(...args);
  }
  export function addFolder(...args: Parameters<GUI["addFolder"]>) {
    return gui!.addFolder(...args);
  }
  export function getFolders() {
    return gui!.folders ?? [];
  }
</script>

<main>
  <div class="menu" bind:this={menu}></div>
</main>

<style lang="scss">
  .menu {
    position: absolute;
    left: 20px;
    top: 20px;
    border-radius: 8px;
    overflow: hidden;
    transition:
      box-shadow 0.3s ease,
      width 0.3s ease,
      height 0.3s ease;
    &:hover {
      box-shadow: 0 0 10px 1px aqua;
    }
  }
</style>
