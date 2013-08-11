remoteStorage.util.silenceAllLoggers();

remoteStorage.defineModule('playlists', function(privateClient, publicClient) {
	/*privateClient.on('conflict', function(event) {
		event.resolve('local');
	});*/
	return {
		exports : {
			on : publicClient.on,
			use : publicClient.use,
			providers : {youtube: 1, soundcloud: 2, remotestorage: 3, url: 4},
			add : function(title, callback) {
				var id = publicClient.uuid().substr(5);
				publicClient.storeObject('playlist', id, {
					title : title,
					songs : [],
					createdAt : Math.round((new Date()).getTime() / 1000)
				}).then(function() {
					callback(id);
				});
			},
			remove : function(playlistId) {
				publicClient.remove(playlistId.replace(/@|\./g, '_').replace(/:/g, '-'));
				publicClient.getObject('order').then(function(order) {
					var i = order.indexOf(playlistId);
					if(i === -1) return;
					order.splice(i, 1);
					publicClient.storeObject('order', 'order', order);
				});
			},
			addSongs : function(playlistId, songs) {
				remoteStorage.playlists.get(playlistId, function(playlist) {
					if(!playlist) return;
					var data = [];
					songs.forEach(function(s) {
						var id = publicClient.uuid().substr(5),
							song = {
								id : id,
								provider : s.provider,
								provider_id : s.provider_id,
								time : s.time,
								title : s.title
							};

						s.provider === remoteStorage.playlists.providers.remotestorage && s.provider_storage && (song.provider_storage = s.provider_storage);
						data.push(song);
					});
					playlist.songs = playlist.songs.concat(data);
					publicClient.storeObject('playlist', playlistId, playlist);
				});
			},
			removeSongs : function(playlistId, ids) {
				remoteStorage.playlists.get(playlistId, function(playlist) {
					if(!playlist) return;
					var l = playlist.songs.length;
					for(var x=0; x<l; x++) {
						if(ids.indexOf(playlist.songs[x].id) !== -1) {
							playlist.songs.splice(x, 1);
							x--;
							l--;
						}
					}
					publicClient.storeObject('playlist', playlistId, playlist);
				});
			},
			reorderSongs : function(playlistId, ids, song_below) {
				remoteStorage.playlists.get(playlistId, function(playlist) {
					if(!playlist) return;
					var songs = [];
					playlist.songs.forEach(function(s, i) {
						if(song_below === s.id) ids.forEach(function(id) {
							songs.push(LIB.arraySearch(playlist.songs, id, 'id'));
						});
						if(ids.indexOf(s.id) === -1) songs.push(s);
					});
					if(!song_below) ids.forEach(function(id) {
						songs.push(LIB.arraySearch(playlist.songs, id, 'id'));
					});
					playlist.songs = songs;
					publicClient.storeObject('playlist', playlistId, playlist);
				});
			},
			renameSong : function(playlistId, id, title) {
				publicClient.getObject(playlistId).then(function(p) {
					var song = LIB.arraySearch(p.songs, id, 'id');
					if(song === false || song.title === title) return;
					song.title = title;
					publicClient.storeObject('playlist', playlistId, p);
				});
			},
			list : function(callback) {
				publicClient.getAll('').then(function(data) {
					var playlists = [],
						ordered = [],
						created = [],
						subscribed = [];

					for(var id in data) {
						var p = data[id];
						if(id === 'order' || !p) continue;
						if(p.storage) {
							p.id = p.storage + ':' + id.substr((p.storage.replace(/@|\./g, '_') + '-').length);
						} else p.id = id;
						delete p['@context'];
						delete p['@type'];
						playlists.push(p);
					}
					if(!data.order) { //legacy
						playlists.sort(function(a, b) {
							var x = a.createdAt,
								y = b.createdAt;

							return ((x > y) ? -1 : ((x < y) ? 1 : 0));
						});
						data.order = [];
						playlists.forEach(function(p) {
							data.order.push(p.id);
						});
						data.order.length && publicClient.storeObject('order', 'order', data.order);
						ordered = playlists;
					} else {
						var update,
							l = data.order.length;

						for(var i=0; i<l; i++) {
							var p = LIB.arraySearch(playlists, data.order[i], 'id');
							if(!p) continue;/*{
								data.order.splice(i, 1);
								i--;
								l--;
								update = true;
							} else*/ ordered.push(p);
						}
						playlists.forEach(function(p) {
							if(LIB.arraySearch(ordered, p.id, 'id')) return;
							data.order.unshift(p.id);
							ordered.unshift(p);
							update = true;
						});
						update && publicClient.storeObject('order', 'order', data.order);
					}
					ordered.forEach(function(p) {
						if(p.storage) subscribed.push(p);
						else created.push(p);
					});
					callback(created, subscribed);
				});
			},
			get : function(id, callback) {
				publicClient.getObject(id).then(function(p) {
					if(p) {
						p.id = id;
						delete p['@context'];
						delete p['@type'];
					}
					callback(p);
				});
			},
			update : function(path, field, value, callback) {
				publicClient.getObject(path).then(function(p) {
					if(p[field] === value) return callback && callback();
					p[field] = value;
					publicClient.storeObject('playlist', path, p).then(callback);
				});
			},
			subscribe : function(playlist) {
				var subscription = {
						title : playlist.title,
						storage : playlist.storage,
						createdAt : Math.round((new Date()).getTime() / 1000)
					},
					playlistId = playlist.id;

				publicClient.storeObject('playlist', playlist.storage.replace(/@|\./g, '_') + '-' + playlistId, subscription);
			},
			subscribed : function(playlist, callback) {
				publicClient.getListing('').then(function(ids) {
					callback(ids.indexOf(playlist.storage.replace(/@|\./g, '_') + '-' + playlist.id) !== -1);
				});
			},
			reorder : function(playlistId, playlist_below) {
				publicClient.getObject('order').then(function(order) {
					var i = order.indexOf(playlistId);
					i !== -1 && order.splice(i, 1);
					i = order.indexOf(playlist_below);
					if(playlist_below && i !== -1) order.splice(i, 0, playlistId);
					else order.push(playlistId);
					publicClient.storeObject('order', 'order', order);
				});
			}
		}
	};
});

remoteStorage.defineModule('music', function(privateClient, publicClient) {
	return {
		exports : {
			on : publicClient.on,
			release : publicClient.release,
			add : function(mimeType, data, callback) {
				var id = publicClient.uuid().substr(5) + '-' + mimeType.substr(6);
				publicClient.storeFile(mimeType, id, data, false).then(function() {
					callback(id);
				});
			},
			getUrl : function(song, callback) {
				if(song.provider_storage === LIB.user()) return callback(publicClient.getItemURL(song.provider_id));
				//THIS SHOULD BE DONE WITH remoteStorage.getForeignClient ... but it doesn't work!!!
				PUBLICDB.getStorageUrl(song.provider_storage, function(url) {
					callback(url + '/public/music/' + song.provider_id);
				});
			},
			remove : publicClient.remove
		}
	};
});

