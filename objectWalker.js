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

var walkObject = function ( object, iterator, keys ) {
    var key;

    if ( _.isUndefined ( keys ) ) {
        keys = [];
    }

    if ( isIterable ( object ) ) {
        for ( key in object ) {
            if ( object.hasOwnProperty ( key ) ) {
                if ( _.isFunction ( iterator ) ) {
                    iterator ( keys.concat ( [ key ] ), object[key] );
                }
            }
        }
    }
};

var handle = function ( type ) {
    return function ( keys, value ) {
        log ( keys, value, type );

        if ( getCustomHandler ( type ) ( keys, value ) ) {
            walkObject ( value, iterator, keys );
        }
    };
};

var iterator = function ( keys, value ) {
    switch ( true ) {
        case _.isDate ( value ):
            handle ( 'Date' ) ( keys, value );
            break;
        case _.isArray ( value ):
            handle ( 'Array' ) ( keys, value );
            break;
        case _.isObject ( value ):
            handle ( 'Object' ) ( keys, value );
            break;
        case _.isNumber ( value ):
            handle ( 'Number' ) ( keys, value );
            break;
        case _.isBoolean ( value ):
            handle ( 'Boolean' ) ( keys, value );
            break;
        case _.isString ( value ):
            handle ( 'String' ) ( keys, value );
            break;
        case _.isNull ( value ):
            handle ( 'Null' ) ( keys, value );
            break;
        case _.isUndefined ( value ):
            handle ( 'Undefined' ) ( keys, value );
            break;
    }
};

exports.walkObject = walkObject;
exports.iterator = iterator;
exports.setCustomHandler = setCustomHandler;
