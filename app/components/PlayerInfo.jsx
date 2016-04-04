var React = require('react');
var InfoStore = require('../Stores/InfoStore.js');

var playerColor = function(color)
{
	return {
		top: '5px',
		left: '5px',
		display:'inline',
		float: 'left',
		backgroundColor: color,
		height: '20px',
		width: '30px',
		border: '2px'
	}
}

module.exports = React.createClass({
	getInitialState:function(){
		return InfoStore.getState();
	},

	 onChange: function(){
        this.setState(InfoStore.getState());
    },
    
    componentDidMount: function(){
        InfoStore.addChangeListener(this.onChange);
    },
    
    componentWillUnmount: function(){
        InfoStore.removeChangeListener(this.onChange);
    },
	render: function(){
		var state = this.state;
		return(
			<div className="playerInfo">
			{
				this.state.players.map(function(s,index){
					//console.log(s,index,state);
					return(<div className="infoDiv"><div style={playerColor(s.color)}></div>
					<label className="label">{s.name} : {state.scores[index]}</label></div>)
				})
			}
			</div>)
	}
})