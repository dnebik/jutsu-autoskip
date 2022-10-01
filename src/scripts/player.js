import axios from 'axios';
import Base64 from 'base-64';
import {
  findEval, getValueInString, parsVars,
} from './utils';

const JAS_CONNECT_NAME = 'JAS_connected';
const JAS_NO_PLAYER_NAME = 'JAS_no_player';
const JAS_ID_IMAGE = 'jas-inserter';
let player = null;
let skipper = null;
let loginHash = null;
let vars = null;

function decodeUtf8(s) {
  return decodeURIComponent(escape(s));
}

const eventInserter = () => document.body.insertAdjacentHTML('beforeend', `<img id="${JAS_ID_IMAGE}" src="x" onerror="document.dispatchEvent(window.player && window.skip_video_intro ? new CustomEvent('${JAS_CONNECT_NAME}', { detail: { player: window.player, prot: window.player.__proto__, skip: window.skip_video_intro, loginHash: window.the_login_hash } }) : new CustomEvent('${JAS_NO_PLAYER_NAME}'));">`);
// const playEvent = () => document.body.insertAdjacentHTML('beforeend', '<img src="x" onerror="window.player.play">');
// const overlayEvent = (params) => document.body.insertAdjacentHTML('beforeend', `<img src="x" onerror="() => window.player.overlay(${JSON.stringify(params).replace(/"/g, "'")})">`);

const parseAnimeAchievements = (string, url) => string
  .replace(/\r\n|\n|\r/g, '')
  .match(/{[^{]*}/gm)
  .map((block) => block.replace(/\{|\}/g, ''))
  .map((block) => {
    let str = '';
    let i = 0;
    let scape = false;
    while (i < block.length) {
      if (block[i] === '"') scape = !scape;
      if (!(block[i] === ' ' && !scape)) str += block[i];
      i++;
    }

    return str
      .replace(/js_preres_url\+"/g, `"${url}`)
      .split(',')
      .map((prop) => {
        const split = prop.split(/:(.*)/);
        return `"${split[0]}":${split[1]}`;
      })
      .join(',');
  })
  .map((block) => JSON.parse(`{${block}}`));

const parseAchievementsIcons = (string, url) => string
  .replace(/ |\r\n|\n|\r/g, '')
  .match(/this_anime_achievements_icons=\[[^\]]*]/)[0]
  .replace('this_anime_achievements_icons=', '')
  .replace(/\+|"|\[|\]/g, '')
  .replace(/js_preres_url/g, url)
  .split(',');

export const getVars = () => vars;
export const getPlayer = () => player;
export const getPlayerDom = () => document.querySelector('div.video-js');

export function setSource(obj) {
  return player.src(JSON.stringify(obj));
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
  await axios.get(`/engine/ajax/previously_viewed.php?the_login_hash=${loginHash}&pview_id=${vars.pview_id}&pview_category=${vars.pview_category}&pview_id_seconds=${player.currentTime()}&mark_as_viewed=yes&mark_as_restart=yes`);
}

export function setVarsFromHtml(string) {
  vars = Object.fromEntries(
    findEval(string)
      .map((s) => Base64.decode(s))
      .map(parsVars)
      .map(Object.entries)
      .flat(),
  );
  vars.pview_id = getValueInString(string, 'pview_id');
  vars.js_preres_url = getValueInString(string, 'js_preres_url');
  console.log(vars);
}

function preloadImagesArray(images) {
  images.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });
}

export function setOverlay() {
  const videoOverlayArray = [];

  if (vars.some_achiv_str) {
    const someAchivStr = decodeUtf8(Base64.decode(vars.some_achiv_str));
    const animeAchievements = parseAnimeAchievements(someAchivStr, vars.js_preres_url);
    const animeAchievementsIcons = parseAchievementsIcons(someAchivStr, vars.js_preres_url);

    if (animeAchievements.length > 0) {
      preloadImagesArray(animeAchievementsIcons);
      animeAchievements.forEach((achHr) => {
        videoOverlayArray.push({
          content: `
            <div class="achievement_full_length achievement_main_full">
              <div class="achievement_full_length achievement_main_base">
                <div class="achievement_text_style">
                  <div class="achievement_text_style_top">&laquo;${achHr.title}&raquo;</div>
                  <div class="achievement_text_style_bottom">${achHr.description}</div>
                </div>
              </div>
              <div class="achievement_main_blink"></div>
              <div class="achievement_full_length achievement_main_glow"></div>
              <div class="achievement_badge_icon" style="background: url('${achHr.icon}') no-repeat; background-size: cover;"></div>
              <div class="achievement_main_badge_frame"></div>
            </div>
          `,
          start: achHr.time_start,
          end: achHr.time_end + 1,
          align: 'bottom',
          class: 'vjs-overlay-nobg achievement_vjs_margin',
          only_once: true,
          is_showed: false,
          dont_hide: true,
          achiv_id: achHr.id,
          achiv_hash: achHr.hash,
        });
      });
    }
  }

  if (vars.video_intro_end) {
    videoOverlayArray.push({
      content: 'Пропустить заставку',
      start: Number(vars.video_intro_start) === 0 ? vars.video_intro_start + 0.3 : vars.video_intro_start,
      end: Number(vars.video_intro_start) + 15,
      end2: 'change_video_src',
      align: 'bottom-left',
      class: 'vjs-overlay-skip-intro',
      the_function: 'skip_video_intro',
      title: 'Нажмите, если лень смотреть опенинг',
    });
  }

  if (vars.video_outro_start && vars.next_episode_link) {
    videoOverlayArray.push({
      content: 'Следующая серия',
      start: vars.video_outro_start,
      end: Number(vars.video_outro_start) + 20,
      end2: 'change_video_src',
      align: 'bottom-right',
      class: 'vjs-overlay-skip-intro',
      the_function: 'video_go_next_episode',
      title: 'Перейти к следующему эпизоду',
    });
  }

  if (vars.next_episode_link && vars.this_video_duration) {
    const videoOutroRealStart = Number(vars.this_video_duration) - 5;
    if (videoOutroRealStart > 10 && ((vars.video_outro_start_end && videoOutroRealStart - 10 > vars.video_outro_start_end) || vars.video_outro_start_end)) {
      videoOverlayArray.push({
        content: 'Следующая серия',
        start: videoOutroRealStart,
        end: Number(vars.this_video_duration) + 5,
        end2: 'change_video_src',
        align: 'bottom-right',
        class: 'vjs-overlay-skip-intro',
        the_function: 'video_go_next_episode',
        title: 'Перейти к следующему эпизоду',
      });
    }
  }

  // console.log(videoOverlayArray);

  if (videoOverlayArray.length > 0) {
    player.overlay({
      content: 'Default overlay content',
      debug: false,
      overlays: videoOverlayArray,
    });
  }
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
      console.log(result.skip_video_intro);
      setVarsFromHtml(document.body.innerHTML);
      player = result.player;
      skipper = result.skip;
      loginHash = result.the_login_hash;
      setOverlay();
      resolve(player);
    });
  });
}
