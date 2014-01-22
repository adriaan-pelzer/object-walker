describe ( 'walker', function () {
    var _ = require ( 'underscore' );
    var inspect = require ( 'eyes' ).inspector ();
    var walker = require ( __dirname + '/../objectWalker.js' );
    var objectWithAllTypes = require ( __dirname + '/testData.js' ).objectWithAllTypes;

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

            walker.setCustomHandler ( 'Array', arrayHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Object', objectHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'String', stringHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Boolean', booleanHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Number', numberHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Date', dateHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Null', nullHandler.andReturn ( true ) );
            walker.setCustomHandler ( 'Undefined', undefinedHandler.andReturn ( true ) );
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

            expect ( arrayHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Array ) );
            expect ( objectHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Object ) );
            expect ( stringHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( String ) );
            expect ( booleanHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), true );
            expect ( numberHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Number ) );
            expect ( dateHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), jasmine.any ( Date ) );
            expect ( nullHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), null );
            expect ( undefinedHandler ).toHaveBeenCalledWith ( jasmine.any ( Array ), undefined );
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

        it ( 'should walk the entire object with the built-in iterator, and call all the value type handlers with the list of keys and node value', function () {
            var input = objectWithAllTypes ();

            walker.walkObject ( input, walker.iterator );
        } );
    } );
} );
