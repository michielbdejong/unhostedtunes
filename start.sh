#!/bin/sh
supervisor --extensions 'js|less|handlebars' --ignore 'css/screen.css,templates.js,bundle' server.dev.js
