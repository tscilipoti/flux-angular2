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
  }
  /**
   * Set the initial state.
   * @return {void}
   */
  ngOnInit() {
    this.state = this.initialState();
    super.ngOnInit();
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
   * Called by the page when the state has been changed.
   * @return {void}
   */
  stateChanged() {
  }
}
