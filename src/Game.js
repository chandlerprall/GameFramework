define(
	[
		'src/Events',
		'src/WebAudio',
		'src/PhysicsScene'
	],
	function( Events, WebAudio, PhysicsScene ) {
		var Game = function() {
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.shadowMapEnabled = true;

			this.world = null;

			this.camera_fov = 50;
			this.camera = new THREE.PerspectiveCamera( this.camera_fov, 640 / 480, 1, 100 );
			this.camera.position.set( 10, 7, 10 );
			this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

			this.fog_color = 0x9988AA;
			this.renderer.setClearColor( this.fog_color );

			this.assets = {
				images: {},
				sounds: {},
				models: {},
				materials: {}
			};

			this.animation_frame = null;

			this.onWindowResize = this.onWindowResize.bind( this );
			this.render = this.render.bind( this );
		};

		Game.prototype = {
			setupLights: function() {
				var ambient_light = new THREE.AmbientLight( 0x444444 );
				this.world.addObject( ambient_light );

				var spotlight = new THREE.SpotLight( 0xBBBBBB );
				spotlight.position.set( -7, 15, -5 );
				spotlight.castShadow = true;
				spotlight.shadowMapWidth = spotlight.shadowMapHeight = 1024;
				spotlight.shadowCameraNear = 1;
				spotlight.shadowCameraFar = 50;
				spotlight.shadowDarkness = 0.65;
				this.world.addObject( spotlight );

				var camera_spot = new THREE.SpotLight( 0xDD5555 );
				camera_spot.position.set( -7, 10, 10 );
				camera_spot.castShadow = true;
				camera_spot.shadowMapWidth = camera_spot.shadowMapHeight = 1024;
				camera_spot.shadowCameraFov = 60;
				camera_spot.shadowCameraNear = 1;
				camera_spot.shadowCameraFar = 50;
				camera_spot.shadowDarkness = 0.65;
				this.camera_spot = camera_spot;
				this.world.addObject( camera_spot );
			},

			setupWorld: function() {
				this.world = new PhysicsScene();
				this.world.scene.fog = new THREE.Fog( this.fog_color, 5, 25 );
				this.world.world.solver.relaxation = 0.5;

				this.setupLights();

				var platform = this.world.createPlane( 50, 50, this.assets.materials.platform, Infinity );
				platform.body.rotation.x = -1;
				platform.body.rotation.normalize();

				this.world.world.addListener( 'stepStart', this.onTick.bind( this ) );
			},

			destroyWorld: function() {
				this.world = null;
			},

			onTick: function( tick ) {
				this.played_sound = false;
				var rotation, distance;

				// rotate camera
				distance = this.camera.position.length();
				rotation = new THREE.Quaternion( 0, 0.001, 0, 1 );
				this.camera.translateZ( -distance );
				rotation.multiply( this.camera.quaternion );
				this.camera.quaternion.copy( rotation );
				this.camera.translateZ( distance );

				WebAudio.context.listener.setPosition( this.camera.position.x, this.camera.position.y, this.camera.position.z );
				var forward = new THREE.Vector3( 0, 0, -1 ),
					up = new THREE.Vector3( 0, 1, 0 );
				forward.applyQuaternion( this.camera.quaternion );
				up.applyQuaternion( this.camera.quaternion );
				WebAudio.context.listener.setOrientation( forward.x, forward.y, forward.z, up.x, up.y, up.z );

				// rotate camera spotlight
				this.camera_spot.lookAt( this.world.scene.position );
				distance = this.camera_spot.position.length();
				rotation = new THREE.Quaternion( 0, 0.001, 0, 1 ).normalize();
				this.camera_spot.translateZ( distance );
				rotation.multiply( this.camera_spot.quaternion );
				this.camera_spot.quaternion.copy( rotation );
				this.camera_spot.translateZ( -distance );

				if ( tick % 150 === 1 ) {
					this.createBlock();
				}
			},

			blockImpact: function( other_body, contact ) {
				if ( this.played_sound ) return;
				var velocity = new Goblin.Vector3();
				velocity.subtractVectors( contact.object_a.linear_velocity, contact.object_b.linear_velocity );
				if ( velocity.lengthSquared() >= 5 ) {
					var source = WebAudio.loadSound( this.assets.sounds.impact ),
						panner = WebAudio.context.createPanner();
					panner.refDistance = 3;
					panner.setPosition( contact.contact_point.x, contact.contact_point.y, contact.contact_point.z );
					source.connect( panner );
					panner.connect( this.convolver );
					source.start( 0 );
				}
			},

			createBlock: function() {
				WebAudio.playSound( this.assets.sounds.wobble );

				var block;

				block = this.world.createBox( 1, 1, 1, this.assets.materials.block, 1 );
				block.body.position.set( -8, 4, Math.random() * 2 - 1 );
				block.body.rotation.set( Math.random(), 0, Math.random(), 1 );
				block.body.rotation.normalize();
				block.body.linear_velocity.set( 6, -5, 0 );
				block.body.angular_velocity.set( Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5 );
				block.body.addListener( 'newContact', this.blockImpact.bind( this ) );
			},

			bind: function() {
				window.addEventListener( 'resize', this.onWindowResize );

				this.setupWorld();

				WebAudio.createContext();

				this.convolver = WebAudio.context.createConvolver();
				this.convolver.buffer = this.assets.sounds.carpark_impulse;
				this.convolver.connect( WebAudio.context.destination );

				this.ambient_gain = WebAudio.context.createGain();
				this.ambient_gain.connect( this.convolver );
				this.ambient_gain.gain.value = 0.4;

				this.ambient_sound = WebAudio.loadSound( this.assets.sounds.ambient );
				this.ambient_sound.connect( this.ambient_gain );
				this.ambient_sound.loop = true;
				this.ambient_sound.start();

				this.animation_frame = requestAnimationFrame( this.render );

				this.onWindowResize();
			},

			unbind: function() {
				window.removeEventListener( 'resize', this.onWindowResize );
				this.destroyWorld();
				cancelAnimationFrame( this.animation_frame );

				this.ambient_sound.stop();
				this.ambient_sound = null;
			},

			onWindowResize: function() {
				this.camera.aspect = window.innerWidth / window.innerHeight;

				// adjust the FOV
				this.camera.fov = ( 360 / Math.PI ) * Math.atan( Math.tan( ( ( Math.PI / 180 ) * this.camera_fov / 2 ) ) * ( window.innerHeight / 640 ) );

				this.camera.updateProjectionMatrix();

				this.renderer.setSize( window.innerWidth, window.innerHeight );
			},

			render: function() {
				this.animation_frame = requestAnimationFrame( this.render );
				this.world.step( 1 / 60 );
				this.renderer.render( this.world.scene, this.camera );
			}
		};

		return Game;
	}
);