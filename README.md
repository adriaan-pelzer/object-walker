object-walker
=============

Walk Objects like an Acrobat
----------------------------

A functional object walker node module, with user-settable handlers for each of the following value types:

- Object
- Array
- Number
- Boolean
- Date
- String
- Null
- Undefined

**Install like this:**

```js
npm install object-walker
```

**Use like this:**

```js
var walker = require ( 'object-walker' );

var inputObject = {
    a: null,
    b: 123,
    c: {
        a: 'hello world',
        b: undefined
    }
};

/* Using your own iterator: */

walker.walkObject ( inputObject, function ( keys, value ) {

    /* 'keys' is an array, representing the tree-of-keys,
     * from root to where you are now
     * 'value' is the value of the node on which you are now
     */

    walker.walkObject ( value, iterator, keys );
} );

/* Using the built-in iterator, and setting some handlers */

walker.setCustomHandler ( 'Null', function ( keys, value ) {
    console.log ( keys[keys.length - 1] + ' is null' );
} );

walker.setCustomHandler ( 'Object', function ( keys, value ) {
    console.log ( keys[keys.length - 1] + ' is an object' );
} );

walker.walkObject ( inputObject, walker.iterator );

/* Outputs:
 * a is null
 * c is an object
 */

/* To reuse walker, call clearCustomHandlers, to clean up after
 * your previous walk.
 */

walker.clearCustomHandlers ();

 /* Using the built-in iterator, with custom handlers, and
  * populating a user context that gets passed along the
  * entire walk.
  */

walker.setCustomHandler ( 'Null', function ( keys, value, userCtx ) {
    var returnedCtx = userCtx;

    returnedCtx.push ( value );

    return returnedCtx;
} );

walker.setCustomHandler ( 'Object', function ( keys, value, userCtx ) {
    var returnedCtx = userCtx;

    returnedCtx.push ( value );

    return returnedCtx;
} );

userCtx = walker.walkObject ( inputObject, walker.iterator, [] );
```
