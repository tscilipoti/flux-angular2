import Flux from '../../../local/index';

class DetailView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(DetailView);
  }

  static getSelector() {
    return 'DetailView';
  }

  static getTemplate() {
    return `<span>Details</span>`;
  }
}

export default DetailView;
