const scrapeIt = require("scrape-it");
var NodeGeocoder = require('node-geocoder');
const ImagesClient = require('google-images');
let client = new ImagesClient('016005128675794900464:2_rzc89hd9c', 'AIzaSyArHmfRENFoOmHd3hnp2ahOfw4eQJ2H_GE');
var geocoder = NodeGeocoder(options);
var GeoJSON = require('geojson');


var jsonfile = require('jsonfile')

var file = 'data.json';

 function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
 
// Promise interface
	
function mapify(num,done){
	num =  pad(num,3);
	var url = "http://east.bigmedium.org/part/part_"+num+".html";
	var array = [];
	scrapeIt(url, {
		title: ".bm-part-name",
		category: ".bm-part-title",
		desc: ".bm-part-desc",
		address: ".bm-part-contact1 a",
		img: {selector: ".bm-part-page img", attr: "src"},
		social: {selector: ".bm-part-social a", attr: "href"},
	}).then(page => {
		console.log(":: got "+page.title);
		console.log(page);
		geocoder.geocode(page.address + ' Austin, TX')
			.then(function(res) {
				var beforeDash = page.title.split(' —')[0];
				var afterDot = beforeDash.split('. ')[1];
				res[0].name = page.title;
				res[0].href = url;
				res[0].desc = page.desc;
				res[0].social = page.social;
				res[0].img = 'http://east.bigmedium.org/'+page.img.substr(3);
				console.log(res[0].img);
				done(res[0])
			})
			.catch(function(err) {
				console.log(err);
			});
	});
	
}


var co = 1;
var array = [];
var interval = setInterval(function(){
	mapify(co,function(mapData){
		array.push(mapData);
		co++;
		var obj = GeoJSON.parse(array, {Point: ['latitude', 'longitude'], include: ['name','href','desc','img','social']});
		jsonfile.writeFile(file, obj, function (err) {
			//console.log(":: Mapified ",mapData.name);
		  //console.error(err)
		})
	})
	if (co == 534) {
		console.log(":: DONE");
		clearInterval(interval);
	}
}, 1000)
/*
	
*/

 



var options = {
	provider: 'google',

	// Optional depending on the providers 
	httpAdapter: 'https', // Default 
	apiKey: 'AIzaSyDMjuzESIgy5iPWq3YWH7v8BgrxZJsqjME', // for Mapquest, OpenCage, Google Premier 
	formatter: null // 'gpx', 'string', ... 
};








/*
<script>
  (function() {
    var cx = '016005128675794900464:2_rzc89hd9c';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
</script>
<gcse:search></gcse:search>
AIzaSyAQp2ri2P7WEsGPO0PpQ3EQD40C2BPPKTA
*/