import { bootstrap } from 'angular2/bootstrap';
import { enableProdMode } from 'angular2/core';
import Director from 'director';
import Flux from 'flux';
import Reflect from './reflect';
import HostView from './hostView';

// A singleton instance of Page.
let currentPage = null;

/**
 * Abstract definition of a page.
 */
class Page {

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
    this.mDispatcher = new Flux.Dispatcher();
    this.mComponent = null;
    this.mProps = null;

    this.mTitle = opts.title || '';
    this.mContainerId = opts.containerId || 'page-body-content';
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
  get dispatcher() {
    return this.mDispatcher;
  }

  /**
   * Returns true if the page is running in the browser, false if it isn't.
   */
  get isBrowserContext() {
    if (this.mIsBrowserContext !== undefined) {
      return this.mIsBrowserContext;
    }
    return Reflect.isBrowserContext();
  }

  /**
   * Returns true if the page is running in developer context, false if it isn't.
   */
  get isDevContext() {
    if (this.mIsDevContext !== undefined) {
      return this.mIsDevContext;
    }
    return Reflect.isDevContext();
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
   * Get the root level component for the page.
   */
  get component() {
    return this.mComponent;
  }

  /**
   * Get the root level properties for the page.
   */
  get props() {
    return this.mProps;
  }

  /**
   * Set the instance of the currently mounted component.
   * This will destory any currently mounted component before replacing it.
   * @param {Object} compRef - The currently mounted component instance.
   * @returns {void}
   */
  setComponentRef(compRef) {
    if (this.mCompRef) {
      this.mCompRef.dispose();
    }
    this.mCompRef = compRef;
  }

  /**
   * This should be called after the page is created and it's ready to be displayed.
   * @returns {void}
   */
  load() {
    if (!this.mIsInitialized) {
      if (!this.isDevContext) {
        enableProdMode();
      }
      this.mIsInitialized = true;
      this.title = this.mTitle;
      this.render();
      this.initRouter();
    }
  }

  /**
   * Setup the routing for the page.  Only works in the browser.
   * @returns {void}
   */
  initRouter() {
    if (!this.isBrowserContext) {
      return;
    }

    // get all of the functions defined on the prototype
    const propNames = Reflect.getPropertyNames(
      Object.getPrototypeOf(this),
      Page.prototype
    );

    const routes = {};
    for (let propIndex = 0; propIndex < propNames.length; propIndex++) {
      // collect all property names that begin with the text 'route'
      const propName = propNames[propIndex];
      if (Reflect.isFunction(this[propName]) && propName.indexOf('route') === 0) {
        let pathName = '?((\\w|.)*)';
        if (propName.length > 5) {
          pathName = propName.slice(5);
          pathName = '/' + pathName[0].toLowerCase() + pathName.slice(1);
        }

        const callFunc = function () { // eslint-disable-line no-loop-func
          this[propName].apply(this, arguments);
        }.bind(this);

        // route without any params set
        routes[pathName] = callFunc;

        // get all of the parameters that will be included in the routing definition
        const params = Reflect.getParameterNames(this[propName]);
        for (let paramIndex = 0; paramIndex < params.length; paramIndex++) {
          if (paramIndex === params.length - 1 && params[paramIndex] === 'any') {
            pathName += '/?((\\w|.)*)';
          } else {
            pathName += '/:' + params[paramIndex];
          }
          // route with optional parameters set
          routes[pathName] = callFunc;
        }
      }
    }

    // hook up the router
    this.mRouter = new Director.Router(routes);
    if (this.mRouter.init) {
      this.mRouter.init();
    }
  }

  /**
   * The default route which gets called if no other route matches.
   * The default page gets rendered in this case.
   * @returns {void}
   */
  route() {
    this.render();
  }

  /**
   * Render the content for this page.
   * @param {View} [component] - The component to render.  If not set the result from the getComponent function is used.
   * @param {Object} [props] - The props for the component to be rendered.  If not set the result from the getProps function is used.
   * @returns {void}
   */
  render(component, props) {
    this.mComponent = component || this.getComponent();
    this.mProps = {};

    // get all of the functions defined on the prototype chain
    const ptype = Object.getPrototypeOf(this);
    const funcList = Reflect.getFunctionChain(
      ['getComponent', 'getProps'],
      component ? Object.getPrototypeOf(ptype) : ptype,
      Page.prototype
    );

    // build inputs using function chain
    const directives = [];
    let template = '';
    if (component && component.getSelector) {
      const selector = component.getSelector();
      template = `<${selector}></${selector}>`;

      this.mProps[component] = props || {};
    }
    for (let index = 0; index < funcList.length; index++) {
      if (funcList[index].getComponent) {
        const comp = funcList[index].getComponent();
        if (comp && comp.prototype && comp.prototype.constructor && comp.prototype.constructor.getSelector) {
          directives.push(comp.prototype.constructor);
          const selector = comp.prototype.constructor.getSelector();
          template = `<${selector}>${template}</${selector}>`;

          this.mProps[comp.prototype.constructor] = funcList[index].getProps;
        }
      }
    }
    template = `<div #content>${template}</div>`;
    if (component) {
      directives.push(component);
    }

    // set components to be rendered in host view
    HostView.__annotationsCache = null;
    HostView.getDirectives = function () {
      return directives;
    };
    HostView.getTemplate = function () {
      return template;
    };

    bootstrap(HostView);
  }
}

export default Page;
