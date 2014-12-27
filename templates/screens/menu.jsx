define(
	[ 'src/Events' ],
	function( Events ) {
		return React.createClass({
			getInitialState: function() {
				return {

				}
			},

			startGame: function() {
				Events.emit( 'app.screen', 'Loading' );
			},

			showOptions: function() {
				Events.emit( 'app.screen', 'Options' );
			},

			quitApp: function() {
				var gui = require( 'nw.gui' );
				gui.App.quit();
			},

			render: function() {
				return (
					<section id="menu-screen">
						<div className="centered">
							<h1>Game Framework</h1>

							<nav>
								<button onClick={this.startGame}>Start Game</button>
								<button onClick={this.showOptions}>Options</button>
								{ window.require != null ? ( <button onClick={this.quitApp}>Quit</button> ) : null }
							</nav>
						</div>
					</section>
				);
			}
		});
	}
);