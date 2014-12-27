define(
	[ 'src/WebAudio' ],
	function( WebAudio ) {
		var AssetLoader = function( onready ) {
			this.total_assets = 0;
			this.loaded_assets = 0;
			this.onready = onready;
		};
		AssetLoader.prototype = {
			loadImage: function( name, path, callback ) {
				this.total_assets++;

				var img = new Image();
				img.src = path;
				img.onload = this.assetFinished.bind( this, name, callback, img );
			},

			loadSound: function( name, path, callback ) {
				this.total_assets++;

				var req = new XMLHttpRequest();
				req.open( 'GET', path ,true );
				req.responseType = 'arraybuffer';
				req.onload = (function() {
					WebAudio.context.decodeAudioData(
						req.response,
						this.assetFinished.bind( this, name, callback )
					);
				}).bind( this );
				req.send();
			},

			assetFinished: function( name, callback, asset ) {
				this.loaded_assets++;

				callback.call( this, asset, name );

				if ( this.loaded_assets === this.total_assets ) {
					this.onready.call( this );
				}
			}
		};

		return AssetLoader;
	}
);