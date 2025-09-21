import Menu from "src/components/Menu.svelte";
import { deployKillAura, clearKillAura } from "src/functions/killaura";

export function bind(menu: Menu) {
  const killauraFolder = menu.addFolder("KillAura");
  
  const controls = {
    deploy: deployKillAura,
    clear: clearKillAura
  };

  killauraFolder.add(controls, 'deploy').name("Deploy");
  killauraFolder.add(controls, 'clear').name("Clear");
}
