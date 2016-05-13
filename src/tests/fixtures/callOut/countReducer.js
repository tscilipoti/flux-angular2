import Flux from '../../../local/index';

class CountReducer extends Flux.Reducer {

  actionIncrement(state) {
    const self = this;
    self.page.request({ method: 'GET', url: 'http://fake.org/functions/increment', body: state })
      .then(result => {
        self.dispatch({
          type: 'incrementComplete',
          result,
          error: null
        });
      })
      .catch(error => {
        self.dispatch({
          type: 'incrementComplete',
          result: 0,
          error
        });
      });

    return state;
  }

  actionIncrementComplete(state, action) {
    return action.result;
  }
}

export default CountReducer;
