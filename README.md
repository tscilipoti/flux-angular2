# flux-angular2

This package is currently in **BETA**

## Overview
This is a node package that contains an implementation of the flux pattern as described by [facebook](https://facebook.github.io/flux/docs/overview.html).
This package is designed to work with [ECMAScript 6](https://github.com/lukehoban/es6features/blob/master/README.md) classes.

## Guide

To install this package execute the following command in the console from within your project.
```
npm install --save flux-angular2
```

This package is a collection of classes that correspond to each of the items defined in the flux pattern.
A short description of each class in this package is below.  See the API section for more detailed information on each class.

- `Page` - Ties together all of the different parts of an application.  There should only ever be one instance on a page.
- `View` - Corresponds to a flux view component.
- `ControllerView` - Controls one or more Views on the page.
- `Store` - Contains all of the business logic for managing data.
- `PageBuilder` - Used on the server side to generate pages.

### Example Application

What follows is an example of an application built using this package.  
For my example I will create an application that allows a user to log questions with a subject and body input.
Note that you will need to use a bundle and transpiler package such as [build-bundle](https://www.npmjs.com/package/build-bundle) or [browserify](https://www.npmjs.com/package/browserify) to transpile from ECMAScript 6 and deliver your code to the client which is not shown
 in the examples.

You wil also need to include the Angular2 polyfills lib in the scripts loaded by the browser. 
See the Angular2 documentation for more information on how to include this in your page.

As an added note, if you are minifying your bundles you will not be able to mangle the function names for the Angular2 lib as this seems to cause an error at runtime.

#### Store
The first thing I like to do is define the store for my application.  For this example the store is simply going to save and retrieve data from memory but normally a store would communicate with some kind of backend service.
Below is code that I've put in a file named `QuestionStore.js`:
```JavaScript
import Flux from 'flux-angular2';

class QuestionStore extends Flux.Store {
  constructor() {
    super();
    this.mQuestions = [];
    this.mQuesitonIdNext = 0;
  }

  getQuestions() {
    return this.mQuestions;
  }

  actionAddQuestion(details) {
    this.mQuestions.push({
      id: ++this.mQuestionIdNext,
      subject: details.subject,
      body: details.body
    });
    
    this.emitChange(); // notify any listeners of a change
  }
}

export default QuestionStore;
```

As you can see above the QuestionStore class code is pretty simple.  There is a getQuestions function which is used to retrieve data and an actionAddQuestion function which is used to update data.
The name given to the actionAddQuestion function has significance as it begins with the text `action`.  Any function defined in a Store class that begins with the text action will be called automatically by the dispatcher when the lower camel case version of the text that follows action is set in `actionType`.
For my example this function gets executed whenever a dispatch is sent with the actionType set to `addQuestion`.

Another thing to note is that after the data in the store has been updated the `emitChange` function is called.  This function is called to notify listeners of any changes and is defined in the Flux.Store class that my QuestionStore class extends.

#### View
Now that I have my Store defined I'm going to define what will be displayed for UI on the page.  To do this I'm going to break up the different parts of my display into a couple of different views.
First up I'll write the view for displaying questions that have been added.  This code will be in a file called `QuestionListView.js`:
```JavaScript
import Flux from 'flux-angular2';

class QuestionListView extends Flux.View {
  static get annotations() {
    return Flux.View.annotate(QuestionListView);
  }

  static getSelector() {
    return 'QuestionListView';
  }

  static getInputs() {
    return ['props.questions'];
  }

  static getTemplate() {
    return `<div>
      <div *ngFor="#question of props.questions">
        <b>{{question.subject}}</b> - {{question.body}}
      </div>
    </div>`;
  }
}

export default QuestionListView;
```
As you can see, this class extends Flux.View and defines a number of static functions.  When this view is loaded into an Angular2 app, Angular2 will call the `annotaions` property to get the definitions for the view.
Rather then return a collection of descriptors in the annotations property we call the `View.annotate` function and pass it our class to build out the view definitions for Angular2.
The View.annotate function will look for specific static functions on our class such as getSelector and getTemplate to generate the necessary annotations. 
See the API documentation for a list of possible functions that effect the definition of the view.
Now that I've defined the view for displaying questions I'll define the view for adding questions in a file named `QuestionAddView.js`:
```JavaScript
import Flux from 'flux-angular2';

class QuestionAddView extends Flux.View {
  static get annotations() {
    return Flux.View.annotate(QuestionAddView);
  }

  constructor() {
    super();
    this.state.subject = '';
    this.state.body = '';
  }

  static getSelector() {
    return 'QuestionAddView';
  }

  static getTemplate() {
    return `<div>
      <form>
        <input [value]="state.subject" (change)="state.subject = $event.target.value" type="text" placeholder="subject" />
        <input [value]="state.body" (change)="state.body = $event.target.value" type="text" placeholder="body" />
        <button type="button" (click)="handleClick()">Create</button>
      </form>
    </div>`;
  }

  handleClick() {
    // dispatch an addQuestion event
    this.page.dispatcher.dispatch({
      actionType: 'addQuestion',
      subject: this.state.subject,
      body: this.state.body
    });
    
    // clear out inputs after creating question
    this.state.subject = '';
    this.state.body = '';
  }
}

export default QuestionAddView;
```
There are a number of things going on in the code above.  First, the user input is being stored in the local state of the view and the state is tied to the text input boxes through the template.  
You'll also notice that the handleClick function is dispatching a message using the page.dispatcher property.  The page property is also 
defined in Flux.View and references the current singleton instance of the Page class.

#### ControllerView
Now that I've defined all of the views I'll need I can create a class that will bring them together to be displayed.  I'll do this with a ControllerView I'll define in a file named `QuestionControllerView.js`:
```JavaScript
import Flux from 'flux-angular2';
import QuestionListView from './questionListView';
import QuestionAddView from './questionAddView';

class QuestionControllerView extends Flux.ControllerView {
  static get annotations() {
    return Flux.View.annotate(QuestionControllerView);
  }

  static getSelector() {
    return 'QuestionControllerView';
  }

  static getDirectives() {
    return [QuestionAddView, QuestionListView];
  }

  static getTemplate() {
    return `<div>
      <QuestionAddView></QuestionAddView>
      <div>Size: {{state.questions.length}}</div>
      <QuestionListView [props.questions]="state.questions"></QuestionListView>
    </div>`;
  }

  onInit() {
    this.state.questions = this.props.store.getQuestions();
    this.addStore(this.props.store);
  }

  handleStoreChange() {
    this.state.questions = this.props.store.getQuestions();
  }
}

export default QuestionControllerView;
```
As you can see the QuestionControllerView class extends the Flux.ControllerView class.
In this class I've brought together the QuestionAddView and QuestionListView views and I am displaying the one on top of the other.  This class also expects a store property that will have a getQuestions function defined for it.
By using the addStore function defined in Flux.ControllerView and passing the store that is passed in as a property it hooks up an event listener to the store that will call the handeStoreChange function whenever the store is changed.
You can see that the handleStoreChange function is being overridden to update the state with the new collection of questions when the store is changed.
Also note that the initialization of this class happens in the onInit function and not the constructor.  This is important because the props property will not be set when the constructor is called but it will have been set before the onInit method
is called by the framework.

#### Page

Now that I have all the parts needed for my application the last thing to do is to bring it all together within a custom Page class.  
I'll do this in a file named `QuestionPage.js`:
```JavaScript
import Flux from 'flux-angular2';
import QuestionStore from './questionStore';
import QuestionController from './questionControllerView';

class QuestionPage extends Flux.Page {
  constructor(options) {
    super(options);
    this.mStore = new QuestionStore();
  }

  getComponent() {
    return QuestionController;
  }

  getProps() {
    return { store: this.mStore };
  }
}

export default QuestionPage;
```
This is all that is needed to define my application.  The last thing to do is to create an instance of the QuestionPage and call the load function like so:
```JavaScript
const page = new QuestionPage();
page.load();
```
When the page is loaded an istance of the component returned from the getComponent function will be created and the properties returned from the getProps function will be passed to the newly created component.
That's all there is to it.  Both the question list and question add views will be displayed and when a user adds a new question it will be immediately displayed.

### Master Detail Pages

The Page class supports a form of master-detail page composition.  By using inheritance you can create detail pages that extend master pages and combine content.
For example lets say I have defined a class named MasterPage which extends Flux.Page and returns the following component when the getComponent function is called:
```
<div>
  <div>Top</div>
  <ng-content></ng-content>
  <div>Bottom</div>
</div>
```
Now if define a class named DetailPage which extends the MasterPage class and returns the following component when it's getComponent function is called:
```
<div>Details</div>
```
The following text will be displayed when the DetailPage is loaded:
```
Top
Details
Bottom
```
This is because the special `ng-content` element of the component will be rendered with any component defined in a sub-classed page.  In this way you can create master pages that
contain common UI such as menus and footers and have them be re-used throught your code using inheritance.

### Application Routing

The Page class also supports routing which will allow you to create pages with multiple views that don't require downloading new content from the server.
To enable routing you simply need to define functions that begin with the text `route`.  The text that follows will be mapped to the same url in lower camel case so that when a user navigates to that value preceeded by the `#/` symbols it
will execute that function.  For example lets say I have an html page at `//example/myPage.html` which has loaded an instance of Flux.Page which defined the following function:
```JavaScript
routeMyExample() {
  console.log('hello');
}
```
The text 'hello' will be printed to the console if the user navigates to `//example/myPage.html#/myExample`.

Routing can also include parameters.  Simply define parameters in your function and they will be populated by the values that appear in order between slashes(/).
For example lets say I define the following function in a class that extends Flux.Page:
```JavaScript
routeMyExample(pOne, pTwo) {
  console.log(pOne);
  console.log(pTwo);
}
```
If the user were to navigate to `//example/myPage.html#/myExample/hello/world` then the following would be printed to the console:
```
hello
world
```
There is a special parameter name if you want to capture the entire url from the current postion.  If you name a parameter `any` and it is the last
parameter in your defined list of parameters then it will contain all of the remaining url characters including slashes(/).  
For example lets say I define the following function in a class that extends Flux.Page:
```JavaScript
routeMyExample(pOne, pTwo, any) {
  console.log(pOne);
  console.log(pTwo);
  console.log(any);
}
```
If the user were to navigate to `//example/myPage.html#/myExample/hello/world/x/y/z` then the following would be printed to the console:
```
hello
world
x/y/z
```

If a user navigates to a url that doesn't have any routing defined for it the Flux.Page.route function will be executed which will simply re-render page by default.
Now that you know how to map a url value to execute a specific function you will want to know how to render a new view in your page.  This is done with the `render`
function defined in the Flux.Page class.  By default the render function gets called with no parameters when the page is loaded.  When this happens the render 
function will render the component returned from the getComponent function if there is one.

If you want to render a component that is different from the one returned by getComponent you can pass it into the render function along with optional properties.
When you pass in a component to be rendered it will take the place of the component returned from getComponent.  For example take the following code which is defined on the page found at `//example/myPage.html`:
```JavaScript
import Flux from 'flux-angular2';
import FirstView from './firstView';
import SecondView from './secondView';

class ExamplePage extends Flux.Page {
  getComponent() {
    return FirstView;
  }

  getProps() {
    return { input: 1 };
  }

  routeSecond(num) {
    this.render(SecondView, { number: num });
  }
}

export default ExamplePage;
```

When `//example/myPage.html` is first loaded it will display the FirstView component with input set to 1 for it's properties.  If the user were to
then navigate to `//example/myPage.html#/second/8` the SecondView component will be displayed with number set to 8 for it's properties.

## API

### Page
Type: `Class`

Abstract class definition of a page.  
Page classes aren't used directly but rather custom classes extend the Page class and contain the logic to render content in a client browser.
Only one instance of a class that extends Page should be loaded at a time or unpredicatable results may occur.

#### Page.constructor(options)
Type: `Constructor`

The constructor for the page class.  Any classes that extend the Page class should pass the options parameter through.

#### options
Type: `Object`

Options for the Page class.

##### options.title
Type: `String`

Optional parameter.  When provided the browser will display the given title.

##### options.containerId
Type: `String` Default: `page-body-content`

Optional parameter that is the id of the DOMElement that components should be rendered into.  By default this is 'page-body-content'.

##### options.isBrowserContext
Type: `Boolean`

Optional parameter that when defined will indicate if the Page is running within the context of a browser or a server.  By default the Page will
determine this on it's own but this option can be useful when creating unit tests and you want to override the default behavior.

##### options.isDevContext
Type: `Boolean`

Optional parameter that when defined will indicate if the Page is running within the development context.  By default the Page will
determine this on it's own but this option can be useful when creating unit tests and you want to override the default behavior.
When left to the default the url of the current page is inspected and if there is a dev token in the page name such as 'index.dev.html' then the isDevContext will be true.

#### Page.current
Type: `Page`

This is a static property that holds the singleton instance of the Page for an application.  It gets set when the Page is first instantiated so
any code that depends on it must be run after the page has been created or within the contructor of a class that extends the Page class.
Whenever a new Page is instantiated it will override this property so having multiple Pages in an application may have unpredictible results.

#### Page.dispatcher
Type: `Dispatcher`

This is a property on the object that will be an instance of Dispatcher as defined in the [Flux](https://www.npmjs.com/package/flux) package.

#### Page.isBrowserContext
Type: `Boolean`

This is a property that indicates if the current code being run is within the context of a client browser.

#### Page.isDevContext
Type: `Boolean`

This is a property that indicates if the current code being run is in the development context.

#### Page.title
Type: `String`

This is a property that corresponds to the title displayed in the browser.  It can be both read from and updated.

#### Page.load()
Type: `Function`

This function is called to load the page into the browser.

#### Page.route()
Type: `Function`

This function is called when the page is first loaded or a url is navigated to for which there is no mapping defined.  By default this
function will call the render function which will re-render the default component.  Override this method to provide custom logic.

#### Page.render(component, props)
Type: `Function`

The render function is used to build the elements that are displayed to a user.  When in the browser context it will render the elements to the DOMElement.
When not in browser context the html text that represents the elements to be rendered in a DOMElement will be returned instead.

##### component
Type: `View`

This is an optional parameter.  When provided it will, along with any components returned from the getComponent function defined on super classes, will 
be rendered.  If it's not provided then the component returned from calling the getComponent function along with any components returned from the getComponent function defined on super classes
will be rendered.

##### props

This is an optional parameter and is only used when the component parameter has been defined.  When provided it will be used in the rendering of the component.

### View
Type: `Class`

Abstract definition of a View.
View classes are not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### View.page
Type: `Page`

This property is a convenience and returns the value from Page.current.

#### View.annotate(classType)
Type: `Function` (static)

This function is used to create Angular2 annotations from the given type.

##### classType
Type: `Object`

The class type to annotate.

#### View.onInit()
Type: `Function`

This function is called by the framework when the view has been initialized.

#### View.onDestroy()
Type: `Function`

This function is called by the framework when the view has been destroyed.

#### View.annotations
Type: `Property` (static)

The Angular2 framework will call this property to get annotations that define the View.

#### View.getSelector()
Type: `Function` (static)

When defined in a sub class, the string returned from this function will be used to define the selector that Angular2 expects for this class in templates.

#### View.getTemplate()
Type: `Function` (static)

When defined in a sub class, the string returned from this function is used to define the template that Angular2 uses to render this class.

#### View.getDirectives()
Type: `Function` (static)

When defined in a sub class, this function returns an array of class types that appear in the template defined for this view.

#### View.getInputs()
Type: `Function` (static)

When defined in a sub class, this function returns an array of named inputs used in the template defined for this view.

#### View.getParameters()
Type: `Function` (static)

When defined in a sub class, this function returns an array of class types that will be injected into the constructor of this view.

### ControllerView
Type: `Class`

The ControllerView class extends the View class and adds additional functionality for sub classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### ControllerView.handleStoreChange()
Type: `Function`

This function is called whenever a Store that has been added has emitted a change event.  By default it does nothing.  Override this function
to provide logic to be executed when a Store has been changed.  Note that if the ControllerView is not mounted this function will not be called
event if a Store has been changed.

#### ControllerView.addStore(store)
Type: `Function`

Add a Store to change changes on.  When a Store that has been added emits a change event the handleStoreChange function will be called.
The same Store can only be added once.  Trying to add the same Store more than once will have no effect.

##### store
Type: `Store`

The store to add to the ControllerView for tracking.

#### ControllerView.removeStore(store)
Type: `Function`

Remove a store that was previously added.

##### store
Type: `Store`

The store to remove.

#### ControllerView.removeAllStores()
Type: `Function`

Remove all Stores that were previously added.

### Store
Type: `Class`

This class is a base class for all Store classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### Store.page
Type: `Page`

This property is a convenience and returns the value from Page.current.

#### Store.onChange(func)
Type: `Function`

Register an event listener with this class that will be called whenever the emitChange function is called.

##### func
Type: `Function`

The function to call when the emitChange function is called.

#### Store.offChange(func)
Type: `Function`

Unregister an event listener that was previously registered with the onChange function.

##### func
Type: `Function`

The function that was previously passed into the onChange function.

#### Store.emitChange
Type: `Function`

This function will call any functions that have been registered with the onChange function.  It should be called by sub classes whenever the data in the Store is changed.

### PageBuilder
Type: `Class`

This class is intended to be used on the server to render Pages on the server to be delivered to client browsers.

#### PageBuilder.styleSheets
Type: `String or String[]`

A property that contains the style sheet tags that should be included in the page.

#### PageBuilder.scripts
Type: `String or String[]`

A property that contains the script tags that should be included in the page.

#### PageBuilder.renderToString()
Type: `Function`

This function generates an HTML string that an instance of the Page class can be rendered into.
