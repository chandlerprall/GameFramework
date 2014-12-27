(function(){
	var listeners = {};

	define(
		[],
		{
			on: function( event, callback ) {
				if ( !listeners.hasOwnProperty( event ) ) {
					listeners[event] = [];
				}

				listeners[event].push( callback );
			},

			removeListener: function( event, callback ) {
				if ( listeners.hasOwnProperty( event ) ) {
					var idx = listeners[event].indexOf( callback );
					listeners[event].splice( idx, 1 );
				}
			},

			emit: function( event, data ) {
				if ( listeners.hasOwnProperty( event ) ) {
					for ( var i = 0; i < listeners[event].length; i++ ) {
						listeners[event][i].call( window, data );
					}
				}
			}
		}
	);
})();