import Page from './page';
import Inspect from './inspect';
import { Component, ComponentMetadata } from 'angular2/core';

/**
 * A view on the page.
 */
class View {

  /**
   * @constructor
   */
  constructor() {
    this.state = {};

    // set properties which may come from the page
    const ptype = Object.getPrototypeOf(this);
    if (ptype && ptype.constructor) {
      let value = null;
      if (this.page && this.page.props) {
        value = this.page.props[ptype.constructor];
      }
      if (Inspect.isFunction(value)) {
        this.props = value.apply(this.page) || {};
      } else {
        this.props = value || {};
      }
    } else {
      this.props = {};
    }
  }

  setState(value) {
    this.state = value;
  }

  getState() {
    return this.state;
  }

  setProps(value) {
    this.props = value;
  }

  getProps() {
    return this.props;
  }

  /**
   * Shortcut to get the angular2 Component class.
   */
  static get Component() {
    return Component;
  }

  /**
   * Get the selector for the given component.
   * @param {Object} component - The component to get the selector from.
   * @returns {string} The selector for the given component or null if one isn't found.
   */
  static getSelector(component) {
    // use reflect
    if (typeof Reflect !== 'undefined') {
      const annotations = Reflect.getOwnMetadata('annotations', component);
      if (annotations && annotations.length) {
        for (let i = 0; i < annotations.length; i++) {
          if (annotations[i].constructor === ComponentMetadata) {
            return annotations[i].selector;
          }
        }
      }
    }

    // fall back if reflect isn't defined
    if (!component ||
        !component.prototype ||
        !component.prototype.constructor ||
        !component.prototype.constructor.annotations ||
        !component.prototype.constructor.annotations.length) {
      return null;
    }
    for (let i = 0; i < component.prototype.constructor.annotations.length; i++) {
      const item = component.prototype.constructor.annotations[i];
      if (item && item.constructor && item.constructor === ComponentMetadata) {
        return item.selector;
      }
    }
    return null;
  }

  /**
   * Get the page associated with this view.
   */
  get page() {
    return Page.current;
  }

  /**
   * Call the init function.
   * @returns {void}
   */
  ngOnInit() {
    this.onInit();
  }

  /**
   * Called when the view is being initialized.
   * @returns {void}
   */
  onInit() {
  }

  /**
   * Call the destroy function.
   * @returns {void}
   */
  ngOnDestroy() {
    this.onDestroy();
  }

  /**
   * Called when the view is being destroyed.
   * @returns {void}
   */
  onDestroy() {
  }
}

export default View;
