import loadNextEpisode from './loadNextEpisode';
import settings from './settings';
import { skipIntro } from './player';

let observer;
let skipped = false;
let next = false;

function refreshStates() {
  skipped = false;
  next = false;
}

function playerChanged(e) {
  e.forEach((event) => {
    const { target } = event;
    if (target.classList.contains('vjs-overlay') && !target.classList.contains('vjs-hidden')) {
      // SKIP INTRO
      if (target.innerHTML === 'Пропустить заставку') {
        if (settings.autoIntroSkip && !skipped) {
          skipped = true;
          skipIntro().catch();
        }
      }

      // NEXT EPISODE
      if (target.innerHTML === 'Следующая серия') {
        if (settings.autoSeriesSkip && !next) {
          next = true;
          loadNextEpisode()
            .then(() => refreshStates())
            .catch();
        }
      }
    }
  });
}

export default function observePlayer(player) {
  if (observer) observer.disconnect();
  if (!player) return;

  refreshStates();

  observer = new MutationObserver(playerChanged);
  observer.observe(player, { childList: true, attributes: true, subtree: true });
}
