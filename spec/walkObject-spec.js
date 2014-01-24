describe ( 'walker', function () {
    var _ = require ( 'underscore' );
    var inspect = require ( 'eyes' ).inspector ( { maxLength: 0 } );
    var objectWithAllTypes = require ( __dirname + '/testData.js' ).objectWithAllTypes;
    var walker = require ( __dirname + '/../objectWalker.js' );

    var isIterable = function ( item ) {
        return ( _.isArray ( item ) || _.isObject ( item ) );
    };

    describe ( 'walkObject', function () {
        it ( 'should walk the entire object', function () {
            var iterator = function ( keys, value ) {
                var i, verifiedValue = objectWithAllTypes ();

                for ( i in keys ) {
                    if ( keys.hasOwnProperty ( i ) ) {
                        verifiedValue = verifiedValue[keys[i]];
                    }
                }

                if ( isIterable ( value ) ) {
                    expect ( verifiedValue ).toEqual ( value );
                } else {
                    expect ( verifiedValue ).toBe ( value );
                }

                walker.walkObject ( value, iterator, keys );
            }; 

            walker.walkObject ( objectWithAllTypes (), iterator );
        } );
    } );

    describe ( 'iterator', function () {
        var walker = require ( __dirname + '/../objectWalker.js' );

        it ( 'should walk the entire object with the built-in iterator', function () {
            spyOn ( walker, 'iterator' ).andCallThrough ();

            walker.walkObject ( objectWithAllTypes (), walker.iterator );

            expect ( walker.iterator ).toHaveBeenCalled ();
        } );
    } );

    describe ( 'customHandlers', function () {
        var arrayHandler, objectHandler, stringHandler, booleanHandler, numberHandler, dateHandler, nullHandler, undefinedHandler;

        beforeEach ( function () {
            arrayHandler = jasmine.createSpy ( 'arrayHandler' );
            objectHandler = jasmine.createSpy ( 'objectHandler' );
            stringHandler = jasmine.createSpy ( 'stringHandler' );
            booleanHandler = jasmine.createSpy ( 'booleanHandler' );
            numberHandler = jasmine.createSpy ( 'numberHandler' );
            dateHandler = jasmine.createSpy ( 'dateHandler' );
            nullHandler = jasmine.createSpy ( 'nullHandler' );
            undefinedHandler = jasmine.createSpy ( 'undefinedHandler' );

            walker.setCustomHandler ( 'Array', arrayHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Object', objectHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'String', stringHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Boolean', booleanHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Number', numberHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Date', dateHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Null', nullHandler.andReturn ( 42 ) );
            walker.setCustomHandler ( 'Undefined', undefinedHandler.andReturn ( 42 ) );
        } );

        afterEach ( function () {
            walker.clearCustomHandlers ();
        } );

        it ( 'should walk the entire object with the built-in iterator, and call all the value type handlers', function () {
            walker.walkObject ( objectWithAllTypes (), walker.iterator );

            expect ( arrayHandler ).toHaveBeenCalled ();
            expect ( objectHandler ).toHaveBeenCalled ();
            expect ( stringHandler ).toHaveBeenCalled ();
            expect ( booleanHandler ).toHaveBeenCalled ();
            expect ( numberHandler ).toHaveBeenCalled ();
            expect ( dateHandler ).toHaveBeenCalled ();
            expect ( nullHandler ).toHaveBeenCalled ();
            expect ( undefinedHandler ).toHaveBeenCalled ();
        } );

        it ( 'should walk the entire object with the built-in iterator, and call all the value type handlers with an array, and a value of the right type', function () {
            walker.walkObject ( objectWithAllTypes (), walker.iterator );

            expect ( arrayHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Array ), 42 );
            expect ( objectHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Object ), 42 );
            expect ( stringHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( String ), 42 );
            expect ( booleanHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), true, 42 );
            expect ( numberHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Number ), 42 );
            expect ( dateHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Date ), 42 );
            expect ( nullHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), null, 42 );
            expect ( undefinedHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), undefined, 42 );
        } );
    } );

    describe ( 'customHandlers: called data', function () {
        beforeEach ( function () {
            var setHandler = function ( walker, type ) {
                walker.setCustomHandler ( type, function ( keys, value ) {
                    var i, possibleObjects = [ 'Object', 'Date', 'Null', 'Array' ];
                    var valueInInput = objectWithAllTypes ();

                    switch ( typeof ( value ) ) {
                        case 'object':
                            expect ( possibleObjects ).toContain ( type );
                            break;
                        default:
                            expect ( type.toLowerCase () ).toBe ( typeof ( value ) );
                    }

                    for ( i = 0; i < keys.length; i++ ) {
                        valueInInput = valueInInput[keys[i]];
                    }

                    expect ( value ).toEqual ( valueInInput );

                    return true;
                } );
            };

            setHandler ( walker, 'Array' );
            setHandler ( walker, 'Object' );
            setHandler ( walker, 'String' );
            setHandler ( walker, 'Boolean' );
            setHandler ( walker, 'Number' );
            setHandler ( walker, 'Date' );
            setHandler ( walker, 'Null' );
            setHandler ( walker, 'Undefined' );
        } );

        afterEach ( function () {
            walker.clearCustomHandlers ();
        } );

        it ( 'should walk the entire object with the built-in iterator, and call all the value type handlers with the list of keys and node value', function () {
            var input = objectWithAllTypes ();

            walker.walkObject ( input, walker.iterator );
        } );
    } );

    describe ( 'customHandlers: user context', function () {
        beforeEach ( function () {
            var setNonIterableHandler = function ( type ) {
                walker.setCustomHandler ( type, function ( keys, value, userCtx ) {
                    var returnedCtx = userCtx;

                    if ( _.isUndefined ( returnedCtx ) ) {
                        returnedCtx = [];
                    }

                    returnedCtx.push ( value );

                    return returnedCtx;
                } );
            };

            setNonIterableHandler ( 'String' );
            setNonIterableHandler ( 'Boolean' );
            setNonIterableHandler ( 'Number' );
            setNonIterableHandler ( 'Date' );
            setNonIterableHandler ( 'Null' );
            setNonIterableHandler ( 'Undefined' );
        } );

        afterEach ( function () {
            walker.clearCustomHandlers ();
        } );

        it ( 'should populate the user context with an array of all the non-iterable nodes in the tree', function () {
            var input = objectWithAllTypes ();
            var expectedOutput = [ 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, null, undefined, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, 'test string', 12345, 3.124, true, null, undefined, null, undefined, new Date ( '2011-11-11 11:11:11' ) ];
            var output = [];

            walker.walkObject ( input, walker.iterator, undefined, output );

            expect ( output ).toEqual ( expectedOutput );
        } );
    } );
} );
