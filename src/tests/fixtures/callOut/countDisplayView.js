import Flux from '../../../local/index';

@Flux.View.component({
  selector: 'CountDisplayView',
  template: (`<div><span>Count: </span><span id="countDisplay">{{state}}</span></div>`),
  inputs: ['state']
})
class CountDisplayView extends Flux.View {
}

export default CountDisplayView;
