import overlay from './overlay';
import { insertScript } from './utils';

const dataLoaded = 'data-player-loaded';

export function getPlayer() {
  return document.querySelector('div.video-js');
}

export function setSource(obj) {
  return insertScript(`player.src(${JSON.stringify(obj)});`);
}

export function setOverlay() {
  return insertScript(overlay);
}

export function reset() {
  return insertScript('player.reset();');
}

export function play() {
  return insertScript('player.play();');
}

export function skipIntro() {
  return insertScript('skip_video_intro();');
}

export function markAsViewed() {
  return insertScript(`
    const prev_view_file = 'previously_viewed.php';
    const cur_p_time = 0;
    $.get(dle_root + 'engine/ajax/' + prev_view_file + '?the_login_hash=' + the_login_hash + '&pview_id=' + pview_id + '&pview_category=' + pview_category + '&pview_id_seconds=' + cur_p_time + '&mark_as_viewed=yes&mark_as_restart=yes');
  `);
}

export function onLoaded() {
  return new Promise((resolve, reject) => {
    const vidBlock = document.querySelector('#my-player');
    if (!vidBlock) {
      reject(new Error('not video page'));
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.body.getAttribute(dataLoaded)) {
        observer.disconnect();
        resolve(getPlayer());
      }
    });
    observer.observe(document.body, { attributes: true });

    insertScript(`
      const setMark = () => document.body.setAttribute('${dataLoaded}', 'loaded');
      (function fn() {
        if (!player || (!player.isReady_)) {
          console.log('not ready');
          setTimeout(() => fn(), 50);
        } else {
          console.log('not ready');
          setMark();
        }
      }());
   `);
  });
}
