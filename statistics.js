var statistics = {
	"glance": [
		{
			"party": "Republicans",
			"politicians": 0,
			"votes": 0,
		},
		{
			"party": "Democrats",
			"politicians": 0,
			"votes": 0,
		},
		{
			"party": "Independants",
			"politicians": 0,
			"votes": 0,
		},
		{
			"party": "Total",
			"politicians": 0,
			"votes": 0,
		}
	]
};

var members;

var summary;

callAPI();

function callAPI() {

	var senate = "https://api.propublica.org/congress/v1/113/senate/members.json";
	var house = "https://api.propublica.org/congress/v1/113/house/members.json";

	if ((document.location.pathname == "/senate-attendance.html") || (document.location.pathname == "/senate-loyalty.html")) {
		start(senate);
	} else if ((document.location.pathname == "/house-attendance.html") || document.location.pathname == "/house-loyalty.html") {
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
	members = serverData['results'][0]['members'];
	summary = statistics['glance'];
	saveFirstTableData(members, summary);
	populateTable(summary);
	average(members);
}

function onConversionToJsonFailed() {
	console.log("Not a json mate!");
}

function saveFirstTableData(membersArray, stats) {
	var DperArray = [];
	var RperArray = [];
	var IperArray = [];
	var totalArray = [];
	var MissedVotesArray = [];
	var least = [];
	var most = [];

	fillingArrays(members, MissedVotesArray, DperArray, RperArray, IperArray, totalArray);

	stats[0]["politicians"] = RperArray.length;
	stats[1]["politicians"] = DperArray.length;
	stats[2]["politicians"] = IperArray.length;
	stats[3]["politicians"] = RperArray.length + DperArray.length + IperArray.length;

	stats[0]["votes"] = average(RperArray);
	stats[1]["votes"] = average(DperArray);
	stats[2]["votes"] = average(IperArray);
	stats[3]["votes"] = average(totalArray);

	leastF(members, least);
	mostF(members, most);
	createTable(least, 'idLeast');
	createTable(most, 'idMost');
}

function fillingArrays(membersArray, polArray, demVotesArray, repVotesArray, indVotesArray, totArray) {
	for (var i = 0; i < membersArray.length; i++) {
		if (membersArray[i]["votes_with_party_pct"] != null) {
			polArray.push(members[i]["missed_votes"]);
			totArray.push(membersArray[i]["votes_with_party_pct"]);
			if (membersArray[i]['party'] == "D") {
				demVotesArray.push(membersArray[i]["votes_with_party_pct"]);
			} else if (membersArray[i]['party'] == "R") {
				repVotesArray.push(membersArray[i]["votes_with_party_pct"]);
			} else if (membersArray[i]['party'] == "I") {
				indVotesArray.push(membersArray[i]["votes_with_party_pct"]);
			}
		}
	}
}

function average(numbersArray) {
	var average = 0;
	for (var i = 0; i < numbersArray.length; i++) {
		average += numbersArray[i] / numbersArray.length;
	}
	return average;
}

function populateTable(stats) {
	var table = document.getElementById("glanceT");
	table.innerHTML = " ";
	for (var i = 0; i < stats.length; i++) {
		var trow = document.createElement('tr');
		table.appendChild(trow);

		var tcol = document.createElement('td');
		trow.appendChild(tcol);
		tcol.textContent = party;

		var tcol1 = document.createElement('td');
		trow.appendChild(tcol1);
		tcol1.textContent = politicians;

		var tcol2 = document.createElement('td');
		trow.appendChild(tcol2);
		tcol2.textContent = votes;

		var party = stats[i]["party"];
		var politicians = stats[i]["politicians"];
		var votes = stats[i]["votes"].toFixed(2) + ' %';

	}
	var trow1 = document.createElement('tr');
	table.appendChild(trow1);

	var tcol = document.createElement('td');
	trow1.appendChild(tcol);
	tcol.textContent = party;

	var tcol1 = document.createElement('td');
	trow1.appendChild(tcol1);
	tcol1.textContent = politicians;

	var tcol2 = document.createElement('td');
	trow1.appendChild(tcol2);
	tcol2.textContent = votes;
}

function leastF(polArray, outcome) {
	var comparingKey = "";
	if ((document.location.pathname == "/senate-attendance.html") || document.location.pathname == "/house-attendance.html") {
		polArray.sort(function (a, b) {
			return b["missed_votes_pct"] - a["missed_votes_pct"];
		});
		comparingKey = "missed_votes_pct";
	} else if ((document.location.pathname == "/senate-loyalty.html") || (document.location.pathname == "/house-loyalty.html")) {
		polArray.sort(function (a, b) {
			return a['votes_with_party_pct'] - b['votes_with_party_pct'];
		});
		comparingKey = "votes_with_party_pct";
	}
	for (var i = 0; i <= 10 * polArray.length / 100; i++) {
		outcome.push(polArray[i]);
	}
	console.log(comparingKey);
	extra(polArray, outcome, comparingKey);
}

function mostF(polArray, outcome) {
	var comparingKey = "";
	if ((document.location.pathname == "/senate-attendance.html") || (document.location.pathname == "/house-attendance.html")) {
		polArray.sort(function (a, b) {
			return a["missed_votes_pct"] - b["missed_votes_pct"];
		});
		comparingKey = "missed_votes_pct";
	} else if ((document.location.pathname == "/senate-loyalty.html") || (document.location.pathname == "/house-loyalty.html")) {
		polArray.sort(function (a, b) {
			return b['votes_with_party_pct'] - a['votes_with_party_pct'];
		});
		comparingKey = "votes_with_party_pct";
	}
	console.log(comparingKey);
	for (var i = 0; i <= 10 * polArray.length / 100; i++) {
		outcome.push(polArray[i]);
	}
	extra(polArray, outcome, comparingKey);
}

function extra(polArray, outcome, compareKey) {
	for (var i = outcome.length; i < polArray.length; i++) {
		if (polArray[i][compareKey] == outcome[outcome.length - 1][compareKey]) {
			outcome.push(polArray[i]);
		}
	}
}

function createTable(polArray, idName) {
	var senateData = document.getElementById(idName);
	senateData.innerHTML = " ";
	for (var i = 0; i < polArray.length; i++) {
		var trow = document.createElement('tr');
		senateData.appendChild(trow);
		var tcol = document.createElement('td');
		var a = document.createElement('a');
		trow.appendChild(tcol);
		tcol.appendChild(a);

		if (polArray[i]['middle_name'] != null) {
			a.innerHTML = polArray[i]['first_name'] + " " + polArray[i]['middle_name'] + " " + polArray[i]['last_name'];
		} else {
			a.innerHTML = polArray[i]['first_name'] + " " + polArray[i]['last_name'];
		}
		a.setAttribute("href", polArray[i]['url']);
		a.setAttribute("target", "_blank");

		if ((document.location.pathname == "/senate-attendance.html") || (document.location.pathname == "/house-attendance.html")) {
			var tcol1 = document.createElement('td');
			trow.appendChild(tcol1);
			tcol1.innerHTML = polArray[i]['missed_votes'];

			var tcol2 = document.createElement('td');
			trow.appendChild(tcol2);
			tcol2.innerHTML = polArray[i]['missed_votes_pct'].toFixed(2) + ' %';
		} else if ((document.location.pathname == "/senate-loyalty.html") || (document.location.pathname == "/house-loyalty.html")) {
			var tcol1 = document.createElement('td');
			trow.appendChild(tcol1);
			tcol1.innerHTML = (((polArray[i]['total_votes'] - polArray[i]['missed_votes']) * polArray[i]['votes_with_party_pct']) / 100).toFixed(0);

			var tcol2 = document.createElement('td');
			trow.appendChild(tcol2);
			tcol2.innerHTML = polArray[i]['votes_with_party_pct'].toFixed(2) + ' %';
		}
	}
}
