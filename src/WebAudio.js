define(
	[],
	function() {
		var WebAudio = {
			context: null,

			createContext: function() {
				this.context = new ( window.AudioContext || window.webkitAudioContext )();
			},

			loadSound: function( buffer ) {
				var source = this.context.createBufferSource();
				source.buffer = buffer;
				return source;
			},

			playSound: function( buffer ) {
				var source = this.loadSound( buffer );
				source.connect( this.context.destination );
				source.start( 0 );
				return source;
			}
		};

		WebAudio.createContext();

		return WebAudio;
	}
);