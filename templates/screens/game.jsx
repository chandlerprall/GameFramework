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
					<section id="game-screen">
						<nav>
							<button onClick={this.restart}>Restart</button>
						</nav>
					</section>
				);
			}
		});
	}
);