remoteStorage.defineModule('contacts', function(privateClient) {
	return {
		exports : {
			on : privateClient.on,
			use : privateClient.use,
			add : function(contact, callback) {
				var id = privateClient.uuid().substr(5),
					vcard = {
						fn : contact.fn || contact.nickname || PROFILE.getUser(contact.email),
						email : [
							{
								type : 'storage',
								value : contact.email
							}
						]
					};

				contact.photo && (vcard.photo = contact.photo);
				privateClient.storeObject('vcard', id, vcard).then(function() {
					callback && callback(id);
				});
			},
			remove : function(email, callback) {
				remoteStorage.contacts.get(email, function(contact) {
					if(!contact) return;
					privateClient.remove(contact.id).then(function() {
						callback && callback();
					});
				});
			},
			list : function(callback) {
				privateClient.getAll('').then(function(data) {
					var contacts = [];
					for(var id in data) {
						var c = data[id];
						c.id = id;
						delete c['@context'];
						delete c['@type'];
						contacts.push(c);
					}
					callback(contacts);
				});
			},
			get : function(email, callback) {
				privateClient.getAll('').then(function(data) {
					var ret;
					for(var id in data) {
						if(ret) break;
						var c = data[id];
						c.email && c.email.forEach(function(e) {
							if(ret) return;
							if(e.value === email) {
								c.id = id;
								delete c['@context'];
								delete c['@type'];
								callback(c);
								ret = true;
							}
						});
					}
					!ret && callback();
				});
			}
		}
	}
});

