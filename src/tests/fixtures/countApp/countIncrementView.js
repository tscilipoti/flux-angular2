import Flux from '../../../local/index';

class CountIncrementView extends Flux.View {

  handleClick() {
    this.page.dispatcher.dispatch({ actionType: 'increment' });
  }

  static get annotations() {
    return Flux.View.annotate(CountIncrementView);
  }

  static getSelector() {
    return 'CountIncrementView';
  }

  static getTemplate() {
    return `<div>
      <form>
        <button id="countIncrement" type="button" (click)="handleClick()">Add</button>
      </form>
    </div>`;
  }
}

export default CountIncrementView;
