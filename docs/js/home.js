(function(window, document, undefined){

	window.onload = init;

	window.onresize = resize;

	function init(){
		setVideoHeight();
		setSloganHeight();
		window.setTimeout(setVideoHeight, 500);
	}

	function resize(){
		setVideoHeight();
		setSloganHeight();
		if (window.innerWidth > 480) {
			var list = document.getElementById("nav-list");
			var button = document.getElementById("navctrlbutton");

			list.style.display = 'block';
			button.src = "img/neonarrowup.png";
		};
	}

	// Functions

})(window, document, undefined);

function randomQuote() {
	var images = ["extra_rare_on.png", "time_well_wasted_on.png", "eggplants_aubergines_on.png"];
	var randomImage = "img/quotes/" + images[Math.floor(Math.random()*images.length)];
	document.write("<img id=\"headerquote\" src=\""+randomImage+"\" alt=\"\">");
}

function showNavItems() {
	var list = document.getElementById("nav-list");
	var button = document.getElementById("navctrlbutton");

	if (list.style.display == 'block') {
		list.style.display = 'none';
		button.src = "img/neonarrowdown.png";
	} else {
		list.style.display = 'block';
		button.src = "img/neonarrowup.png";
	}

}

function setVideoHeight() {
	var videoObjects = document.getElementsByClassName("phonescreenrecording");
	for (var j = 0; j < videoObjects.length; j++) {
		var height = 0;
		var children = videoObjects[j].children;
		for (var i = 0; i < children.length; i++) {
			height += (children[i].offsetHeight / 0.8730800323);
		};
		videoObjects[j].style.height = height + "px";
	}
}

function setSloganHeight() {
	var slogans = document.getElementsByClassName("slogan");
	for (var i = 0; i < slogans.length; i++) {
		slogans[i].style.height = (slogans[i].clientWidth / (3+(1/3))) + "px";
	}
}