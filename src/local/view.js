import Page from './page';
import { Component, ComponentMetadata, EventEmitter } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

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
  static get component() {
    return Component;
  }

  /**
   * Shortcut to get the angular2 RouteConfig class.
   */
  static get routeConfig() {
    return RouteConfig;
  }

  /**
   * Shortcut to get the angular2 ROUTER_DIRECTIVES object.
   */
  static get routerDirectives() {
    return ROUTER_DIRECTIVES;
  }

  /**
   * Shortcut to get the event emitter class.
   */
  static get EventEmitter() {
    return EventEmitter;
  }

  /**
   * Get the selector for the given component.
   * @param {Object} comp - The component to get the selector from.
   * @returns {string} The selector for the given component or null if one isn't found.
   */
  static getSelector(comp) {
    // use reflect
    if (typeof Reflect !== 'undefined') {
      const annotations = Reflect.getOwnMetadata('annotations', comp);
      if (annotations && annotations.length) {
        for (let i = 0; i < annotations.length; i++) {
          if (annotations[i].constructor === ComponentMetadata) {
            return annotations[i].selector;
          }
        }
      }
    }

    // fall back if reflect isn't defined
    if (!comp ||
        !comp.prototype ||
        !comp.prototype.constructor ||
        !comp.prototype.constructor.annotations ||
        !comp.prototype.constructor.annotations.length) {
      return null;
    }
    for (let i = 0; i < comp.prototype.constructor.annotations.length; i++) {
      const item = comp.prototype.constructor.annotations[i];
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
