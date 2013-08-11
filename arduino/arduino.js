var http = require('http'),
	server = http.createServer(),
	socket = require('sockjs').createServer(),
	clients = [],
	Arduino = require('arduino'),
	logLevel = 'verbose',
	numBands = 8;

logLevel === 'verbose' && console.log("Connecting to the Arduino...");
Arduino.on('error', function(err) {
	console.log('Arduino ' + err);
});

Arduino.on('req', function(device, func, data) {
	clients.forEach(function(conn) {
		conn.write(JSON.stringify({
			func : func,
			data : data
		}));
	});
});

Arduino.connect(process.argv[2] || '/dev/cu.usbmodem621', function() {
	socket.on('connection', function(conn) {
		conn.on('data', function(req) {
	    	try {
	 		   	req = JSON.parse(req);
	        } catch(e) {
	        	return;
	        }
	   		Arduino.req(255, 1, new Buffer(req));
	    });
	    conn.on('close', function() {
	    	var index = clients.indexOf(conn);
	    	logLevel === 'verbose' && console.log('Client ' + clients[index]._session.connection.id + ' disconnected.');
	    	clients.splice(index, 1);

			//reset the EQ...
			var zeros = [];
			for(var x=0; x<numBands; zeros[x++] = 0);
			Arduino.req(255, 1, new Buffer(zeros));
	    });
	    clients.push(conn);
	    conn.write(JSON.stringify({
			func : 1,
			data : [numBands]
		}));
	    logLevel === 'verbose' && console.log('Client ' + conn._session.connection.id + ' connected.');
	});

	logLevel === 'verbose' && console.log("Starting the local sockjs server...");
	socket.installHandlers(server, {prefix: '/sockjs', log: function() {}});
	var http_port = process.argv[3] ? parseInt(process.argv[3], 10) : 6969;
	server.listen(http_port, '', function() {
		console.log('Server listening on: http://localhost:' + http_port);
	});
});
