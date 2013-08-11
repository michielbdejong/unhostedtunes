Handlebars.registerHelper('L', function(key) {
    return L[key];
});

Handlebars.registerHelper('empty', function(data, options) {
    if(data && ((data instanceof Array && !data.length) || (data instanceof LocalCollection.Cursor && !data.count()))) return options.fn(this);
    else return options.inverse(this);
});

Handlebars.registerHelper('equals', function(a, b, options) {
    if(a === b) return options.fn(this);
    else return options.inverse(this);
});

Handlebars.registerHelper('nequals', function(a, b, options) {
    if(a !== b) return options.fn(this);
    else return options.inverse(this);
});

Handlebars.registerHelper('a', function(title, href, className, icon, langTitle) {
    title = LIB.escapeHTML(title || L[langTitle]);
    return new Handlebars.SafeString('<a' + (typeof href === 'string' ? ' href="' + href + '" onclick="LIB.handleLink(event)"' : '') + (typeof className === 'string' ? ' class="' + className + '"' : '') + '>' + (typeof icon === 'string' ? '<i class="icon-' + icon + '"></i> ' : '') + title + '</a>');
});

Handlebars.registerHelper('inline', function(text, module, path, field) {
    text = LIB.escapeHTML(text);
    return new Handlebars.SafeString('<span contenteditable="true" onblur="LIB.inlineOnBlur(event, \'' + module + '\', \'' + path + '\', \'' + field + '\')" onkeydown="LIB.inlineOnKeyDown(event)">' + text + '</span>');
});

Handlebars.registerHelper('timeFormatted', function(data) {
    return LIB.formatTime(this.time || 0);
});

Handlebars.registerHelper('playlistListing', function() {
    return new Handlebars.SafeString(Handlebars.templates.playlistListing(this));
});

Handlebars.registerHelper('remove', function(options) {
    if(this.isOwner || this.queue) return options.fn(this);
    else return options.inverse(this);
});

