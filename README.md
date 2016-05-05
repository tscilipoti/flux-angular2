# flux-angular2

This package is currently in **BETA**

## Overview
This is a node package that contains an implementation of the flux pattern using Angular2 and the redux package.

## Guide

To install this package execute the following command in the console from within your project.
```
npm install --save flux-angular2
```

This package is a collection of classes that loosley correspond to each of the items defined in the flux pattern.
A short description of each class in this package is below.  See the API section for more detailed information on each class.

- `Page` - Ties together all of the different parts of an application.  There should only ever be one instance on a page.
- `View` - Corresponds to a flux view component.
- `AppView` - Controls one or more Views on the page.
- `Reducer` - Contains all of the business logic for managing data.
- `PageBuilder` - Used on the server side to generate pages.

### Example Application

What follows is an example of an application built using this package.  
For my example I will create an application that allows a user to log questions with a subject and body input.
Note that you will need to use a bundle and transpiler package to transpile from ECMAScript 6/TypeScript and 
deliver your code to the client which is not shown in the examples.

#### Reducer
The first thing to do is define a reducer for my application.  For this example the reducer is simply going to save and retrieve data from 
memory but normally there would be some kind of communication with a backend service.
Below is code that I've put in a file named `questionReducer.js`:
```JavaScript
import Flux from 'flux-angular2';

export default class QuestionReducer extends Flux.Reducer {

  constructor(opts) {
    super(opts);
    this.mQuestionIdNext = 0;
  }

  actionAddQuestion(state, action) {
    return [...state, {
      id: ++this.mQuestionIdNext,
      subject: action.subject,
      body: action.body
    }];
  }
}
```

As you can see above the QuestionReducer class code is pretty simple.
The name given to the actionAddQuestion function has significance as it begins with the text `action`.  Any function defined in a Reducer class 
that begins with the text action will be called automatically by the dispatcher when the lower camel case version of the text that follows action 
is set in `type`.
For my example this function gets executed whenever a dispatch is sent with the action.type set to `addQuestion`.

You can also use action types with periods if you want.  These get translated into underscores in function names.  For eaxmple the action 
`.my.example.action` will map to the function `action_my_example_action`.

#### View
Now that I have my Reducer defined I'm going to define what will be displayed for UI on the page.  To do this I'm going to break up the different parts of my 
display into a couple of different views.
First up I'll write the view for displaying questions that have been added.  This code will be in a file called `QuestionListView.js`:
```JavaScript
import Flux from 'flux-angular2';

@Flux.View.component({
  selector: 'QuestionListView',
  template: (`<div>
    <div *ngFor="let question of state">
      <b>{{question.subject}}</b> - {{question.body}}
    </div>
  </div>`),
  inputs: ['state']
})
export default class QuestionListView extends Flux.View {
}
```
As you can see, this class extends Flux.View and uses the Flux.View.Component annotation.  Flux.View.component is simply a convenience function
and is equivalent to angular2/core/Component.
Now that I've defined the view for displaying questions I'll define the view for adding questions in a file named `QuestionAddView.js`:
```JavaScript
import Flux from 'flux-angular2';

@Flux.View.component({
  selector: 'QuestionAddView',
  template: (`<div>
    <form>
      <input id="questionSubject" [value]="data.subject" (change)="data.subject = $event.target.value" type="text" placeholder="subject" />
      <input id="questionBody" [value]="data.body" (change)="data.body = $event.target.value" type="text" placeholder="body" />
      <button id="questionAdd" type="button" (click)="handleClick()">Create</button>
    </form>
  </div>`)
})
export default class QuestionAddView extends Flux.View {

  constructor() {
    super();

    // initialize the local state for this view
    this.data.subject = '';
    this.data.body = '';
  }

  handleClick() {
    // dispatch an addQuestion event
    this.dispatch({
      type: 'addQuestion',
      subject: this.data.subject,
      body: this.data.body
    });

    // clear out inputs after creating question
    this.data.subject = '';
    this.data.body = '';
  }
}
```
There are a number of things going on in the code above.  First, the user input is being stored in the local data object of the view and the data is 
tied to the text input boxes through the template.  
You'll also notice that the handleClick function is dispatching a message using the dispatch function defined in the View class.  The page property is also 
defined in Flux.View and references the current singleton instance of the Page class.

