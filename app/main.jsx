var React = require('react');
var ReactDOM = require('react-dom');
var Navigator = require('./components/Navigator.jsx');
                
var menuOptions = ["Home","Score","About"];

function render(){
    ReactDOM.render(<Navigator items={menuOptions} />, document.getElementById("container"));  
}           
 
render();