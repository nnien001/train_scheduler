console.log("using app.js")

 
//  Initialize Firebase
var config = {
    apiKey: "AIzaSyBpPVHvxdeKl26e5ACciTghcZfu7owtAhU",
    authDomain: "train-scheduler-2d0f8.firebaseapp.com",
    databaseURL: "https://train-scheduler-2d0f8.firebaseio.com",
    storageBucket: "train-scheduler-2d0f8.appspot.com",
    messagingSenderId: "314319068859"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainData= {
	name: "",
	destination: "",
	firstRun: new Date(),
	frequency: 0,
	dateAdded: new Date()
}


//---------------------------------------------------------
$("#inputSubmit").on("click", function(){

	//store input values into variables
	trainData.name = $("#inputName").val().trim();
	trainData.destination = $("#inputDest").val().trim();
	trainData.firstRun = $("#inputFirstRun").val().trim();
	trainData.frequency = $("#inputFreq").val().trim();
	trainData.dateAdded = firebase.database.ServerValue.TIMESTAMP

	console.log(trainData.name, trainData.destination, trainData.firstRun, trainData.frequency);

	database.ref().push(trainData);

	// Return False to allow "enter"
	return false;
});

database.ref().on("child_added", function(childSnapshot){
	console.log(childSnapshot.val());

	var childName = childSnapshot.val().name;
	var childDest = childSnapshot.val().destination;
	var childFirstRun = childSnapshot.val().firstRun;
	var childFreq = childSnapshot.val().frequency;

	var newRow= $("<tr>");
	var nameTD = $('<td class="col-sm-2-4">');
	var destTD = $('<td class="col-sm-2-4">');
	var freqTD = $('<td class="col-sm-2-4">');
	var nextTD = $('<td class="col-sm-2-4">');
	var minTD = $('<td class="col-sm-2-4">');

	nameTD.text(childName);
	destTD.text(childDest);
	freqTD.text(childFreq);
	nextTD.text(nextRunTime(childFirstRun, childFreq));
	minTD.text(nextRunMin(childFirstRun, childFreq));

	newRow.append(nameTD);
	newRow.append(destTD);
	newRow.append(freqTD);
	newRow.append(nextTD);
	newRow.append(minTD);

	$("tbody").append(newRow);

	$("#now").text(moment().format("HH:mm"));

}, function (errorObject) {
  	console.log("The read failed: " + errorObject.code);
});



//It is assumed that all trains stop at midnight.
// You're not going to get the results you want if you have a pre-midnight train with freq that carries post midnight.

function todayFirstRun(firstRun) {
	var timeSplit = firstRun.split(":");
	return moment().startOf("day").add(timeSplit[0],"hours").add(timeSplit[1], "minutes");
}

function nextRunMin(firstRun, frequency) {
	var todaysFirst = todayFirstRun(firstRun);

	var timeDiff = moment().diff(todaysFirst, "minutes");

	if(todaysFirst < moment() )
		return frequency - (timeDiff % frequency);
	else 
		return timeDiff * (-1);

}

function nextRunTime(firstRun, frequency) {
	var todaysFirst = todayFirstRun(firstRun);

	if(todaysFirst < moment() )
		return moment().add(nextRunMin(firstRun, frequency), "minutes").format("HH:mm");
	else
		return firstRun;
}