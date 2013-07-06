$(document).ready(function(){
	// Defining Global Variables
		theHeader = $('#header');
		streamWrap = $('#stream-wrapper');
		streamerList = $('#streamer-list');
		streamArea = $('#livestream');
		theSidebar = $('#sidebar');
		streamWatching = $('#streamer-watching');
		headerOffset = $('#header').height();

	// Defining Global Functions
		twitchHots = function() {
			var twitchHots_api = 'http://api.justin.tv/api/stream/list.json?meta_game=StarCraft%20II:%20Heart%20of%20the%20Swarm&limit=25&jsonp=?';
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
				$('#streamer-list li').on('click', function(){
					var user_ID = $(this).data('user');
					var title = $(this).data('stream-title');
					streamInject($(this), user_ID, title);
				});	
			});
		}

		twitchEmbed = function(username) {
			var start = '&auto_play=true';
			var width = '1920';
			var height = '1080';
			var twitch_stream = '<div class="livestream-embed"><object type="application/x-shockwave-flash" height="'+height+'" width="'+width+'" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=mlgsc2" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+username+start+'" /></object></div>';
			streamArea.append(twitch_stream);	
		}

		twitchChat = function() {
			var user = $('.watching').find('.streamer').text();
			var chat_embed_code = '<iframe frameborder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel='+user+'&amp;popout_chat=true" height="100%" width="300"></iframe></div></div>';
			theSidebar.find('.twitch-chat .widget-header').html('<span class="highlight-text">'+user+'</span> Twitch Chat');
			theSidebar.find('.twitch-chat .widget-body').html(chat_embed_code);
		}

		streamInject = function(ele, user, title) {
			streamerList.find('li').removeClass('selected');
			ele.addClass('selected');
			streamArea.html('');
			twitchEmbed(user);	
			streamWrap.attr('data-twitch-user', user);
			streamWrap.attr('data-twitch-title', title);
			// streamWatching.html('You Are Now Watching <span>'+user+'</span> <span class="title">'+title+'</span>');
			theHeader.find('.watching').html('Now Watching <span class="streamer highlight-text">'+user+'</span>: <span class="title">'+title+'</span>');
			setTimeout(function(){ twitchChat(); }, 50);
			// streamWatching.fadeIn('fast').delay(2000).fadeOut('fast');
		}

		streamListRefresh = function() {
			streamerList.find('li').fadeOut(400);
			setTimeout(function(){
				streamerList.find('li').remove();
			}, 500)
			setTimeout(function(){
				twitchHots();
			}, 600);
			
			console.log('refreshed');
		}

		exitPage = function() {
			$(window).bind('beforeunload', function(){
				return "This message popped up to counter potential accidental clickage.";
			});

		}

	// Execute Initial Functions on Page Load

		twitchHots();
		
		$(window).load(function(){

			// Get The First User's Information
				var first = streamerList.find('li').first();
				var user_first = first.data('user');
				var title_first = first.data('stream-title');

			// Embed the First User's Stream
				first.addClass('selected').focus();
				streamInject(first, user_first, title_first);

				$('#streamer-list li').on('click', function(){
					console.log('clicked');
					var user_ID = $(this).data('user');
					var title = $(this).data('stream-title');
					streamInject($(this), user_ID, title);
				});	

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
						} else if (ps == 0) {
							b.scrollTop(0);
						}
					} else if (direction == 'down') {
						if( a.offset().top > b.height()) {
							scrollCounter++;
							b.scrollTop(h * scrollCounter);
						}
					} else {
						return false;
					}
					
				}

				$(document).on('keydown', function(e) {

					// "Up" / "W" for Previous
						if(e.keyCode == 38 || e.keyCode == 87) {
							var prevUser = streamerList.find('li.selected').prev()
							var userID = prevUser.data('user');
							var title = prevUser.data('stream-title');
							if(!streamerList.find('li.selected').is(':first-child')) {
								if(streamerList.hasClass('active')) {
									streamerList.find('li.selected').removeClass('selected');
									prevUser.addClass('selected');
									scrollOffset('up');
								} else {
									streamInject(prevUser, userID, title);
								}	
							}
						}
						

					// "Down" / "S" for Next
						if(e.keyCode == 40 || e.keyCode == 83) {
							var nextUser = streamerList.find('li.selected').next();
							var userID = nextUser.data('user');
							var title = nextUser.data('stream-title');

							if(!streamerList.find('li.selected').is(':last-child')) {
								if(streamerList.hasClass('active')) {
									streamerList.find('li.selected').removeClass('selected');
									nextUser.addClass('selected');
									scrollOffset('down');
								} else {
									streamInject(nextUser, userID, title);
								}
							}
						}

					// "Right" / "D" to Show Stream Menu
						if(e.keyCode == 39 || e.keyCode == 68) {
							// streamListUserReset();
							streamerList.addClass('active');
						}

					// "Left" / "A" to Hide Stream Menu
						if(e.keyCode == 37 || e.keyCode == 65) {
							// streamListUserReset();
							streamerList.removeClass('active scroll');
						}

					// "Enter" / "E" to Activate Selected User's Stream
						if(e.keyCode == 13 || e.keyCode == 69) {
							if(streamerList.hasClass('active')) {
								var user = streamerList.find('li.selected');
								var userID = user.data('user');
								var title = user.data('stream-title');
								streamInject(user, userID, title);
							}
						}

					// "C" for Chat
						if(e.keyCode == 67) {
							var sa = 'sidebar-active';
							var tc = $('.twitch-chat');
							$('.option.chat').toggleClass('active-on');
							streamWrap.toggleClass('sidebar-active');
							theSidebar.toggleClass('hidden');						
						}

					// "R" for Refresh List
						if(e.keyCode == 82) {
							if(streamerList.hasClass('active')) {
								streamListRefresh();
							}
						}

						// console.log(e.keyCode);

					// if (e.keyCode == 83) {
					// 	if(!$('#streamer-search').hasClass('show')) {
					// 		$('#streamer-search').show().addClass('show');
					// 	} else {
					// 		$('#streamer-search').hide().removeClass('show');
					// 	}
					// }
				});
		});

	// Defining Mouse Action Functions

		streamArea.on('mouseenter',function(){
			streamerList.removeClass('active');
		});

		streamerList.on('mouseenter',function(){
			$(this).addClass('active');
		});

		streamerList.on('mouseleave',function(){
			$(this).removeClass('active');
		});

		$('.header-elements').find('.the-menu').on('click',function(){
			streamerList.toggleClass('active');
		});

		$('.option.refresh').on('click', function(){
			if(streamerList.hasClass('active')) {
				streamListRefresh();
			}
		});

		$('.option.chat').on('click',function(){
			$(this).toggleClass('active-on');
			streamWrap.toggleClass('sidebar-active');
			theSidebar.toggleClass('hidden');
		});

		// exitPage();

});
