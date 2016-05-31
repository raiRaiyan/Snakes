var React = require('react');
var Arena = require('./PlayArena.jsx');
var actions = require('../actions/ConnectionActions.js');
var SnakeActions = require('../actions/SnakeActions.js');

var ConnectionStore = require('../Stores/ConnectionStore.js');

module.exports = React.createClass({
    getInitialState: function(){
       return ConnectionStore.getData();
    },
    
   clickHandler: function(){
        if(this.state.nameInput === false) actions.startR();
        else if(this.state.name.trim() != "")
            actions.startGame(this.state.name);    
    },
    
    onChange: function(){
        this.setState(ConnectionStore.getData());
    },
    
    componentDidMount: function(){
        ConnectionStore.addChangeListener(this.onChange);
    },
    
    componentWillUnmount: function(){
        ConnectionStore.removeChangeListener(this.onChange);
    },
    
    handleChange:function(e){
      this.setState({name: e.target.value.toLowerCase()});
    },

    handleColorChange:function(e){
        ConnectionStore.setColor(e.target.value);
        this.setState({color:e.target.value});
    },
    
    handleKeyPress: function(event){
        if(!this.state.nameInput && !this.state.arenaNotVisible)
        {
            event.preventDefault();
            SnakeActions.handleKeyPress(event.keyCode);
        }
    },
    
    render: function(){
        var dataForm = this.state.nameInput?
                     <div className="Form">
                        <input id="nameText" onChange={this.handleChange} value={this.state.name} placeholder="Enter your name here"/>
                        <div id="color">
                            <label>Color </label>
                            <input type="color" defaultValue={this.state.color} onChange={this.handleColorChange}/>
                        </div>
                    </div>:null;
        var button = this.state.arenaNotVisible?
                    <button className="start-button" onClick = {this.clickHandler}>{this.state.btnText}</button>
                    :null;
        return(
           <div className="right-panel" >
				<div id="arena" onKeyDown = {this.handleKeyPress} tabIndex="0">
                    {dataForm}
                    {button}
					<Arena/>
				</div>
			</div> 
        );
    }
})