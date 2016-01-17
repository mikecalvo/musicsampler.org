var highlight;
var images = new Array();
var tracks;

function noop(event) { Event.stop(event); }

function handleMouseOver(event) {
	var row = Event.element(event);
	row.addClassName('clickableTrack');		
}


function handleMouseOut(event) {
	var row = Event.element(event);
	if (row != highlight) {
		row.removeClassName('clickableTrack');		
	}
}

function handleClick(event) {
	clearHighlight();
	var row = Event.element(event);
	
	var cover = $('cover');
	if (cover) {
		cover.remove();
	}

	highlight = row;
	row.addClassName('selectedTrack');		
	cover = new Element('div', { 'class': 'cover', 'id': 'cover' });
	cover.observe('mouseover', noop);
	var trackIndex = parseInt(row.id);
	if (trackIndex >= 0) {
		cover.insert(images[trackIndex]);
		if (tracks[trackIndex].comments) {
			cover.insert(tracks[trackIndex].comments);
		}
		cover.show();
		row.insert({'bottom': cover});
		Event.stop(event);
	}
}


function clearHighlight() {
	if (highlight) {
		highlight.removeClassName('clickableTrack');
		highlight.removeClassName('selectedTrack');
		highlight = null;
	}
	
	if ($('cover')) {
		$('cover').remove();
	}
}

function track(title, artist, comments) {
	var track = new Object();
	
	track.title = title;
	track.artist = artist;
	if (comments) {
		track.comments = comments;
	}
	
	return track;
}

