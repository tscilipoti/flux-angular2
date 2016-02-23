import View from './view';
import Page from './page';
import { DynamicComponentLoader, ElementRef, ApplicationRef } from 'angular2/core';

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
    return [DynamicComponentLoader, ElementRef, ApplicationRef];
  }

  /**
   * @constructor
   * @param {DynamicComponentLoader} dcl - The dependency injected dynamic component loader.
   * @param {ElementRef} element - The dependency injected element reference.
   * @param {ApplicationRef} app - The dependency injected application reference.
   */
  constructor(dcl, element, app) {
    this.dcl = dcl;
    this.element = element;
    this.app = app;
    this.emptyView.getTemplate = function () { return ''; };
    this.emptyView.annotations = View.annotate(this.emptyView);
  }

  /**
   * Used as an empty view.
   * @returns {void}
   */
  emptyView() {
  }

  /**
   * Load the component when this view is initialized.
   * @returns {void}
   */
  ngOnInit() {
    const self = this;
    this.dcl.loadIntoLocation(this.emptyView, this.element, 'content')
            .then(function (compRef) {
              Page.current.setComponentRef(compRef);
              Page.current.setApplicationRef(self.app);
            });
  }
}

export default HostView;
