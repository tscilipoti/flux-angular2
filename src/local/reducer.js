import Inspect from './inspect';
import Page from './page';

/**
 * Base class for stores.
 */
export default class Reducer {

  /**
   * @constructor
   * @param {Object} opts - Options for this class.
   * @param {Object} opts.initialState - The initial state for the class.
   */
  constructor(opts = {}) {
    this.mInitialState = opts.initialState || {};
    this.initActionRouter();
  }

  /**
   * Get the page associated with this reducer.
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
   * Execute action against the state.
   * @param {Object} state - The previous state.
   * @param {Object} action - The action to perform.
   * @returns {Object} The new state.
   */
  reduce(state, action) {
    if (state === undefined) {
      return this.initialState();
    }
    return this.handleAction(state, action);
  }

  /**
   * Return the initial state.  Override this to provide custom initial states.
   * @returns {Object} An empty object.
   */
  initialState() {
    return this.mInitialState;
  }

  /**
   * Reflect the class and record functions that actions should be routed to.
   * @returns {void}
   */
  initActionRouter() {
    // get all of the functions defined on the prototype
    const propNames = Inspect.getPropertyNames(
      Object.getPrototypeOf(this),
      Reducer.prototype
    );

    this.actionRoutes = {};
    for (let propIndex = 0; propIndex < propNames.length; propIndex++) {
      // collect all property names that begin with the text 'action'
      const propName = propNames[propIndex];
      if (Inspect.isFunction(this[propName]) && propName.length > 6 && propName.indexOf('action') === 0) {
        const action = propName[6].toLowerCase() + propName.slice(7).replace(/[.]/g, '_');
        this.actionRoutes[action] = propName;
      }
    }
  }

  /**
   * This is called when an action occurs.
   * @param {Object} state - The previous state.
   * @param {Object} action - The details about the action that has occured.
   * @returns {Object} - The result from calling the action handler.
   */
  handleAction(state, action) {
    const route = this.actionRoutes[action.type];
    if (route) {
      return this[route].apply(this, [state, action]);
    }
    return state;
  }
}
