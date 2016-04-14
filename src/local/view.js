import Page from './page';
import { Component, ComponentMetadata } from 'angular2/core';

/**
 * A view on the page.
 */
export default class View {

  /**
   * @constructor
   */
  constructor() {
    this.state = {};
    this.props = {};
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
   * Dispatch an action to the page store.
   * @param {Object} action - The action to dispatch.
   * @returns {void}
   */
  dispatch(action) {
    this.page.store.dispatch(action);
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
