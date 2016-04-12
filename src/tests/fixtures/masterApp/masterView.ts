import Flux from '../../../local/index';

@Flux.View.Component({
  selector: 'MasterView',
  template: (`<div>
    <span>Start</span>
    <ng-content></ng-content>
    <span>End</span>
  </div>`)
})
class MasterView extends Flux.View {
}

export default MasterView;
