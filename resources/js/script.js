$(document).ready(function(){

	superDebugMode = false;
	debugMode = false;
	var initialLoadTime = new Date();
	urlPathname = window.location.href;

	// Debug Mode
		// superDebugMode = true;
		// debugMode = true;

		debugEle = '<div class="debug db-message">Debug Mode is On</div>';
		// Debug Mode Properties
			if(superDebugMode == true ) { console.log('SUPER Debug Mode is On!'); }
			if(debugMode == true ) { console.log('Debug Mode is On!'); }
		
	// Defining Global Variables
		theBody = $('body');
		theHeader = $('#header');
		streamWrap = $('#stream-wrapper');
		streamerList = $('#streamer-list');
		streamerLi = streamerList.find('li');
		streamerListW = 200;
		streamArea = $('#livestream');
		theSidebar = $('#sidebar');
		streamWatching = $('#streamer-watching');
		theModal = $('.modal');
		theShade = $('.modal-shader');

		fsTrigger = $('.fullscreen-trigger');

		iconMenu = $('.option.menu');
		iconChat = $('.option.chat');
		iconRefresh = $('.option.refresh');
		iconFS = $('.option.fullscreen');
		iconHK = $('.option.hotkeys');

		modalWindowHotkey = $('.window-help');
			
	// Reserving Functions and Features for Desktop Only
	if(theBody.hasClass('desktop')) {

	// Defining Global Functions
		twitchHots = function() {
			if(superDebugMode == false) {
				var metagame = 'StarCraft%20II:%20Heart%20of%20the%20Swarm';
				if(urlPathname.search('lol') >= 0) {
					document.title = 'Syndre - League of Legends Twitch Streamer';
					var metagame = 'League%20of%20Legends';
				}
				var initialLoadTime = new Date();
				var twitchHots_api = 'http://api.justin.tv/api/stream/list.json?meta_game='+metagame+'&limit=25&jsonp=?';
				$.getJSON(twitchHots_api, function(data) {
					$.each(data,function(i, data) {
						var user = data.channel.login;
						var twitch_live_view_count = data.channel_count;
						var stream_title = data.title;
						streamerList.find('ul').append('<li id="'+twitch_live_view_count+'" data-user="'+user+'" data-stream-title="'+stream_title+'" class="'+user+'">'+user+'<span class="view-count">'+twitch_live_view_count+'</span></li>');
					});
				})
				.done(function(){
					var currentUser = $('.watching').find('.streamer').text();
					if(currentUser.length) {
						streamerList.find('.'+currentUser).addClass('selected');
					}
					streamUserClick();
					if(debugMode == true) {
						var loadTime = new Date();
						console.log('Twitch API fetch was successful. ('+ (loadTime - initialLoadTime) + 'ms)');
					}
					playerRace();
				});				
			}
		}

		twitchEmbed = function(username) {
			var chatState = 'on'
			if(streamWrap.hasClass('chat-active')) { var chatState = 'on'; }
			history.pushState(null, null, '#!/user=' + username);
			var start = '&auto_play=true';
			var width = '1920';
			var height = '1080';
			var twitch_stream = '<div class="livestream-embed pos-abso"><object type="application/x-shockwave-flash" height="'+height+'" width="'+width+'" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=mlgsc2" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+username+start+'" /></object></div>';
			
			if(debugMode == false) {
				streamArea.append(twitch_stream);
			} else {
				streamArea.html(debugEle);
				console.log('Twitch stream embed for '+username+' was successful.');
			}

		}

		twitchChat = function() {
			if(superDebugMode == false) {
				var user = $('.watching').find('.streamer').text();
				var chat_embed_code = '<iframe frameborder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel='+user+'&amp;popout_chat=true" height="100%" width="300"></iframe></div></div>';
				var tChat = theSidebar.find('.twitch-chat');
				tChat.find('.widget-header').html('<span class="highlight-text">'+user+'</span> Twitch Chat');
				if(debugMode == false) {
					tChat.find('.widget-body').html(chat_embed_code);
				} else {
					tChat.find('.widget-body').html(debugEle);
					console.log('Twitch chat for '+user+' embed was successful.');
				}				
			}
		}

		streamInject = function(ele, user, title) {
			streamerLi.removeClass('selected');
			ele.addClass('selected');
			streamArea.html('');
			twitchEmbed(user);	
			streamWrap.attr('data-twitch-user', user);
			streamWrap.attr('data-twitch-title', title);
			streamWatching.html('You Are Now Watching <span class="highlight-text">'+user+'</span>');
			theHeader.find('.now-watching').html('Now Watching <span class="streamer highlight-text">'+user+'</span>: ');
			theHeader.find('.stream-title').html(title)
			setTimeout(function(){ twitchChat(); }, 50);
		}

		streamListRefresh = function() {
			streamerList.find('li').fadeOut(400);
			setTimeout(function(){
				streamerList.find('li').remove();
			}, 500)
			setTimeout(function(){
				twitchHots();
			}, 600);
			
			if(debugMode == true) { console.log('Twitch stream list refresh was successful.'); }
		}

		streamUserClick = function() {
			streamerList.find('li').on('click', function(){
				var user_ID = $(this).data('user');
				var title = $(this).data('stream-title');
				streamerList.find('li').removeClass('selected');
				streamerList.find('.'+user_ID).addClass('selected');
				streamInject($(this), user_ID, title);
			});
		}

		var fsActionTime = 100;

		chatTrigger = function() {
			var sa = 'sidebar-active';
			var wc = 'widget-chat';
			var saNum = 301;
			var fsNum = 15;
			iconChat.toggleClass('active-on');
			streamWrap.toggleClass(sa).toggleClass(wc);
			theSidebar.toggleClass('hidden');
			if(streamWrap.hasClass(sa)) {
				fsTrigger.css('right', saNum + fsNum);
			} else {
				fsTrigger.css('right', fsNum);
			}
		}

		fullscreenActivate = function() {
			fsTrigger.addClass('activate');
			streamWrap.addClass('fullscreen-mode');
			theHeader.animate({ height: '0px'}, fsActionTime-50);
			streamWrap.animate({ top: '0px'}, fsActionTime);
			streamArea.animate({ bottom: '-30px'}, fsActionTime);
			fsTrigger.animate({ bottom: '15px'}, fsActionTime);
			if(streamerList.hasClass('active')) {
				streamerList.animate({ left: -(streamerListW+1) }, fsActionTime);
			}
		}

		fullscreenDectivate = function() {
			fsTrigger.removeClass('activate');
			streamWrap.removeClass('fullscreen-mode');
			theHeader.animate({ height: '35px'}, fsActionTime-50);
			streamWrap.animate({ top: '36px'}, fsActionTime);
			streamArea.animate({ bottom: '0px'}, fsActionTime);
			fsTrigger.animate({ bottom: '30px'}, fsActionTime);
			if(streamerList.hasClass('active')) {
				streamerList.animate({ left: 0 }, fsActionTime);
			}
		}

		fullscreenTrigger = function() {
			if(!streamWrap.hasClass('fullscreen-mode')) {
				fullscreenActivate();
				if(debugMode == true) { console.log('Fullscreen mode activated.'); }
			} else {			
				fullscreenDectivate();
				if(debugMode == true) { console.log('Fullscreen mode dectivated.'); }
			}
		}

		modalHotkey = function() {
			if(!modalWindowHotkey.hasClass('active')) {
				modalWindowHotkey.addClass('active');
				theShade.addClass('active');
			} else {
				modalWindowHotkey.removeClass('active');
				theShade.removeClass('active');
			}
		}

		exitPage = function() {
			$(window).bind('beforeunload', function(){
				return "This message popped up to counter potential accidental clickage.";
			});

		}

	// Global Function for Player Race Detection
		playerRace = function() {

			// Terran Players
				var terran = '.avilo, .brentstarcraft, .colthestc, .demuslim, .dragon, .gamegene, .htomario, .liquidtaeja, .painuser, .sc2sound, .selectkr, .squishy88, .sterlingkolde, .tumescentpie';

			// Protoss Players
				var protoss = '.axeltoss, .crimson_sc2, .dreadnoughtt, .finalmastery, .followgrubby, .incontroltv, .naniwasc2, .liquidhero, .kuroa1, .puckk, .tarrantius, .torkhots, .wayne379, .weedamins, .whitera';

			// Zerg Players
				var zerg = '.armzi, .bexysc, .dimaga, .empiretvpeptar, .empiretvzerg, .idrajit, .kawaiirice, .liquidtlo, .massansc, .protech, .tilea, .wiredguitars';

			streamerList.find('li').each(function(){
				if($(this).is(terran)) {
					$(this).addClass('player-race race-terran');
					if(debugMode == true) { console.log('Terran player was identified.'); }
				}
				if($(this).is(protoss)) {
					$(this).addClass('player-race race-protoss');
					if(debugMode == true) { console.log('Protoss player was identified.'); }
				}
				if($(this).is(zerg)) {
					$(this).addClass('player-race race-zerg');
					if(debugMode == true) { console.log('Zerg player was identified.'); }
				}
			})

			if(debugMode == true) { console.log('Player race filter activated.'); }

		}

	// Load Sequence Functions

	loadSequenceFunctions = function() {	
		if(debugMode == true) { 
			var loadTime = new Date();
			console.log('Window has loaded successfully. ('+ (loadTime - initialLoadTime) + 'ms)'); 
		}

		// Get The First User's Information
			var first = streamerList.find('li').first();
			var user_first = first.data('user');
			var title_first = first.data('stream-title');

		// Embed the First User's Stream
			first.addClass('selected');
			streamInject(first, user_first, title_first);
			streamUserClick();

		// Defining Key Press Functions
			var streamListUserReset = function() {
				var currentUser = $('.watching').find('.streamer').text();
				streamerList.find('li').removeClass('selected');
				streamerList.find('.'+currentUser).addClass('selected');
			}

			var scrollCounter = 0;

			var scrollOffset = function(direction){
				var a = streamerList.find('li.selected');
				var b = streamerList.find('ul');
				var p = a.prevAll();
				var ps = p.size();
				var h = 32;
				if(direction == 'up') {
					if( a.offset().top < 70 ) {
						b.scrollTop(ps * h - h);
						if(debugMode == true) { console.log('Scroll offset "Up" was successful.'); }
					} else if (ps == 0) {
						b.scrollTop(0);
						if(debugMode == true) { console.log('Scroll offset "Up - Reset" was successful.'); }
					}
				} else if (direction == 'down') {
					if( a.offset().top > b.height()) {
						scrollCounter++;
						b.scrollTop(h * scrollCounter);
						if(debugMode == true) { console.log('Scroll offset "Down" was successful.'); }
					}
				} else {
					return false;
				}
				
			}

			$(document).on('keydown', function(e) {

				// "Up" / "W" for Previous
					if(e.keyCode == 38 || e.keyCode == 87) {
						if(modalWindowHotkey.hasClass('active')) {
							if(e.keyCode == 38) {
								$('#key-up').addClass('triggered');
							}

							if(e.keyCode == 87) {
								$('#key-w').addClass('triggered');
							}							
						}
						var prevUser = streamerList.find('li.selected').prev()
						var userID = prevUser.data('user');
						var title = prevUser.data('stream-title');
						if(!streamerList.find('li.selected').is(':first-child')) {
							streamerList.find('li.selected').removeClass('selected');
							streamerLi.blur();
							prevUser.addClass('selected').focus();
							if(streamerList.hasClass('active')) {
								scrollOffset('up');
							} else {
								streamInject(prevUser, userID, title);
							}	
						}
					}
					

				// "Down" / "S" for Next
					if(e.keyCode == 40 || e.keyCode == 83) {
						if(modalWindowHotkey.hasClass('active')) {
							if(e.keyCode == 40) {
								$('#key-down').addClass('triggered');
							}

							if(e.keyCode == 83) {
								$('#key-s').addClass('triggered');
							}							
						}
						var nextUser = streamerList.find('li.selected').next();
						var userID = nextUser.data('user');
						var title = nextUser.data('stream-title');
						if(!streamerList.find('li.selected').is(':last-child')) {
							streamerList.find('li.selected').removeClass('selected');
							streamerLi.blur();
							nextUser.addClass('selected').focus();
							if(streamerList.hasClass('active')) {
								scrollOffset('down');
							} else {
								streamInject(nextUser, userID, title);d
							}
						}
					}

				// "Right" / "D" to Show Stream Menu
					if(e.keyCode == 39 || e.keyCode == 68) {
						if(modalWindowHotkey.hasClass('active')) {
							if(e.keyCode == 39) {
								$('#key-right').addClass('triggered');
							}

							if(e.keyCode == 68) {
								$('#key-d').addClass('triggered');
							}
						}
						// streamListUserReset();
						streamerLi.blur();
						iconMenu.toggleClass('active-on');
						streamerList.addClass('active');
					}

				// "Left" / "A" to Hide Stream Menu
					if(e.keyCode == 37 || e.keyCode == 65) {
						if(modalWindowHotkey.hasClass('active')) {
							if(e.keyCode == 37) {
								$('#key-left').addClass('triggered');
							}

							if(e.keyCode == 65) {
								$('#key-a').addClass('triggered');
							}
						}
						// streamListUserReset();
						streamerLi.blur();
						iconMenu.toggleClass('active-on');
						streamerList.removeClass('active scroll').css('left', 0);
					}

				// "Enter" / "E" to Activate Selected User's Stream
					if(e.keyCode == 13 || e.keyCode == 69) {
						if(modalWindowHotkey.hasClass('active')) {
							if(e.keyCode == 13) {
								$('#key-enter').addClass('triggered');
							}

							if(e.keyCode == 69) {
								$('#key-e').addClass('triggered');
							}
						}
						if(streamerList.hasClass('active')) {
							var user = streamerList.find('li.selected');
							var userID = user.data('user');
							var title = user.data('stream-title');
							streamerLi.blur();
							user.focus();
							streamInject(user, userID, title);
						}
					}

				// "C" for Chat
					if(e.keyCode == 67) {
						if(modalWindowHotkey.hasClass('active')) {
							$('#key-c').addClass('triggered');
						}
						chatTrigger();			
					}

				// "R" for Refresh List
					if(debugMode == true) {
						if(e.keyCode == 82) {
							if(streamerList.hasClass('active')) {
								streamListRefresh();
							}
						}
					}
					
				// "F" for Fullscreen Mode
					if(e.keyCode == 70) {
						if(modalWindowHotkey.hasClass('active')) {
							$('#key-f').addClass('triggered');
						}
						fullscreenTrigger();
					}

				// "H" for Help Window
					if(e.keyCode == 72) {
						if(modalWindowHotkey.hasClass('active')) {
							$('#key-h').addClass('triggered');
						}
						modalHotkey();
					}

				if(debugMode == true) { console.log(e.keyCode); }

				// if (e.keyCode == 83) {
				// 	if(!$('#streamer-search').hasClass('show')) {
				// 		$('#streamer-search').show().addClass('show');
				// 	} else {
				// 		$('#streamer-search').hide().removeClass('show');
				// 	}
				// }
			});

			$(document).on('keyup', function(e) {
				if(modalWindowHotkey.hasClass('active')) {
					modalWindowHotkey.find('i').removeClass('triggered');					
				}
			});
	}

	// Execute Initial Functions on Page Load

		twitchHots();
		
		$(window).load(function(){
			loadSequenceFunctions();
		});

	// Defining Mouse Action Functions

		streamerList.on('mouseenter',function(){
			$(this).addClass('active');
			iconMenu.addClass('active-on');
		});

		if(debugMode == false) {
			streamArea.on('mouseenter',function(){
				streamerList.removeClass('active');
			});

			streamerList.on('mouseleave',function(){
				$(this).removeClass('active');
				iconMenu.removeClass('active-on');
			});
		}		

		iconMenu.on('click',function(){
			$(this).toggleClass('active-on');
			streamerList.toggleClass('active');
			
		});

		iconRefresh.on('click', function(){
			if(streamerList.hasClass('active')) {
				streamListRefresh();
			}
		});

		iconChat.on('click',function(){
			chatTrigger();
		});

		iconFS.on('click',function() {
			fullscreenTrigger();
		});

		iconHK.on('click', function(){
			modalHotkey();
		})

		theShade.on('click', function(){
			$(this).removeClass('active');
			theModal.removeClass('active');
		});

		// exitPage();

	// Idle Functions
		var idleActive = false;
		// var idleActive = true;
		if(idleActive == true) {
			var idleTimeout = 10000;
			$(document).bind("idle.idleTimer", function(){
				fullscreenActivate();
				if(debugMode == true) {
					console.log('User is now idle.');	
				}
	        });

	        $(document).bind("active.idleTimer", function(){
	        	fullscreenDeactive();
				if(debugMode == true) {
					console.log('User is now active.');	
				}
	        });			
		}
        $.idleTimer(idleTimeout);
    }
});
