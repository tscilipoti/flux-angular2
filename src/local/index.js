import AppView from './appView';
import Page from './page';
import Reducer from './reducer';
import View from './view';

/**
 * Holds references of all of the public classes in the package.
 */
export default class FluxBase {

  /**
   * Get the AppView class.
   */
  static get AppView() {
    return AppView;
  }

  /**
   * Get the Page class.
   */
  static get Page() {
    return Page;
  }

  /**
   * Get the Reducer class.
   */
  static get Reducer() {
    return Reducer;
  }

  /**
   * Get the View class.
   */
  static get View() {
    return View;
  }
}
