var map;

function initMap() {
	var infowindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {
			lat: 30.2714,
			lng: -97.7071
		}
	});
	// NOTE: This uses cross-domain XHR, and may not work on older browsers.
	google.maps.event.addListener(map, 'click', function() {
		infowindow.close();
	});
	map.data.addListener('click', function(event) {
		var desc = event.feature.getProperty("desc");
		var name = event.feature.getProperty("name");
		var social = event.feature.getProperty("social");
		var img = event.feature.getProperty("img");

		var beforeDash = name.split(' —')[0];

		var match = beforeDash.substr(5);
		var googleLink = '<a title="Search for more info about ' + match + '" href="http://www.google.com/search?q=' + encodeURIComponent(match) + ' austin" target="_new"><img src="/img/35px/www.png"></a>';
		var imageSearch = '<br/><a href="http://images.google.com/search?tbm=isch&q=' + encodeURIComponent(match) + ' austin" target="_new">Image search</a>';
		var href = event.feature.getProperty("href");
		var socialHtml = '';
		if (typeof social != 'undefined'){
			var logoImg = '/img/35px/'+getSocial(social)+'.png'
			socialHtml = '<a href="'+social+'" target="_new"><img src="'+logoImg+'"></a>';
		}
		var imgHtml = '';
		if (typeof img != 'undefined'){
			imgHtml = '<span class="preview"><a href="'+href+'" target="_new"><img class="previewImg" src="'+img+'"></a></span>'
		}
		//iff(social,'<a href="'+social+'">Artist Link</a>')
		var socNet = getSocial
		
		var html = '<div class="box"><a class="title" href="' + href + '" target="_new">' + name + '</a><div class="info"><div class="tRow"><div class="tCell">'+ imgHtml + imageSearch +'</div><div class="desc tCell">' + desc + '</div></div><div class="gutter"><span class="social round">'+ socialHtml + '</div><div class="round">' + googleLink + '</div></div></div></div></div>';
		
		
		infowindow.setContent("<div style='width:450px;'>" + html + "</div>");
		infowindow.setPosition(event.feature.getGeometry().get());
		infowindow.setOptions({
			pixelOffset: new google.maps.Size(0, -30)
		});
		infowindow.open(map);
	});
	map.data.loadGeoJson("http://atx.writeordie.com/data/data.json");
}

function getSocial(url){
	var socName = 'sharethis';
	["facebook","instagram","twitter","tumblr"].forEach(function(soc){
		if (url.indexOf(soc) > -1) {
			console.log("found?",soc);
			socName = soc;
		} 
	})
	return socName
}

function iff(thing,otherThing){
	if (thing == undefined) {
		return ''
	} else {
		return otherThing
	}
}