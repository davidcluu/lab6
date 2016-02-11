'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.project a').click(addProjectDetails);

	$('#colorBtn').click(randomizeColors);
	$('#picBtn').click(placeRandomPicture);
}

/*
 * Make an AJAX call to retrieve project details and add it in
 */
function addProjectDetails(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var idNumber = projectID.substr('project'.length);

	$.get("/project/" + idNumber, handleProjectDetail);
}

function handleProjectDetail(res) {
	$("#project" + res['id'] + " .thumbnail .details").html(
		res['summary'] +
		'<img src="' + res['image'] + '" class="detailsImage"></img>'
	);
}

/*
 * Make an AJAX call to retrieve a color palette for the site
 * and apply it
 */
function randomizeColors(e) {
	$.get("/palette/", handlePalette);
}

function handlePalette(res) {
	$('body').css('background-color', res.colors.hex[0]);
	$('.thumbnail').css('background-color', res.colors.hex[1]);
	$('h1, h2, h3, h4, h5, h5').css('color', res.colors.hex[2]);
	$('p').css('color', res.colors.hex[3]);
	$('.project img').css('opacity', .75);
}


/**/
function placeRandomPicture() {
	var long = Math.floor(360 * Math.random()) - 180;
	var minLong = (long < -170) ? -180 : (long - 10);
	var maxLong = (long >  170) ?  180 : (long + 10);

	var lat  = Math.floor(180 * Math.random()) - 90;
	var minLat = (long < -80) ? -90 : (long - 10);
	var maxLat = (long >  80) ?  90 : (long + 10);

	$.get(
		"http://www.panoramio.com/map/get_panoramas.php?" +
		"set=public&from=0&to=20&" +
		"minx=" + minLong + "&miny=" + minLat + "&maxx=" + maxLong + "&maxy=" + maxLat + "&" +
		"size=medium&mapfilter=true",
		handlePicture,
		'jsonp'
	);
}

function handlePicture(res) {
	if (res.photos.length == 0) {
		placeRandomPicture();
	}
	else {
		var photo = res.photos[Math.floor(res.photos.length * Math.random())];

		$("#worldPic").html(
			'<img src="' + photo.photo_file_url + '" class="img" style="margin: 10px auto;"></img>' +
			'<div>Title: ' + photo.photo_title + '</div>' +
			'<div>Uploaded: ' + photo.upload_date + '</div>' +
			'<div>Lat/Long: (' + photo.longitude + ', ' + photo.latitude + ')</div>'
		);
	}
}