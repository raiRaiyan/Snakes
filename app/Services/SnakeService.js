var $ = require("jquery");
var Promise = require("es6-promise").Promise;
var SnakeActions = require('../actions/SnakeActions.js');
var InfoActions = require('../actions/InfoActions.js');

var resourceUrl = document.location.origin+'/';

module.exports = {
    sendKeyPress : function (keyCode,id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl + "keyPress?"+id,
                data: JSON.stringify(keyCode),
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                success: resolve,
                error: reject
            });
        });
    },
    
    startR: function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl + "startR",
                method: "POST",
                dataType: "json",
                success: resolve,
                error: reject
            });
        });
    },
    
    startSSE: function (name,color) {
        console.log(color);
        var s = new EventSource("/startGame?"+name+"$"+color.substr(1));
        s.addEventListener('gameOver',function(msg){
            // console.log(msg.data);
            // $scope.key  = msg.data;
            // $scope.arena = false;
            // $scope.btnText = "Play again";
            // $scope.nameInput = true;
            // $scope.myName = id;
            s.close();	
        },false);
        
        s.addEventListener('newPlayer',
            function(msg){
                console.log(msg);
                InfoActions.newPlayer(JSON.parse(msg.data))
            },false);

        s.addEventListener('scoreUpdate',
            function(msg){
                console.log(msg);
                InfoActions.scoreUpdate(JSON.parse(msg.data));
            },false);

        s.addEventListener('message',
            function(msg){
                SnakeActions.moveSnake(JSON.parse(msg.data))
            },
            false);
        
        s.onerror = function(err)
        {
           // ConnectionActions.error(err);
            s.close();
            console.log("Disconnected");
        };
    }
}