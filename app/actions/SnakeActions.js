var dispatcher = require('../dispatcher.js')

function handleKeyPress(data){
    dispatcher.dispatch({
        data: data,
        type: "keyPress"
    });
}

function moveSnake(data){
    dispatcher.dispatch({
        data: data,
        type: "moveSnake"
   })
}

module.exports = {
    handleKeyPress: handleKeyPress,
    moveSnake: moveSnake
} 