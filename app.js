var express = require('express'); // load express 
var http = require('http'); // then http
var socketIO = require('socket.io'); // then socket

var app = express(); // create application
var server = http.createServer(app); //create server
var io = socketIO.listen(server); // start listening to server.

// setup routing for static files.		
app.use("/public", express.static(__dirname + '/public'));

// setup routing for teacher
app.get('/teacher', function(req, res) {
    res.sendfile(__dirname + '/teacher.html');
});
// setup routing for student
app.get('/student', function(req, res) {
    res.sendfile(__dirname + '/student.html');
});
// listen on 3000
server.listen(3000);
// set logging  to minimal.
io.set('log level', 1);
// on connection send a greeting message.
io.sockets.on('connection', function(socket) {
    // this is a sent to a client connecting.
    socket.emit('getalcanvas', '');
    // if some data appears on teacher,
    // send it to all students.
    socket.on('teacher', function(data) {
        // announce to all students what the teacher said.
        socket.broadcast.emit('student', data);
    });
	socket.on('getSettings',function(){
		socket.emit('teachersettings','');
	});
	
	socket.on('settings',function(data){
		socket.emit('studentsettings',data);
	});
	
	socket.on('clearScreen', function(data){
		socket.broadcast.emit('studentclr','');
	});
	socket.on('penchanged', function(data){
		socket.broadcast.emit('studentpen',data);
	});
	socket.on('colorchanged', function(data){
		socket.broadcast.emit('studentcolor',data);
	});
	socket.on('widthchanged', function(data){
		socket.broadcast.emit('studentwidth',data);
	});
	socket.on('savelesson', function(data){
		//************* Database connection and query *************
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'Hina',
			password: 'RTDOIWBC',
			database: 'smartboard_db'
		});
		connection.connect();
		var qstring = 'INSERT INTO lectures values("' +course+'","'+data[0]+'","'+data[1]+'","'+data[2]+'")';
		connection.query('USE smartboard_db');
		connection.query(qstring, function(err, rows, fields) 
		{
			if (err) 
			{	
				console.log('ERROR: ' + err);
                socket.emit('status','DB error');
				return;
			}
			else socket.emit('ststus','Successfully Added');
		});

		connection.end();
		
	});
});