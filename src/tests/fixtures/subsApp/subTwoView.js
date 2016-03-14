import Flux from '../../../local/index';

class SubTwoView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(SubTwoView);
  }

  static getTemplate() {
    return `<div>
      <span>Two</span>
    </div>`;
  }
}

export default SubTwoView;
