define(
	[],
	function() {
		var MeshBody = function( mesh, body ) {
			this.mesh = mesh;
			this.body = body;
		};
		MeshBody.prototype = {
			sync: function() {
				this.mesh.position.set( this.body.position.x, this.body.position.y, this.body.position.z );
				this.mesh.quaternion.set( this.body.rotation.x, this.body.rotation.y, this.body.rotation.z, this.body.rotation.w );
			}
		};

		var PhysicsScene = function() {
			this.scene = new THREE.Scene();
			this.world = new Goblin.World( new Goblin.SAPBroadphase(), new Goblin.NarrowPhase(), new Goblin.IterativeSolver() );

			this.mesh_bodies = [];
		};

		PhysicsScene.prototype = {
			addObject: function( object ) {
				this.scene.add( object );
			},

			step: function( time ) {
				this.world.step( time );

				for ( var i = 0; i < this.mesh_bodies.length; i++ ) {
					this.mesh_bodies[i].sync();
				}
			},

			createPlane: function( height, depth, material, mass ) {
				var mesh = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( height, depth ),
					material
				);
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				var body = new Goblin.RigidBody(
					new Goblin.PlaneShape( 2, height / 2, depth / 2 ),
					mass
				);

				var mesh_body = new MeshBody( mesh, body );
				this.mesh_bodies.push( mesh_body );

				this.scene.add( mesh );
				this.world.addRigidBody( body );

				return mesh_body;
			},

			createBox: function( width, height, depth, material, mass ) {
				var mesh = new THREE.Mesh(
					new THREE.BoxGeometry( width, height, depth ),
					material
				);
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				var body = new Goblin.RigidBody(
					new Goblin.BoxShape( width / 2, height / 2, depth / 2 ),
					mass
				);

				var mesh_body = new MeshBody( mesh, body );
				this.mesh_bodies.push( mesh_body );

				this.scene.add( mesh );
				this.world.addRigidBody( body );

				return mesh_body;
			}
		};

		return PhysicsScene;
	}
);