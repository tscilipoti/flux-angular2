require('reflect-metadata');
import { enableProdMode, ApplicationRef } from 'angular2/core';
import { createStore } from 'redux';
import Inspect from './inspect';

// A singleton instance of Page.
let currentPage = null;

// set to true after angular2 has been initialized.
let ngInit = false;

/**
 * Abstract definition of a page.
 */
export default class Page {

  /**
   * Constructor.
   * @param {Object} [options] - Options for this page.
   * @param {String} [options.title] - The title for the page.
   * @param {String} [options.containerId] - The id of the container the page will be rendered into.  Default is page-body-content.
   * @param {Boolean} [options.isBrowserContext] - When set the value will override the normal check done to detrmine if the page is running in a browser.
   * @param {Boolean} [options.isDevContext] - When set the value will override the normal check done to determine if the page is running in a developer context.
   * @returns {void}
   */
  constructor(options) {
    currentPage = this;
    const opts = options || {};

    this.mIsInitialized = false;

    this.mTitle = opts.title || '';
    this.mIsBrowserContext = opts.isBrowserContext;
    this.mIsDevContext = opts.isDevContext;
  }

  /**
   * The single instance of the page when in a browser context.
   * This gets set when the load function is called.
   */
  static get current() {
    return currentPage;
  }

  /**
   * Get the dispatcher being used for this page.
   */
  get store() {
    return this.mStore;
  }

  /**
   * Get the view for this page.
   */
  get view() {
    return this.mView;
  }

  /**
   * Get the app for the page.
   */
  get app() {
    return this.mApp;
  }

  /**
   * Returns true if the page is running in the browser, false if it isn't.
   */
  get isBrowserContext() {
    if (this.mIsBrowserContext !== undefined) {
      return this.mIsBrowserContext;
    }
    return Inspect.isBrowserContext();
  }

  /**
   * Returns true if the page is running in developer context, false if it isn't.
   */
  get isDevContext() {
    if (this.mIsDevContext !== undefined) {
      return this.mIsDevContext;
    }
    return Inspect.isDevContext();
  }

  /**
   * Get the title for this page.
   */
  get title() {
    if (this.isBrowserContext) {
      return document.title;
    }
    return this.mTitle;
  }

  /**
   * The view to display on the page.
   * @returns {Object} undefined.
   */
  getView() {
    return undefined;
  }

  /**
   * Properties for the page.
   * @returns {Object} Empty object.
   */
  getProps() {
    return {};
  }

  /**
   * Set the title for this page.
   * @param {String} value - The value for the page title.
   * @returns {void}
   */
  set title(value) {
    if (this.isBrowserContext) {
      document.title = value;
    } else {
      this.mTitle = value;
    }
  }

  /**
   * Handle the given error.
   * @param {Error} err - The error to handle.
   * @returns {void}
   */
  handleError(err) {
    console.error(err.message);
    console.error(err.stack);
  }

  /**
   * This function is used by unit tests to manually initiate the change detection functions of angular2
   * in order for changes to be observed in the document when testing.
   * @returns {void}
   */
  tick() {
    if (this.app) {
      this.app.tick();
    }
  }

  /**
   * This should be called after the page is created and it's ready to be displayed.
   * @returns {Promise} A promise that resolves when the page is done loading.
   */
  load() {
    const self = this;
    if (!this.mIsInitialized) {
      this.mIsInitialized = true;
      if (!this.isDevContext && !ngInit) {
        enableProdMode();
        ngInit = true;
      }
      this.title = this.mTitle;
      const bootstrap = require('angular2/platform/browser').bootstrap;
      return bootstrap(this.getView()).then(function (compRef) {
        self.mView = compRef.instance;
        self.mApp = compRef.injector.get(ApplicationRef);
        self.initStore();
      });
    }
  }

  /**
   * Create and wire up the store.
   * @returns {void}
   */
  initStore() {
    if (this.mStoreUnsubscribe) {
      this.mStoreUnsubscribe();
    }
    this.mStore = createStore(this.storeReducer.bind(this));
    this.mStoreUnsubscribe = this.mStore.subscribe(this.storeListener.bind(this));
  }

  /**
   * Handles updates to the store.
   * @param {Object} state - The previous state.
   * @param {Object} action - The action to perform.
   * @returns {Object} The new state.
   */
  storeReducer(state, action) {
    try {
      if (action.type === '@@redux/INIT') {
        return (!this.view || !this.view.initialState) ? {} : this.view.initialState();
      }
      if (!this.view || !this.view.reduce) {
        return state;
      }
      return this.view.reduce(state, action);
    } catch (err) {
      this.handleError(err);
      return state;
    }
  }

  /**
   * Notify view that the store has been changed.
   * @returns {void}
   */
  storeListener() {
    if (this.view && this.view.storeChanged) {
      this.view.storeChanged();
    }
  }
}
