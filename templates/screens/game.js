define(
	[ 'src/Events' ],
	function( Events ) {
		return React.createClass({
			getInitialState: function() {
				return {};
			},

			componentDidMount: function() {
				this.getDOMNode().appendChild( this.props.game.renderer.domElement );
				this.props.game.bind();
			},

			componentWillUnmount: function() {
				this.props.game.unbind();
			},

			restart: function() {
				Events.emit( 'app.unloadgame' );
				Events.emit( 'app.screen', 'Menu' );
			},

			render: function() {
				return (
					React.createElement("section", {id: "game-screen"}, 
						React.createElement("nav", null, 
							React.createElement("button", {onClick: this.restart}, "Restart")
						)
					)
				);
			}
		});
	}
);