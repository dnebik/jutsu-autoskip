let autoIntroSkip = window.localStorage.getItem('autoIntroSkip') === 'true';
let autoSeriesSkip = window.localStorage.getItem('autoSeriesSkip') === 'true';

const createSwitcher = (label, id, checked) => {
  const block = document.createElement('div');
  block.classList.add('achiv_switcher_in');
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
    const topLine = document.querySelector('.top_player_line');
    if (topLine) {
      require('../styles/settings.scss');

      const line = topLine.querySelector('.achiv_switcher');
      const introSwitcher = createSwitcher('Пропускать интро', 'intro_skip', autoIntroSkip);
      const seriesSwitcher = createSwitcher('Переключать серии', 'series_skip', autoSeriesSkip);
      introSwitcher.querySelector('input').onchange = (e) => changeIntroSkip(e.target.checked);
      seriesSwitcher.querySelector('input').onchange = (e) => changeSeriesSkip(e.target.checked);
      line.insertAdjacentElement('beforeend', introSwitcher);
      line.insertAdjacentElement('beforeend', seriesSwitcher);
    }
  },
};
