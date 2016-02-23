import Flux from '../../../local/index';
import CountDisplayView from './countDisplayView';
import CountIncrementView from './countIncrementView';

class CountController extends Flux.ControllerView {

  onInit() {
    this.state = { count: this.props.store.getCount() };
    this.addStore(this.props.store);
  }

  handleStoreChange() {
    this.state.count = this.props.store.getCount();
  }

  static get annotations() {
    return Flux.View.annotate(CountController);
  }

  static getSelector() {
    return 'CountController';
  }

  static getDirectives() {
    return [CountDisplayView, CountIncrementView];
  }

  static getTemplate() {
    return (`<div>
      <CountDisplayView [props.count]="state.count"></CountDisplayView>
      <CountIncrementView></CountIncrementView>
    </div>`);
  }
}

export default CountController;
