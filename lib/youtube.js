YT = {
	search : function(feed, param, page, callback) {
		var params = {
				alt : 'json',
				format : 5,
				'start-index' : (page * 50) + 1,
				'max-results' : 50
			}, url;

		switch(feed) {
			case 'videos':
				url = '//gdata.youtube.com/feeds/api/videos';
				params.vq = param;
			break;
			default:
				url = '//gdata.youtube.com/feeds/api/standardfeeds/' + feed + (param ? '_' + param : '');
		}
		$.ajax({
			url : url,
			data : params
		}).done(function(data) {
			callback((typeof data === 'string' ? JSON.parse(data) : data).feed);
		});
	},
	get : function(id, callback) {
		var params = {
				alt : 'json'
			},
			url = '//gdata.youtube.com/feeds/api/videos/' + id;

		$.ajax({
			url : url,
			data : params
		}).done(function(data) {
			callback((typeof data === 'string' ? JSON.parse(data) : data).entry);
		});
	},
	player : function(song) {
		var video_id = song.provider_id,
			callback = function() {
				var onStateChange = function(e) {
						PLAYER.onStateChange(e.data);
					},
					onError = function(e) {
						PLAYER.onError(e.data);
					},
					player = new YT.Player('playerYT', {
						height: '100%',
						width: '100%',
						videoId: video_id,
						events: {
							'onStateChange': onStateChange,
							'onError' : onError
						},
						playerVars: {
							autoplay: 1,
							controls: 0,
							showinfo: 0,
	            			modestbranding: 1,
	            			iv_load_policy: 3,
	            			rel: 0,
	            			hd: 1,
	            			html5: 1
						}
					});

				PLAYER.current = {
					song : song,
					play : function() {
						player.playVideo()
					},
					pause : function() {
						player.pauseVideo()
					},
					getCurrentTime : function() {
						return player.getCurrentTime ? player.getCurrentTime() : 0;
					},
					getDuration : function() {
						return player.getDuration ? player.getDuration() : song.time;
					},
					getLoadedFraction : function() {
						return player.getVideoLoadedFraction ? player.getVideoLoadedFraction() : 0;
					},
					seekTo : function(fraction) {
						if(!player.getDuration) return;
						player.seekTo(player.getDuration() * fraction);
					}
				};
				PLAYLIST.setPlayingSong();
			};

		if(PLAYER.IframeAPILoaded) return callback();
		$.getScript('//www.youtube.com/iframe_api');
		YT.IframeAPIReadyCallback = callback;
	},
	IframeAPIReady : function() {
		PLAYER.IframeAPILoaded = 1;
		YT.IframeAPIReadyCallback && YT.IframeAPIReadyCallback();
	}
};

function onYouTubeIframeAPIReady() {
	YT.IframeAPIReady();
}
