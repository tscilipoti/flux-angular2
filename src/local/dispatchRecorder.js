/**
 * This class is used to keep track of dispatches until a page store is created.
 */
export default class DispatchRecorder {
  /**
   * @constructor
   */
  constructor() {
    this.mStore = [];
  }

  /**
   * Record the dispatch action for later replay.
   * @param {Object} action - The action to record.
   * @return {void}
   */
  dispatch(action) {
    this.mStore.push(action);
  }

  /**
   * Replay all of the recorded actions against the store.
   * @param {Store} store - The redux store to dispatch recorded actions to.
   * @return {void}
   */
  replay(store) {
    this.mStore.forEach(action => {
      store.dispatch(action);
    });
    this.mStore = [];
  }

  /**
   * Always returns an empty object.
   * @returns {Object} Empty object.
   */
  getState() {
    return {};
  }
}
