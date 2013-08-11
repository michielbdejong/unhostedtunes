SC = {
	client_id : '857a8a0446619aaa2b81e6b36f9055cb',
	artworks : {},
	artworks_err : {},
	artworks_req : [],
	artworks_req_callbacks : [],
	search : function(query, callback) {
		var params = {
				client_id : SC.client_id,
				filter : 'streamable',
				q : query
			};

		$.ajax({
			url : '//api.soundcloud.com/tracks.json',
			data : params
		}).done(function(data) {
			callback(typeof data === 'string' ? JSON.parse(data) : data);
		});
	},
	get : function(id, callback) {
		$.ajax({
			url : '//api.soundcloud.com/tracks/' + id +  '.json',
			data : {
				client_id : SC.client_id
			}
		}).done(function(data) {
			callback(typeof data === 'string' ? JSON.parse(data) : data);
		});
	},
	reqArtworks : function() {
		if(SC.artworks_req.length > 0) {
			var params = {
					client_id : SC.client_id,
					ids : SC.artworks_req.join(',')
				},
				cbs = SC.artworks_req_callbacks;
			
			$.ajax({
				url : '//api.soundcloud.com/tracks.json',
				data : params
			}).done(function(data) {
				(typeof data === 'string' ? JSON.parse(data) : data).forEach(function(t) {
					if(t.artwork_url || (t.user.avatar_url && t.user.avatar_url.indexOf('default_avatar_large.png') === -1)) {
						SC.artworks[t.id] = (t.artwork_url || t.user.avatar_url).replace(/large.jpg/, 'crop.jpg');
						$('img.scart' + t.id, '#content').attr('src', SC.artworks[t.id].replace(/crop.jpg/, 'large.jpg'));
					} else SC.artworks_err[t.id] = true;
				});
				
				for(i in cbs) cbs[i]();
			});
			
			SC.artworks_req = [];
			SC.artworks_req_callbacks = [];
		}
	},
	player : function(song) {
		if(!SoundManager.ready) {
			!SoundManager.callbacks && (SoundManager.callbacks = []);
			return SoundManager.callbacks.push(function() {SC.player(song)});
		}
		if(song.provider === remoteStorage.playlists.providers.remotestorage && !song.url) return remoteStorage.music.getUrl(song, function(url) {
			song.url = url + '?.' + url.substr(url.lastIndexOf('-') + 1); //ogg files don't work without this fake extension hack
			SC.player(song);
		});
		PLAYER.onStateChange(3);
		var sound = soundManager.createSound({
			id : 'sound' + song.provider + song.provider_id,
			url : song.provider === remoteStorage.playlists.providers.soundcloud ? 'http://api.soundcloud.com/tracks/' + song.provider_id + '/stream?client_id=' + SC.client_id : song.provider === remoteStorage.playlists.providers.url ? song.provider_id : song.url,
			autoPlay: true,
			multiShot: false,
			useEQData: true,
			onfinish : function() {
				PLAYER.onStateChange(PLAYER.states.ended);
			},
			onplay : function() {
				PLAYER.onStateChange(PLAYER.states.playing);
			},
			onresume : function() {
				PLAYER.onStateChange(PLAYER.states.playing);
			},
			onpause : function() {
				PLAYER.onStateChange(PLAYER.states.paused);
			},
			whileplaying : function() {
				if(!ARDUINO.connected || !ARDUINO.numBands) return;
				if(!avg) {
					avg = [];
					for(var x=0; x<ARDUINO.numBands; avg[x++] = 0); 
				}
				var bands = [],
					fall = 0.25,
					sliceAvg = function(a, b, e) {
						if(b == e) return a[b];
						var s = a.slice(b, e);
						return sum(s) / s.length;
					},
					sum = function(a) {
						for(var i=0, sum=0; i<a.length; sum+=parseFloat(a[i++]));
						return sum;
					};

				for(var x=0; x<ARDUINO.numBands; x++) {
					var n = Math.pow(2, x) - 1,
						data = sliceAvg(sound.eqData, n+1, n*2+1);

					bands[x] = Math.round(Math.sqrt(avg[x] = Math.max(data / Math.SQRT2, avg[x])) * 100);
					avg[x] -= fall;
				}
				
				var diff = false;
				bands.forEach(function(v, i) {
					if(v != sentBands[i]) diff = true;
				});
				if(!diff) return;
				sentBands = bands;
				ARDUINO.send(bands);
			}
			/*,
			onerror : function(e) {
				PLAYER.onError(e.currentTarget.error.code);
			}*/
		}), sentBands = [], avg;
		PLAYER.current = {
			song : song,
			play : function() {
				sound.resume();
			},
			pause : function() {
				sound.pause();
			},
			getCurrentTime : function() {
				return sound.position ? sound.position / 1000 : 0;
			},
			getDuration : function() {
				return !sound.bytesTotal || sound.bytesTotal > sound.bytesLoaded ? (song.time || sound.durationEstimate) : sound.duration / 1000;
			},
			getLoadedFraction : function() {
				return sound.buffered && sound.buffered.length ? sound.buffered[0].end / 1000 / PLAYER.current.getDuration() : 0;
			},
			seekTo : function(fraction) {
				sound.setPosition(PLAYER.current.getDuration() * 1000 * fraction);
			},
			destruct : function() {
				sound.destruct();
				if(!ARDUINO.connected || !ARDUINO.numBands) return;
				//reset the EQ...
				var zeros = [];
				for(var x=0; x<ARDUINO.numBands; zeros[x++] = 0);
				ARDUINO.send(zeros);
			}
		};
		if(song.provider === remoteStorage.playlists.providers.soundcloud && SC.artworks_req.indexOf(song.provider_id) === -1) {
			SC.artworks_req.push(song.provider_id);
			SC.artworks_req_callbacks.push(function() {
				if(!SC.artworks[song.provider_id]) return;
				var i = $('<img/>');
				i.attr("src", SC.artworks[song.provider_id]);
				i.hide();
				i.load(function() {
					i.fadeIn('fast');
				});
				$('#playerSC').append(i);
			});
			SC.reqArtworks();
		}
		PLAYLIST.setPlayingSong();
	}
};
