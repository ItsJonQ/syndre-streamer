$(document).ready(function(){
	// Defining Global Variables
		theHeader = $('#header');
		streamWrap = $('#stream-wrapper');
		streamerList = $('#streamer-list');
		streamArea = $('#livestream');
		theSidebar = $('#sidebar');
		streamWatching = $('#streamer-watching');
		headerOffset = $('#header').height();
		whOffset = 64;

	// Defining Global Functions
		twitchHots = function() {
			var twitchHots_api = 'http://api.justin.tv/api/stream/list.json?meta_game=StarCraft%20II:%20Heart%20of%20the%20Swarm&limit=25&jsonp=?';
			$.getJSON(twitchHots_api, function(data) {
				$.each(data,function(i, data) {
					var user = data.channel.login;
					var twitch_live_view_count = data.channel_count;
					var stream_title = data.title;
					streamerList.find('ul').append('<li id="'+twitch_live_view_count+'" data-user="'+user+'" data-stream-title="'+stream_title+'">'+user+'<span class="view-count">'+twitch_live_view_count+'</span></li>');
				});
			});
		}

		twitchEmbed = function(username, view_count, counter) {
			var start = '&auto_play=true';
			var width = '1920';
			var height = '1080';
			var twitch_stream = '<div class="livestream-embed" data-view-count="'+view_count+'"><object type="application/x-shockwave-flash" height="'+height+'" width="'+width+'" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=mlgsc2" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+username+start+'" /></object></div>';
			streamArea.append(twitch_stream);	
		}

		twitchChat = function() {
			var user = streamWrap.data('twitch-user');
			var chat_embed_code = '<div class="twitch-chat side-widget"><div class="chat-header widget-header"><span class="highlight-text">'+user+'</span> Twitch Chat</div><div class="widget-body"><iframe frameborder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel='+user+'&amp;popout_chat=true" height="100%" width="300"></iframe></div></div>';
			theSidebar.append(chat_embed_code);
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
			// streamWatching.fadeIn('fast').delay(2000).fadeOut('fast');
		}

		function sortEm(a,b){
	  		return parseInt($('span.view-count', a).text()) < parseInt($('span.view-count', b).text()) ? 1 : -1;
		}

		streamerListScroll = function() {
			var sh = streamerList.find('ul').height();
			var wh = $(window).height();
			// streamerList.find('ul').height(wh-whOffset);
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
			
			streamerList.find('li').on('click', function(){
				var user_ID = $(this).data('user');
				var title = $(this).data('stream-title');
				streamInject($(this), user_ID, title);
			});	

			// Defining Key Press Functions

				$(document).keydown(function(e) {

					// "Up" for Previous
						if(e.keyCode == 38) {
							var prevUser = streamerList.find('li.selected').prev()
							var userID = prevUser.data('user');
							var title = prevUser.data('stream-title');
							if(!streamerList.find('li.selected').is(':first-child')) {
								streamInject(prevUser, userID, title);
							}
						}

					// "Down" for Next
						if(e.keyCode == 40) {
							var nextUser = streamerList.find('li.selected').next();
							var userID = nextUser.data('user');
							var title = nextUser.data('stream-title');
							if(!streamerList.find('li.selected').is(':last-child')) {
								streamInject(nextUser, userID, title);
							}
						}

					// "Right" to Show Stream Menu
						if(e.keyCode == 39) {
							streamerList.addClass('active');
							streamerListScroll();
						}

					// "Left" to Hide Stream Menu
						if(e.keyCode == 37) {
							streamerList.removeClass('active scroll');
							streamerList.find('ul').height('auto');
						}

					// "C" for Chat
						if(e.keyCode == 67) {
							var sa = 'sidebar-active';
							var tc = $('.twitch-chat');
							if(!streamWrap.hasClass(sa)) {
								streamWrap.addClass(sa);
								theSidebar.removeClass('hidden');
								var wh = $(window).height() - headerOffset;
								tc.find('iframe').height(wh);
								if(!tc.length) {
									twitchChat();
								}
							} else {
								streamWrap.removeClass(sa);
								theSidebar.addClass('hidden');	
							}
							
						}

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
			streamerListScroll();
		});

		streamerList.on('mouseleave',function(){
			$(this).removeClass('active');
		});

		$('.header-elements').find('.the-menu, .the-logo').on('mouseenter',function(){
			streamerList.addClass('active');
			streamerListScroll();
		});

});
