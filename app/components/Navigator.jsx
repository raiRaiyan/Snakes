var React = require('react');
var Info = require('./PlayerInfo.jsx');
var RightPanel = require('./RightPanel.jsx')

module.exports = React.createClass({
     
    render: function() {
        return(
            <div className="content">
                <div className="left-panel">
                    <ul className="nav-bar">
                    {
                        this.props.items.map(function(s,index){
                            return(
                                <li>
                                    <a className = "nav-bar-link" href="">{s}</a>
                                </li>);
                        })
                    }
                    </ul>
                    <Info/>
                </div>
                <RightPanel/>
            </div>
        )
    }
})