
name: "unhostedtunes"
description: "unhosted tunes"
version: "0.2.0"
bundle:
	#fibers: \1.0.0
	#weak: \0.2.2
	#bindings: \1.1.0
	#optimist: \0.3.5
	#coffee-script: \1.4.0
	#LiveScript: 'git://github.com/gkz/LiveScript.git'
	#'prelude-ls': 'git://github.com/gkz/prelude-ls.git'
	#stack: \0.1.0
	#lodash: \1.1.1
	#connect: \2.5.0
	#zappa: \0.3.3
	#'component-builder': \0.6.3
	#component: 'git://github.com/heavyk/component.git'
	#batch: \0.2.1
	#less: \1.3.3
	#stylus: \0.30.1
	#nib: \0.8.2
	#mime: \1.2.7
	#semver: \1.1.0
	#handlebars: \1.0.7
	#mpromise: \0.2.1
	#mongodb: \1.2.14
	#mongoose: \3.6.2
	#'http-proxy': \0.8.5
	#'node-static': \0.6.7
	#'forever-monitor': \1.1.0
	#dnode: \1.0.5
	optimist: \*
	'node-static': \*
scripts: [
	"/lib/_jquery.js"
	"/lib/bootstrap.js"
	"/lib/fullscreen.js"
	"/lib/handlebars.js"
	"/lib/lang.js"
	"/lib/lib.js"
	"/lib/md5.js"
	"/lib/player.js"
	"/lib/remoteStorage.js"
	"/lib/sockjs.js"
	"/lib/soundcloud.js"
	"/lib/soundmanager2.js"
	"/lib/youtube.js"
	"/templates.js"
	"/main.js"
]
statics: [
	'/img/'
	'/css/screen.less'
	'/js/lib.js'
]
'app.manifest': true
dependencies:
	'http-browserify': \* #\0.1.2
	optimist: \*
	'node-static': \*
	shoe: \*
	'youtube-player': \*
	tosource: \*
	dnode: \*
	handlebars: \*
	less: \*
