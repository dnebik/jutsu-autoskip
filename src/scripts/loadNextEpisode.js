import axios from 'axios';
import { insertScript, replaceEl } from './utils';
import {
  play, reset, setOverlay, setSource,
} from './player';

const match = window.location.pathname.match(/\d+\.html/)[0];
const startEpisode = +match.replace('.html', '');

let currentEpisode = startEpisode;
const initScriptRegExp = new RegExp(/view_id = /);

export default function loadNextEpisode() {
  return new Promise((resolve, reject) => {
    const hasNext = document.querySelector('.there_is_link_to_next_episode');
    if (!hasNext) reject(new Error('this episode is last'));

    const nextEpisodePath = window.location.pathname.replace(`${currentEpisode}.html`, `${++currentEpisode}.html`);

    const url = new URL(window.location.toString());
    url.pathname = nextEpisodePath;
    window.history.pushState({}, null, url.toString());

    axios.get(url.toString()).then(async (response) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(response.data, 'text/html');
      const newVideo = html.querySelector('video');

      replaceEl(html, 'h1.header_video');
      replaceEl(html, '.all_anime_title');
      replaceEl(html, '.v_epi_nav');
      replaceEl(html, '.logo_b wrapper');

      const htmlScripts = html.querySelectorAll('script');
      let initScriptInner;
      htmlScripts.forEach((script) => {
        if (script.innerText.search(initScriptRegExp) > -1) initScriptInner = script.innerText;
      });
      if (initScriptInner) await insertScript(initScriptInner);

      await reset();

      const sources = [];
      newVideo.querySelectorAll('source').forEach((source) => {
        const object = {};
        const attrs = source.attributes;
        for (let i = 0; i < attrs.length; i++) object[attrs[i].name] = attrs[i].value;
        sources.push(object);
      });
      await setSource(sources);

      await setOverlay();
      await play();

      resolve();
    });
  });
}
