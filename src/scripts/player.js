import axios from 'axios';
import overlay from './overlay';
import { insertScript } from './utils';

const JAS_CONNECT_NAME = 'JAS_connected';
const JAS_NO_PLAYER_NAME = 'JAS_no_player';
const JAS_ID_IMAGE = 'jas-inserter';
let player = null;
let skipper = null;
let loginHash = null;

const eventInserter = () => document.body.insertAdjacentHTML('beforeend', `<img id="${JAS_ID_IMAGE}" src="x" onerror="document.dispatchEvent(window.player && window.skip_video_intro ? new CustomEvent('${JAS_CONNECT_NAME}', { detail: { player: window.player, skip: window.skip_video_intro, loginHash: window.the_login_hash } }) : new CustomEvent('${JAS_NO_PLAYER_NAME}'));">`);

export function getPlayer() {
  return player;
}
export function getPlayerDom() {
  return document.querySelector('div.video-js');
}

export function setSource(obj) {
  return player.src(JSON.stringify(obj));
}

export function setOverlay() {
  return insertScript(overlay);
}

export function reset() {
  return player.reset();
}

export function play() {
  return player.play();
}

export function skipIntro() {
  return skipper();
}

export async function markAsViewed() {
  await axios.get(`/engine/ajax/previously_viewed.php?the_login_hash=${loginHash}&pview_id=${pview_id}&pview_category=${pview_category}&pview_id_seconds=${player.currentTime()}&mark_as_viewed=yes&mark_as_restart=yes`);
}

export function onLoaded() {
  return new Promise((resolve, reject) => {
    const vidBlock = document.querySelector('#my-player');
    if (!vidBlock) {
      reject(new Error('not video page'));
      return;
    }

    const playerEventPromise = new Promise((r) => {
      const connectHandler = (e) => {
        document.querySelector(`#${JAS_ID_IMAGE}`)?.remove();
        document.removeEventListener(JAS_CONNECT_NAME, connectHandler);
        document.removeEventListener(JAS_NO_PLAYER_NAME, connectHandler);
        r(e.detail);
      };
      const noConnect = () => {
        document.querySelector(`#${JAS_ID_IMAGE}`)?.remove();
        setTimeout(() => eventInserter(), 300);
      };

      document.addEventListener(JAS_CONNECT_NAME, connectHandler);
      document.addEventListener(JAS_NO_PLAYER_NAME, noConnect);
    });

    eventInserter();
    playerEventPromise.then((result) => {
      player = result.player;
      skipper = result.skip;
      loginHash = result.the_login_hash;
      resolve(player);
    });
  });
}
