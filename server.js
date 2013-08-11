var port = process.argv[2] || 8084,
	static = new(require('node-static').Server)('./', {cache : -1});

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        static.serve(request, response, function (e, res) {
            if(e && (e.status === 404)) { // If the file wasn't found
                static.serveFile('/index.html', 200, {}, request, response);
            }
        });
    });
}).listen(port, function() {
	console.log('server started on http://localhost:' + port);
});