LIB = {
    user : function() {
        return localStorage['remotestorage_widget:userAddress'];
    },
	cancelHandler : function(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    addZero : function(str) {
        str = str + '';
        if(str.length < 2) str = '0' + str;
        return str;
    },
	escapeHTML : function(text) {
        return $('<div/>').text(text).html();
    },
    inlineOnKeyDown : function(e) {
        if(e.keyCode == 13) {
            LIB.cancelHandler(e);
            e.target.blur();
        }
    },
    inlineOnBlur : function(e, module, path, field) {
        var value = $(e.target).text();
        value !== '' && remoteStorage[module].update(path, field, value);
    },
    preventSelection : function(a, md) {
        var b = $('body');
        a.mousedown(function(e) {
            var ss = function(e) {
                    LIB.cancelHandler(e);
                },
                mu = function(e) {
                    //b.css('MozUserSelect', '');
                    $(window).unbind('selectstart', ss);
                    $(window).unbind('mouseup', mu);
                };

            //CHECK.isFirefox() && (b.style.MozUserSelect = 'none');
            $(window).bind('selectstart', ss);
            $(window).bind('mouseup', mu);
            if(md) {
                md(e);
                LIB.cancelHandler(e);
            }
        });
    },
    cordsInsideBox : function(cordX, cordY, boxTop, boxRight, boxBottom, boxLeft) {
        return !(cordX > boxRight || cordX < boxLeft || cordY > boxBottom || cordY < boxTop);
    },
    drag : function(e, data, preCb, postCb) {
        if(e.button === 2) return;
        var b = $('body'),
            initX = e.clientX,
            initY = e.clientY,
            draggin = false,
            drag, drop,
            mm = function(e) {
                if(draggin === false) {
                    var offset = 5,
                        scroll_offset = 20;

                    if(LIB.cordsInsideBox(e.clientX, e.clientY, initY - offset, initX + offset, initY + offset, initX - offset)) return;

                    $('#drag').remove();
                    drag = $(Handlebars.templates.drag({title: data.title}));
                    b.append(drag);

                    draggin = true;
                    preCb && preCb();
                    b.addClass('draggin');
                }

                drag.css('top', e.clientY - 20);
                drag.css('left', e.clientX + 10);

                var t = e.target,
                    c = 0;

                while(t && !t.drop && t.parentNode && c < 5) {
                    t = t.parentNode
                    c++;
                }

                if(t && t.drop && t.drop.types.indexOf(data.type) !== -1 && drop !== t && (!t.drop.check || t.drop.check(data))) {
                    drop && $(drop).removeClass(drop.drop.className || 'dropping');
                    drop = t;
                    drag.addClass('dropping');
                    $(drop).addClass(drop.drop.className ||'dropping');
                } else if(drop && drop !== t) {
                    $(drop).removeClass(drop.drop.className ||'dropping');
                    drop = null;
                    drag.removeClass('dropping');
                }
            },
            mu = function(e) {
                if(drop) {
                    drop.drop.cb(data);
                    $(drop).removeClass(drop.drop.className || 'dropping');
                    drag.fadeOut('fast', function() {
                       drag.remove();
                    });
                } else if(drag) {
                    drag.animate({
                        top: initY,
                        left: initX,
                        opacity: 0
                    }, function() {
                        drag.remove();
                    });
                }
                $(window).unbind('mousemove', mm);
                $(window).unbind('mouseup', mu);
                b.removeClass('draggin');
                draggin && postCb && postCb();
                draggin = false;
            };

        $(window).bind('mousemove', mm);
        $(window).bind('mouseup', mu);
    },
    handleLink : function(e) {
        var t = e.target,
            c = 0;

        while(t && t.tagName.toLowerCase() !== 'a' && t.parentNode && c < 3) {
            t = t.parentNode
            c++;
        }

        if(t.href) {
            var fullHost = document.location.protocol + '//' + document.location.host,
                p = t.href.indexOf(fullHost);

            LIB.cancelHandler(e);
            LIB.updateURL(t.href.substr(p === 0 ? (p + fullHost.length) : 0));
        }
    },
    playlistLink : function(p) {
        return "/playlist/" + (p.id.indexOf(':') === -1 ? (p.storage || LIB.user()) + ':' : '') + p.id + "/" + p.title.replace(/ /g, "_").replace(/\//g, "");
    },
    arraySearch : function(haystack, needle, index, returnIndex) {
        var result = false;
        haystack.forEach(function(item, i) {
            if(result || !item || item[index] !== needle) return;
            result = returnIndex ? parseInt(i, 10) : item;
        });

        return result;
    },
    formatTime : function(time, long) {
        var hours = Math.floor(time / 3600),
            minutes = Math.floor((time % 3600) / 60);

        if(long) return (hours > 0 ? hours + 'h ' : '') + (minutes > 0 ? minutes + 'm' : '');
        else return (hours > 0 ? hours + ':' + LIB.addZero(minutes) : minutes) + ":" + LIB.addZero(Math.round(time % 60));
    },
    renderSkin : function(lang) {
        var body = $('body');
        while(body.children().length > 2) body.children().last().remove();

        body.append(Handlebars.templates.skin({
            lang : lang
        }));

        var queue = $('#playlistMenu').children().first().children().first()[0],
            add = $('#playlistMenuAdd')[0],
            button = $('#playlistMenuAdd button');

        queue.drop = {
            types : ['playlists', 'songs'],
            cb : function(o) {
                var songscb = function(songs) {
                        o.type === 'playlists' && songs.forEach(function(s) {
                            s.from = playlist;
                        });
                        PLAYER.addToQueue(songs);
                        if(window.location.pathname === '/queue') {
                            QUEUE.onUnload();
                            QUEUE.render();
                        }
                    };

                switch(o.type) {
                    case 'playlists':
                        var playlist = o.data[0];
                        if(playlist.songs) return songscb(playlist.songs);
                        //THIS SHOULD BE DONE WITH remoteStorage.getForeignClient ... but it doesn't work!!!
                        PUBLICDB.req('getPlaylist', {id: playlist.id.substr(playlist.id.lastIndexOf(':') + 1), storage: playlist.storage}, function(p) {
                            if(!p) return songscb([]);
                            playlist = p;
                            songscb(p.songs);
                        });
                    break;
                    case 'songs':
                        var songs = [];
                        o.data.forEach(function(s) {
                            songs.push(s.song);
                        });
                        songscb(songs);
                }
            }
        };

        add.drop = {
            types : ['songs'],
            cb : function(o) {
                !PLAYLIST.saveSongs && (PLAYLIST.saveSongs = []);
                PLAYLIST.saveSongs = PLAYLIST.saveSongs.concat(o.data);
                button.addClass('btn-success');
                button.children().last().text(L.savePlaylist + ' (' + PLAYLIST.saveSongs.length + ')');
            }
        };

        var controls = $('#controls'),
            slider = $('#controls div.slider');

        $(controls)[0].drop = queue.drop;

        LIB.preventSelection(slider, function(e) {
            if(!PLAYER.current) return;
            var mm = function(e) {
                    PLAYER.setSlider({
                        progress : e.clientX / slider.width(),
                        fromSlider : true
                    });
                },
                mu = function() {
                    $(window).unbind('mousemove', mm);
                    $(window).unbind('mouseup', mu);
                    controls.removeClass('sliding');
                    PLAYER.sliding = false;
                    PLAYER.current.seekTo(PLAYER.sliderValue);
                };

            PLAYER.sliding = true;
            mm(e);
            $(window).bind('mousemove', mm);
            $(window).bind('mouseup', mu);
            controls.addClass('sliding');
        });

        body.fadeIn();
    },
    setTitle : function(title) {
        if(!LIB.windowBlur) return;
        window.document.title = title || 'UnhostedTunes';
    },
    setFavicon : function(icon) {
        //This stops working on chrome if I don't do this twice, so...
        for(var x=0; x<2; x++) $('link[rel="shortcut icon"]', 'head').each(function(i, favicon) {
            var ext = $(favicon).attr('type').substr(6);
            $(favicon).attr('href', '/img/' + (icon || 'favicon') + '.' + (ext === 'x-icon' ? 'ico' : ext));
        });
    },
    setLang : function(lang, store) {
        window.L = LANG[lang];
        store && window.localStorage.setItem("lang", lang);
    },
    resetLang : function(lang) {
        LIB.setLang(lang, true);
        var w = $('#remotestorage-connect')[0];
        LIB.renderSkin(lang);
        $('#remotestorage-connect').replaceWith(w);
        LIB.renderUsermenu();
        QUEUE.updateBadge();
        LIB.user() && PLAYLIST.renderMenu();
        if(PLAYER.current) {
            PLAYER.setTitle(PLAYER.current.song);
            PLAYER.onStateChange(PLAYER.state);
        }
        LIB.updateURL(document.location.pathname, true);
    },
    renderUsermenu : function() {
        var nav = $('div.navbar.navbar-fixed-top div.navbar-inner')
        if($('body').hasClass('auth')) {
            $('ul.nav', nav).children().last().before($('<li rel="profile">' + Handlebars.helpers.a(L.profile, '/profile/' + LIB.user()).toString() + '</li>'));
            nav.append(Handlebars.templates.userMenu({gravatar: md5(LIB.user())}));
        } else {
            $('ul.nav li:nth-child(4)', nav).remove();
            $('ul.user', nav).remove();
        }
    },
    updateCssRules : function(rules) {
        var s, i;

        for(i in document.styleSheets) {
            if(document.styleSheets[i].title === 'js') {
                s = document.styleSheets[i];
                break;
            }
        }

        if(!s) {
            s = document.createElement('style');
            s.type = 'text/css';
            s.rel = 'stylesheet';
            s.media = 'screen';
            s.title = 'js';
            $("head").append(s);
            for(i in document.styleSheets) {
                s = document.styleSheets[i];
                if(s.title === 'js') break;
            }

        } else {
            rules.forEach(function(rule) {
                for(i in s.cssRules) {
                    if(s.cssRules[i] && s.cssRules[i].selectorText === rule.name) {
                        s.deleteRule(i);
                        break;
                    }
                }
            });
        }

        rules.forEach(function(r) {
            if(s.addRule) {
                s.addRule(r.name, r.rule, 0);
            } else {
                s.insertRule(r.name + ' {' + r.rule + '}', 0);
            }
        });
    },
    onResize : function() {
        var w = $(window),
            h = w.height();

        LIB.updateCssRules([
            {name: "div#playlistMenu", rule: 'height: ' + (h - 100) + 'px'},
            {name: "body.video div#playlistMenu", rule: 'height: ' + (h - 300) + 'px'},
            {name: "div#content", rule: 'margin: 0 ' + ((w.width() - 240 - $('#content').width()) / 2) + 'px;min-height: ' + (w.height() - 120) + 'px'}
        ]);
    },
    onKeyDown : function(e) {
        var t = e.target,
            n = t.nodeName,
            on_text = (n === "INPUT" || n === "TEXTAREA" || $(t).attr('contenteditable')) && e.keyCode !== 27;

        if(on_text || e.metaKey) return;
        switch(e.keyCode) {
            case 32: //space
                LIB.cancelHandler(e); //avoid page scroll-down behaviour
                PLAYER.play();
            break;
            case 37: //left
                PLAYER.prev();
            break;
            case 39: //right
                PLAYER.next();
            break;
        }
    },
    onBlur : function() {
        LIB.windowBlur = true;
    },
    onFocus : function() {
        LIB.setTitle();
        delete LIB.windowBlur;
    },
    isFirefox : function() {
		return navigator.userAgent.indexOf('Firefox') !== -1;
	},
	updateURL : function(url, fromPopEvent) {
        url = url.substr(1);
        var p = url.indexOf('/'),
            panel = p != -1 ? url.substr(0, p) : url,
            params = p != -1 ? url.substr(p + 1).split('/') : [],
            renderPanel = function(dest) {
                var obj = window[panel.toUpperCase()],
                	cb = function(context) {
                		$(dest).empty();
                		$(dest).append(Handlebars.templates[panel](context));
                		if(obj) {
		                    obj.render && obj.render(params);
		                    obj.onUnload && (LIB.onUnload = obj.onUnload);
		                }
                        $(window).scrollTop(0);
                	};

                if(obj && obj.templateParams) obj.templateParams(params, cb);
               	else cb();
                !fromPopEvent && history.state !== '/' + url && history.pushState('/' + url, '', '/' + url);
            };

        params.forEach(function(p, i) { params[i] = decodeURIComponent(p); });

        if(LIB.onUnload) {
            LIB.onUnload();
            delete LIB.onUnload;
        }

        switch(panel) {
            case 'song':
                SEARCH.getSong(params, function(song) {
                    PLAYER.addToQueue([song], 0, true);
                });
            case '':
                panel = 'explore';
            case 'explore':
            case 'search':
            case 'playlist':
            case 'about':
            case 'profile':
            case 'queue':
            case 'history':
            case 'magnet':
            case 'torrents':
                renderPanel('#content');
            break;
            default:
                LIB.updateURL('/');
        }

        $('div.navbar.navbar-fixed-top ul.nav').children().each(function() {
            var li = $(this),
                rel = li.attr('rel');

            if(!rel) return;
            li[(rel === panel && (rel !== 'profile' || params[0] === LIB.user()) ? 'add' : 'remove') + 'Class']('active');
        });
    }
};
