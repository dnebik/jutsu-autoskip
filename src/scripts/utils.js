export function insertScript(string, remove = true) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerText = string;
    document.body.insertAdjacentElement('afterbegin', script);
    if (remove) {
      setTimeout(() => {
        script.remove();
        resolve(script);
      }, 0);
    } else {
      resolve(script);
    }
  });
}

export function parsVars(string) {
  const innerJSON = string
    .replace(/var| |\r\n|\n|\r/gm, '')
    .split(';')
    .filter((v) => v.match(/.+=.+/))
    .map((v) => {
      const splited = v.split('=');
      const key = splited.shift();
      const value = splited.reduce((a, b) => a + b, '');
      return `"${key}":${value}`;
    })
    .join(',');
  return JSON.parse(`{${innerJSON}}`);
}

export const findEval = (str) => str
  .replace(/ /gm, '')
  .match(/Base64.*\)/gm)
  .map((s) => s
    .replace(/Base64.decode\("|\)|"/gm, ''));

export const getValueInString = (string, name) => string
  .replace(/ /gm, '')
  .match(new RegExp(`${name}=[^;]*;`))[0]
  .replace(`${name}=`, '')
  .replace(';', '')
  .replace(/"/g, '');

export function replaceEl(newDoc, selector) {
  const oldEl = document.querySelector(selector);
  const newEl = newDoc.querySelector(selector);
  if (oldEl && newEl) oldEl.parentNode.replaceChild(newEl, oldEl);
}
