#!/usr/local/bin/node

var exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),
	argv = require('optimist').argv,
	host = argv.host || 'git.hellacoders.com',
	app_name = argv.app || 'UnhostedTunes';

function ssh(command, callback) {
	exec('ssh ' + host + " '" + command + "'", callback);
}

function uglify(files, callback) {
	if(!files.length) return callback();
	var file = files.shift();
	console.log('uglifying ' + file + '...');
	exec('uglifyjs bundle/' + file + ' -nco bundle/' + file, function() {
		uglify(files, callback);
	});
}

function md5(files, path, callback, md5s) {
	if(!files.length) return callback(md5s);
	md5s = md5s || [];

	exec('md5 -q bundle' + path + files.shift(), function(err, stdout, stderr) {
		md5s.push(stdout.substr(0, stdout.length - 1));
		md5(files, path, callback, md5s);
	});
}

function compact(files, ext, callback) {
	exec('cat ' + files + ' > bundle/' + ext + '.' + ext, function() {
		md5([ext + '.' + ext], '/', function(md5) {
			exec('mv bundle/' + ext + '.' + ext + ' bundle/' + md5[0] + '.' + ext, function() {
				callback(md5[0]);
			});
		});
	});
}

function genTemplates(callback) {
	//compact
	fs.readdirSync('bundle/templates').forEach(function(template) {
		if(template.indexOf('.handlebars') === -1) return;
		fs.writeFileSync('bundle/templates/' + template, str_replace_array(fs.readFileSync('bundle/templates/' + template, 'utf8'), ["\n", "\r", "\t"], ['', '', '']));
	});
	//compile
	exec('handlebars -m bundle/templates/*.handlebars -f bundle/templates.js', callback);
}

function writeIndex(css, js) {
	var html = fs.readFileSync('bundle/index.html', 'utf8'),
		index = html.substr(0, html.indexOf('<link'));

	index = index.replace(/<html>/, '<html manifest="/app.manifest">');
	index += '<link href="/' + css + '.css" rel="stylesheet" />';
	index += '<script src="/' + js + '.js"></script>';
	index += html.substr(html.indexOf('<title>'));
	fs.writeFileSync('bundle/index.html', str_replace_array(index, ["\n", "\r", "\t"], ['', '', '']));
}

function genManifest(css, js, callback) {
	var imgs = fs.readdirSync('bundle/img'),
		manifest = "CACHE:\n" +
			"/\n" +
			"/" + css + ".css\n" +
			"/" + js + ".js\n";

	md5(imgs.slice(), '/img/', function(md5s) {
		md5(['soundmanager2_flash9.swf'], '/', function(swfmd5) {
			manifest += "/soundmanager2_flash9.swf?" + swfmd5[0] + "\n";
			for(var x=0; x<2; x++) {
				imgs.forEach(function(img, i) {
					if(x === 1) manifest += "/img/" + img + " ";
					manifest += "/img/" + img + "?" + md5s[i] + "\n";
				});

				x === 0 && (manifest += "\nFALLBACK:\n/ /\n");
			}
			manifest += "/soundmanager2_flash9.swf /soundmanager2_flash9.swf?" + swfmd5[0] + "\n";

			manifest += "\nNETWORK:\n" +
				"/app.manifest\n" +
				"*";

			manifest = "CACHE MANIFEST\n\n# " + require('crypto').createHash('md5').update(manifest).digest('hex') + "\n\n" + manifest;

			fs.writeFileSync('bundle/app.manifest', manifest);
			callback();
		});
	});
}

function str_replace(string, find, replace) {
	var	i = string.indexOf(find),
		len;

	if(i !== -1) {
		len = find.length;
		do {
			string = string.substr(0, i) + replace + string.substr(i + len);

			i = string.indexOf(find);
		} while(i !== -1);
	}

	return string;
}

function str_replace_array(string, find, replace) {
	for(var i = find.length - 1; i >= 0; --i) {
		if(find[i] !== replace[i]) string = str_replace(string, find[i], replace[i]);
	}

	return string;
}

console.log("Creating bundle...");
exec('rm -rf bundle', function() {
	exec('mkdir bundle', function() {
		exec('cp -R css img lib templates index.html main.js server.js soundmanager2_flash9.swf templates.js bundle', function() {
			console.log('compiling templates...');
			genTemplates(function() {
				console.log('compiling css...');
				exec('lessc --yui-compress bundle/css/screen.less bundle/css/screen.css', function() {
					exec('rm -rf bundle/templates bundle/css/screen.less', function() {
						uglify([
							'main.js',
							'lib/lib.js',
							'lib/lang.js',
							'lib/fullscreen.js',
							'lib/handlebars.js',
							'lib/player.js',
							'lib/soundcloud.js',
							'lib/youtube.js',
							'lib/md5.js',
						], function() {
							console.log('compacting css...');
							compact('bundle/css/*.css', 'css', function(cssMD5) {
								console.log('compacting js...');
								compact('bundle/lib/*.js bundle/main.js bundle/templates.js', 'js', function(jsMD5) {
									console.log('cleaning bundle...');
									exec('rm -rf bundle/templates.js bundle/main.js bundle/css bundle/lib bundle/css', function() {
										console.log('generating index & manifest...');
										writeIndex(cssMD5, jsMD5);
										genManifest(cssMD5, jsMD5, function() {
											exec('tar -jcf bundle.tar.bz2 bundle', function() {
												exec('rm -rf bundle', function() {
													if(path.resolve(host).indexOf('/') === 0) {

													} else {
														console.log("Uploading bundle...");
														exec('scp bundle.tar.bz2 ' + host + ':~/' + app_name + '.tar.bz2', function() {
															console.log("Installing bundle...");
															var dir = app_name + '_release_' + Math.round((new Date()).getTime() / 1000),
																commands = [
																	"cd " + app_name,
																	"tar -jxf ../" + app_name + ".tar.bz2",
																	"rm ../" + app_name + ".tar.bz2",
																	"mv bundle " + dir,
																	"rm current",
																	"ln -s " + dir + "/ current",
																	"cd current",
																	"npm install node-static",
																	"forever stop server.js",
																	"forever start server.js"
																];

															ssh(commands.join(" && "), function() {
																exec('rm bundle.tar.bz2', function() {
																	console.log('Done!');
																});
															});
														});
													}
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});
