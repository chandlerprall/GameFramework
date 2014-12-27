define(
	[
		'src/Game',
		'src/AssetLoader',
		'src/Events',
		'src/MaterialBuilder',
		'templates/components/progress_bar'
	],
	function( Game, AssetLoader, Events, MaterialBuilder, ProgressBar ) {
		return React.createClass({
			getInitialState: function() {
				return {
					progress_percent: 0,
					loading_message: 'Loading...'
				}
			},

			componentDidMount: function() {
				// Start loading things
				var game = new Game();
				this.loadAssets( game );
			},

			updateProgress: function( loader ) {
				this.setState({
					progress_percent: loader.loaded_assets / loader.total_assets * 100
				});
			},

			imageLoaded: function( game, loader, image, name ) {
				game.assets.images[name] = image;
				this.updateProgress( loader );
			},

			soundLoaded: function( game, loader, sound, name ) {
				game.assets.sounds[name] = sound;
				this.updateProgress( loader );
			},

			loadAssets: function( game ) {
				var loader = new AssetLoader(
					function() {
						this.createMaterials( game );
						Events.emit( 'app.startgame', game );
					}.bind( this )
				);

				this.loadImages( game, loader );
				this.loadModels( game, loader );
				this.loadSounds( game, loader );
			},

			createMaterials: function( game ) {
				game.assets.materials.block = MaterialBuilder.createPhong({
					map: MaterialBuilder.createTexture( game.assets.images.block_diffuse )
						.anisotropy( 8 )
						.create(),
					specularMap: MaterialBuilder.createTexture( game.assets.images.block_specular )
						.anisotropy( 8 )
						.create(),
					normalMap: MaterialBuilder.createTexture( game.assets.images.block_normal )
						.anisotropy( 8 )
						.create()
				});
				game.assets.materials.block.normalScale.set( 5, 5 );

				game.assets.materials.platform = MaterialBuilder.createPhong({
					map: MaterialBuilder.createTexture(game.assets.images.platform_diffuse )
						.repeat( 10, 10 )
						.anisotropy( 8 )
						.create(),
					specularMap: MaterialBuilder.createTexture( game.assets.images.platform_specular )
						.repeat( 10, 10 )
						.anisotropy( 8 )
						.create(),
					normalMap: MaterialBuilder.createTexture( game.assets.images.platform_normal )
						.repeat( 10, 10 )
						.anisotropy( 8 )
						.create(),

					specular: 0xCCCCCC
				});
			},

			loadImages: function( game, loader ) {
				loader.loadImage( 'block_diffuse', 'data/images/textures/block/diffuse.png', this.imageLoaded.bind( this, game, loader ) );
				loader.loadImage( 'block_specular', 'data/images/textures/block/specular.png', this.imageLoaded.bind( this, game, loader ) );
				loader.loadImage( 'block_normal', 'data/images/textures/block/normal.png', this.imageLoaded.bind( this, game, loader ) );

				loader.loadImage( 'platform_diffuse', 'data/images/textures/platform/diffuse.png', this.imageLoaded.bind( this, game, loader ) );
				loader.loadImage( 'platform_specular', 'data/images/textures/platform/specular.png', this.imageLoaded.bind( this, game, loader ) );
				loader.loadImage( 'platform_normal', 'data/images/textures/platform/normal.png', this.imageLoaded.bind( this, game, loader ) );
			},

			loadModels: function( game, loader ) {

			},

			loadSounds: function( game, loader ) {
				loader.loadSound( 'wobble', 'data/sounds/wobble.ogg', this.soundLoaded.bind( this, game, loader ) );
				loader.loadSound( 'ambient', 'data/sounds/rhythm-2-2-own-b7-21.ogg', this.soundLoaded.bind( this, game, loader ) );
				loader.loadSound( 'impact', 'data/sounds/impact.ogg', this.soundLoaded.bind( this, game, loader ) );
				loader.loadSound( 'carpark_impulse', 'data/sounds/carpark_balloon_ir_stereo_24bit_44100.ogg', this.soundLoaded.bind( this, game, loader ) );
			},

			render: function() {
				return (
					React.createElement("section", {id: "loading-screen"}, 
						React.createElement("div", {className: "centered"}, 
							React.createElement("h1", null, "Loading"), 
							React.createElement(ProgressBar, {progress: this.state.progress_percent}), 
							React.createElement("p", null, this.state.loading_message)
						)
					)
				);
			}
		});
	}
);