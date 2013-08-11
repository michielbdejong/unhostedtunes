var port = process.argv[2] || 8888,
	static = new(require('node-static').Server)('./', {cache : -1}),
	exec = require('child_process').exec;

console.log('compiling templates...');
exec('./node_modules/handlebars/bin/handlebars -m templates/*.handlebars -f templates.js', function(err) {
	if(err) throw(err)
	console.log('compiling css...');
	exec('./node_modules/less/bin/lessc --yui-compress css/screen.less css/screen.css', function(err) {
		if(err) throw(err)
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

			/*process.env.SILENT = 1;

			var reStore = require('restore'),
				store = new reStore.Redis(),
				server = new reStore({
			        store : store,
			        http : {port: port + 1}
				});

			server.boot();
			console.log('reStore started on http://localhost:' + (port + 1));*/
		});
	});
});
