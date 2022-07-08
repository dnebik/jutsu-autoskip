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

export function replaceEl(newDoc, selector) {
  const oldEl = document.querySelector(selector);
  const newEl = newDoc.querySelector(selector);
  if (oldEl && newEl) oldEl.parentNode.replaceChild(newEl, oldEl);
}
