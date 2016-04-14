import Flux from '../../../local/index';
import CountApp from './countAppView';
import CountReducer from './countReducer';

class SimplePage extends Flux.Page {

  constructor(opts) {
    super(opts);
    this.mCountReducer = new CountReducer();
  }

  getView() {
    return CountApp;
  }

  getProps() {
    return { countReducer: this.mCountReducer };
  }
}

export default SimplePage;
