import View from './view';

/**
 * A view on the page.
 */
export default class AppView extends View {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.props = this.page.getProps();
    this.state = this.initialState();
  }

  /**
   * Override this function in sub classes to handle specific actions.
   * @param {Object} state - The previous state.
   * @returns {Object} The previous state.
   */
  reduce(state) {
    return state;
  }

  /**
   * Get the initial state.
   * @returns {Object} An empty object.
   */
  initialState() {
    return {};
  }

  /**
   * Called from Page when this is the root level component and the store has been changed.
   * Override this function in sub classes with necessary logic.
   * @returns {void}
   */
  storeChanged() {
  }

  /**
   * Get the page state.
   * @returns {Object} The state from the page.
   */
  get storeState() {
    if (this.page.store) {
      return this.page.store.getState();
    }
    return this.reduce(undefined, { type: null });
  }
}