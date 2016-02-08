import Flux from '../../../local/index';

class CustomController extends Flux.ControllerView {

  static get annotations() {
    return Flux.View.annotate(CustomController);
  }

  static getSelector() {
    return 'CustomController';
  }

  static getTemplate() {
    return `<div></div>`;
  }
}

export default CustomController;
