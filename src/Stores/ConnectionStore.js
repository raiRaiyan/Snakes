var dispatcher = require('../dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SnakeService = require('../Services/SnakeService.js');
var SnakeStore = require('./SnakeStore.js');

var _playerName = '';
var _playerColor = '#555555';
var _btnText =  "Connect to Server";
var _nameInput = false;
var _arenaNotVisible = true;
var CHANGE_EVENT = 'change';

var ConnectionStore = assign({},EventEmitter.prototype,{
    
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT,callback);
    },
    
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },
    
    getPlayerName: function(){
        return _playerName;
    },

    getSnakeColor: function(index){
        return {
            fill: _playerColor
        }
    },

    setColor: function(color){
        _playerColor = color;
    },
    
    getData: function(){
        return {
            name: _playerName,
            btnText: _btnText,
            nameInput: _nameInput,
            arenaNotVisible: _arenaNotVisible,
            color: _playerColor
        };
    },
    
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    }
    
});

ConnectionStore.dispatchId = dispatcher.register(function(payload){
    switch(payload.type)
    {
        case 'startR':
            SnakeService.startR().then(function(){
                console.log("Started R");
                _btnText = "Submit";
                _nameInput =true;
                ConnectionStore.emitChange();
            });
            break;
        case 'startGame':
            // dispatcher.waitFor([Info.dispatchId]);
            // if(InfoStore.nameValid())
            // {
                
            // }
            _playerName = payload.data;
            SnakeService.startSSE(_playerName,_playerColor);
            _nameInput = false;
            _arenaNotVisible = false;
            SnakeStore.setName(_playerName);
            ConnectionStore.emitChange();
            break;
    }
});
module.exports = ConnectionStore;