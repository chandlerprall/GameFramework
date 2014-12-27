define(
	[ 'src/Events', 'templates/screens' ],
	function( Events, Screens ) {
		return React.createClass({
			getInitialState: function() {
				return {
					screen: Screens.Menu,
					game: null
				};
			},

			setScreen: function( screen ) {
				this.setState({
					screen: Screens[screen]
				});
			},

			startGame: function( game ) {
				this.setState(
					{
						game: game
					},
					function() {
						Events.emit( 'app.screen', 'Game' );
					}
				)
			},

			componentWillMount: function() {
				Events.on( 'app.screen', this.setScreen );
				Events.on( 'app.startgame', this.startGame );

				this.setState({
					game: null
				})
			},

			componentWillUnmount: function() {
				Events.removeListener( 'app.screen', this.setScreen );
				Events.removeListener( 'app.startgame', this.startGame );
			},

			render: function() {
				return (
					<this.state.screen game={this.state.game}/>
				);
			}
		});
	}
);