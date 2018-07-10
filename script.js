var app = new Vue({
	el: '#app',
	data: {
		members: [],
		states: [],
		mainMembers: []
	}
});

var serverData;
var members;
var time;

var demoCH = document.getElementById('demo');
var repCH = document.getElementById('rep');
var indCH = document.getElementById('ind');
demoCH.addEventListener("click", showhiderow);
repCH.addEventListener("click", showhiderow);
indCH.addEventListener("click", showhiderow);

var select = document.getElementById("state");
select.addEventListener("change", showhiderow);

call();


// function
function call() {

	var senate = "https://api.propublica.org/congress/v1/113/senate/members.json";
	var house = "https://api.propublica.org/congress/v1/113/house/members.json";

	if (document.location.pathname == "/U.S.-Congress-Open-Data/senate.html") {
		start(senate);
	} else if (document.location.pathname == "/U.S.-Congress-Open-Data/house.html") {
		start(house);
	}
}

function start(url) {
	var fetchConfig =
		fetch(url, {
			method: "GET",
			headers: new Headers({
				"X-API-Key": 'AP6rtff9mqqKKtvJR7DSCCYZVheq1lrHONalPGrF'
			})
		})
		.then(onDataFetched)
		.catch(onDataFetchFailed);
}

function onDataFetched(response) {
	response.json()
		.then(onConversionToJsonSuccessful)
		.catch(onConversionToJsonFailed);
}

function onDataFetchFailed(error) {
	console.log("I have failed in life.", error);
}

function onConversionToJsonSuccessful(json) {
	serverData = json;
	showPage();
	app.mainMembers = serverData['results'][0]['members'];
	app.members = serverData['results'][0]['members'];
	app.states = uniqueState();
}

function onConversionToJsonFailed() {
	console.log("Not a json mate!");
}

function showPage() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("myDiv").style.display = "block";
}

function showhiderow() {
	var members = app.mainMembers;
	var filteredArray = [];
	var currentselect = document.getElementById("state").value;
	for (var i = 0; i < members.length; i++) {
		if (currentselect == members[i]["state"] || currentselect == "all") {
			if (demoCH.checked && members[i]['party'] == "D") {
				filteredArray.push(members[i]);
			} else if (repCH.checked && members[i]['party'] == "R") {
				filteredArray.push(members[i]);
			} else if (indCH.checked && members[i]['party'] == "I") {
				filteredArray.push(members[i]);
			} else if (!demoCH.checked && !indCH.checked && !repCH.checked) {
				filteredArray.push(members[i]);
			}
		}
	}
	app.members = filteredArray;
}

function uniqueState() {
	var members = app.members;
	var unique = [];
	var select = document.getElementById("state");
	for (var i = 0; i < members.length; i++) {
		for (var j = i + 1; j < members.length; j++) {
			if (members[i]['state'] !== members[j]['state'] && !unique.includes(members[j]['state'])) {
				unique.push(members[j]['state']);
			}
		}
	}
	unique.sort();
	return unique;
}
