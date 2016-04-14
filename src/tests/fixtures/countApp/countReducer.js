import Flux from '../../../local/index';

class CountReducer extends Flux.Reducer {

  constructor() {
    super();
  }

  initialState() {
    return 0;
  }

  actionIncrement(state) {
    return state + 1;
  }
}

export default CountReducer;
