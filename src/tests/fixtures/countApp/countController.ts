import Flux from '../../../local/index';
import CountDisplayView from './countDisplayView';
import CountIncrementView from './countIncrementView';

@Flux.View.Component({
  selector: 'CountController',
  template: (`<div>
    <CountDisplayView [props.count]="state.count"></CountDisplayView>
    <CountIncrementView></CountIncrementView>
  </div>`),
  inputs: ['props.count'],
  directives: [CountDisplayView, CountIncrementView]
})
class CountController extends Flux.ControllerView {

  onInit() {
    this.setState({ count: this.getProps().store.getCount() });
    this.addStore(this.getProps().store);
  }

  handleStoreChange() {
    this.setState({ count: this.getProps().store.getCount() });
  }
}

export default CountController;
