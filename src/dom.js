/**
 * This piece of magic is based on: https://github.com/mmomtchev/ol-ssr
 */

import { performance } from 'perf_hooks';
import jsdom, { JSDOM } from 'jsdom';

const resourceLoader = new jsdom.ResourceLoader();
export const window = new JSDOM('', { resources: resourceLoader }).window;
export const document = window.document;

// Monkey Path DOM
(() => {
  URL.createObjectURL = () => null;

  const _ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.document.createElement = ((orig) => {
    return function createElement(el, tags) {
        return orig.call(this, el, tags);
    };
  })(window.document.createElement);

  window.Node.prototype.appendChild = ((orig) => {
    return function appendChild(newChild) {
        return orig.call(this, newChild);
    };
  })(window.Node.prototype.appendChild);
  
  window.getComputedStyle = ((orig) => {
    return function getComputedStyle(elt, pseudoElt) {
        const style = orig.call(this, elt, pseudoElt);
        for (const p of [
            'borderLeftWidth',
            'paddingLeft',
            'paddingRight',
            'borderRightWidth',
            'borderTopWidth',
            'paddingTop',
            'paddingBottom',
            'borderBottomWidth'
        ])
            if (!style[p]) style[p] = '0px';
        return style;
    };
  })(window.getComputedStyle);

  window.requestAnimationFrame = (fn) => {
    const hr = performance.now();
    return setTimeout(() => fn(hr), 0);
  };

  window.cancelAnimationFrame = (id) => clearTimeout(id);

  Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
    get: function offsetHeight() {
      if (this.style.height && this.style.height.match(/^[0-9]+px/))
        return parseInt(this.style.height);
      return 0;
    }
  });
  Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
    get: function offsetWidth() {
      if (this.style.width && this.style.width.match(/^[0-9]+px/))
        return parseInt(this.style.width);
      return 0;
    }
  });

  if (!Object.getOwnPropertyDescriptor(global, 'window'))
    Object.defineProperty(global, 'window', { value: window });
  if (!Object.getOwnPropertyDescriptor(global, 'document'))
    Object.defineProperty(global, 'document', { value: window.document });
  if (!Object.getOwnPropertyDescriptor(global, 'ResizeObserver'))
    Object.defineProperty(global, 'ResizeObserver', { value: _ResizeObserver });
  if (!Object.getOwnPropertyDescriptor(global, 'ShadowRoot'))
    Object.defineProperty(global, 'ShadowRoot', { value: Object });
  if (!Object.getOwnPropertyDescriptor(global, 'getComputedStyle'))
    Object.defineProperty(global, 'getComputedStyle', { value: window.getComputedStyle });
  if (!Object.getOwnPropertyDescriptor(global, 'requestAnimationFrame'))
    Object.defineProperty(global, 'requestAnimationFrame', { value: window.requestAnimationFrame });
  if (!Object.getOwnPropertyDescriptor(global, 'cancelAnimationFrame'))
    Object.defineProperty(global, 'cancelAnimationFrame', { value: window.cancelAnimationFrame });
  if (!Object.getOwnPropertyDescriptor(global, 'Blob'))
    Object.defineProperty(global, 'Blob', { value: Object });
  if (!Object.getOwnPropertyDescriptor(global, 'Image'))
    Object.defineProperty(global, 'Image', { value: window.Image });
  if (!Object.getOwnPropertyDescriptor(global, 'FileReader'))
    Object.defineProperty(global, 'FileReader', { value: window.FileReader });
  if (!Object.getOwnPropertyDescriptor(global, 'DOMParser'))
    Object.defineProperty(global, 'DOMParser', { value: window.DOMParser });
  if (!Object.getOwnPropertyDescriptor(global, 'Node'))
    Object.defineProperty(global, 'Node', { value: window.Node });

  // Override all remaing properties.
  for (const p of Object.keys(Object.getOwnPropertyDescriptors(window)).filter(p => p.startsWith('HTML')))
    if (!Object.getOwnPropertyDescriptor(global, p))
      Object.defineProperty(global, p, { value: window[p] });

})();
