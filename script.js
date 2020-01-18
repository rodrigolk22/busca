


var textInput = localStorage.getItem("searchCharacterValue");

var pageOffset = localStorage.getItem("pageOffsetValue");

if(pageOffset == null){
	pageOffset = 0;
}

var count;

var requestURL = 'https://kitsu.io/api/edge/characters?page[limit]=10&page[offset]='+pageOffset;
var request = new XMLHttpRequest();

var requestURLDetails;
var requestDetails = new XMLHttpRequest();

var characters;


window.onload = function(){
	document.getElementById("searchCharacter").value = localStorage.getItem("searchCharacterValue");
}

if(textInput != undefined && textInput != null && textInput != ""){
	requestURL = requestURL+'&filter[name]='+textInput;
}

console.log(requestURL);

request.open('GET', requestURL, true);
request.responseType = 'json';
request.send();

console.log(localStorage.getItem("requestDetails"));

if(localStorage.getItem("requestDetails") != 0 && localStorage.getItem("requestDetails") != null && localStorage.getItem("requestDetails") != undefined){
	requestURLDetails = 'https://kitsu.io/api/edge/characters/'+localStorage.getItem("requestDetails")+'/media-characters';
	console.log(requestURLDetails);
	requestDetails.open('GET', requestURLDetails, true);
	requestDetails.responseType = 'json';
	requestDetails.send();
	
}

requestDetails.onload = function(){
	var details = requestDetails.response;
	var detailsList = details['data'];
	var detailHeader = document.getElementById("contentHeader");
	var contentHeaderDetails = document.createElement('div');
	contentHeaderDetails.setAttribute("id", "contentHeaderDetails");
	var detailTitle =  document.createElement('span');
	detailTitle.textContent = "Midias relacionadas";
	detailTitle.setAttribute("class","detailTitle");
	contentHeaderDetails.appendChild(detailTitle);
	var detailList = document.createElement('ul');
	var requestsList = new Array(detailsList.length);

	var helperFunc = function(i, itemId){
		return function(){
			if(requestsList[i]. readyState === 4){
				var responseTemp = requestsList[i].response.data.attributes;
				var nameMedia = document.createElement('span');
				var imageMedia = document.createElement('img');
				nameMedia.textContent = responseTemp.canonicalTitle;

				if(responseTemp.posterImage != null){
					imageMedia.src = responseTemp.posterImage.tiny;
				}else{
					imageMedia.src = "images/image-not-found.jpg";
				}
				
				var detailListItem = document.createElement('li');
				detailListItem.appendChild(imageMedia);
				detailListItem.appendChild(nameMedia);
				detailList.appendChild(detailListItem);
			}
		}
	}


	for (var i = 0; i < detailsList.length; i++){
		var resquestTempUrl = 'https://kitsu.io/api/edge/media-characters/'+detailsList[i].id+'/media';
		var itemId = requestsList[i]; 
		requestsList[i] = new XMLHttpRequest()
		requestsList[i].open('GET', resquestTempUrl, true);
		requestsList[i].responseType = 'json';
		requestsList[i].onreadystatechange = helperFunc(i,itemId);
		requestsList[i].send();
	}
	contentHeaderDetails.appendChild(detailList);
	detailHeader.appendChild(contentHeaderDetails);
	
}


request.onload = function() {
	characters = request.response;
	populateCharacters(characters);
	if(pageOffset == 0 || pageOffset == null){
		document.getElementById("arrowLeft").classList.add("arrowInactive");
	}
	count = characters['meta'].count;
	if(count - 10 <= pageOffset){
		document.getElementById("arrowRight").classList.add("arrowInactive");
	}
	renderPagination();
}

function populateCharacters(characters){
	var contentBodyList = document.getElementById("contentBodyList");
	var charactersList = characters['data'];
	var myList = document.createElement('ul');
	
	for (var i = 0; i < charactersList.length; i++){
		var listItem = document.createElement('li');
		listItem.setAttribute("id", "listItem");
		var relativeContentBodyList = document.createElement('div');
		relativeContentBodyList.setAttribute("id", "relativeContentBodyList");
		var contentListItem = document.createElement('div');
		contentListItem.setAttribute("class", "contentListItem width25"); 
		var image = document.createElement('img');
		var name = document.createElement('span');
		var contentDetails = document.createElement('div');
		contentDetails.setAttribute("id", "contentDetails");
		contentDetails.setAttribute("class", "contentListItem width75");
		
		

		if(charactersList[i].attributes.image != null){
			image.src = charactersList[i].attributes.image.original;
		}else{
			image.src = "images/image-not-found.jpg";
		}
		
		
		name.textContent = charactersList[i].attributes.canonicalName;
		contentDetails.innerHTML = charactersList[i].attributes.description;

		contentListItem.appendChild(image);
		contentListItem.appendChild(name);

		relativeContentBodyList.appendChild(contentListItem);
		relativeContentBodyList.appendChild(contentDetails);


		listItem.setAttribute("onclick", "showDetails("+charactersList[i].id+");");

		listItem.appendChild(relativeContentBodyList);
		
		myList.appendChild(listItem);
	}
	contentBodyList.appendChild(myList);

}

function characterSearch(){
	localStorage.setItem("pageOffsetValue", 0)
	localStorage.setItem("requestDetails", 0);
	localStorage.setItem("searchCharacterValue",document.getElementById("searchCharacter").value);
}

function reduceOffset(){
	pageOffset = localStorage.getItem("pageOffsetValue");
	if(pageOffset >= 10){
		localStorage.setItem("pageOffsetValue", pageOffset-10);
		localStorage.setItem("requestDetails", 0);
		location.reload();
	}
}

function increaseOffset(){
	pageOffset = localStorage.getItem("pageOffsetValue");
	if(count - 10 > pageOffset){
		localStorage.setItem("pageOffsetValue", parseInt(pageOffset)+10);
		localStorage.setItem("requestDetails", 0);
		location.reload();
	}
}

function setOffset(value){
	localStorage.setItem("pageOffsetValue", value*10);
	pageOffset = value;
	localStorage.setItem("requestDetails", 0);
	location.reload();
}

function renderPagination(){
	if(pageOffset != null && count != null){
		var pageList = document.getElementById("pageList");
		var myList = document.createElement('ul');
		for (var i = 0; i < 10; i++){
			var listItem = document.createElement('li');
			listItem.textContent = i;
			if(pageOffset == i*10){
				listItem.classList.add('currentPage');
			}
			else{
				listItem.classList.add('availablePage');
			}
			listItem.setAttribute("onclick", "setOffset("+i+");");
			myList.appendChild(listItem);
			
		}
		pageList.appendChild(myList);
	}
}

function showDetails(id){
	if(localStorage.getItem("requestDetails") == id){
		localStorage.setItem("requestDetails", 0);
	}else{
		localStorage.setItem("requestDetails", id);
	}
	location.reload();
}