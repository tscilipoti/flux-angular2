/**
 * Class used to build html output for pages.
 */
class PageBuilder {

  /**
   * @constructor
   */
  constructor() {
    this.mStyleSheets = [];
    this.mScripts = [];
  }

  /**
   * Get the stylesheet tags for the page.
   */
  get styleSheets() {
    return this.mStyleSheets;
  }

  /**
   * Set the stylesheet tags for the page.
   * @param {String|String[]} value - A stylesheet tag or array of stylesheet tags.
   * @returns {void}
   */
  set styleSheets(value) {
    this.mStyleSheets = value;
  }

  /**
   * Get the script tags for the page.
   */
  get scripts() {
    return this.mScripts;
  }

  /**
   * Set the scripts tags for the page.
   * @param {String|String[]} value - A script tag or array of script tags.
   * @returns {void}
   */
  set scripts(value) {
    this.mScripts = value;
  }

  /**
   * Write the given page out to a string.
   * @returns {String} A string representation of the given page.
   */
  renderToString() {
    const styleSheets = (Array.isArray(this.styleSheets) ? this.styleSheets.join('\n    ') : this.styleSheets) || '';
    const scripts = (Array.isArray(this.scripts) ? this.scripts.join('\n    ') : this.scripts) || '';

    return `<!DOCTYPE HTML>
<html>
  <head>
    ${styleSheets}
    ${scripts}
  </head>
  <body id="page-body-content">
    <HostView></HostView>
  </body>
</html>`;
  }
}

export default PageBuilder;
