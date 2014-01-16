var objectWithAllNumbers = function () {
    return {
        Integer: 12345,
        Float: 3.124
    };
};

var objectWithAllPrimitives = function () {
    return {
        String: 'test string',
        Number: objectWithAllNumbers (),
        Boolean: true
    };
};

var objectWithAllSpecials = function () {
    return {
        Null: null,
        Undefined: undefined
    };
};

var objectWithCompositesOfPrimitives = function () {
    return {
        Object: {
            primitive: objectWithAllPrimitives ()
        },
        Array: [
            objectWithAllPrimitives (),
            objectWithAllPrimitives ()
        ]
    };
};

var objectWithAllTypes = function () {
    return {
        primitive: objectWithAllPrimitives (),
        composite: {
            Object: {
                primitive: objectWithAllPrimitives (),
                composite: objectWithCompositesOfPrimitives (),
                special: objectWithAllSpecials ()
            },
            Array: [
                objectWithAllPrimitives (),
                objectWithCompositesOfPrimitives (),
                objectWithAllSpecials ()
            ]
        },
        special: objectWithAllSpecials (),
        date: new Date ( '2011-11-11 11:11:11' )
    };
};

exports.objectWithAllTypes = objectWithAllTypes;
