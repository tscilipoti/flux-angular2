import Flux from '../../../local/index';
import DetailView from './detailView';

class SimplePage extends Flux.Page {

  getView() {
    return DetailView;
  }
}

export default SimplePage;
