import observePlayer from './observePlayer';
import { onLoaded } from './player';
import settings from './settings';

window.addEventListener('DOMContentLoaded', async () => {
  settings.initSettings();
  try {
    const player = await onLoaded();
    observePlayer(player);
  } catch (e) {
    console.error(e);
  }
});
