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

const eventInserter = () => document.body.insertAdjacentHTML('beforeend', `<img id="${JAS_ID_IMAGE}" src="x" onerror="document.dispatchEvent(window.player && window.skip_video_intro ? new CustomEvent('${JAS_CONNECT_NAME}', { detail: { player: window.player, skip: window.skip_video_intro, loginHash: window.the_login_hash } }) : new CustomEvent('${JAS_NO_PLAYER_NAME}'));">`);
const parseAnimeAchievements = (string) => string.match(/{[^{]*}/gm).map(JSON.parse);

export const getVars = () => vars;
export const getPlayer = () => player;
export const getPlayerDom = () => document.querySelector('div.video-js');

export function setSource(obj) {
  return player.src(JSON.stringify(obj));
}

export function setOverlay() {
  // return insertScript(overlay);
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

function setOverlay () {
  const videoOverlayArray = [];

  if (vars.some_achiv_str) {
    const someAchivStr = Base64.decode(vars.some_achiv_str);
    const animeAchievements = parseAnimeAchievements(someAchivStr);
    // TODO продолжить тут
    if (typeof (animeAchievements) != 'undefined' && animeAchievements.length > 0) {
      achievement_audio = new Audio();
      achievement_audio.src = js_preres_url + '/templates/school/images/achiv/achievement_sound_silent2.mp3';
      achievement_audio.load();
      document.fonts.load('16px FRQuadrata');
      if (typeof (this_anime_achievements_icons) != 'undefined' && this_anime_achievements_icons.length > 0) preload_images_array(this_anime_achievements_icons);
      var rindex_a;
      for (rindex_a = 0; rindex_a < animeAchievements.length; ++rindex_a) {
        var ach_hr = animeAchievements[rindex_a];
        ach_hr.time_end = ach_hr.time_start + 1;
        videoOverlayArray.push({
          content: '<div class="achievement_full_length achievement_main_full">\n' + '\n' + '                <div class="achievement_full_length achievement_main_base">\n' + '                    <div class="achievement_text_style">\n' + '                        <div class="achievement_text_style_top">&laquo;' + ach_hr.title + '&raquo;</div>\n' + '                        <div class="achievement_text_style_bottom">' + ach_hr.description + '</div>\n' + '                    </div>\n' + '                </div>\n' + '\n' + '                <div class="achievement_main_blink"></div>\n' + '                <div class="achievement_full_length achievement_main_glow"></div>\n' + '                <div class="achievement_badge_icon" style="background: url(\'' + ach_hr.icon + '\') no-repeat; background-size: cover;"></div>\n' + '                <div class="achievement_main_badge_frame"></div>\n' + '            </div>',
          start: ach_hr.time_start,
          end: ach_hr.time_end,
          align: 'bottom',
          class : 'vjs-overlay-nobg achievement_vjs_margin',
          only_once: true,
          is_showed: false,
          dont_hide: true,
          achiv_id: ach_hr.id,
          achiv_hash: ach_hr.hash
        });
      }
    }
  }

  if (typeof (video_intro_end) != 'undefined') {
    var video_intro_start_end = parseInt(video_intro_start) + 15;
    if (parseInt(video_intro_start) == 0) video_intro_start = parseFloat(video_intro_start) + 0.3;
    var video_intro_object = {
      content: 'Пропустить заставку',
      start: video_intro_start,
      end: video_intro_start_end,
      end2: 'change_video_src',
      align: 'bottom-left',
      class : 'vjs-overlay-skip-intro',
      the_function: 'skip_video_intro',
      title: 'Нажмите, если лень смотреть опенинг'
    };
    videoOverlayArray.push(video_intro_object);
  }
  if (typeof (video_outro_start) != 'undefined') {
    var video_outro_start_end = parseInt(video_outro_start) + 20;
    if (js_isset(next_episode_link)) {
      var video_outro_object = {
        content: 'Следующая серия',
        start: video_outro_start,
        end: video_outro_start_end,
        end2: 'change_video_src',
        align: 'bottom-right',
        class : 'vjs-overlay-skip-intro',
        the_function: 'video_go_next_episode',
        title: 'Перейти к следующему эпизоду'
      };
      videoOverlayArray.push(video_outro_object);
    }
  }
  if (js_isset(next_episode_link) && typeof (this_video_duration) != 'undefined') {
    var video_outro_real_start = parseInt(this_video_duration) - 5;
    if (video_outro_real_start > 10 && ((typeof (video_outro_start_end) != 'undefined' && video_outro_real_start - 10 > video_outro_start_end) || typeof (video_outro_start_end) == 'undefined')) {
      var video_outro_real_start_end = video_outro_real_start + 10;
      var video_real_outro_object = {
        content: 'Следующая серия',
        start: video_outro_real_start,
        end: video_outro_real_start_end,
        end2: 'change_video_src',
        align: 'bottom-right',
        class : 'vjs-overlay-skip-intro',
        the_function: 'video_go_next_episode',
        title: 'Перейти к следующему эпизоду'
      };
      videoOverlayArray.push(video_real_outro_object);
    }
  }
  if (videoOverlayArray.length > 0) {
    player.overlay({
      content: 'Default overlay content',
      debug: false,
      overlays: videoOverlayArray
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
      setVarsFromHtml(document.body.innerHTML);
      player = result.player;
      skipper = result.skip;
      loginHash = result.the_login_hash;
      resolve(player);
    });
  });
}
