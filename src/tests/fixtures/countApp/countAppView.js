import Flux from '../../../local/index';
import CountDisplayView from './countDisplayView';
import CountIncrementView from './countIncrementView';
import CountReducer from './countReducer';

@Flux.View.component({
  selector: 'CountApp',
  template: (`<div>
    <CountDisplayView [state]="state.count"></CountDisplayView>
    <CountIncrementView></CountIncrementView>
  </div>`),
  directives: [CountDisplayView, CountIncrementView]
})
class CountApp extends Flux.AppView {
  constructor() {
    super();
    this.countReducer = new CountReducer({ initialState: this.props.count });
  }

  reduce(state, action) {
    return {
      count: this.countReducer.reduce(state.count, action)
    };
  }

  initialState() {
    return {
      count: this.countReducer.initialState()
    };
  }
}

export default CountApp;
