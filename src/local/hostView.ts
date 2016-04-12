import View from './view';
import Page from './page';
import { Inject, ApplicationRef, Component } from 'angular2/core';

/**
 * Class used to load root level components.
 */
class HostView {
  /**
   * Generate annotations at run time.
   * @returns {Array} The annotations for this component.
   */
  static get annotations() {
    return [new Component({
      selector: 'HostView',
      template: HostView.getTemplate(),
      directives: HostView.getDirectives()
    })];
  }

  /**
   * The template for the view.
   */
  static getTemplate() {
    return (`<div id="content"></div>`);
  }

  /**
   * The directives for the view.
   */
  static getDirectives() {
    return undefined;
  }

  /**
   * @constructor
   * @param {ApplicationRef} app - The dependency injected application reference.
   */
  constructor(@Inject(ApplicationRef) app) {
    Page.current.setApplicationRef(app);
  }
}

export default HostView;
