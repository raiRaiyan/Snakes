var dispatcher = require('../dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SnakeService = require('../Services/SnakeService.js');

var _players = [];
var _scores = [0];
var CHANGE_EVENT = 'change';


var InfoStore = assign({},EventEmitter.prototype,{
	getState: function(){
		return {
			players: _players,
			scores: _scores
		}
	},

	getSnakeColors: function(){
		return _scores;
	},

	addChangeListener: function(callback){
        this.on(CHANGE_EVENT,callback);
    },
    
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },

    emitChange: function(){
        this.emit(CHANGE_EVENT);
    }
});

InfoStore.dispatchId = dispatcher.register(function(payload){
	switch(payload.type){
		case 'startGame':
			
			
			break;
		case 'newPlayer':
			_players = payload.data;
			InfoStore.emitChange();
			break;
		case 'scoreUpdate':
			_scores = payload.data;
			InfoStore.emitChange();
			break;
	}
});

module.exports = InfoStore;
