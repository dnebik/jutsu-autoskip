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

export function onLoaded() {
  return new Promise((resolve, reject) => {
    const vidBlock = document.querySelector('#my-player');
    console.log(vidBlock);
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
      (function fn() {
        if (!player) {
          setTimeout(() => fn(), 50);
        } else {
          document.body.setAttribute('${dataLoaded}', 'loaded');
        }
      }());
   `);
  });
}
