import observePlayer from './scripts/observePlayer';
import { onLoaded } from './scripts/player';
import settings from './scripts/settings';

(async function fn() {
  try {
    settings.initSettings();
    const player = await onLoaded();
    observePlayer(player);
  } catch (e) {
    console.error(e);
  }
}());