#### AppView
Now that I've defined all of the views I'll need I can create a class that will bring them together to be displayed.  I'll do this with an AppView I'll define in a file named `QuestionAppView.js`:
```JavaScript
import Flux from '../../../local/index';
import QuestionListView from './questionListView';
import QuestionAddView from './questionAddView';
import QuestionReducer from './questionReducer';

@Flux.View.component({
  selector: 'QuestionAppView',
  template: (`<div>
    <QuestionAddView></QuestionAddView>
    <div>Size: <span id="questionSize">{{state.questions.length}}</span></div>
    <QuestionListView [state]="state.questions"></QuestionListView>
  </div>`),
  directives: [QuestionAddView, QuestionListView]
})
export default class QuestionAppView extends Flux.AppView {

  constructor() {
    super();
    this.questionReducer = new QuestionReducer({ initialState: this.props.questions });
  }

  reduce(state, action) {
    return {
      questions: this.questionReducer.reduce(state.questions, action)
    };
  }

  initialState() {
    return {
      questions: this.questionReducer.initialState()
    };
  }
}
```
As you can see the QuestionAppView class extends the Flux.AppView class.
In this class I've brought together the QuestionAddView and QuestionListView views and I am displaying the one on top of the other.  
This class also expects a questions property that will be used used to set the initial state for a question reducer.

#### Page

Now that I have all the parts needed for my application I can render it into a page.  First I'll use the PageBuilder to generate
html that will be rendered on the browser.  I will also need to write some code to have my app load when the browser loads the page.

The following is the code needed to generate html for the browser.
```JavaScript
import PageBuilder from 'flux-angular2/lib/local/pageBuilder';
import QuestionAppView from './questionAppView';

const pb = new PageBuilder();
pb.scripts = ['<script src="myscripts.js"></script>']; // this would be set with the scripts that load your application
const html = pb.renderToString(QuestionAppView, { questions: [] });
```
The value that is held in the html variable is a string that is the rendered value of the QuestionAppView page which would then
be returned from a server call or maybe written out to an html file to ultimately be loaded into a browser.

This is the code that is needed in order to load the application when the page loads.  It should be included in the scripts
that are rendered by the PageBuilder class in the example above.
```JavaScript
import Flux from 'flux-angular2';
import QuestionAppView from './questionAppView';

Flux.Page.load(QuestionsAppView).then(function (page) {
  console.log('the page has been loaded');
});
```
The Flux.Page.load function returns a promise that will resolve with the page that has been loaded.

## API

### `Page`
Type: `Class`

Page objects are created from calls to Page.load which create a new Page instance with the specified View loaded.

#### Page.current
Type: `Page`

This is a static property that holds the singleton instance of the Page for an application.  It gets set when the Page is first instantiated so
any code that depends on it must be run after the page has been created or within the contructor of a class that extends the Page class.
Whenever a new Page is instantiated it will override this property so having multiple Pages in an application may have unpredictible results.

#### Page.store
Type: `Store`

