import Flux from '../../../local/index';

class CountReducer extends Flux.Reducer {

  actionIncrement(state) {
    return state + 1;
  }
}

export default CountReducer;
