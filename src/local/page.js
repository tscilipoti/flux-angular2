require('reflect-metadata');
import { enableProdMode, ApplicationRef } from 'angular2/core';
import { createStore } from 'redux';
import Inspect from './inspect';
import * as FakeStorage from 'fake-storage';

// A singleton instance of Page.
let currentPage = null;

// set to true after angular2 has been initialized.
let ngInit = false;

// holds storages
const pageSessionStorage = (typeof window !== 'undefined' && window.sessionStorage) ? window.sessionStorage : new FakeStorage();
const pageLocalStorage = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : new FakeStorage();

/**
 * Abstract definition of a page.
 */
export default class Page {

  /**
   * Constructor.
   * @param {Object} [options] - Options for this page.
   * @param {String} [options.title] - The title for the page.
   * @param {View} [options.view] - The view type for the page.
   * @param {Object} [options.props] - The properties for the page.
   * @param {Boolean} [options.isBrowserContext] - When set the value will override the normal check done to detrmine if the page is running in a browser.
   * @param {Boolean} [options.isDevContext] - When set the value will override the normal check done to determine if the page is running in a developer context.
   * @returns {void}
   */
  constructor(options) {
    currentPage = this;
    const opts = options || {};

    this.mIsInitialized = false;
    this.mIsLoaded = false;
    this.mTickRunning = false;

    this.mTitle = opts.title || '';
    this.mIsBrowserContext = opts.isBrowserContext;
    this.mIsDevContext = opts.isDevContext;
    this.mViewLoads = [];

    this.mViewType = opts.view;
    if (opts.props) {
      this.mProps = opts.props;
    } else if (this.isBrowserContext) {
      const element = document.getElementById('page-props');
      this.mProps = (!element || !element.textContent) ? {} : JSON.parse(element.textContent);
    } else {
      this.mProps = {};
    }
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
   * After the page has been loaded this returns true.
   */
  get isLoaded() {
    return this.mIsLoaded;
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
   * The session storage object.
   */
  static get sessionStorage() {
    return pageSessionStorage;
  }

  /**
   * The session storage object.
   */
  get sessionStorage() {
    return Page.sessionStorage;
  }

  /**
   * The local storage object.
   */
  static get localStorage() {
    return pageLocalStorage;
  }

  /**
   * The local storage object.
   */
  get localStorage() {
    return Page.localStorage;
  }

  /**
   * The view to display on the page.
   * @returns {Object} undefined.
   */
  getView() {
    return this.mViewType;
  }

  /**
   * Properties for the page.
   * @returns {Object} Empty object.
   */
  getProps() {
    return this.mProps;
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
    console.error(err.message); // eslint-disable-line no-console
    console.error(err.stack); // eslint-disable-line no-console
  }

  /**
   * This function is used by unit tests to manually initiate the change detection functions of angular2
   * in order for changes to be observed in the document when testing.
   * @returns {void}
   */
  tick() {
    if (this.app && !this.mTickRunning) {
      this.mTickRunning = true;
      try {
        this.app.tick();
      } finally {
        this.mTickRunning = false;
      }
    }
  }

  /**
   * Register a function that will be called when the page is loaded.
   * @param {View} view - The view that will be called when the page has been loaded.
   * @return {void}
   */
  registerLoad(view) {
    if (!this.isLoaded) {
      this.mViewLoads.push(view);
    }
  }

  /**
   * Execute each onLoad function on each view that was registered with registerLoad function and then
   * remove them from the register.
   * @return {void}
   */
  executeLoads() {
    this.mViewLoads.forEach(view => {
      if (view.onLoad) {
        view.onLoad();
      }
    });
    this.mViewLoads = [];
  }

  /**
   * Navigate to the given url.  If the page isn't in the browser context then this function has no effect.
   * @param {String} url - The url to navigate to.
   * @return {void}
   */
  navigate(url) {
    if (this.isBrowserContext && window.location) {
      window.location.href = url;
    }
  }

  /**
   * Load the given view.
   * @param {View} view - The view to load into a page.
   * @param {Object} props - The properties for the given view.
   * @param {Object} opts - Any additional options for the page.
   * @return {Promise} A promise that resolves to the loaded page.
   */
  static load(view, props, opts = {}) {
    const page = new Page({
      view,
      props,
      isBrowserContext: Inspect.isBrowserContext(),
      isDevContext: Inspect.isDevContext(),
      title: opts.title
    });
    return page.load();
  }

  /**
   * This function calls the static load method but only when in the browser context.
   * @param {View} view - The view to load into a page.
   * @param {Object} props - The properties for the given view.
   * @param {Object} opts - Any additional options for the page.
   * @return {Promise} A promise that resolves to the loaded page.
   */
  static bootstrap(view, props, opts) {
    if (Inspect.isBrowserContext()) {
      return Page.load(view, props, opts);
    }
    return Promise.resolve(null);
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
      return new Promise(function (resolve, reject) {
        bootstrap(self.getView())
          .then(function (compRef) {
            self.mView = compRef.instance;
            self.mApp = compRef.injector.get(ApplicationRef);
            self.initStore();
            self.executeLoads();
            self.mIsLoaded = true;
            resolve(self);
          })
          .catch(function (err) {
            reject(err);
          });
      });
    }
    return Promise.resolve(this);
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
