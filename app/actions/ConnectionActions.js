var dispatcher = require('../dispatcher.js')

function startR()
{
    dispatcher.dispatch({
        type: "startR"
    });
}

function startGame(name)
{
    dispatcher.dispatch({
        type: "startGame",
        data: name
    })
}

module.exports={
    startGame: startGame,
    startR: startR
}