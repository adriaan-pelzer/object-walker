var _ = require ( 'underscore' );

var debug = false;

var log = function ( keys, value, extra ) {
    if ( debug ) {
        console.log ( keys[keys.length - 1] + ': ' + value + ' (' + extra + ')' );
    }
};

var customHandlers = {};

var getCustomHandler = function ( type ) {
    if ( _.isFunction ( customHandlers[type] ) ) {
        return customHandlers[type]; 
    }

    return function () { return true; };
};

var setCustomHandler = function ( type, handler ) {
    customHandlers[type] = handler; 
};

var isIterable = function ( object ) {
    return ( _.isObject ( object ) && ! _.isFunction ( object ) );
};

var walkObject = function ( object, iterator, keys, userCtx ) {
    var key;

    if ( _.isUndefined ( keys ) ) {
        keys = [];
    }

    if ( isIterable ( object ) ) {
        for ( key in object ) {
            if ( object.hasOwnProperty ( key ) ) {
                if ( _.isFunction ( iterator ) ) {
                    iterator ( keys.concat ( [ key ] ), object[key], userCtx );
                }
            }
        }
    }

    return userCtx;
};

var handle = function ( type ) {
    return function ( keys, value, userCtx ) {
        log ( keys, value, type );

        if ( getCustomHandler ( type ) ( keys, value, userCtx ) ) {
            walkObject ( value, iterator, keys, userCtx );
        }
    };
};

var iterator = function ( keys, value, userCtx ) {
    var handler;

    switch ( true ) {
        case _.isDate ( value ):
            handler = handle ( 'Date' );
            break;
        case _.isArray ( value ):
            handler = handle ( 'Array' );
            break;
        case _.isObject ( value ):
            handler = handle ( 'Object' );
            break;
        case _.isNumber ( value ):
            handler = handle ( 'Number' );
            break;
        case _.isBoolean ( value ):
            handler = handle ( 'Boolean' );
            break;
        case _.isString ( value ):
            handler = handle ( 'String' );
            break;
        case _.isNull ( value ):
            handler = handle ( 'Null' );
            break;
        case _.isUndefined ( value ):
            handler = handle ( 'Undefined' );
            break;
    }

    handler ( keys, value, userCtx );
};

exports.walkObject = walkObject;
exports.iterator = iterator;
exports.setCustomHandler = setCustomHandler;
