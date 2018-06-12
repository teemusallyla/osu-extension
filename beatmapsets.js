
function refresh(){
	chrome.storage.local.get(
		function(items){
			var downloaded = items["downloaded"];
			var color = items["downloaded_color"];
			var headers = document.body.getElementsByClassName("beatmapset-panel__header");
			for (header of headers){
                var id = header.getElementsByTagName("a")[0].href.split("/").pop()
				if(downloaded.includes(id)){
                    header.parentElement.style.backgroundColor = color;
				} else {
					header.parentElement.style.backgroundColor = null;
				}
			};
		}
	);
}

function addToStorage(){
	var songid = window.location.href.split("/")[4].split("#")[0];
	chrome.storage.local.get(
		"downloaded",
		function(item){
			var downloaded = item["downloaded"];
			if (!downloaded.includes(songid)){
				downloaded.push(songid);
				chrome.storage.local.set(
					{"downloaded": downloaded},
					function(){
						console.log("Storage set");
					}
				);
			} else {
				console.log("Song already downloaded");
				alert("Note: you have already downloaded this song!");
			}
		}
	);
}

var interval;
function beatmapsets() {
	console.log("beatmapsets called");
	refresh();
	interval = setInterval(refresh, 1000);
}


function mapset() {
	function setInfoColor() {
		chrome.storage.local.get(items => {
			if (items["downloaded"].includes(songid)) {
				document.getElementsByClassName("beatmapset-info")[0].style.backgroundColor = items["downloaded_color"];
			}
		});
	}
	
	clearInterval(interval);
    console.log("mapset called");
    var links = document.getElementsByClassName("js-beatmapset-download-link");
	var songid = links[0].href.split("/")[4];
	setTimeout(setInfoColor, 1000);
	chrome.storage.onChanged.addListener(setInfoColor);

    for (l of links){
        l.addEventListener("click", addToStorage);
    }
}

var oldLocation;
function locationListener() {
	var location = window.location.href;
	if (!oldLocation || oldLocation != location) {
		onLocationChange();
		oldLocation = location;
	}
}

function onLocationChange() {
	run();
}

function run() {
	if (window.location.href.split("/").length > 4) {
		mapset();
	} else {
		beatmapsets();
	}
}

setInterval(locationListener, 500);