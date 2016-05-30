var dispatcher = require('../dispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SnakeService = require('../Services/SnakeService.js')

var CHANGE_EVENT = 'change';
var _playerId = '0';
var _snakes = [];
var _food = [0,0];
var _colors = ['#555'];

var SnakeStore = assign({},EventEmitter.prototype,{
    
    getState: function(){
        return{
            snakes: _snakes,
            food: _food,
            colors: _colors
        }
    },
    
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT,callback);
    },
    
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },
    
    setName: function(name){
        _playerId = name;
    },
    
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },
    
});

SnakeStore.dispatchId  = dispatcher.register(function(payload){
        switch(payload.type){
            case 'newPlayer':
                _colors = [];
                payload.data.forEach(function(s,index){
                    _colors[index] = s.color;
                });
                SnakeStore.emitChange();
                break;
            case 'keyPress':
                //console.log(payload.data)
                SnakeService.sendKeyPress(payload.data,_playerId).then(
                    // console.log("Moving")
                    );
                break;
            case 'moveSnake':
                //console.log("snake data:",payload.data);
                _snakes = payload.data.s;
                _food = payload.data.f;
                SnakeStore.emitChange();
                break;
        }
    });
    
module.exports = SnakeStore;
