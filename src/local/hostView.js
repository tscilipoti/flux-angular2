import View from './view';
import Page from './page';
import { DynamicComponentLoader, ElementRef } from 'angular2/core';

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
    return [DynamicComponentLoader, ElementRef];
  }

  /**
   * @constructor
   * @param {DynamicComponentLoader} dcl - The dependency injected dynamic component loader.
   * @param {ElementRef} element - The dependency injected element reference.
   */
  constructor(dcl, element) {
    this.dcl = dcl;
    this.element = element;
    this.emptyView.getTemplate = function () { return ''; };
    this.emptyView.annotations = View.annotate(this.emptyView);
  }

  emptyView() {
  }

  /**
   * Load the component when this view is initialized.
   * @returns {void}
   */
  ngOnInit() {
    this.dcl.loadIntoLocation(this.emptyView, this.element, 'content')
            .then((compRef) => { Page.current.setComponentRef(compRef); });
  }
}

export default HostView;
