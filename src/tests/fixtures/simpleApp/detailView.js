import Flux from '../../../local/index';

class DetailView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(DetailView);
  }

  static getTemplate() {
    return (`<div>
      <span>Details</span>
    </div>`);
  }
}

export default DetailView;
