import Flux from '../../../local/index';
import CountDisplayView from './countDisplayView';
import CountIncrementView from './countIncrementView';

@Flux.View.Component({
  selector: 'CountApp',
  template: (`<div>
    <CountDisplayView [props.count]="state.count"></CountDisplayView>
    <CountIncrementView></CountIncrementView>
  </div>`),
  inputs: ['props.count'],
  directives: [CountDisplayView, CountIncrementView]
})
class CountApp extends Flux.AppView {

  reduce(state, action) {
    const result = { count: this.props.countReducer.reduce(state.count, action) };
    return result;
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
