var $ = require("jquery");
var Promise = require("es6-promise").Promise;
var io = require('socket.io-client');

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
        var socket = io(location.protocol+"//"+location.hostname+":8081");
        socket.emit("startGame",JSON.stringify({id:name,color}));
        socket.on('gameOver',function(msg){
            // console.log(msg.data);
            // $scope.key  = msg.data;
            // $scope.arena = false;
            // $scope.btnText = "Play again";
            // $scope.nameInput = true;
            // $scope.myName = id;
            socket.close();	
        });
        
        socket.on('newPlayer',
            function(msg){
                InfoActions.newPlayer(JSON.parse(msg))
            });

        socket.on('scoreUpdate',
            function(msg){
                //console.log("scoreUpdate",msg);
                InfoActions.scoreUpdate(JSON.parse(msg));
            });

        socket.on('message',
            function(msg){
                //console.log("recieved",msg);
                SnakeActions.moveSnake(JSON.parse(msg))
            });
    }
}