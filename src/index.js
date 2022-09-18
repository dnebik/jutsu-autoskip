// import observePlayer from './scripts/observePlayer';
import { onLoaded } from './scripts/player';
import settings from './scripts/settings';

(async function fn() {
  try {
    settings.initSettings();
    await onLoaded();
    // console.log(player);
    // observePlayer(getPlayerDom());
  } catch (e) {
    console.error(e);
  }
}());
