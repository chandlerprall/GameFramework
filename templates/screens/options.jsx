define(
	[ 'src/Events' ],
	function( Events ) {
		return React.createClass({
			getInitialState: function() {
				return {

				}
			},

			showMenu: function() {
				Events.emit( 'app.screen', 'Menu' );
			},

			render: function() {
				return (
					<section id="loading-screen">
						<div className="centered">
							<h1>Options</h1>
							<button onClick={this.showMenu}>Back to Menu</button>
						</div>
					</section>
				);
			}
		});
	}
);