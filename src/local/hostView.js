import View from './view';
import Page from './page';
import { ApplicationRef } from 'angular2/core';

/**
 * Class used to load root level components.
 */
class HostView {

  /**
   * Define the view.
   */
  static get annotations() {
    return View.annotate(HostView);
  }

  /**
   * Define the selector.
   * @returns {String} - The selector for this view.
   */
  static getSelector() {
    return 'HostView';
  }

  /**
   * The template for this view.
   * @returns {String} - The template for this view.
   */
  static getTemplate() {
    return '<div #content></div>';
  }

  /**
   * Define dependencies.
   * @returns {Array} - The dependencies for this view.
   */
  static getParameters() {
    return [ApplicationRef];
  }

  /**
   * @constructor
   * @param {ApplicationRef} app - The dependency injected application reference.
   */
  constructor(app) {
    Page.current.setApplicationRef(app);
  }
}

export default HostView;
