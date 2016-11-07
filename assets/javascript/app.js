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

}, function (errorObject) {
  	console.log("The read failed: " + errorObject.code);
});

function nextRunMin(firstRun, frequency) {
	var timeSplit = firstRun.split(":");
	var timeDiff = moment().diff(moment().startOf("day").add(timeSplit[0],"hours").add(timeSplit[1], "minutes"), "minutes");

	if (timeDiff < 0) {//event hasn't happened yet. 
		return timeDiff * -1; //return the minutes until the future event occurs
	}
	else {//firstRun has occured.
		if (timeDiff < frequency) {
			return (frequency - timeDiff);
		}
		else {
			return frequency - (timeDiff % frequency);
		}
	}
}

function nextRunTime(firstRun, frequency) {
	return moment().add(nextRunMin(firstRun, frequency), "minutes").format("HH:mm");
}