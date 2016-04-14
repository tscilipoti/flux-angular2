import Flux from '../../../local/index';

@Flux.View.Component({
  selector: 'CountIncrementView',
  template: (`<div>
    <form>
      <button id="countIncrement" type="button" (click)="handleClick()">Add</button>
    </form>
  </div>`)
})
class CountIncrementView extends Flux.View {

  handleClick() {
    this.dispatch({ type: 'increment' });
  }
}

export default CountIncrementView;
