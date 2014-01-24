var _ = require ( 'underscore' );
var log = require ( __dirname + '/functionLogger.js' );

var customHandlers = {};

var getCustomHandler = function ( type ) {
    if ( _.isFunction ( customHandlers[type] ) ) {
        return customHandlers[type]; 
    }

    return function ( keys, value, userCtx ) { return userCtx; };
};

var setCustomHandler = function ( type, handler ) {
    customHandlers[type] = handler; 
};

var clearCustomHandlers = function () {
    customHandlers = {};
};

var isIterable = function ( object ) {
    return ( _.isObject ( object ) && ! _.isFunction ( object ) );
};

var walkObject = function ( object, iterator, keys, userCtx ) {
    var key, returnedCtx = userCtx;

    log.logFunction ( 'walkObject', arguments );

    if ( _.isUndefined ( keys ) ) {
        keys = [];
    }

    if ( isIterable ( object ) ) {
        for ( key in object ) {
            if ( object.hasOwnProperty ( key ) ) {
                if ( _.isFunction ( iterator ) ) {
                    returnedCtx = iterator ( keys.concat ( [ key ] ), object[key], returnedCtx );
                }
            }
        }
    }

    log.logReturn ( 'walkObject', returnedCtx );

    return returnedCtx;
};

var handle = function ( type ) {
    return function ( keys, value, userCtx ) {
        var ret, passedCtx;

        log.logFunction ( 'handler', arguments );

        _.isFunction ( customHandlers[type] ) && log.logFunction ( 'customHandler', [ keys, value, userCtx ] );

        passedCtx = getCustomHandler ( type ) ( keys, value, userCtx );

        _.isFunction ( customHandlers[type] ) && log.logReturn ( 'customHandler', passedCtx );

        ret = walkObject ( value, iterator, keys, passedCtx );

        log.logReturn ( 'handler', ret );

        return ret;
    };
};

var iterator = function ( keys, value, userCtx ) {
    var type, ret;

    log.logFunction ( 'iterator', arguments );

    switch ( true ) {
        case _.isDate ( value ):
            type = 'Date';
            break;
        case _.isArray ( value ):
            type = 'Array';
            break;
        case _.isObject ( value ):
            type = 'Object';
            break;
        case _.isNumber ( value ):
            type = 'Number';
            break;
        case _.isBoolean ( value ):
            type = 'Boolean';
            break;
        case _.isString ( value ):
            type = 'String';
            break;
        case _.isNull ( value ):
            type = 'Null';
            break;
        case _.isUndefined ( value ):
            type = 'Undefined';
            break;
    }

    ret = handle ( type ) ( keys, value, userCtx );

    log.logReturn ( 'walkObject', ret );

    return ret;
};

exports.walkObject = walkObject;
exports.iterator = iterator;
exports.setCustomHandler = setCustomHandler;
exports.clearCustomHandlers = clearCustomHandlers;
