define(
	[],
	function() {
		var Texture = function( image ) {
			this.texture = new THREE.Texture( image );
			this.texture.needsUpdate = true;
		};

		Texture.prototype = {
			repeat: function( s, t ) {
				this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
				this.texture.repeat.set( s, t );
				return this;
			},

			anisotropy: function( value ) {
				this.texture.anisotropy = value;
				return this;
			},

			create: function() {
				return this.texture;
			}
		};

		var MaterialBuilder = {
			createTexture: function( image ) {
				var texture = new Texture( image );
				return new Texture( image );
			},

			createLambert: function( options ) {
				return new THREE.MeshLambertMaterial( options );
			},

			createPhong: function( options ) {
				return new THREE.MeshPhongMaterial( options );
			}
		};

		return MaterialBuilder;
	}
);