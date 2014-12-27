define(
	[],
	function(){
		return React.createClass({
			render: function() {
				var bar_style = {
					width: this.props.progress + '%'
				};

				return (
					React.createElement("div", {className: "component-progressbar"}, React.createElement("div", {style: bar_style}))
				)
			}
		});
	}
);