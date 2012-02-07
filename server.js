/*var http = require('http');
var socketio = require('socket.io');
var server = http.createServer(function(req, res) {
  var body = '<html><head>'+
    '<script src="http://localhost:8000/socket.io/socket.io.js"></script>'+
    '<script>'+
    'var s = io.connect("http://localhost:8000/",{transports:["websocket"]});'+
    '\ns.on("connect", function() { document.getElementById("result").innerHTML = "connected " + s.socket.transport.name; });'+
    '</script></head><body>'+
    '<div id="test">testing websocket</div>'+
    '<div id="result">connecting...</div>'+
    '</body></html>';
  res.writeHead(200, 'text/html');
  res.end(body);
});
server.listen(8000);
var io = socketio.listen(server);*/

var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
//Number of players in the game, max is 4
var players = 0;
//Number of players who escaped, if all 4 escape a win message is printed
var escaped = [false,false,false,false];
//Maze arrays
var maze1 = new Array(100);
var maze2 = new Array(100);
var maze3 = new Array(100);
var maze4 = new Array(100);
//Incrementer variables
var i = 0;
var j = 0;

//Setup maze arrays: these are emitted to the clients
fs.readFile(__dirname+"/maze1.txt",'utf8',function(err,data){
  if(err) throw err;
  for(i=0;i<100;i++) {
    maze1[i] = data.charAt(i);
   }
});
fs.readFile(__dirname+"/maze2.txt",'utf8',function(err,data){
  if(err) throw err;
  for(i=0;i<100;i++) {
    maze2[i] = data.charAt(i);
   }
});
fs.readFile(__dirname+"/maze3.txt",'utf8',function(err,data){
  if(err) throw err;
  for(i=0;i<100;i++) {
    maze3[i] = data.charAt(i);
   }
});
fs.readFile(__dirname+"/maze4.txt",'utf8',function(err,data){
  if(err) throw err;
  for(i=0;i<100;i++) {
    maze4[i] = data.charAt(i);
   }
});

//Create server
var server = http.createServer(function(req, res) {
  fs.readFile(__dirname+"/index.html",'utf8',function(err,data){
    if(err) throw err;
    res.writeHead(200,'text/html');
    res.end(data);
  });
});
server.listen(8000);
var io = socketio.listen(server);
//onConnect: set client to next player in array if player count < 4
//           begin game when 4 players detected
io.sockets.on('connection', function(socket) {
  players += 1;
  console.log('connection received, assigning id '+players+' and sending maze');
  //send appropriate maze depending on how many players so far
  //This is technically being dumped on every player connected.
  if(players == 1)
    io.sockets.emit('setup',players,maze1);
  else if(players == 2)
	io.sockets.emit('setup',players,maze2);
  else if(players == 3)
	io.sockets.emit('setup',players,maze3);
  else if(players == 4)
	io.sockets.emit('setup',players,maze4);
//onDisconnect: reduce player count by 1
//				reset game if there is time to implement
  socket.on('disconnect', function() {
	console.log('Player disconnected');
    players -= 1;
  });
//iEscaped: a player escaped! Give him a cookie.
  socket.on('iEscaped', function (player) {
    io.sockets.emit('playerEscaped',player);
	escaped[player-1] = true;
	if(escaped[0] && escaped[1] && escaped[2] && escaped[3])
	  io.sockets.emit('winMsg');
  });
  socket.on('triggerSwitch', function(player,loc) {
	//Open gate in the next maze for the specific switch at loc
	//Send signal to the client in that maze to change a T at loc
	//to "_" then redraw their maze
    console.log('Player '+player+' has hit a switch at '+loc);
	var xLoc;
	var yLoc;
	if(player == 1)
	{
	  if(loc == 18) {//1 opens x:6 y:2
	    xLoc = 6;
		yLoc = 2;
	  }
	  else if(loc == 38) {//g opens x:3 y:4
	    xLoc = 3;
		yLoc = 4;
	  }
	  else if(loc == 41) {//E opens x:6 y:7
		xLoc = 6;
		yLoc = 7;
	  }
	  else if(loc == 46) {//9 opens x:4 y:3
		xLoc = 4;
		yLoc = 3;
	  }
	  else if(loc == 53) {//M opens x:5 y:8
		xLoc = 5;
		yLoc = 8;
	  }
	  else if(loc == 81) {//w opens x:7 y:6
		xLoc = 7;
		yLoc = 6;
	  }
	  else if(loc == 86) {//o opens x:2 y:5
		xLoc = 2;
		yLoc = 5;
	  }
	  else if(loc == 88) {//U opens x:3 y:8
		xLoc = 3;
		yLoc = 8;
	  }
	  io.sockets.emit('openGate',2,xLoc,yLoc);
	}
	if(player == 2) {
	  if(loc == 11) {//a opens x:5 y:7
		xLoc = 5;
		yLoc = 7;
	  }
	  if(loc == 31) {//i opens x:4 y:5
		xLoc = 4;
		yLoc = 5;
	  }
	  if(loc == 38) {//y opens x:3 y:2
		xLoc = 3;
		yLoc = 2;
	  }
	  if(loc == 45) {//3 opens x:4 y:8
		xLoc = 4;
		yLoc = 8;
	  }
	  if(loc == 61) {//q opens x:1 y:5
		xLoc = 1;
		yLoc = 5;
	  }
	  if(loc == 82) {//W opens x:8 y:1
		xLoc = 8;
		yLoc = 1;
	  }
	  if(loc == 84) {//O opens x:7 y:2
		xLoc = 7;
		yLoc = 2;
	  }
	  if(loc == 88) {//G opens x:5 y:2
		xLoc = 5;
		yLoc = 2;
	  }
	  io.sockets.emit('openGate',3,xLoc,yLoc);
	}
	if(player == 3) {
	  if(loc == 11) {//A opens x:3 y:3
		xLoc = 3;
		yLoc = 3;
	  }
	  if(loc == 31) {//s opens x:2 y:5
		xLoc = 2;
		yLoc = 5;
	  }
	  if(loc == 35) {//I opens x:3 y:1
		xLoc = 3;
		yLoc = 1;
	  }
	  if(loc == 47) {//Q opens x:2 y:1
		xLoc = 2;
		yLoc = 1;
	  }
	  if(loc == 63) {//k opens x:4 y:7
		xLoc = 4;
		yLoc = 7;
	  }
	  if(loc == 68) {//c opens x:8 y:6
		xLoc = 8;
		yLoc = 6;
	  }
	  if(loc == 88) {//5 opens x:7 y:8
		xLoc = 7;
		yLoc = 8;
	  }
	  io.sockets.emit('openGate',4,xLoc,yLoc);
	}
	if(player == 4) {
	  if(loc == 11) {//S opens x:8 y:7
		xLoc = 8;
		yLoc = 7;
	  }
	  if(loc == 14) {//K opens x:4 y:4
		xLoc = 4;
		yLoc = 4;
	  }
	  if(loc == 16) {//C opens x:2 y:6
		xLoc = 2;
		yLoc = 6;
	  }
	  if(loc == 31) {//u opens x:5 y:7
		xLoc = 5;
		yLoc = 7;
	  }
	  if(loc == 57) {//e opens x:7 y:4
		xLoc = 7;
		yLoc = 4;
	  }
	  if(loc == 81) {//m opens x:6 y:6
		xLoc = 6;
		yLoc = 6;
	  }
	  if(loc == 86) {//7 opens x:6 y:2
		xLoc = 6;
		yLoc = 2;
	  }
	  io.sockets.emit('openGate',1,xLoc,yLoc);
	}
  });
});
