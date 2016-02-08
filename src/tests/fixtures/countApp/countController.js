import Flux from '../../../local/index';
import CountDisplay from './countDisplayView';
import CountIncrement from './countIncrementView';

class CountController extends Flux.ControllerView {

  onInit() {
    this.state = { count: this.props.store.getCount() };
    this.addStore(this.props.store);
  }

  handleStoreChange() {
    this.setState({ count: this.props.store.getCount() });
  }

  static get annotations() {
    return Flux.View.annotate(CountController);
  }

  static getSelector() {
    return 'CountController';
  }

  static getDirectives() {
    return [CountDisplay, CountIncrement];
  }

  static getTemplate() {
    return `<div>
      <CountDisplay [count]={{state.count}}></CountDisplay>
      <CountIncrement></CountIncrement>
    </div>`;
  }
}

export default CountController;
