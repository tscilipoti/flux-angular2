import View from './view';

/**
 * A view on the page.
 */
class ControllerView extends View {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.mStores = [];
    this.mChangeHandler = this.handleStoreChange.bind(this);
  }

  /**
   * Called when a store has been changed.
   * @returns {void}
   */
  handleStoreChange() {
  }

  /**
   * Add a store to the view for tracking.
   * @param {Store} store - The store to add.
   * @returns {void}
   */
  addStore(store) {
    for (let index = 0; index < this.mStores.length; index++) {
      if (this.mStores[index] === store) {
        return;
      }
    }

    this.mStores.push(store);
  }

  /**
   * Remove the given store from being tracked.
   * @param {Store} store - The store to remove.
   * @returns {void}
   */
  removeStore(store) {
    for (let index = 0; index < this.mStores.length; index++) {
      if (this.mStores[index] === store) {
        store.offChange(this.mChangeHandler);
        this.mStores.splice(index, 1);
        return;
      }
    }
  }

  /**
   * Remove all of the stores being tracked.
   * @returns {void}
   */
  removeAllStores() {
    for (let index = 0; index < this.mStores.length; index++) {
      this.mStores[index].offChange(this.mChangeHandler);
    }
    this.mStores = [];
  }

  /**
   * Attach listeners for stores.
   * @returns {void}
   */
  ngOnInit() {
    super.ngOnInit();
    for (let index = 0; index < this.mStores.length; index++) {
      this.mStores[index].onChange(this.mChangeHandler);
    }
  }

  /**
   * Dettach listeners for stores.
   * @returns {void}
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    for (let index = 0; index < this.mStores.length; index++) {
      this.mStores[index].offChange(this.mChangeHandler);
    }
  }
}

export default ControllerView;
