import Flux from '../../../local/index';
import CountDisplayView from './countDisplayView';
import CountIncrementView from './countIncrementView';
import CountReducer from './countReducer';

@Flux.View.component({
  selector: 'CountApp',
  template: (`<div>
    <CountDisplayView [props.count]="state.count"></CountDisplayView>
    <CountIncrementView></CountIncrementView>
  </div>`),
  inputs: ['props.count'],
  directives: [CountDisplayView, CountIncrementView]
})
class CountApp extends Flux.AppView {
  constructor() {
    super();
    this.countReducer = new CountReducer({ initialState: this.props.count });
    this.copyInitialState();
  }

  reduce(state, action) {
    return {
      count: this.countReducer.reduce(state.count, action)
    };
  }

  initialState() {
    return {
      count: 0
    };
  }

  storeChanged() {
    this.state.count = this.storeState.count;
  }
}

export default CountApp;