SEARCH = {
	templateParams : function(params, cb) {
		cb({
			query : params[0]
		});
	},
	onUnload : function() {
		delete PLAYLIST.selectedSongs;
		$(window).unbind('mousedown', PLAYLIST.resetSelection);
	},
	submit : function(e) {
		LIB.cancelHandler(e);
		var query = $('#searchBox').val().replace(/\//g, "");
		query !== '' && LIB.updateURL('/search/' + query);
	},
	render : function(params) {
		var query = params[0];
		$('#searchBox').val(query);
		PUBLICDB.req('search', {query: query}, function(playlists) {
			var regexp = new RegExp('(' + query.replace(/ /g, '|') + ')', 'ig');
				playlists.forEach(function(p, i) {
					i > 3 && (p.hidden = true);
					p.owner = PROFILE.getUser(p.storage);
					p.link = LIB.playlistLink(p);
					if(p.search) {
						p.search.forEach(function(s, i) {
							var num = LIB.addZero(s[0]) + '. ',
								title = s[1].replace(regexp, "<strong class='match'>$1</strong>");

							i === 0 && s[0] !== 0 && (num = '... ' + num);
							i === p.search.length - 1 && s[0] !== p.songs - 1 && (title = title + ' ...');
							p.search[i] = {num: num, title: new Handlebars.SafeString(title)};
						});
					}
				});
			playlists.length > 4 && playlists.splice(4, 0, {more:true});
			playlists.length && $('#search_playlists').append(Handlebars.templates.playlistListing({playlists: playlists, condensed: true}))
				.parent().removeClass('hidden').hide().fadeIn();
		});
		YT.search('videos', query, 0, function(r) {
		  SEARCH.renderYT('videos', query, 0, r, 0, $('#search_yt'));
		});
		SC.search(query, function(r) {
		  SEARCH.renderSC(query, r, $('#search_sc'));
		});
		PUBLICDB.req('mp3skull', {query: query}, function(songs) {
			var dest = $('#search_mp3');
			songs.forEach(function(s, i) {
				s.id = 'searchMp3' + query + i;
				PLAYLIST.renderSong(s, dest);
			});
		});
			$(window).bind('mousedown', PLAYLIST.resetSelection);
	},
	renderYT : function(feed, query, page, r, count, dest) {
		page === 0 && dest.empty();
		if(r.entry) {
			r.entry.forEach(function(e) {
				if(count === 100 /*|| (e.app$control && e.app$control.yt$state && e.app$control.yt$state.name === 'restricted')*/) return;
				var s = {
						id : 'searchYT' + feed + (query || '') + count,
						provider : remoteStorage.playlists.providers.youtube,
						provider_id : e.id.$t.substr(e.id.$t.lastIndexOf('/') + 1),
						title : e.title.$t,
						time : parseInt(e.media$group.yt$duration.seconds, 10),
						search : true
					};

				e.yt$hd && (s.hd = true);
				PLAYLIST.renderSong(s, dest);
				count++;
			});

			page++;
			if(count < 100 && r.openSearch$totalResults.$t > page * 50) {
				setTimeout(function() {
					YT.search(feed, query, page, function(r) {
						SEARCH.renderYT(feed, query, page, r, count, dest);
					});
				}, 10 * page);
			}
		} else if(page === 0 && count === 0) dest.text("no youtube videos found.");
	},
	renderSC : function(query, r, dest) {
		dest.empty();
		r.forEach(function(t, i) {
			var s = {
					id : 'searchSC' + query + i,
					provider : remoteStorage.playlists.providers.soundcloud,
					provider_id : t.id,
					title : t.user.username + ' - ' + t.title,
					time : Math.round(t.duration / 1000),
					search : true
				};

			PLAYLIST.renderSong(s, dest);
		});
		if(r.length === 0) {
			dest.text("no soundcloud songs found.");
		} else {
			SC.reqArtworks();
		}
	},
	getSong : function(params, callback) {
		var song = {
				provider : parseInt(params[0], 10),
				provider_id : params[1]
			};

		switch(song.provider) {
			case remoteStorage.playlists.providers.youtube:
				YT.get(song.provider_id, function(e) {
					song.title = e.title.$t;
					song.time = parseInt(e.media$group.yt$duration.seconds, 10);
					callback(song);
				});
			break;
			case remoteStorage.playlists.providers.soundcloud:
				SC.get(song.provider_id, function(t) {
					song.title = t.user.username + ' - ' + t.title;
					song.time = Math.round(t.duration / 1000);
					callback(song);
				});
			break;
			case remoteStorage.playlists.providers.remotestorage:
				//TODO
			break;
			case remoteStorage.playlists.providers.url:
				song.provider_id = song.provider_id.replace(/\|/g, "/");
				song.title = decodeURIComponent(song.provider_id.substr(song.provider_id.lastIndexOf('/') + 1));
				callback(song);
		}
	},
	pirateBay : function(query, callback) {
		$.ajax({
			url : '//apify.ifc0nfig.com/tpb/search/' + encodeURIComponent(query),
			data : {
				'$orderby' : 'seeders desc',
				'$filter' : "category eq 'Music'"
			}
		}).done(function(data) {
			callback(typeof data === 'string' ? JSON.parse(data) : data);
		});
	}
};

PROFILE = {
	templateParams : function(params, cb) {
		var storage = params[0];
		if(!storage) return LIB.updateURL('/');
		var p = PROFILE.current = {
				gravatar: md5(storage),
				storage : storage,
				user : PROFILE.getUser(storage)
			},
			ccb = function() {
				//THIS SHOULD BE DONE WITH remoteStorage.getForeignClient ... but it doesn't work!!!
				PUBLICDB.req('getPlaylists', {storage: storage}, function(playlists) {
					playlists.forEach(function(p) {
						p.storage = storage;
						p.link = LIB.playlistLink(p);
					});
					p.playlists = playlists;

					cb(p);
				});
			};

		if(storage === LIB.user() && (p.isMe = true)) return ccb();
		remoteStorage.contacts.get(params[0], function(following) {
			following && (p.following = true);
			ccb();
		});
	},
	onUnload : function() {
		delete PROFILE.current;
	},
	getUser : function(storage) {
		var user = storage.substr(0, storage.indexOf('@'));
		return user[0].toUpperCase() + user.substr(1);
	},
	follow : function(unfollow) {
		if(!LIB.user()) return alert('ERROR: You must first connect to your remoteStorage in order to subscribe to a playlist.');
		var profile = PROFILE.current;
		if(!profile || profile.storage === LIB.user()) return;

		var cb = function() {
				LIB.updateURL(document.location.pathname, true);
			};

		if(unfollow) remoteStorage.contacts.remove(profile.storage, cb);
		else remoteStorage.contacts.add({email: profile.storage}, cb);
	},
	getFollowing : function(callback) {
		remoteStorage.contacts.list(function(contacts){
			var following = [];
			contacts.forEach(function(c) {
				if(!c || !c.email) return;
				var email;
				c.email.forEach(function(e) {
					e.type === 'storage' && (email = e.value);
				});
				email = email || c.emails[0].value;
				if(email === LIB.user()) return;
				following.push(md5(email));
			});
			callback(following);
		});
	}
};

PLAYLIST = {
	templateParams : function(params, cb) {
		var id = params[0],
			d = id.indexOf(':'),
			datacb = function(p) {
				if(!p) return LIB.updateURL('/');
				p.uploading = LIB.uploading;
				PLAYLIST.current = p;
				cb(p);
			};

		if(d !== -1) {
			var storage = id.substr(0, d);
			id = id.substr(d + 1);
			//THIS SHOULD BE DONE WITH remoteStorage.getForeignClient ... but it doesn't work!!!
			if(storage !== LIB.user()) return PUBLICDB.req('getPlaylist', {id: id, storage: storage}, function(p) {
				if(!p) return datacb(p);
				p.owner = {user : PROFILE.getUser(storage), link: '/profile/' + storage};
				remoteStorage.playlists.subscribed(p, function(subscribed) {
					p.subscribed = subscribed;
					datacb(p);
				});
			});
		}

		remoteStorage.playlists.get(id, function(p) {
			p && (p.isOwner = true);
			datacb(p);
		});
	},
	onUnload : function() {
		delete PLAYLIST.current;
		delete PLAYLIST.selectedSongs;
		$(window).unbind('mousedown', PLAYLIST.resetSelection);
		PLAYLIST.renderMenu();
	},
	render : function(params) {
		PLAYLIST.renderSongs();
		if(params[2]) {
			var i = LIB.arraySearch(PLAYLIST.current.songs, params[2], 'id', true);
			i !== false && $('tr:nth-child(' + (i + 1) + ') td a', $('#content table.songs')).first().click();
		}
		$(window).bind('mousedown', PLAYLIST.resetSelection);
		PLAYLIST.renderMenu();
	},
	renderSongs : function() {
		var dest = $('table.songs', '#content');
		dest.empty();
		PLAYLIST.current.songs.forEach(function(s) {
			PLAYLIST.current.isOwner && (s.isOwner = true);
			PLAYLIST.renderSong(s, dest);
		});
		PLAYLIST.renderTotals();
		PLAYLIST.setPlayingSong();
	},
	renderTotals : function() {
		var totals = $('#content h1 small.labels'),
			queue = window.location.pathname === '/queue',
			history = window.location.pathname === '/history';

		if((!queue && !history && !PLAYLIST.current) || !totals) return;
		var songs = (queue ? (PLAYER.queue || []) : history ? HISTORY.get() : PLAYLIST.current.songs),
			t = 0;

		songs.forEach(function(s) {
			t += s.time;
		});
		t = LIB.formatTime(t, true);
		totals.html('<span class="label' + (songs.length ? ' label-info' : '') + '">' + songs.length + ' ' + L.songs + '</span>' + (t !== '' ? ' <span class="label"><i class="icon-time icon-white"></i> ' + t : '</span>'));
	},
	showAdd : function() {
		var d = $('#playlistMenuAdd');
		d.hide();
		d = d.next();
		d.show();

		var i = d.children().children().children('input'),
			md = function(e) {
				if(e.target !== i[0] && e.target !== i.next()[0] && e.target !== i.next().children()[0]) {
					$(window).unbind('mousedown', md);
					i.val('');
					d.hide();
					d.prev().show();
				}
			};

		$(window).bind('mousedown', md);
		i.focus();
	},
	add : function(e, modal) {
		e && LIB.cancelHandler(e);
		var i = modal ? $('#addSongsPlaylist').next() : $(e.target.title),
			d = $('#playlistMenuAdd'),
			button = $('#playlistMenuAdd button');

		if(i.val() === '') return i.focus();
		d.show();
		d.next().hide();
		button.removeClass('btn-success');
		button.children().last().text(L.addPlaylist);
		remoteStorage.playlists.add(i.val(), function(playlistId) {
			if(PLAYLIST.saveSongs) {
				PLAYLIST.addSongs(playlistId, PLAYLIST.saveSongs);
				delete PLAYLIST.saveSongs;
			}
		});
	},
	remove : function(id) {
		remoteStorage.playlists.remove(id);
		LIB.updateURL('/');
	},
	addSongs : function(playlistId, data) {
		var songs = [];
		data.forEach(function(s) {
			songs.push(s.song);
		});
		remoteStorage.playlists.addSongs(playlistId, songs);
	},
	removeSongs : function() {
		var sel = PLAYLIST.selectedSongs,
			ids = [];

		if(!sel) return;
		sel.forEach(function(s) {
			ids.push(s.song.id);
		});
		remoteStorage.playlists.removeSongs(PLAYLIST.current.id, ids);
		delete PLAYLIST.selectedSongs;
	},
	resetSelection : function() {
		if($('#addSongs')[0]) return;
		var sel = PLAYLIST.selectedSongs;
		if(!sel) return;
		sel.forEach(function(s) {
			s.tr.removeClass('info');
		});
		delete PLAYLIST.selectedSongs;
	},
	renderMenu : function() {
		var ul = $('#playlistMenu').children().first();
		remoteStorage.playlists.list(function(playlists, subscribed) {
			while(ul.children().length > 3) ul.children().last().remove();
			var renderLi = function(p, subscribed) {
					var li = $(Handlebars.templates.playlistMenuItem({
							active : PLAYLIST.current && (p.storage ? p.id.substr(p.id.lastIndexOf(':') + 1) : p.id) === PLAYLIST.current.id,
							icon : PLAYER.current && PLAYER.current.song.from && PLAYER.current.song.from.id === (p.storage ? p.id.substr(p.id.lastIndexOf(':') + 1) : p.id) ? 'volume-up' : 'music',
							title : p.title,
							link : LIB.playlistLink(p)
						}))[0];

					li.drop = {
						types : subscribed ? ['playlists'] : ['songs', 'playlists'],
						check : function(o) {
							switch(o.type) {
								case 'songs':
									li.drop.className = 'dropping';
									return o.id !== p.id;
								break;
								case 'playlists':
									li.drop.className = 'dropping-playlists';
									return ((subscribed && o.data[0].storage) || (!subscribed && !o.data[0].storage)) && o.data[0].id !== p.id;
							}

						},
						cb : function(o) {
							switch(o.type) {
								case 'songs':
									PLAYLIST.addSongs(p.id, o.data);
								break;
								case 'playlists':
									remoteStorage.playlists.reorder(o.data[0].id, p.id);
							}
						}
					};

					LIB.preventSelection($(li), function(e) {
						var lli;
						LIB.drag(e, {
							title : p.title,
							type : 'playlists',
							data : [p]
						}, function() {
							lli = $('<li class="lli"><a></a></li>');
							lli[0].drop = {
								types : ['playlists'],
								className : 'dropping-playlists',
								check : function(o) {
									return (subscribed && o.data[0].storage) || (!subscribed && !o.data[0].storage);
								},
								cb : function(o) {
									remoteStorage.playlists.reorder(o.data[0].id);
								}
							}
							if(!subscribed && $('li.nav-header', ul).length > 1) $('li.nav-header', ul).last().before(lli);
							else ul.append(lli);
						}, function() {
							lli.remove();
							lli = null;
						});
					});

					ul.append(li);
				};

			playlists.forEach(function(p) {
				renderLi(p);
			});
			if(subscribed.length) {
				ul.append('<li class="nav-header">' + L.subscribedPlaylists + '</li>');
				subscribed.forEach(function(p) {
					renderLi(p, true);
				});
			}
		});
	},
	renderSong : function(song, dest) {
		if(song.provider === remoteStorage.playlists.providers.remotestorage && !song.download) return remoteStorage.music.getUrl(song, function(url) {
			song.download = url;
			PLAYLIST.renderSong(song, dest);
		});
		song.provider === remoteStorage.playlists.providers.url && (song.download = song.provider_id);
		song.num = LIB.addZero(dest.children().last().children().length + 1);
		var tr = $(Handlebars.templates.song(song)),
			load = function() {
				if(window.location.pathname === '/queue') return QUEUE.jumpTo(tr[0].rowIndex);
				var ps;
				if(PLAYLIST.current) {
					ps = PLAYLIST.current.songs;
					ps && ps.forEach(function(s) {
						s.from = PLAYLIST.current;
					});
				}
				window.location.pathname === '/history' && (ps = HISTORY.get());
				PLAYER.addToQueue(ps ? ps : [song], song, true);
			},
			img = $('img.img-rounded', tr);

		if(img[0]) {
			switch(song.provider) {
				case remoteStorage.playlists.providers.youtube:
					var crop = $('<div class="crop" />');
					img.after(crop);
					crop.append(img);
					img.attr('src', 'http://i.ytimg.com/vi/' + song.provider_id + '/default.jpg');
				break;
				case remoteStorage.playlists.providers.soundcloud:
					if(SC.artworks[song.provider_id]) img.attr('src', SC.artworks[song.provider_id].replace(/crop.jpg/, 'large.jpg'));
					else {
						//im.src = '/img/sc.png';
						if(!SC.artworks_err[song.provider_id]) {
							if(SC.artworks_req.indexOf(song.provider_id) === -1) SC.artworks_req.push(song.provider_id);
							img.addClass('scart' + song.provider_id);
						}
					}
				break;
			}
		}

		$('li.share a', tr).click(function() {
			PLAYLIST.shareSong(song, PLAYLIST.current);
		});

		$('li.queue a', tr).click(function() {
			var songs = [];
			PLAYLIST.selectedSongs.forEach(function(s) {
				s.song.from = PLAYLIST.current;
				songs.push(s.song);
			});
			PLAYER.addToQueue(songs);
		});

		LIB.preventSelection(tr, function(e) {
			var sel = PLAYLIST.selectedSongs,
				data = {
					song : song,
					tr : tr
				};

			!sel && (sel = []);
			var already = false;
			sel.forEach(function(s, i) {
				if(already !== false) return;
				s.song.id === song.id && (already = i);
			});
			if(e.metaKey || e.controlKey || e.shiftKey) { //case for e.shiftKey should be different...
				if(already !== false) {
					sel[already].tr.removeClass('info');
					sel.splice(already, 1);
				} else {
					tr.addClass('info');
					sel.push(data);
				}
			} else if(already === false) {
				PLAYLIST.resetSelection();
				tr.addClass('info');
				sel = [data];
			}
			(song.isOwner || song.queue) && sel.sort(function(a, b) {
				var x = a.tr[0].rowIndex,
					y = b.tr[0].rowIndex;

				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
			PLAYLIST.selectedSongs = sel;

			var ltr;
			LIB.drag(e, {
				title : sel.length > 1 ? sel.length + ' songs' : sel[0].song.title,
				type : 'songs',
				data : sel
			}, function() {
				if(!song.isOwner && !song.queue) return;
				ltr = $('<tr class="ltr"><td colspan="3"/></tr>');
				tr.parent().append(ltr);
				PLAYLIST.hookReorder(ltr);
			}, function() {
				ltr && ltr.remove();
				ltr = null;
			});
		});
		tr.dblclick(load);
		tr.children('td').first().children('a').click(load);

		dest.append(tr);

		if(!song.isOwner && !song.queue) return;
		PLAYLIST.hookReorder(tr, song);
	},
	hookReorder : function(tr, song) {
		tr[0].drop = {
			types : ['songs'],
			check : function(o) {
				var sel = PLAYLIST.selectedSongs,
					inSel = false;

				sel.forEach(function(s) {
					if(inSel) return;
					s.tr[0].rowIndex === tr[0].rowIndex && (inSel = 1);
				});
				return inSel === false && sel[sel.length - 1].tr[0].rowIndex !== tr[0].rowIndex - 1;
			},
			cb : function(o) {
				if(PLAYLIST.current) {
					var song_below = song ? song.id : null,
						ids = [];

					o.data.forEach(function(s) {
						ids.push(s.song.id);
					});
					remoteStorage.playlists.reorderSongs(PLAYLIST.current.id, ids, song_below);
					delete PLAYLIST.selectedSongs;
				} else { //queue
					var queue = [],
						table = $('table.songs', '#content'),
						song_below = song ? tr[0].rowIndex : null,
						ids = [];

					o.data.forEach(function(s) {
						ids.push(s.tr[0].rowIndex);
					});
					PLAYER.queue.forEach(function(s, i) {
						if(song_below === i) o.data.forEach(function(s, x) {
							queue.push(s.song);
							$('tr:nth-child(' + (i + 1) + ')', table).before(s.tr);
						});
						if(ids.indexOf(i) === -1) queue.push(s);
					});
					if(song_below === null) o.data.forEach(function(s, x) {
						queue.push(s.song);
						$(table).append(s.tr);
					});
					$('tr', table).each(function(i, e) {
						$('td small.muted', e).first().text(LIB.addZero(i + 1));
					});
					PLAYER.queue = queue;
					if(song_below === null || song_below > PLAYER.queueId) PLAYER.queueId -= o.data.length;
					else if(song_below <= PLAYER.queueId) PLAYER.queueId += o.data.length;
				}
			}
		}
	},
	upload : function(e) {
		if(!LIB.user()) return alert('ERROR: You must first connect to your remoteStorage in order to upload songs.');
		var files = [],
			t = e.target.files.length,
			r = new FileReader(),
			p = PLAYLIST.current.id,
			process = function() {
				if(!files.length) {
					PLAYLIST.setUploading();
					return; //Done uploading
				}
				var f = files.shift();
				if(f.type.indexOf('audio/') !== 0) return alert('Only audio files!');
				PLAYLIST.setUploading('Uploading... ' + (t - files.length) + ' / ' + t);
				r.onload = function(e) {
					var audio = $('<audio/>');
					audio.attr("src", window.URL.createObjectURL(new Blob([r.result], {type : f.type})));
					audio.bind('loadedmetadata', function(e) {
						remoteStorage.music.add(f.type, r.result, function(id) {
							PLAYLIST.addSongs(p, [{
								song : {
									provider : remoteStorage.playlists.providers.remotestorage,
									provider_id : id,
									provider_storage : LIB.user(),
									title : f.name,
									time : Math.round(audio[0].duration)
								}
							}]);
							process();
						});
					});
				};
				r.readAsArrayBuffer(f);
			};

		for(var x=0; x<t; x++) files.push(e.target.files[x]);
		process();
	},
	setUploading : function(status) {
		LIB.uploading = status;
		if(!PLAYLIST.current) return;
		var c = $('#content'),
			p = $('div.progress.progress-striped.active', c);

		p[(status ? 'remove' : 'add') + 'Class']('hidden');
		$('div.bar', p).text(status);
		$('button.upload', c)[(status ? 'add' : 'remove') + 'Class']('hidden');
	},
	setPlayingSong : function() {
		var ps = PLAYER.current ? PLAYER.current.song : null,
			queue = window.location.pathname === '/queue',
			history = window.location.pathname === '/history';

		ps && PLAYLIST.renderMenu();
		if(!ps || (!queue && !history && (!PLAYLIST.current || !ps.from || ps.from.id !== PLAYLIST.current.id))) return;
		var psi = queue ? PLAYER.queueId : LIB.arraySearch(history ? HISTORY.get() : PLAYLIST.current.songs, ps.id, 'id', true),
			table = $('#content table.songs');

		$('tr', table).removeClass('warning');
		psi !== false && $('tr:nth-child(' + (psi + 1) + ')', table).addClass('warning');
	},
	showAddSongs : function() {
		remoteStorage.playlists.list(function(playlists) {
			playlists.length && playlists.push({id: -1, title: L.newPlaylist});
			var modal = $(Handlebars.templates.addSongs({playlists: playlists.length ? playlists : null}))
				.on('hidden', function() {
					modal.remove();
				})
				.modal();
		});
	},
	addSongsSubmit : function(e) {
		LIB.cancelHandler(e);
		var s = $('#addSongsPlaylist');
		if(s.val() !== '-1') PLAYLIST.addSongs(s.val(), PLAYLIST.selectedSongs);
		else {
			if(s.next().val() === '') return;
			!PLAYLIST.saveSongs && (PLAYLIST.saveSongs = []);
			PLAYLIST.saveSongs = PLAYLIST.saveSongs.concat(PLAYLIST.selectedSongs);
			PLAYLIST.add(null, true);
		}
		PLAYLIST.resetSelection();
		$('#addSongs').modal('hide');
	},
	showRenameSong : function(id, title) {
		var modal = $(Handlebars.templates.renameSong({id: id, title: title}))
			.on('hidden', function() {
				modal.remove();
			})
			.on('shown', function() {
				$('#renameSongTitle').focus();
			})
			.modal();
	},
	renameSongSubmit : function(e) {
		LIB.cancelHandler(e);
		var s = $('#renameSongTitle');
		if(s.val() === '') return;
		remoteStorage.playlists.renameSong(PLAYLIST.current.id, $('#renameSongId').val(), s.val());
		$('#renameSong').modal('hide');
	},
	subscribe : function(unsubscribe) {
		if(!LIB.user()) return alert('ERROR: You must first connect to your remoteStorage in order to subscribe to a playlist.');
		var playlist = PLAYLIST.current;
		if(!playlist || !playlist.storage) return;

		if(unsubscribe) remoteStorage.playlists.remove(PLAYLIST.current.storage + ':' + PLAYLIST.current.id);
		else remoteStorage.playlists.subscribe(playlist);
		LIB.updateURL(document.location.pathname, true);
	},
	shareSong : function(song, playlist) {
		playlist && !playlist.storage && LIB.user() && (playlist.storage = LIB.user());
		var link ='http://' + window.location.host + (playlist ? LIB.playlistLink(playlist) + '/' + song.id : '/song/' + song.provider + '/' + (song.provider_storage ? song.provider_storage + ':' : '') + song.provider_id.replace(/\//g, "|") + '/' + song.title.replace(/ /g, "_").replace(/\//g, "")),
			modal = $(Handlebars.templates.shareSong({}))
			.on('hidden', function() {
				modal.remove();
			})
			.on('shown', function() {
				i.select();
			})
			.modal();

		var i = $('#shareSongLink', modal);
		i.val(link);
		i.on({
			change : function() {
				i.val(link);
			},
			click : function() {
				i.select();
			}
		});
	},
	addToQueue : function() {
		PLAYLIST.current.songs.forEach(function(s) {
			s.from = PLAYLIST.current;
		});
		PLAYER.addToQueue(PLAYLIST.current.songs);
	}
};

EXPLORE = {
	templateParams : function(params, cb) {
		var categories = [];

		L.categories.forEach(function(c, i) {
			categories.push({id: LANG.en.categories[i], title : c});
		});

		cb({
			categories : categories
		});
	},
	onUnload : function() {
		$(window).unbind('mousedown', PLAYLIST.resetSelection);
	},
	render : function(params) {
		var lp = $('div.lastPlaylists', '#content');
		if(params[0]) lp.next().remove() && lp.next().remove() && lp.remove();
		else EXPLORE.getPlaylists();
		var category = params[0] || 'Music';
		if(LANG.en.categories.indexOf(category) === -1) return LIB.updateURL('/');
		$('select', '#content').first().val(category);
		['top_rated', 'top_favorites', 'on_the_web', 'most_shared'].forEach(function(feed) {
			YT.search(feed, category, 0, function(r) {
				SEARCH.renderYT(feed, category, 0, r, 0, $('#' + feed));
			});
		});
		$(window).bind('mousedown', PLAYLIST.resetSelection);
	},
	getPlaylists : function() {
		var lp = $('div.lastPlaylists', '#content');
		if(!lp) return;
		var render = function(playlists, dest) {
				playlists.forEach(function(p, i) {
					i > 9 && (p.hidden = true);
					p.owner = PROFILE.getUser(p.storage);
					p.link = LIB.playlistLink(p);
				});
				playlists.length > 10 && playlists.splice(10, 0, {more:true});
				dest.children().length > 1 && dest.children().last().remove();
				dest.append(Handlebars.templates.playlistListing({playlists: playlists, condensed: true}));
			};

		PUBLICDB.req('getPlaylists', {last : 1}, function(playlists) {
			render(playlists, lp);
		}, LIB.user());

		PUBLICDB.req('getPlaylists', {last: 1, following : 1}, function(playlists) {
			render(playlists, lp.next());
		});
	},
	setCategory : function(e) {
		LIB.updateURL('/explore/' + $(e.target).val());
	}
};

QUEUE = {
	templateParams : function(params, cb) {
		cb({
			allowDups : QUEUE.allowDups
		});
	},
	onUnload : function() {
		$('#playlistMenu').children().first().children().first().removeClass('active');
		$(window).unbind('mousedown', PLAYLIST.resetSelection);
	},
	render : function() {
		$('#playlistMenu').children().first().children().first().addClass('active');
		var dest = $('table.songs', '#content');
		dest.empty();
		setTimeout(PLAYLIST.renderTotals, 0);
		if(!PLAYER.queue) return;
		PLAYER.queue.forEach(function(s) {
			s.queue = true;
			PLAYLIST.renderSong(s, dest);
		});
		$(window).bind('mousedown', PLAYLIST.resetSelection);
		setTimeout(PLAYLIST.setPlayingSong, 0);
	},
	empty : function() {
		delete PLAYER.queue;
		PLAYER.onStateChange(0);
		$('table.songs', '#content').empty();
		QUEUE.updateBadge();
		PLAYLIST.renderTotals();
	},
	removeSongs : function() {
		var sel = PLAYLIST.selectedSongs,
			ids = [];

		if(!sel) return;
		sel.forEach(function(s) {
			var index = s.tr[0].rowIndex;
			PLAYER.queue.splice(index, 1);
			s.tr.remove();
			index < PLAYER.queueId && PLAYER.queueId--;
		});
		$('table.songs tr', '#content').each(function(i, e) {
			$('td small.muted', e).first().text(LIB.addZero(i + 1));
		});
		QUEUE.updateBadge();
	},
	jumpTo : function(index) {
		PLAYER.queueId = index;
		PLAYER.load(PLAYER.queue[PLAYER.queueId]);
	},
	shake : function() {
		if(!PLAYER.queue) return;
		var cs = PLAYER.current.song;
		for(var x=0; x<Math.floor(Math.random() * 3) + 2; x++) PLAYER.queue.sort(function() {
			return Math.floor(Math.random() * 3) - 1;
		});
		PLAYER.queue.forEach(function(s, i) {
			if(s.provider === cs.provider && s.provider_id === cs.provider_id && s.provider_storage === cs.provider_storage) PLAYER.queueId = i;
		});
		QUEUE.onUnload();
		QUEUE.render();
	},
	updateBadge : function() {
		var a = $('#playlistMenu').children().first().children().first().children().first();
		a.children().length > 1 && a.children().last().remove();
		PLAYER.queue && a.append(' <small class="badge badge-info pull-right">' + PLAYER.queue.length + '</small>');
	}
};

HISTORY = {
	onUnload : function() {
		$('#playlistMenu').children().first().children('tr:nth-child(2)').removeClass('active');
		$(window).unbind('mousedown', PLAYLIST.resetSelection);
	},
	render : function() {
		$('#playlistMenu').children().first().children('tr:nth-child(2)').addClass('active');
		var dest = $('table.songs', '#content'),
			history = HISTORY.get();

		dest.empty();
		setTimeout(PLAYLIST.renderTotals, 0);
		history.forEach(function(s) {
			s.history = true;
			PLAYLIST.renderSong(s, dest);
		});
		$(window).bind('mousedown', PLAYLIST.resetSelection);
		setTimeout(PLAYLIST.setPlayingSong, 0);
	},
	get : function() {
		return JSON.parse(window.localStorage.getItem("history") || '[]');
	},
	add : function(s) {
		var history = HISTORY.get(),
			song = {
				id : (new Date()).getTime(),
				provider : s.provider,
				provider_id : s.provider_id,
				time : s.time,
				title : s.title
			};

		s.provider === remoteStorage.playlists.providers.remotestorage && s.provider_storage && (song.provider_storage = s.provider_storage);
		history.unshift(song);
		//TODO: benchmark at which length we need to start poping songs.
		window.localStorage.setItem("history", JSON.stringify(history));
		if(window.location.pathname === '/history') {
			HISTORY.onUnload();
			HISTORY.render();
		}
	},
	empty : function() {
		window.localStorage.removeItem("history");
		$('table.songs', '#content').empty();
		PLAYLIST.renderTotals();
	},
};

PUBLICDB = {
	_listeners: {},
	connect : function() {
		var sock = new SockJS('http://localhost:8085/PublicDB');
		PUBLICDB.sock = sock;
		sock.onopen = function() {
			PUBLICDB.connected = true;
			if(PUBLICDB.connectCallbacks) {
				PUBLICDB.connectCallbacks.forEach(function(p) {
					PUBLICDB.req(p[0], p[1], p[2]);
				});
				delete PUBLICDB.connectCallbacks;
			}
			PUBLICDB.reconnectTimeout = 1;

			/* Experimental */
			LIB.user() && PROFILE.getFollowing(function(following) {
				PUBLICDB.req('following', {
					'users' : following
				});
				PUBLICDB.followingOnServer = true;
				if(PUBLICDB.followingCallbacks) {
					PUBLICDB.followingCallbacks.forEach(function(p) {
						PUBLICDB.req(p[0], p[1], p[2]);
					});
					delete PUBLICDB.followingCallbacks;
				}
			});
		};
		sock.onmessage = function(e) {
			try {
				e.data = JSON.parse(e.data);
			} catch(e) {
				return;
			}
			if(e.data.callback && PUBLICDB.callbacks[e.data.callback]) {
				var cid = e.data.callback;
				console.log("PublicDB.onmessage", cid);
				PUBLICDB.callbacks[cid](e.data.data);
				delete PUBLICDB.callbacks[cid];
			}
			var evt, listeners;
			console.log("msg:", e.data.event);
			if(evt = e.data.event) {
				if(listeners = PUBLICDB._listeners[evt]) {
					listeners.forEach(function(l) {
						l(e.data.data);
					});
				}
				if(listeners = PUBLICDB._listeners['*']) {
					listeners.forEach(function(l) {
						l(evt, e.data.data);
					});
				}
			}
		};
		sock.onclose = function() {
			delete PUBLICDB.connected;
			delete PUBLICDB.followingOnServer;
			setTimeout(PUBLICDB.connect, PUBLICDB.reconnectTimeout * 1000);
			PUBLICDB.reconnectTimeout += 5;
		};
	},
	on : function(evt, cb) {
		var l;
		if(l = PUBLICDB._listeners[evt]) {
			l.push(cb);
		} else {
			PUBLICDB._listeners[evt] = [cb];
		}
	},
	off : function(evt, cb) {
		console.error("TODO: PUBLICDB.off()")
	},
	req : function(func, params, callback, requireFollowing) {
		if(LIB.user() && (requireFollowing || params.following) && !PUBLICDB.followingOnServer) {
			!PUBLICDB.followingCallbacks && (PUBLICDB.followingCallbacks = []);
			PUBLICDB.followingCallbacks.push([func, params, callback]);
			return;
		}
		if(!PUBLICDB.connected) {
			!PUBLICDB.connectCallbacks && (PUBLICDB.connectCallbacks = []);
			PUBLICDB.connectCallbacks.push([func, params, callback]);
			return;
		}
		if(callback) {
			if(!PUBLICDB.callbacks) {
				PUBLICDB.callbacks = [];
				PUBLICDB.callbackID = 1;
			}
			params.callback = PUBLICDB.callbackID++;
			PUBLICDB.callbacks[params.callback] = callback;
		}
		params.func = func;
		console.log("PublicDB.req", func, params);
		PUBLICDB.sock.send(JSON.stringify(params));
	},
	getStorageUrl : function(storage, callback) {
		!PUBLICDB.storageUrls && (PUBLICDB.storageUrls = []);
		if(PUBLICDB.storageUrls[storage]) return callback(PUBLICDB.storageUrls[storage]);
		PUBLICDB.req('getStorageUrl', {storage: storage}, function(url) {
			PUBLICDB.storageUrls[storage] = url;
			callback(url);
		});
	}
};

ARDUINO = {
	activate : function(customPort) {
		window.localStorage.setItem('arduino', true);
		customPort && window.localStorage.setItem('arduinoPort', parseInt(customPort, 10));
		!ARDUINO.connected && ARDUINO.connect();
	},
	deactivate : function() {
		window.localStorage.removeItem('arduino');
		window.localStorage.removeItem('arduinoPort');
		if(!ARDUINO.connected) return;
		delete ARDUINO.connected;
		delete ARDUINO.sock.onclose;
		ARDUINO.sock.close();
	},
	connect : function() {
		var port = window.localStorage.getItem('arduinoPort') || 6969,
			sock = ARDUINO.sock = new SockJS('http://localhost:' + port + '/sockjs');

		sock.onopen = function() {
			ARDUINO.connected = true;
			ARDUINO.reconnectTimeout = 1;
		};
		sock.onmessage = function(e) {
			try {
				e.data = JSON.parse(e.data);
			} catch(e) {
				return;
			}
			switch(e.data.func) {
				case 1: //eqBands
					ARDUINO.numBands = e.data.data[0];
				break;
				case 2: //controlEvent
					switch(e.data.data[0]) {
						case 0:
							PLAYER.play();
						break;
						case 1:
							PLAYER.prev();
						break;
						case 2:
							PLAYER.next();
					}
			}
		};
		sock.onclose = function() {
			delete ARDUINO.connected;
			setTimeout(ARDUINO.connect, ARDUINO.reconnectTimeout * 1000);
			ARDUINO.reconnectTimeout += 5;
		};
	},
	send : function(data) {
		if(!ARDUINO.connected) return;
		ARDUINO.sock.send(JSON.stringify(data));
	}
};

document.addEventListener('DOMContentLoaded', function() {
	window.applicationCache && window.applicationCache.addEventListener('updateready', function(e) {
		if(window.applicationCache.status !== window.applicationCache.UPDATEREADY) return;
		try {
			window.applicationCache.swapCache();
		} catch(e) {}
		window.location.reload();
	}, false);

	var browser_lang = navigator.language ? navigator.language.substr(navigator.language.length - 2).toLowerCase() : navigator.browserLanguage,
		cookie_lang = window.localStorage.getItem("lang"),
		lang = 'en'; //the default

	if(LANG[cookie_lang]) lang = cookie_lang;
	else if(LANG[browser_lang]) lang = browser_lang;

	LIB.setLang(lang);

	var body = $('body');
	body.append('<div id="video" class="container"></div>');
	LIB.renderSkin(lang);

	$('#video')[0].drop = $('#controls')[0].drop;

	remoteStorage.claimAccess({
		playlists: 'rw',
		music : 'rw',
		contacts : 'rw'
	}).then(function() {
		remoteStorage.playlists.use('');
		remoteStorage.music.release('');
		remoteStorage.contacts.use('');
	}).then(function() {
		remoteStorage.displayWidget('remotestorage-connect');
		remoteStorage['on' + (remoteStorage.on ? '' : 'Widget')]('ready', function() {
			$('body').addClass('auth');
			LIB.renderUsermenu();

			/* Experimental */
			remoteStorage.playlists.list(function(playlists) {
				playlists.forEach(function(p) {
					PUBLICDB.req('update', {
						'playlist' : p.id,
						'storage' : LIB.user()
					});
				});
			});
		});
		remoteStorage['on' + (remoteStorage.on ? '' : 'Widget')]('disconnect', function() {
			var ul = $('#playlistMenu').children().first();
			while(ul.children().length > 3) ul.children().last().remove();
			$('body').removeClass('auth');
			LIB.renderUsermenu();
			PUBLICDB.req('following', {
				'users' : []
			});
			LIB.updateURL('/');
			HISTORY.empty();
		});
		PLAYLIST.renderMenu();
	});

	remoteStorage.playlists.on('change', function(e) {
		PLAYLIST.current && PLAYLIST.current.id === e.relativePath && (PLAYLIST.current.songs = e.newValue.songs) && PLAYLIST.renderSongs();
		PLAYLIST.renderMenu();

		/* Experimental */
		if(e.relativePath === 'order' || (e.newValue || e.oldValue).storage) return;
		setTimeout(function() {
			PUBLICDB.req('update', {
				'playlist' : e.relativePath,
				'storage' : LIB.user(),
				'force' : 1
			});
		}, 1500); //Give it time to be updated on the server.. I know, pretty lame workaround..
	});

	remoteStorage.contacts.on('change', function(e) {
		EXPLORE.getPlaylists();

		/* Experimental */
		PROFILE.getFollowing(function(following) {
			PUBLICDB.req('following', {
				'users' : following
			});
		});
	});

	PUBLICDB.connect();

	LIB.onResize();
	$(window).resize(LIB.onResize)
		.keydown(LIB.onKeyDown)
		.bind(FULLSCREEN.eventName, PLAYER.onFullscreen)
		.bind('focus', LIB.onFocus)
		.bind('blur', LIB.onBlur)
		.bind('popstate', function(e) {
			LIB.updateURL(e.originalEvent.state !== null ? e.originalEvent.state : document.location.pathname, true);
		});

	LIB.isFirefox() && LIB.updateURL(document.location.pathname, true);

	window.localStorage.getItem('arduino') && ARDUINO.connect();
});

TRANSNODE = {
	started: false,
	torrents: {},
	templateParams : function(params, cb) {
		cb({
			query : params[0]
		});
	},
	render : function(params) {
		console.log("render func!!");
	},
	allGood : function(cb) {
		if(!TRANSNODE.started) {
			PUBLICDB.req('TransNode.start', {}, function(res) {
				PUBLICDB.on('*', function(evt, data) {
					console.log("PUBLICDB.event", evt, data);
					if(evt.indexOf('torrent:file:complete') === 0) {
						console.log("file complete"+data.file);
						$('.torrent.file-'+data.file).children(0).get(2).innerHTML = 'complete!'
					} else if(evt.indexOf('torrent:progress') === 0) {
						//$('.torrent')
						//<div class="progress">
						//  <div class="bar" style="width: 60%;"></div>
						//</div>
						var progress = data.file_bytes / data.file_length;
						$('.torrent.file-'+data.file).children(0).get(2).innerHTML =
						'<div class="progress">' +
							'<div class="bar" style="width:'+Math.round(progress * 100)+'%;"></div>'+
						'</div>';
					}
				})
				cb(true);
			});
		} else {
			cb(true);
		}
	}
}

MAGNET = {
	templateParams : function(params, cb) {
		console.log("MAGNET", params);
		var mag, mag_test;
		if(params[0] === 'magnet:') {
			mag = "magnet:"+window.location.search;
		}
		if(mag) {
			if(mag.indexOf("magnet:") === 0 && ~mag.indexOf('xt=urn:btih:'))
				mag_test = mag.match(/xt=urn:btih:([^&]+)/)[1]
			else mag_test = mag;
			var tor = TRANSNODE.torrents[mag]
			var loading = mag_test.length === 40 ? true : "Invalid magnet link"
			if(tor) {
				cb({
					magnet : mag,
					title : tor.name,
					files : tor.files
				});
			} else if(loading === true) {
				TRANSNODE.allGood(function(good) {
					PUBLICDB.req('TransNode.getMetadata', {
						magnet: mag || '6f4d0cfa88d5192292519e7be14c8087d4544ec2'
					}, function(res) {
						// TODO: I should also mention if the file already exists (ready to be played)
						console.log("metadata for torrent:", res.tor);
						console.log("Name:", res.name)
						//LIB.updateURL(document.location.pathname, true);
						cb(tor = {
							title : res.name,
							files : res.files.map(function(f) {
								//console.log(f.path.join(' / '), "  (" + f.length + ")");
								f.path = f.path.join(' / ');
								return f;
							}),
							magnet : ~mag.indexOf('magnet:') ? mag.match(/xt=urn:btih:([^&]+)/)[1] : mag
						});
						TRANSNODE.torrents[mag] = tor;
					});
				});
			}
			cb({
				title: "Loading...",
				magnet: mag_test,
				loading: loading
			});
		}
	},
	render : function(params) {
		console.log("render func!!");
	},
	download : function(id, offset) {
		console.log("download func", id, this);
		console.log("http://localhost:8086/"+id);


		TRANSNODE.allGood(function(good) {
			PUBLICDB.req('TransNode.getLink', {
				magnet: id+':'+offset
			}, function(res) {
				console.log("got link:", res);
				SC.player("http://localhost:8086/"+id);
			});
		});
		PUBLICDB.on('torrent:file:complete:'+id, function(res) {

			console.log("torrent complete!", res.http);
		});
	}
};

/*
TransNode TODO List
 * when torrent already exists, update it and verify (added important dirs)
 * proper dirs + make into verse
 * queue / pause function
 * move sockjs app over to verse
*/

function torrent_demo(num) {
	PUBLICDB.on('torrent:start:6f4d0cfa88d5192292519e7be14c8087d4544ec2', function(res) {
		console.log("torrent started!");
	});
	PUBLICDB.on('torrent:progress:6f4d0cfa88d5192292519e7be14c8087d4544ec2', function(res) {
		console.log("torrent progress!", res.percent);
	});
	PUBLICDB.on('torrent:complete:6f4d0cfa88d5192292519e7be14c8087d4544ec2', function(res) {
		console.log("torrent complete!", res.http);
	});
	PUBLICDB.on('metadata:complete:6f4d0cfa88d5192292519e7be14c8087d4544ec2', function(res) {
		console.log("torrent complete!", res.http);
	});
	PUBLICDB.req('TransNode.start', {}, function(res) {
		switch(num) {
			case "get metadata":
				PUBLICDB.req('TransNode.getMetadata', {
					magnet:'6f4d0cfa88d5192292519e7be14c8087d4544ec2'
				}, function(res) {
					// TODO: I should also mention if the file already exists (ready to be played)
					console.log("metadata for torrent:", res.tor);
					console.log("Name:", res.name)
					res.files.forEach(function(f) {
						console.log(f.path.join(' / '), "  (" + f.length + ")");
					});
				});
			break;

			case "play song":
				PUBLICDB.req('TransNode.getLink', {
					magnet:'6f4d0cfa88d5192292519e7be14c8087d4544ec2:3'
				}, function(res) {
					if(res.http) {
						console.log("YAY we got the link", res.http);
					} else {
						console.error("an error occured getting the link for", res.tor);
					}
				});
		}
	});
}
