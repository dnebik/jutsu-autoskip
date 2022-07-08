import observePlayer from './scripts/observePlayer';
import { onLoaded } from './scripts/player';
import settings from './scripts/settings';

console.log('test');
window.addEventListener('DOMContentLoaded', async () => {
  settings.initSettings();
  try {
    const player = await onLoaded();
    observePlayer(player);
  } catch (e) {
    console.error(e);
  }
});
