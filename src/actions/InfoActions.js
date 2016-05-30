var dispatcher = require('../dispatcher.js')

function newPlayer(data){
    dispatcher.dispatch({
        type: "newPlayer",
        data: data
    });
}

function scoreUpdate(data){
	 dispatcher.dispatch({
        type: "scoreUpdate",
        data: data
    });
}

module.exports={
    newPlayer: newPlayer,
    scoreUpdate: scoreUpdate
}