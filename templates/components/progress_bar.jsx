define(
	[],
	function(){
		return React.createClass({
			render: function() {
				var bar_style = {
					width: this.props.progress + '%'
				};

				return (
					<div className="component-progressbar"><div style={bar_style}></div></div>
				)
			}
		});
	}
);