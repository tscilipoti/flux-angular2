import Page from './page';
import Reflect from './reflect';
import { Component } from 'angular2/core';

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
      if (Reflect.isFunction(value)) {
        this.props = value.apply(this.page) || {};
      } else {
        this.props = value || {};
      }
    } else {
      this.props = {};
    }
  }

  /**
   * Build out annotations.
   * @param {Object} classType - The class type to annotate.
   * @returns {Array} - An array of annotations.
   */
  static annotate(classType) {
    if (classType.__annotationsCache) {
      return classType.__annotationsCache;
    }

    const input = {};
    if (classType.getSelector) {
      input.selector = classType.getSelector();
    }
    if (classType.getTemplate) {
      input.template = classType.getTemplate();
    }
    if (classType.getDirectives) {
      input.directives = classType.getDirectives();
    }
    if (classType.getInputs) {
      input.inputs = classType.getInputs();
    }
    if (classType.getParameters) {
      classType.parameters = classType.getParameters();
    }

    const result = [new Component(input)];
    classType.__annotationsCache = result;

    return result;
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
