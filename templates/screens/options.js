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
					React.createElement("section", {id: "loading-screen"}, 
						React.createElement("div", {className: "centered"}, 
							React.createElement("h1", null, "Options"), 
							React.createElement("button", {onClick: this.showMenu}, "Back to Menu")
						)
					)
				);
			}
		});
	}
);