This is a property on the object that will be an instance of a Redux store as defined in the [Redux](https://www.npmjs.com/package/redux) package.

#### Page.isBrowserContext
Type: `Boolean`

This is a property that indicates if the current code being run is within the context of a client browser.

#### Page.isDevContext
Type: `Boolean`

This is a property that indicates if the current code being run is in the development context.

#### Page.title
Type: `String`

This is a property that corresponds to the title displayed in the browser.  It can be both read from and updated.

#### Page.sessionStorage
Type: `Storage`

The storage object for the session.

#### Page.localStorage
Type: `Storage`

The storage object for the client.

#### Page.navigate(url)
Type: `Function`

Navigate to the given url when in the browser context.  If not in the browser context this function will have no effect.

##### url
Type: `String`

The url to navigate to.

#### Page.load(view, props, opts)
Type: `Function`

This is a static function that creates a new page instance with the given view and loads it.

##### view
Type: `View`

The view to load into the page.

##### props
Type: `Object`

The properties for the view that is loaded.

##### opts
Type: `Object`

Options for the page.

##### opts.title
Type: `String`

The title for the page.

#### Page.bootstrap(view, props, opts)
Type: `Function`

This function calls the static load method but only when in the browser context.  All of the parameters are passed through.

#### Page.tick()
Type: `Function`

This function is used to manually run a check for any changed state on the page.  It should only be used as part of unit testing.

#### Page.handleError(err)
Type: `Function`

Handle the given error by writing the error to the console.

##### err
Type: `Error`

The error to handle.

### `View`
Type: `Class`

Abstract definition of a View.
View classes are not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### View.page
Type: `Page`

This property is a convenience property and returns the value from Page.current.

#### View.onInit()
Type: `Function`

This function is called by the framework when the view has been initialized.

#### View.onLoad()
Type: `Function`

This function is called after the view has been initialized and after the page has loaded.

#### View.onDestroy()
Type: `Function`

This function is called by the framework when the view has been destroyed.

#### View.dispatch(action)
Type: `Function`

A convenience property that is the same as calling Page.current.store.dispatch.

#### View.component
Type: `Component`

A convenience property that is the same as angular2/core/Component.

#### View.state
Type: `Object` Default: `Empty Object`

This property will hold an immutable state object that is passed in from the container of the view and will
contain state values for the view.

#### View.props
Type: `Object` Default: `Empty Object`

This property will hold an immutable object that contains property values for the view that are in addition to
the state values.

#### View.data
Type: `Object` Default: `Empty Object`

This property is used to store state that is local to the view.

### `AppView`
Type: `Class`

The AppView class extends the View class and adds additional functionality for sub classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### AppView.reduce(state, action)
Type: `Function`

This function is called by the Redux package whenever an action has been dispatched.  It should return the new state based on the
action.

#### AppView.initialState()
Type: `Function`

This is called by the Redux package to get the initial state when the page is loaded.

#### AppView.state
Type: `Object`

The state property gets set to the state from the page store whenver it's updated.

#### AppView.props
Type: `Object`

The props property gets set to the value returned from calling page.getProps().

### `Reducer`
Type: `Class`

This class is a base class for all Reducer classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.
Classes that override this class can wire up functions to be called when a given action is dispatched.
Any function that has a name that begins with the text action will be wired up to the corresponding action name.

#### Reducer.constructor(options)
Type: `Function`

The constructor for reducer classes.

##### options
Type: `Object`

The options for the reducer.

##### options.initialState
Type: `Object`

When this is set it will be returned from calls to the initialState function of this class.

#### Reducer.clone(source, values)
Type: `Function`

This function will create a shallow copy of the source parameter.

##### source
Type: `Object`

The object to clone.

##### values
Type: `Object`

Optional values to copy into the cloned result.

#### Reducer.initialState()
Type: `Function`

This function will return the value passed into the constructor of this class by default.  It can also be overridden
by sub classes to provide a different behavior.

### `PageBuilder`
Type: `Class`

This class is intended to be used on the server to render Pages on the server to be delivered to client browsers.

#### PageBuilder.styleSheets
Type: `String or String[]`

A property that contains the style sheet tags that should be included in the page.

#### PageBuilder.scripts
Type: `String or String[]`

A property that contains the script tags that should be included in the page.

#### PageBuilder.renderToString(view, props)
Type: `Function`

This function generates an HTML string that will load the given page when the page is loaded in a browser.
In the future this function will generate the rendered output from the page.

##### view
Type: `View`

The view to render.

##### props
Type: `Object`

The properties for the view.

#### PageBuilder.test(opts)
Type: `Function`

This function is used to help with unit testing of pages.  It returns a promies that resolves with the loaded page.

##### opts.view
Type: `View`

The view to load for testing.

##### opts.props
Type: `Object`

The properties for the loaded view.

##### opts.sessionStorage
Type: `Object`

Values to set for session storage.

##### opts.localStorage
Type: `Object`

Values to set for local storage.

##### opts.storeListener
Type: `Function`

A function that gets called whenever there is a reducing event.  This function will be passed that will have the following properties:
- action: The action that has occured.
- before: The state object before the action is reduced.
- after: The state object after the action is reduced.
- isOverride: Flag that indicates if the reducer was overridden.

##### opts.reducer
Type: `Object`

When this is set to an object it will override reducing actions.  Set a property on this object to the same name as an action.type
and it will be used instead of the normal reducing function.  The property can be a reducing function or an object which will
be merged with the current state.
