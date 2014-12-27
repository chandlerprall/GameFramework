define(
	[
		'templates/screens/menu',
		'templates/screens/options',
		'templates/screens/loading',
		'templates/screens/game'
	],
	function( Menu, Options, Loading, Game ) {
		return {
			Menu: Menu,
			Options: Options,
			Loading: Loading,
			Game: Game
		};
	}
);