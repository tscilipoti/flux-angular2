let isDev = null;
let isBrowser = null;

/**
 * Helper functions for doing reflection.
 */
export default class Inspect {

  /**
   * Check to see if the current code is running a browser versus running on a server.
   * @returns {Boolean} true if the current code is running in a browser, false otherwise.
   */
  static isBrowserContext() {
    if (isBrowser !== null) {
      return isBrowser;
    }
    return (typeof window !== 'undefined' && window);
  }

  /**
   * Set if in browser context.
   * @param {Boolean} isBrowserContext - The value that will be returned from the isBrowserContext function.
   * @return {void}
   */
  static setBrowserContext(isBrowserContext) {
    isBrowser = isBrowserContext;
  }

  /**
   * Check to see if the current code is running in a developer context.
   * @returns {Boolean} - true if the current code is running in a browser, false otherwise.
   */
  static isDevContext() {
    if (isDev !== null) {
      return isDev;
    }

    if (!document || !document.URL) {
      return false;
    }

    const parts = document.URL.split(/[#?]/);
    if (parts.length > 0) {
      const subParts = parts[0].split('/');
      if (subParts.length > 0 && subParts[subParts.length - 1].indexOf('.dev.') !== -1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Set if in developer context.
   * @param {Boolean} isDevContext - The value that will be returned from the isDevContext function.
   * @return {void}
   */
  static setDevContext(isDevContext) {
    isDev = isDevContext;
  }

  /**
   * Check to see if the given value is a function.
   * @param {Any} value The value to check.
   * @returns {Boolean} true is returned if the value is a function, false if it is not.
   */
  static isFunction(value) {
    return (typeof value === 'function');
  }

  /**
   * Get all of the property names starting on the startPrototype and working up to the endPrototype.
   * @param {Prototype} startPrototype The prototype to start collecting property names from.
   * @param {Prototype} [endPrototype] A prototype that startPrototype inherits from either directly or indirectly.
   *                                   If not set then only the property names on the startPrototype will be returned.
   * @returns {Array} The property names defined on the prototypes.
   */
  static getPropertyNames(startPrototype, endPrototype) {
    if (!endPrototype || (startPrototype && startPrototype === endPrototype)) {
      return Object.getOwnPropertyNames(startPrototype);
    }

    let ptype = startPrototype;
    let isEnd = false;
    const result = [];

    while (ptype && !isEnd) {
      isEnd = (ptype === endPrototype);
      Array.prototype.push.apply(result, Object.getOwnPropertyNames(ptype));
      ptype = Object.getPrototypeOf(ptype);
    }

    return result;
  }

  /**
   * Creates a shallow clone of the source object.
   * @param {Object} source - The source to clone from.
   * @param {Object} values - Optional values to included in the cloned copy.
   * @return {Object} The clone of the given object.
   */
  static clone(source, values) {
    const result = {};
    if (source) {
      for (const propName in source) {
        if (source.hasOwnProperty(propName)) {
          result[propName] = source[propName];
        }
      }
    }
    if (values) {
      for (const propName in values) {
        if (values.hasOwnProperty(propName)) {
          result[propName] = values[propName];
        }
      }
    }
    return result;
  }
}
