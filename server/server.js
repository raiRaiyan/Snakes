var http = require('http'),
	server = http.createServer(),
	url = require("url"),
    path = require("path"),
    fs = require("fs"),
    cp = require('child_process')
    net = require('net');

 var distPath = "./dist";
 var rPath = "./server";

 var r,gResponse,rServer,t,stop = true,sseResponse = [];
 var ids =  [],players = [];
 
 var playerData = function(n,c,s){
 	return {
 		name: n,
	 	color: c,
	 	score: s
	 }
 }

var getData = function(request,id,callback)
{
	//console.log("Extracting data form client request");
	var body = [];
	request.on('data',function(chunk){
		body.push(chunk);
	}).on('end',function()
	{
		body = JSON.parse(Buffer.concat(body).toString());
		// console.log("body: " + body.toString());
		callback(id+","+body.toString());
	});
}

var staticFiles = function(request,response)
{
	var uri = url.parse(request.url).pathname
    	, filename = path.join(process.cwd(), distPath,uri);

    console.log(filename);
  
	if (uri === "/" && fs.statSync(filename).isDirectory()) filename += "index.html";
	
	console.log(filename);

	fs.exists(filename, function(exists) {
		if(!exists) {
		  response.writeHead(404, {"Content-Type": "text/plain"});
		  response.write("404 Not Found\n");
		  response.end();
		  return;
		}


		fs.readFile(filename, "binary", function(err, file) {
		  if(err) {        
		    response.writeHead(500, {"Content-Type": "text/plain"});
		    response.write(err + "\n");
		    response.end();
		    return;
		  }

		  response.writeHead(200);
		  response.write(file, "binary");
		  response.end();
		});	
	});
}

var moveSnake = function(data)
{
	console.log("Writing to R" + data);
	rServer.write(data);
}

var handleROutput = function(data)
{
	var op = data.toString();
	console.log("R data received: "+ op);
	if(op.search('>') != -1)
	{
		r.stdin.write("source(\"" +path.join(process.cwd(), rPath, "./sample.R") +"\")\n");
	}
	else if(op.search("started") != -1)
	{
		var send = {"start": "true"}
		gResponse.writeHead(200,{"Content-type" : "application/json"});
		gResponse.write(JSON.stringify(send));
		gResponse.end();
	}
	else if(op === '100')
	{
		setTimeout(function(){
			rServer = net.createConnection({port:6311},function()
			{
				 console.log('connected to server!');
			});

			rServer.on('data', function(data){
				//console.log("Snake Data received: ", data.toString());
				// /console.log((new Date()).getMilliseconds());
				data = data.toString();
				for(var i=0;i<sseResponse.length;i++)
				{
					sseResponse[i].write(data);
				}		
			});
			rServer.on('error',function(err){
				console.log(err)
			});
			rServer.on('end', function(){
	  			console.log('disconnected from server');
			});
		},500);
	}
	else
	{
		if(op.search("\\[")!=-1)
		{
			console.log(op)
			var scores = JSON.parse(op);
			scores.pop();
			for(var j=0;j<players.length;j++){
				players[j].score = scores[j];
				sseResponse[j].write('event: scoreUpdate\ndata: '+JSON.stringify(scores)+'\n\n');
			}
		}
		else if(op.search('score')!=-1)
        {
            var d = op.split(",");
            var delIndex = ids.indexOf(d[0]);
		    //sseResponse.writeHead(200,{"Content-type" : "text/plain"});
            sseResponse[delIndex].write('event: gameOver\ndata: ' + d[1] + '\n\n');
            console.log(ids);
            sseResponse.splice(delIndex,1);
            players.splice(delIndex,1);
            ids.splice(delIndex,1);
            console.log(ids);
            if(sseResponse.length === 0 )
            {
                stop = true;
                clearTimeout(t);
                console.log("Stopped");
            }
        }
			
	}
}

var handleRequest = function(request,response)
{
	console.log("\nReceived request");
	// console.log(request.method+"\n"+request.url+"\n"+request.headers['user-agent']);
	gResponse = response;
	var id = url.parse(request.url);
    
    //console.log(request.method,id.pathname,id.query);
    if(request.method === 'POST')
	{
        if(id.pathname === '/keyPress')
		{
			if(typeof(r)==='undefined')
			{
				response.writeHead(500);
				response.end();
			}
			else if(ids.indexOf(id.query) != -1)
			{
				getData(request,id.query,function(data){
                    if(!stop)
                    {
                        moveSnake(data);
                        if(typeof(t) != 'undefined')
                        {
                            clearInterval(t);
                        }
                        t = setInterval(moveSnake,200,data);
                    }
				});
				response.writeHead(200);
				response.end("Moving snake");
			}
			else
			{
				response.writeHead(200);
				response.end("Game Over");
			}
		}
		else if(id.pathname === '/startR') {
			//startR
			//console.log(typeof(r));
			if(typeof(r) === 'undefined')
			{
				console.log('Starting R');
				r = cp.spawn('R',['--no-save --slave']);
				r.stdout.on('data',handleROutput);
				r.stderr.on('data',function(data){
					console.log(data.toString('utf8'));
				});
				r.stdin.write("cat('>')\n");
			}
			else
			{
				var send = {"start": "true"}
				response.writeHead(200,{"Content-type" : "application/json"});
				response.write(JSON.stringify(send));
				response.end();

			}
		}
	} 
	else if(request.method === 'GET')
	{
		if(id.pathname === '/startGame')
		{
			info = id.query.split('$');
			if(stop){
				stop = false;
				ids.push(info[0]);
				sseResponse.push(response);
				console.log("Starting Game");
				response.on("close",function()
				{
					clearTimeout(t);
				});
				response.writeHead(200, {
				        'Content-Type': 'text/event-stream',
				        'Cache-Control': 'no-cache',
				        'Connection': 'keep-alive'
			    });
                if(typeof(r)!='undefined'){
				    r.stdin.write("playSnake(\""+info[0]+"\")\n");
				    var newPlayer = playerData(info[0],'#'+info[1],0);
					players.push(newPlayer);
				    response.write('event:newPlayer\ndata:'+JSON.stringify(players) + '\n\n');
                }
                else
                    stop = true;
			}
			else if(ids.indexOf(info[0]) === -1)
			{
				ids.push(info[0]);
				sseResponse.push(response);
				response.on("close",function()
				{
                    //remove the corresponding snake from the environment
					clearTimeout(t);
                    // sseResponse[response]
				});
				response.writeHead(200, {
				        'Content-Type': 'text/event-stream',
				        'Cache-Control': 'no-cache',
				        'Connection': 'keep-alive'
			    });
				console.log("Sending new snake request");
				clearTimeout(t);
				rServer.write(info[0]+",new");
				var newPlayer = playerData(info[0],'#'+info[1],0);
				players.push(newPlayer);
				for(var i=0;i<sseResponse.length;i++)
				{
					sseResponse[i].write('event:newPlayer\ndata:'+JSON.stringify(players) + '\n\n');
				}	
			}
		}
		else
		{
			staticFiles(request,response);
		}
	}
}

server.on('request',handleRequest);
server.listen(8081);
console.log("Listening on localhost:8081");
