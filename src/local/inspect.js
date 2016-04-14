
/**
 * Helper functions for doing reflection.
 */
export default class Inspect {

  /**
   * Check to see if the current code is running a browser versus running on a server.
   * @returns {Boolean} true if the current code is running in a browser, false otherwise.
   */
  static isBrowserContext() {
    return (typeof window !== 'undefined' && window);
  }

  /**
   * Check to see if the current code is running in a developer context.
   * @returns {Boolean} - true if the current code is running in a browser, false otherwise.
   */
  static isDevContext() {
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
}