var React = require('react');
var ReactDOM = require('react-dom');
var Navigator = require('./components/Navigator');
var menuOptions = ["Home","Score","About"];

var r = function(){
    ReactDOM.render(<Navigator items={menuOptions} />, document.getElementById("container"));  
}           
 
r();