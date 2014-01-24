debug = false;

exports.logFunction = function ( funcName, args ) {
    var i, logText;
    
    if ( debug ) {
        logText = funcName + ' (' + "\n", first = true;

        for ( i in args ) {
            if ( args.hasOwnProperty ( i ) ) {
                if ( first ) {
                    logText += "\t" + JSON.stringify ( args[i] );
                } else {
                    logText += ',' + "\n" + "\t" + JSON.stringify ( args[i] );
                }

                first = false;
            }
        }

        logText += "\n" + ');';

        console.log ( logText );
        console.log ( "\n" );
    }
};

exports.logReturn = function ( funcName, value ) {
    var logText;

    if ( debug ) {
        logText = funcName + ' returns ';
        logText += JSON.stringify ( value ) + ';';

        console.log ( logText );
        console.log ( "\n" );
    }
};
