
function viewMeta(x){
	$("#metaModal .modal-title").html(""+x.name+"")
	$("#metaModal #downloadBTN").attr("href","http://floodatlas.org/asfpm/data/toledo"+x.path+"")
	$("#metaModal .modal-body").html(function(){
		body = ""
		body += ""+x.description+"<hr>"
		body += "<dl class='dl-horizontal'>"
		body += "<dt>Author</dt><dd>"+x.author+"</dd>"
		body += "<dt>Credits</dt><dd>"+x.credits+"</dd>"
		body += "<dt>Format</dt><dd>"+x.format+"</dd>"
		body += "<dt>Geometry</dt><dd>"+x.geometry+"</dd>"
		body += "<dt>Tags</dt><dd>"+x.tags+"</dd>"
		body += "</dl>"
		return body
	})
	$("#metaModal").modal()
}

/* From application.js on bootstrap docs */
if($(document).width()>=992){
	console.log("big")
	$('.sidenav').affix({
	  offset: {
	    top: 168
	  }
	});
}else{
	$('.sidenav').prepend('<hr>')
}





var t = new Trianglify({
    x_gradient: Trianglify.colorbrewer.YlGnBu[9],
    noiseIntensity: 0,
    cellsize: 90});
var pattern = t.generate(document.body.clientWidth, $('header').outerHeight());
$("header,footer").css('background-image',pattern.dataUrl);


$(window).on('load',function(){
	if($('footer').position().top<($(window).height()-$('footer').outerHeight())){
		$('footer').css('top', function(){
			return ($(window).height()-$('footer').outerHeight())
		})
		$('footer').css('position', 'absolute')


	}
	$('.sidenav').css('width',function(){
		return $(this).width()
	})
})
$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}



