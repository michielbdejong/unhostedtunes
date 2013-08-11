(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};b.about=a(function(a,b,c,d,e){return this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{},'<div class="page-header">\n	<h1>About <small>UnhostedTunes</small></h1>\n</div>\n<div class="row">\n	<div class="span6">\n		<p>\n			This is a pretty experimental application at the moment. The motivations behind it are mostly learning and testing the possibilities of making an app of this kind with just <a href="http://remotestorage.io/" target="_blank">remoteStorage</a>. \n		</p>\n		<p>\n			I\'ll release it soon with some agpl alike license in <a href="https://github.com/danielesteban" target="_blank">github</a>. At the current developement stage, which is really alpha, any <a href="mailto:dani@hellacoders.com">feedback</a> will be very appreciated (but probably not replied ;P).\n		</p>\n		<p>\n			Much love.<br />\n			.dani.\n		</p>\n		<hr />\n		<p>\n			<strong>Known issues:</strong>\n			<ul>\n				<li>Seeking does not work with unhosted audio files (on my reStore server, at least).</li>\n				<li>Long unhosted MP3s files have network errors sometimes, which cause the player to skip to the next song.</li>\n				<li>External APIs requests doesn\'t seem to work on firefox linux.</li>\n				<li>Works better in chrome/chromium.</li>\n			</ul>\n		</p>\n	</div>\n	<div class="span2 offset2">\n		<address>\n			<strong>About the author:</strong><br />\n			Daniel Esteban<br />\n			<a href="mailto:dani@hellacoders.com">dani@hellacoders.com</a><br />\n			<a href="https://github.com/danielesteban" target="_blank">github.com/danielesteban</a>\n		</address>\n	</div>\n</div>\n'}),b.addSongs=a(function(a,b,c,d,e){function n(a,b){var d="",e;d+="\n					<select id=\"addSongsPlaylist\" onchange=\"this.value === '-1' &amp;&amp; $(this).hide().next().removeClass('hidden').focus()\">\n						",e=c.each.call(a,a.playlists,{hash:{},inverse:l.noop,fn:l.program(2,o,b),data:b});if(e||e===0)d+=e;return d+="\n					</select>\n					",d}function o(a,b){var d="",e;return d+='\n							<option value="',(e=c.id)?e=e.call(a,{hash:{},data:b}):(e=a.id,e=typeof e===j?e.apply(a):e),d+=k(e)+'">',(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===j?e.apply(a):e),d+=k(e)+"</option>\n						",d}function p(a,b){return'\n					<input type="hidden" id="addSongsPlaylist" value="-1" />\n					'}function q(a,b){return' class="hidden"'}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j="function",k=this.escapeExpression,l=this,m=c.helperMissing;f+='<div id="addSongs" class="modal hide fade">\n	<div class="modal-header">\n		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"addSongs",i):m.call(b,"L","addSongs",i)))+'</h3>\n	</div>\n	<form class="form-horizontal" style="margin:0" onsubmit="PLAYLIST.addSongsSubmit(event)">\n		<div class="modal-body">\n			<div class="control-group">\n				<label class="control-label" for="addSongsPlaylist">Playlist</label>\n				<div class="controls">\n					',h=c["if"].call(b,b.playlists,{hash:{},inverse:l.program(4,p,e),fn:l.program(1,n,e),data:e});if(h||h===0)f+=h;f+='\n					<input type="text" ',h=c["if"].call(b,b.playlists,{hash:{},inverse:l.noop,fn:l.program(6,q,e),data:e});if(h||h===0)f+=h;return f+='placeholder="Title" />\n				</div>\n			</div>\n		</div>\n		<div class="modal-footer">\n			<button type="submit" class="btn btn-primary">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"add",i):m.call(b,"L","add",i)))+"</button>\n		</div>\n	</form>\n</div>\n",f}),b.drag=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h="function",i=this.escapeExpression;return f+='<div id="drag"><i class="icon-plus icon-white"></i> <small>',(g=c.title)?g=g.call(b,{hash:{},data:e}):(g=b.title,g=typeof g===h?g.apply(b):g),f+=i(g)+"</small></div>\n",f}),b.explore=a(function(a,b,c,d,e){function n(a,b){var d="",e;return d+='\n				<option value="',(e=c.id)?e=e.call(a,{hash:{},data:b}):(e=a.id,e=typeof e===j?e.apply(a):e),d+=k(e)+'">',(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===j?e.apply(a):e),d+=k(e)+"</option>\n			",d}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j="function",k=this.escapeExpression,l=c.helperMissing,m=this;f+='<div class="row">\n	<div class="span5 lastPlaylists">\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"lastPlaylists",i):l.call(b,"L","lastPlaylists",i)))+'</h3>\n	</div>\n	<div class="span5">\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"following",i):l.call(b,"L","following",i)))+'</h3>\n	</div>\n	<div class="span8 offset1">\n		<hr /><br />\n	</div>\n</div>\n<div class="row">\n	<div class="span4 offset3">\n		<label class="pull-left" for="exploreCategory" style="margin: 4px 10px 0 0">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"category",i):l.call(b,"L","category",i)))+':</label>\n		<select id="exploreCategory" onchange="EXPLORE.setCategory(event)">\n			',h=c.each.call(b,b.categories,{hash:{},inverse:m.noop,fn:m.program(1,n,e),data:e});if(h||h===0)f+=h;return f+='\n		</select>\n	</div>\n</div>\n<div class="row">\n	<div class="span4">\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"topRated",i):l.call(b,"L","topRated",i)))+'</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="top_rated"></table>\n	</div>\n	<div class="span3">\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"topFavorites",i):l.call(b,"L","topFavorites",i)))+'</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="top_favorites"></table>\n	</div>\n	<div class="span3">\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"trending",i):l.call(b,"L","trending",i)))+'</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="on_the_web"></table>\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"mostShared",i):l.call(b,"L","mostShared",i)))+'</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="most_shared"></table>\n	</div>\n</div>\n',f}),b.history=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i=c.helperMissing,j=this.escapeExpression;return f+='<div class="page-header">\n	<h1>\n		',h={hash:{},data:e},f+=j((g=c.L,g?g.call(b,"history",h):i.call(b,"L","history",h)))+' <small class="labels"></small>\n	</h1>\n</div>\n<div class="row">\n	<div class="span8">\n		<table class="table table-striped table-hover table-condensed songs"></table>\n	</div>\n	<div class="span2">\n		<div class="well">\n			<ul class="nav">\n				<li><button class="btn btn-block btn-danger" onclick="HISTORY.empty()"><i class="icon-remove icon-white"></i> ',h={hash:{},data:e},f+=j((g=c.L,g?g.call(b,"empty",h):i.call(b,"L","empty",h)))+"</button></li>\n			</ul>\n		</div>\n	</div>\n</div>\n",f}),b.magnet=a(function(a,b,c,d,e){function n(a,b,d){var e="",f,g;return e+='\n				<tr class="torrent file file-'+k((f=b.index,typeof f===j?f.apply(a):f))+'">\n					<td>',(g=c.path)?g=g.call(a,{hash:{},data:b}):(g=a.path,g=typeof g===j?g.apply(a):g),e+=k(g)+"</td>\n					<td>",(g=c.length)?g=g.call(a,{hash:{},data:b}):(g=a.length,g=typeof g===j?g.apply(a):g),e+=k(g)+'</td>\n					<td><button class="btn btn-link" onclick="MAGNET.download(\''+k((f=d.magnet,typeof f===j?f.apply(a):f))+"',"+k((f=b.index,typeof f===j?f.apply(a):f))+')">download</button></td>\n					<td><a class="btn btn-link" target="_" href="http://localhost:8086/'+k((f=d.magnet,typeof f===j?f.apply(a):f))+":"+k((f=b.index,typeof f===j?f.apply(a):f))+'">link</a></td>\n				</tr>\n			',e}function o(a,b){var d="",e,f,g;d+='\n					<li>\n						<div class="progress progress-striped active',e=c.unless.call(a,a.uploading,{hash:{},inverse:l.noop,fn:l.program(4,p,b),data:b});if(e||e===0)d+=e;d+='" style="margin:0">\n							<div class="bar" style="width: 100%;">',(e=c.uploading)?e=e.call(a,{hash:{},data:b}):(e=a.uploading,e=typeof e===j?e.apply(a):e),d+=k(e)+'</div>\n						</div>\n						<button class="btn btn-block upload',e=c["if"].call(a,a.uploading,{hash:{},inverse:l.noop,fn:l.program(4,p,b),data:b});if(e||e===0)d+=e;return d+='" onclick="$(this).parent().children().last().click()"><i class="icon-file"></i> ',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"uploadSongs",g):m.call(a,"L","uploadSongs",g)))+'</button>\n						<input type="file" multiple="true" onchange="PLAYLIST.upload(event)" class="hidden" />\n					</li>\n					<li>&nbsp;</li>\n					<li><button class="btn btn-block btn-danger" onclick="confirm(\'',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"areYouSure",g):m.call(a,"L","areYouSure",g)))+"') && PLAYLIST.remove('",(f=c.id)?f=f.call(a,{hash:{},data:b}):(f=a.id,f=typeof f===j?f.apply(a):f),d+=k(f)+'\')"><i class="icon-remove icon-white"></i> ',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"removePlaylist",g):m.call(a,"L","removePlaylist",g)))+"</button></li>\n				",d}function p(a,b){return" hidden"}function q(a,b){var d="",e;d+='\n					<li>\n						<button class="btn btn-block btn-',e=c["if"].call(a,a.downloaded,{hash:{},inverse:l.program(9,s,b),fn:l.program(7,r,b),data:b});if(e||e===0)d+=e;d+='" onclick="PLAYLIST.subscribe(',e=c["if"].call(a,a.downloaded,{hash:{},inverse:l.noop,fn:l.program(11,t,b),data:b});if(e||e===0)d+=e;d+=')"><i class="icon-plus icon-white"></i> ',e=c["if"].call(a,a.downloaded,{hash:{},inverse:l.program(15,v,b),fn:l.program(13,u,b),data:b});if(e||e===0)d+=e;return d+="</button>\n					</li>\n				",d}function r(a,b){return"success"}function s(a,b){return"primary"}function t(a,b){return"true"}function u(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"subscribed",e):m.call(a,"L","subscribed",e)))}function v(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"subscribe",e):m.call(a,"L","subscribe",e)))}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j="function",k=this.escapeExpression,l=this,m=c.helperMissing;f+='<div class="page-header">\n	<h1>\n		',(g=c.title)?g=g.call(b,{hash:{},data:e}):(g=b.title,g=typeof g===j?g.apply(b):g),f+=k(g)+"\n		<div>\n			<small>",(g=c.magnet)?g=g.call(b,{hash:{},data:e}):(g=b.magnet,g=typeof g===j?g.apply(b):g),f+=k(g)+'</small>\n			 <small class="labels"></small>\n		</div>\n	</h1>\n</div>\n<div class="row">\n	<div class="span8">\n		<table class="table table-striped table-hover table-condensed songs">\n			',g=c.each.call(b,b.files,{hash:{},inverse:l.noop,fn:l.programWithDepth(n,e,b),data:e});if(g||g===0)f+=g;f+='\n		</table>\n	</div>\n	<div class="span2">\n		<div class="well">\n			<ul class="nav">\n				<li>\n					<button class="btn btn-block" onclick="PLAYLIST.addToQueue()"><i class="icon-plus"></i> ',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"addToQueue",i):m.call(b,"L","addToQueue",i)))+'</button>\n				</li>\n				<li>\n					<button class="btn btn-block btn-link" onclick="MAGNET.download(\'',(h=c.magnet)?h=h.call(b,{hash:{},data:e}):(h=b.magnet,h=typeof h===j?h.apply(b):h),f+=k(h)+'\')"><i class="icon-download-alt"></i> ',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"download",i):m.call(b,"L","download",i)))+"</button>\n				</li>\n				<li>&nbsp;</li>\n				",h=c["if"].call(b,!1,{hash:{},inverse:l.program(6,q,e),fn:l.program(3,o,e),data:e});if(h||h===0)f+=h;return f+="\n			</ul>\n		</div>\n	</div>\n</div>\n",f}),b.playlist=a(function(a,b,c,d,e){function n(a,b){var d="",e,f;return d+="\n			",f={hash:{},data:b},d+=k((e=c.inline,e?e.call(a,a.title,"playlists",a.id,"title",f):j.call(a,"inline",a.title,"playlists",a.id,"title",f)))+"\n		",d}function o(a,b){var d="",e;return d+="\n			",(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===l?e.apply(a):e),d+=k(e)+"\n		",d}function p(a,b){var d="",e,f;return d+=" <small>",f={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"from",f):j.call(a,"L","from",f)))+" ",f={hash:{},data:b},d+=k((e=c.a,e?e.call(a,(e=a.owner,e==null||e===!1?e:e.user),(e=a.owner,e==null||e===!1?e:e.link),"profile",f):j.call(a,"a",(e=a.owner,e==null||e===!1?e:e.user),(e=a.owner,e==null||e===!1?e:e.link),"profile",f)))+"</small>",d}function q(a,b){var d="",e,f,g;d+='\n					<li>\n						<div class="progress progress-striped active',e=c.unless.call(a,a.uploading,{hash:{},inverse:m.noop,fn:m.program(8,r,b),data:b});if(e||e===0)d+=e;d+='" style="margin:0">\n							<div class="bar" style="width: 100%;">',(e=c.uploading)?e=e.call(a,{hash:{},data:b}):(e=a.uploading,e=typeof e===l?e.apply(a):e),d+=k(e)+'</div>\n						</div>\n						<button class="btn btn-block upload',e=c["if"].call(a,a.uploading,{hash:{},inverse:m.noop,fn:m.program(8,r,b),data:b});if(e||e===0)d+=e;return d+='" onclick="$(this).parent().children().last().click()"><i class="icon-file"></i> ',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"uploadSongs",g):j.call(a,"L","uploadSongs",g)))+'</button>\n						<input type="file" multiple="true" onchange="PLAYLIST.upload(event)" class="hidden" />\n					</li>\n					<li>&nbsp;</li>\n					<li><button class="btn btn-block btn-danger" onclick="confirm(\'',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"areYouSure",g):j.call(a,"L","areYouSure",g)))+"') && PLAYLIST.remove('",(f=c.id)?f=f.call(a,{hash:{},data:b}):(f=a.id,f=typeof f===l?f.apply(a):f),d+=k(f)+'\')"><i class="icon-remove icon-white"></i> ',g={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"removePlaylist",g):j.call(a,"L","removePlaylist",g)))+"</button></li>\n				",d}function r(a,b){return" hidden"}function s(a,b){var d="",e;d+='\n					<li>\n						<button class="btn btn-block btn-',e=c["if"].call(a,a.subscribed,{hash:{},inverse:m.program(13,u,b),fn:m.program(11,t,b),data:b});if(e||e===0)d+=e;d+='" onclick="PLAYLIST.subscribe(',e=c["if"].call(a,a.subscribed,{hash:{},inverse:m.noop,fn:m.program(15,v,b),data:b});if(e||e===0)d+=e;d+=')"><i class="icon-plus icon-white"></i> ',e=c["if"].call(a,a.subscribed,{hash:{},inverse:m.program(19,x,b),fn:m.program(17,w,b),data:b});if(e||e===0)d+=e;return d+="</button>\n					</li>\n				",d}function t(a,b){return"success"}function u(a,b){return"primary"}function v(a,b){return"true"}function w(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"subscribed",e):j.call(a,"L","subscribed",e)))}function x(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"subscribe",e):j.call(a,"L","subscribe",e)))}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j=c.helperMissing,k=this.escapeExpression,l="function",m=this;f+='<div class="page-header">\n	<h1>\n		',g=c["if"].call(b,b.isOwner,{hash:{},inverse:m.program(3,o,e),fn:m.program(1,n,e),data:e});if(g||g===0)f+=g;f+="\n		",g=c["if"].call(b,b.owner,{hash:{},inverse:m.noop,fn:m.program(5,p,e),data:e});if(g||g===0)f+=g;f+='\n		 <small class="labels"></small>\n	</h1>\n</div>\n<div class="row">\n	<div class="span8">\n		<table class="table table-striped table-hover table-condensed songs"></table>\n	</div>\n	<div class="span2">\n		<div class="well">\n			<ul class="nav">\n				<li>\n					<button class="btn btn-block" onclick="PLAYLIST.addToQueue()"><i class="icon-plus"></i> ',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"addToQueue",i):j.call(b,"L","addToQueue",i)))+"</button>\n				</li>\n				<li>&nbsp;</li>\n				",h=c["if"].call(b,b.isOwner,{hash:{},inverse:m.program(10,s,e),fn:m.program(7,q,e),data:e});if(h||h===0)f+=h;return f+="\n			</ul>\n		</div>\n	</div>\n</div>\n",f}),b.playlistListing=a(function(a,b,c,d,e){function l(a,b){return"table-condensed "}function m(a,b){var d="",e;d+="\n		<tr",e=c["if"].call(a,a.hidden,{hash:{},inverse:k.noop,fn:k.program(4,n,b),data:b});if(e||e===0)d+=e;d+=">\n			<td>\n				",e=c["if"].call(a,a.more,{hash:{},inverse:k.program(8,p,b),fn:k.program(6,o,b),data:b});if(e||e===0)d+=e;return d+="\n			</td>\n		</tr>\n	",d}function n(a,b){return' class="hidden"'}function o(a,b){var d="",e,f;return d+="\n					<a class=\"text-center\" onclick=\"$(this).parent().parent().parent().children('tr.hidden').removeClass('hidden').hide().fadeIn();$(this).parent().parent().remove()\">\n						<small>",f={hash:{},data:b},d+=i((e=c.L,e?e.call(a,"seeMore",f):h.call(a,"L","seeMore",f)))+'</small> <span class="caret" style="vertical-align: middle"></span>\n					</a>\n				',d}function p(a,b){var d="",e,f,g;d+='\n					<a href="',(e=c.link)?e=e.call(a,{hash:{},data:b}):(e=a.link,e=typeof e===j?e.apply(a):e),d+=i(e)+'" onclick="LIB.handleLink(event)">\n						',(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===j?e.apply(a):e),d+=i(e)+" ",e=c["if"].call(a,a.owner,{hash:{},inverse:k.noop,fn:k.program(9,q,b),data:b});if(e||e===0)d+=e;d+='\n						<small class="pull-right muted">',(e=c.songs)?e=e.call(a,{hash:{},data:b}):(e=a.songs,e=typeof e===j?e.apply(a):e),d+=i(e)+" ",g={hash:{},data:b},d+=i((e=c.L,e?e.call(a,"songs",g):h.call(a,"L","songs",g)))+"</small>\n						",f=c["if"].call(a,a.search,{hash:{},inverse:k.noop,fn:k.program(11,r,b),data:b});if(f||f===0)d+=f;return d+="\n					</a>\n				",d}function q(a,b){var d="",e,f,g;return d+='<small class="muted">',g={hash:{},data:b},d+=i((e=c.L,e?e.call(a,"from",g):h.call(a,"L","from",g)))+" ",(f=c.owner)?f=f.call(a,{hash:{},data:b}):(f=a.owner,f=typeof f===j?f.apply(a):f),d+=i(f)+"</small>",d}function r(a,b){var d="",e;d+='\n							<ul class="muted">\n								',e=c.each.call(a,a.search,{hash:{},inverse:k.noop,fn:k.program(12,s,b),data:b});if(e||e===0)d+=e;return d+="\n							</ul>\n						",d}function s(a,b){var d="",e;return d+="\n									<li>",(e=c.num)?e=e.call(a,{hash:{},data:b}):(e=a.num,e=typeof e===j?e.apply(a):e),d+=i(e)+" ",(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===j?e.apply(a):e),d+=i(e)+"</li>\n								",d}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h=c.helperMissing,i=this.escapeExpression,j="function",k=this;f+='<table class="table table-striped table-hover ',g=c["if"].call(b,b.condensed,{hash:{},inverse:k.noop,fn:k.program(1,l,e),data:e});if(g||g===0)f+=g;f+='playlists">\n	',g=c.each.call(b,b.playlists,{hash:{},inverse:k.noop,fn:k.program(3,m,e),data:e});if(g||g===0)f+=g;return f+="\n</table>\n",f}),b.playlistMenuItem=a(function(a,b,c,d,e){function l(a,b){return' class="active"'}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i=this,j=c.helperMissing,k=this.escapeExpression;f+="<li",g=c["if"].call(b,b.active,{hash:{},inverse:i.noop,fn:i.program(1,l,e),data:e});if(g||g===0)f+=g;return f+=">",h={hash:{},data:e},f+=k((g=c.a,g?g.call(b,b.title,b.link,b.null,b.icon,h):j.call(b,"a",b.title,b.link,b.null,b.icon,h)))+"</li>\n",f}),b.profile=a(function(a,b,c,d,e){function n(a,b){var d="",e;d+='\n			<ul class="nav" style="margin-bottom: 35px">\n				<li>\n					<button class="btn btn-block btn-',e=c["if"].call(a,a.following,{hash:{},inverse:l.program(4,p,b),fn:l.program(2,o,b),data:b});if(e||e===0)d+=e;d+='" onclick="PROFILE.follow(',e=c["if"].call(a,a.following,{hash:{},inverse:l.noop,fn:l.program(6,q,b),data:b});if(e||e===0)d+=e;d+=')"><i class="icon-plus icon-white"></i> ',e=c["if"].call(a,a.following,{hash:{},inverse:l.program(10,s,b),fn:l.program(8,r,b),data:b});if(e||e===0)d+=e;return d+="</button>\n				</li>\n			</ul>\n		",d}function o(a,b){return"success"}function p(a,b){return"primary"}function q(a,b){return"true"}function r(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"following",e):j.call(a,"L","following",e)))}function s(a,b){var d,e;return e={hash:{},data:b},k((d=c.L,d?d.call(a,"follow",e):j.call(a,"L","follow",e)))}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j=c.helperMissing,k=this.escapeExpression,l=this,m="function";f+='<div class="row">     \n	<div class="span7">\n		<h2 style="margin-bottom: 20px">',(g=c.user)?g=g.call(b,{hash:{},data:e}):(g=b.user,g=typeof g===m?g.apply(b):g),f+=k(g)+"'s ",i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"playlists",i):j.call(b,"L","playlists",i)))+"</h2>\n		",(h=c.playlistListing)?h=h.call(b,{hash:{},data:e}):(h=b.playlistListing,h=typeof h===m?h.apply(b):h),f+=k(h)+'\n	</div>\n	<div class="span2 offset1 text-right">\n		',h=c.unless.call(b,b.isMe,{hash:{},inverse:l.noop,fn:l.program(1,n,e),data:e});if(h||h===0)f+=h;return f+='\n		<img src="http://www.gravatar.com/avatar/',(h=c.gravatar)?h=h.call(b,{hash:{},data:e}):(h=b.gravatar,h=typeof h===m?h.apply(b):h),f+=k(h)+'?&s=160" class="img-polaroid" />\n    	<h4 style="margin-bottom: 0">',(h=c.user)?h=h.call(b,{hash:{},data:e}):(h=b.user,h=typeof h===m?h.apply(b):h),f+=k(h)+'</h4>\n    	<small class="muted">',(h=c.storage)?h=h.call(b,{hash:{},data:e}):(h=b.storage,h=typeof h===m?h.apply(b):h),f+=k(h)+"</small>\n	</div>\n</div>\n",f}),b.queue=a(function(a,b,c,d,e){function m(a,b){return'checked="checked"'}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j=c.helperMissing,k=this.escapeExpression,l=this;f+='<div class="page-header">\n	<h1>\n		',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"queue",i):j.call(b,"L","queue",i)))+' <small class="labels"></small>\n	</h1>\n</div>\n<div class="row">\n	<div class="span8">\n		<table class="table table-striped table-hover table-condensed songs"></table>\n	</div>\n	<div class="span2">\n		<div class="well">\n			<ul class="nav">\n				<li><button class="btn btn-block" onclick="QUEUE.shake()"><i class="icon-random"></i> ',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"shake",i):j.call(b,"L","shake",i)))+'</button></li>\n				<li>&nbsp;</li>\n				<li><button class="btn btn-block btn-danger" onclick="QUEUE.empty()"><i class="icon-remove icon-white"></i> ',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"empty",i):j.call(b,"L","empty",i)))+'</button></li>\n				<li>&nbsp;</li>\n				<li class="text-center"><input id="queueAllowDups" type="checkbox" style="margin: 0 5px 0 0" onchange="QUEUE.allowDups = this.checked" ',h=c["if"].call(b,b.allowDups,{hash:{},inverse:l.noop,fn:l.program(1,m,e),data:e});if(h||h===0)f+=h;return f+='/><label for="queueAllowDups" style="display:inline-block"><small>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"allowDups",i):j.call(b,"L","allowDups",i)))+"</small></label></li>\n			</ul>\n		</div>\n	</div>\n</div>\n",f}),b.renameSong=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j=c.helperMissing,k=this.escapeExpression,l="function";return f+='<div id="renameSong" class="modal hide fade">\n	<div class="modal-header">\n		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n		<h3>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"renameSong",i):j.call(b,"L","renameSong",i)))+'</h3>\n	</div>\n	<form class="form-horizontal" style="margin:0" onsubmit="PLAYLIST.renameSongSubmit(event)">\n		<div class="modal-body">\n			<div class="control-group">\n				<label class="control-label" for="renameSongTitle" style="text-align:left;width:50px">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"title",i):j.call(b,"L","title",i)))+'</label>\n				<div class="controls" style="margin-left:60px">\n					<input type="hidden" id="renameSongId" value="',(h=c.id)?h=h.call(b,{hash:{},data:e}):(h=b.id,h=typeof h===l?h.apply(b):h),f+=k(h)+'" />\n					<input type="text" id="renameSongTitle" class="span5" placeholder="',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"title",i):j.call(b,"L","title",i)))+'" value="',(h=c.title)?h=h.call(b,{hash:{},data:e}):(h=b.title,h=typeof h===l?h.apply(b):h),f+=k(h)+'" />\n				</div>\n			</div>\n		</div>\n		<div class="modal-footer">\n			<button type="submit" class="btn btn-primary">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"rename",i):j.call(b,"L","rename",i)))+"</button>\n		</div>\n	</form>\n</div>\n",f}),b.search=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i="function",j=this.escapeExpression,k=c.helperMissing;return f+='<div class="page-header">\n	<h1>Search <small>',(g=c.query)?g=g.call(b,{hash:{},data:e}):(g=b.query,g=typeof g===i?g.apply(b):g),f+=j(g)+'</small></h1>\n</div>\n<div class="row hidden">\n	<div class="span10" id="search_playlists">\n		<h3>',h={hash:{},data:e},f+=j((g=c.L,g?g.call(b,"playlists",h):k.call(b,"L","playlists",h)))+'</h3>\n	</div>\n</div>\n<div class="row">\n	<div class="span5">\n		<h3>Youtube</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="search_yt"></table>\n	</div>\n	<div class="span5">\n		<h3>SoundCloud</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="search_sc"></table>\n		<h3>Mp3skull</h3>\n		<table class="table table-striped table-hover table-condensed songs" id="search_mp3"></table>\n	</div>\n</div>\n',f}),b.shareSong=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i=c.helperMissing,j=this.escapeExpression;return f+='<div id="shareSong" class="modal hide fade">\n	<div class="modal-header">\n		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n		<h3>',h={hash:{},data:e},f+=j((g=c.L,g?g.call(b,"share",h):i.call(b,"L","share",h)))+'</h3>\n	</div>\n	<form class="form-horizontal" style="margin:0" onsubmit="LIB.cancelHandler(event)">\n		<div class="modal-body">\n			<div class="control-group">\n				<label class="control-label" for="shareSongLink" style="text-align:left;width:50px">Link</label>\n				<div class="controls" style="margin-left:60px">\n					<input id="shareSongLink" type="text" class="span5" />\n				</div>\n			</div>\n		</div>\n		<div class="modal-footer">\n			\n		</div>\n	</form>\n</div>\n',f}),b.skin=a(function(a,b,c,d,e){function m(a,b){return'\n							<li><a onclick="LIB.resetLang(\'en\')" tabindex="-1">English (US)</a></li>\n						'}function n(a,b){return'\n							<li><a onclick="LIB.resetLang(\'es\')" tabindex="-1">Castellano (ES)</a></li>\n						'}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j=c.helperMissing,k=this.escapeExpression,l=this;f+='<div class="navbar navbar-fixed-top">\n	<div class="navbar-inner">\n		',i={hash:{},data:e},f+=k((g=c.a,g?g.call(b,"UnhostedTunes","/","brand",i):j.call(b,"a","UnhostedTunes","/","brand",i)))+'\n		<ul class="nav">\n			<li>\n				<form class="form-search navbar-search" onsubmit="SEARCH.submit(event)">\n					<div class="input-append">\n						<input id="searchBox" type="text" class="span2 search-query" placeholder="',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"search",i):j.call(b,"L","search",i)))+'" />\n						<button type="submit" class="btn btn"><i class="icon-search"></i></button>\n					</div>\n				</form>\n			</li>\n			<li class="divider-vertical"></li>\n			<li rel="explore">',i={hash:{},data:e},f+=k((g=c.a,g?g.call(b,b.null,"/",b.null,b.null,"explore",i):j.call(b,"a",b.null,"/",b.null,b.null,"explore",i)))+'</li>\n			<li rel="about">',i={hash:{},data:e},f+=k((g=c.a,g?g.call(b,"About","/about",i):j.call(b,"a","About","/about",i)))+'</li>\n		</ul>\n		<div id="remotestorage-connect"></div>\n	</div>\n</div>\n<div id="playlistMenu" class="container">\n	<ul class="nav nav-list">\n		<li>',i={hash:{},data:e},f+=k((g=c.a,g?g.call(b,b.null,"/queue",b.null,"list","queue",i):j.call(b,"a",b.null,"/queue",b.null,"list","queue",i)))+"</li>\n		<li>",i={hash:{},data:e},f+=k((g=c.a,g?g.call(b,b.null,"/history",b.null,"book","history",i):j.call(b,"a",b.null,"/history",b.null,"book","history",i)))+'</li>\n		<li class="nav-header">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"playlists",i):j.call(b,"L","playlists",i)))+'</li>\n	</ul>\n	<div id="playlistMenuAdd" class="add">\n		<button class="btn btn-block btn-small" onclick="PLAYLIST.showAdd()"><i class="icon-plus"></i> <span>',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"addPlaylist",i):j.call(b,"L","addPlaylist",i)))+'</span></button>\n	</div>\n	<div class="add" style="display:none">\n		<form class="form" onsubmit="PLAYLIST.add(event)">\n			<div class="input-append">\n				<input type="text" name="title" placeholder="',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"title",i):j.call(b,"L","title",i)))+'" />\n				<button type="submit" class="btn btn"><i class="icon-plus"></i></button>\n			</div>\n		</form>\n	</div>\n</div>\n<div id="panel">\n	<div id="content" class="span10"></div>\n</div>\n<div id="controls" class="navbar navbar-fixed-bottom navbar-inverse">\n	<div class="navbar-inner">\n		<div class="slider">\n			<div></div>\n			<div></div>\n			<span></span>\n			<div class="t"></div>\n		</div>\n		<ul class="nav">\n			<li><button class="btn btn-inverse" onclick="PLAYER.play()"><i class="icon-play"></i></button></li>\n			<li><button class="btn btn-inverse" onclick="PLAYER.prev()"><i class="icon-fast-backward"></i></button></li>\n			<li><button class="btn btn-inverse" onclick="PLAYER.next()"><i class="icon-fast-forward"></i></button></li>\n			<li><button class="btn btn-inverse" onclick="PLAYER.fullscreen()"><i class="icon-fullscreen"></i></button></li>\n			<li class="title"><a onclick="LIB.handleLink(event)"></a></li>\n		</ul>\n		<ul class="nav pull-right">\n			<li class="time"><a>&nbsp;</a></li>\n			<li class="divider-vertical"></li>\n			<li class="lang">\n				<div class="btn-group dropup">\n					<a class="btn btn-inverse dropdown-toggle" data-toggle="dropdown">\n						',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"lang",i):j.call(b,"L","lang",i)))+'\n						<span class="caret"></span>\n					</a>\n					<ul class="dropdown-menu pull-right">\n						',i={hash:{},inverse:l.noop,fn:l.program(1,m,e),data:e},h=(g=c.nequals,g?g.call(b,b.lang,"en",i):j.call(b,"nequals",b.lang,"en",i));if(h||h===0)f+=h;f+="\n						",i={hash:{},inverse:l.noop,fn:l.program(3,n,e),data:e},h=(g=c.nequals,g?g.call(b,b.lang,"es",i):j.call(b,"nequals",b.lang,"es",i));if(h||h===0)f+=h;return f+="\n					</ul>\n				</div>\n			</li>\n		</ul>\n	</div>\n</div>\n",f}),b.song=a(function(a,b,c,d,e){function o(a,b){return"\n		<img class=\"img-rounded\" onload=\"$(this).css('visibility', '').hide().fadeIn('fast')\" style=\"visibility:hidden\" />\n		"}function p(a,b){var d="",e;return d+='\n		<small class="muted">',(e=c.num)?e=e.call(a,{hash:{},data:b}):(e=a.num,e=typeof e===j?e.apply(a):e),d+=k(e)+"</small>\n		",d}function q(a,b){return' class="img-play"'}function r(a,b){return'\n			 <small class="label">HD</small>\n		'}function s(a,b){var d="",e,f;return d+='\n				<li class="queue"><a tabindex="-1">',f={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"addToQueue",f):l.call(a,"L","addToQueue",f)))+'</a></li>\n				<li class="divider"></li>\n				',d}function t(a,b){var d="",e,f;return d+='\n				<li><a tabindex="-1" onclick="PLAYLIST.showRenameSong(\'',(e=c.id)?e=e.call(a,{hash:{},data:b}):(e=a.id,e=typeof e===j?e.apply(a):e),d+=k(e)+"', '",(e=c.title)?e=e.call(a,{hash:{},data:b}):(e=a.title,e=typeof e===j?e.apply(a):e),d+=k(e)+"')\">",f={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"renameSong",f):l.call(a,"L","renameSong",f)))+"</a></li>\n				",d}function u(a,b){var d="",e,f;return d+='\n				<li><a href="',(e=c.download)?e=e.call(a,{hash:{},data:b}):(e=a.download,e=typeof e===j?e.apply(a):e),d+=k(e)+'" tabindex="-1" target="_blank">',f={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"download",f):l.call(a,"L","download",f)))+"</a></li>\n				",d}function v(a,b){var d="",e,f;d+='\n					<li class="divider"></li>\n					<li>\n						<a tabindex="-1" onclick="',e=c["if"].call(a,a.queue,{hash:{},inverse:m.program(18,x,b),fn:m.program(16,w,b),data:b});if(e||e===0)d+=e;return d+='.removeSongs()">',f={hash:{},data:b},d+=k((e=c.L,e?e.call(a,"remove",f):l.call(a,"L","remove",f)))+"</a>\n					</li>\n				",d}function w(a,b){return"QUEUE"}function x(a,b){return"PLAYLIST"}this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h,i,j="function",k=this.escapeExpression,l=c.helperMissing,m=this,n=c.blockHelperMissing;f+="<tr onmouseover=\"$(this).offset().top - 40 > $('#content').height() - $('ul.dropdown-menu', $(this)).height() && !$('div.dropdown', $(this)).hasClass('dropup') && $('div.dropdown', $(this)).addClass('dropup')\">\n	<td>\n		",g=c["if"].call(b,b.search,{hash:{},inverse:m.program(3,p,e),fn:m.program(1,o,e),data:e});if(g||g===0)f+=g;f+='\n		<i class="icon-volume-up"></i>\n		<a',g=c["if"].call(b,b.search,{hash:{},inverse:m.noop,fn:m.program(5,q,e),data:e});if(g||g===0)f+=g;f+='><i class="icon-play"></i></a>\n	</td>\n	<td>\n		',(g=c.title)?g=g.call(b,{hash:{},data:e}):(g=b.title,g=typeof g===j?g.apply(b):g),f+=k(g)+"\n		",g=c["if"].call(b,b.hd,{hash:{},inverse:m.noop,fn:m.program(7,r,e),data:e});if(g||g===0)f+=g;f+='\n	</td>\n	<td class="t">\n		<div class="dropdown pull-right">\n			<small>',(g=c.timeFormatted)?g=g.call(b,{hash:{},data:e}):(g=b.timeFormatted,g=typeof g===j?g.apply(b):g),f+=k(g)+'</small>\n			<a class="dropdown-toggle pull-right" data-toggle="dropdown"><span class="caret"></span></a>\n			<ul class="dropdown-menu pull-right" role="options" aria-labelledby="dropdownMenu">\n				',g=c.unless.call(b,b.queue,{hash:{},inverse:m.noop,fn:m.program(9,s,e),data:e});if(g||g===0)f+=g;f+="\n				",g=c["if"].call(b,b.isOwner,{hash:{},inverse:m.noop,fn:m.program(11,t,e),data:e});if(g||g===0)f+=g;f+='\n				<li><a tabindex="-1" onclick="PLAYLIST.showAddSongs()">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"addTo",i):l.call(b,"L","addTo",i)))+'...</a></li>\n				<li class="divider"></li>\n				<li class="share"><a tabindex="-1">',i={hash:{},data:e},f+=k((g=c.L,g?g.call(b,"share",i):l.call(b,"L","share",i)))+"</a></li>\n				",h=c["if"].call(b,b.download,{hash:{},inverse:m.noop,fn:m.program(13,u,e),data:e});if(h||h===0)f+=h;f+="\n				",i={hash:{},inverse:m.noop,fn:m.program(15,v,e),data:e},(h=c.remove)?h=h.call(b,i):(h=b.remove,h=typeof h===j?h.apply(b):h),c.remove||(h=n.call(b,h,i));if(h||h===0)f+=h;return f+="\n			</ul>\n		</div>\n	</td>\n</tr>\n",f}),b.userMenu=a(function(a,b,c,d,e){this.compilerInfo=[2,">= 1.0.0-rc.3"],c=c||a.helpers,e=e||{};var f="",g,h="function",i=this.escapeExpression;return f+='<ul class="nav pull-right user">\n	<li>\n		<a onclick="$(\'#remotestorage-widget img.cube\').click()">\n			<img src="http://www.gravatar.com/avatar/',(g=c.gravatar)?g=g.call(b,{hash:{},data:e}):(g=b.gravatar,g=typeof g===h?g.apply(b):g),f+=i(g)+'?&s=40" />\n		</a>\n	</li>\n</ul>\n',f})})()