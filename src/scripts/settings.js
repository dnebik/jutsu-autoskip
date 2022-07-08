// eslint-disable-next-line
import main from '../styles/main.scss';

let autoIntroSkip = window.localStorage.getItem('autoIntroSkip') === 'true';
let autoSeriesSkip = window.localStorage.getItem('autoSeriesSkip') === 'true';
const switcherClass = 'achiv_switcher_in';

const createSwitcher = (label, id, checked) => {
  const block = document.createElement('div');
  block.classList.add(switcherClass);
  block.classList.add(`${switcherClass}--${id}`);
  block.innerHTML = `
    ${label}<div class="mchat_wrap_out" style="display: inline-block; top: -1.7em; right: 15px; ">
    <div class="mchat_wrap">
        <input type="checkbox" id="${id}" ${checked ? 'checked="checked"' : ''}>
        <label class="mchat_slider-v2" for="${id}" style="background: transparent; box-shadow: none; box-sizing: content-box; border-color: transparent; "></label>
        </div></div>
    </div>
  `;
  return block;
};
const createTopLine = (dom) => {
  const block = document.createElement('div');
  block.classList.add('top_player_line');
  block.innerHTML = '<div class="achiv_switcher"></div>';
  dom.insertAdjacentElement('afterbegin', block);
  return block;
};

const changeIntroSkip = (value) => {
  autoIntroSkip = value;
  window.localStorage.setItem('autoIntroSkip', value);
};
const changeSeriesSkip = (value) => {
  autoSeriesSkip = value;
  window.localStorage.setItem('autoSeriesSkip', value);
};

export default {
  get autoIntroSkip() { return autoIntroSkip; },
  get autoSeriesSkip() { return autoSeriesSkip; },
  initSettings() {
    const isIntroScipExist = document.querySelector(`.${switcherClass}--intro_skip`);
    const postMedia = document.querySelector('.post_media');
    if (!postMedia || isIntroScipExist) return;

    const plusSettings = document.querySelector('.plus_settings');
    let topLine = document.querySelector('.top_player_line');
    if (!topLine) topLine = createTopLine(postMedia);

    const line = topLine.querySelector('.achiv_switcher');
    const introSwitcher = createSwitcher('Пропускать интро', 'intro_skip', autoIntroSkip);
    const seriesSwitcher = createSwitcher('Переключать серии', 'series_skip', autoSeriesSkip);
    introSwitcher.querySelector('input').onchange = (e) => changeIntroSkip(e.target.checked);
    seriesSwitcher.querySelector('input').onchange = (e) => changeSeriesSkip(e.target.checked);

    function makeWrapper() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('achiv_switcher_wrapper');
      line.insertAdjacentElement('beforeend', wrapper);
      line.classList.add('wrapped');
      return wrapper;
    }
    function inject(position) {
      position.insertAdjacentElement('beforeend', introSwitcher);
      position.insertAdjacentElement('beforeend', seriesSwitcher);
    }

    inject(plusSettings ? makeWrapper() : line);
  },
};
