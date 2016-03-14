import Flux from '../../../local/index';

class MasterView extends Flux.View {

  static get annotations() {
    return Flux.View.annotate(MasterView);
  }

  static getTemplate() {
    return `<div>
      <span>Start</span>
      <ng-content></ng-content>
      <span>End</span>
    </div>`;
  }
}

export default MasterView;
