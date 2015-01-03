## Requiremnts
  * mongodb

## Run application in development
  * First config your file .env with the keys for [trello](https://trello.com/docs/gettingstarted/index.html#getting-a-token-from-a-user)
    ```
      TRELLO_KEY=YOUR_KEY
      TRELLO_SECRET=YOURSECRETKEYGOESHERE
    ```

  ```
    rails s
  ```
## Run test suite
  * First config your file .env.test with the keys for [trello](https://trello.com/docs/gettingstarted/index.html#getting-a-token-from-a-user) (all call should be stubbed)

  ```shell
    rspec
  ```
## Development

###Views
  * Angular
    * All views should be in the folder **/templates/\[:resources]/file.html**
    * The view do not need all layout
  * Ruby server: Normally
  
###Controllers
  * Angular
    * Should be in the folder: **/assets/javascripts/time_angular/modules/\[:resources\]/action.js**

  * Api controllers
    * The controller should be in the namespace **api**
    * You need create the controller with **ApiController**
  * Server Controllers
    * Normally

###Models
  * Angular: 
    * All models should be created with 
```javascript
  var TimeApp = window.TimeApp ||= {}
  var myObject = TimeApp.myObject = {};
  myObject = function(attributes){
    attributes ||= {};
    this.my_attribute = attributes.my_attribute; //Initializacion

    this.my_function = function(){};
  }
```

## Dependencies

   * Angular 1.3.7(resources, routes, sanatize, message)

   This dependencies are managed with Bower (see: Bowerfile)
