var React = require('react');
var SnakeStore = require('../Stores/SnakeStore.js');
var InfoStore = require('../Stores/InfoStore.js')

module.exports = React.createClass({
    getInitialState: function(){
        return SnakeStore.getState();
    },
    
    onChange: function(){
        this.setState(SnakeStore.getState());
    },
    
    componentDidMount: function(){
        SnakeStore.addChangeListener(this.onChange);
    },
    
    componentWillUnmount: function(){
        SnakeStore.removeChangeListener(this.onChange);
    },
    
    render: function(){
        var state = this.state;
        //console.log("Colors",state.colors,"\nSnakes",state.snakes);
        return(
            <svg width="460" height="460">
		        {
                    state.snakes.map(function(s,index){
                        var style = {fill:state.colors[index]};
                        return(s.map(function(p){
                            return(
                            <circle style={style} cx={p[0]*10+5} cy={p[1]*10+5} r="5"/>
                            )
                        }))
                        
                    })
                }
                <line id = "food" x1={this.state.food[0]*10} y1={this.state.food[1]*10+5} x2={this.state.food[0]*10+10} y2 = {this.state.food[1]*10+5}/>
            </svg>
        )
    }
})