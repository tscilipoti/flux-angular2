import Flux from '../../../local/index';

@Flux.View.Component({
  selector: 'CountDisplayView',
  template: (`<div><span>Count: </span><span id="countDisplay">{{props.count}}</span></div>`),
  inputs: ['props.count']
})
class CountDisplayView extends Flux.View {
}

export default CountDisplayView;
