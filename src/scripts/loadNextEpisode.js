import axios from 'axios';
import { insertScript, replaceEl } from './utils';
import {
  markAsViewed,
  play, reset, setOverlay, setSource,
} from './player';

const initScriptsRegExp = new RegExp(/eval/);

export default function loadNextEpisode() {
  return new Promise((resolve, reject) => {
    const nextButton = document.querySelector('.there_is_link_to_next_episode');
    if (!nextButton) reject(new Error('this episode is last'));

    // URL make
    const url = new URL(window.location.toString());
    url.pathname = nextButton.getAttribute('href');
    window.history.pushState({}, null, url.toString());

    // Load page with new series
    axios.get(url.toString()).then(async (response) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(response.data, 'text/html');
      const newVideo = html.querySelector('video');

      // Mark as this episode viewed
      await markAsViewed();

      // HTML data replace
      replaceEl(html, 'h1.header_video');
      replaceEl(html, '.all_anime_title');
      replaceEl(html, '.v_epi_nav');
      replaceEl(html, '.logo_b wrapper');
      replaceEl(html, 'title');
      // END HTML data replace

      // Insert init scripts
      const htmlScripts = html.querySelectorAll('script');
      const initScriptsInner = [];
      htmlScripts.forEach((script) => {
        if (script.innerText.search(initScriptsRegExp) > -1) {
          initScriptsInner.push(script.innerText.replaceAll(' ', ''));
        }
      });
      if (initScriptsInner) {
        await Promise.all([
          initScriptsInner.map((text) => insertScript(text)),
        ]);
      }
      // END Insert init scripts

      // Player settings
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
      // END Player settings

      resolve();
    });
  });
}
