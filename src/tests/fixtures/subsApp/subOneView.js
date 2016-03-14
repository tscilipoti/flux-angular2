import Flux from '../../../local/index';

class SubOneView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(SubOneView);
  }

  static getTemplate() {
    return `<div>
      <span>One</span>
    </div>`;
  }
}

export default SubOneView;
