// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info, log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

(function ($) {

	// Shorthand jQuery selector cache. Only use on selectors for the DOM that won't change.
	var $$ = (function() {
		var cache = {};
		return function(selector) {
			if (!cache[selector]) {
				cache[selector] = $(selector);
			}
			return cache[selector];
		};
	})();

	var socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['xhr-polling']
	});
	socketIoClient.on('connect', function () {
		$$('#connected').addClass('on').find('strong').text('Online');
	});

	var image = $.trim($('#image').val());
	var service = $.trim($('#service').val());
	socketIoClient.on('message', function(json) {

        var doc = JSON.parse(json);
        var msg = doc.actor.displayName + ' ' + doc.title + ' ' + doc.object.displayName;

		var $li = $('<li>').text(msg);
        if (doc.actor.image) {
		    $li.append($('<img class="avatar">').attr('src', doc.actor.image.url));
        } 
		if (doc.provider && doc.provider.icon) {
			$li.append($('<img class="service">').attr('src', doc.provider.icon.url));
		}
		$$('#bubble ul').prepend($li);
		$$('#bubble').scrollTop(98).stop().animate({
			'scrollTop': '0'
		}, 500);
		setTimeout(function() {
			$li.remove();
		}, 20000);

		setTimeout(function() {
			socketIoClient.send('I am still online');
		}, 5000);
	});

	socketIoClient.on('disconnect', function() {
		$$('#connected').removeClass('on').find('strong').text('Offline');
	});
})(jQuery);
