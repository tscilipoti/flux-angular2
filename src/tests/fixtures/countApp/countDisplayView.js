import Flux from '../../../local/index';

class CountDisplayView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(CountDisplayView);
  }

  static getSelector() {
    return 'CountDisplayView';
  }

  static getTemplate() {
    return (`<div>
      <span>Count: </span><span id="countDisplay">{{props.count}}</span>
    </div>`);
  }
}

export default CountDisplayView;
