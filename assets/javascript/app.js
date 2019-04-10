
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAv2hoeNB1I7U1M95Fxb1QHeeZ_zuzkMzU",
    authDomain: "train-scheduler-284cb.firebaseapp.com",
    databaseURL: "https://train-scheduler-284cb.firebaseio.com",
    projectId: "train-scheduler-284cb",
    storageBucket: "train-scheduler-284cb.appspot.com",
    messagingSenderId: "841274163671"
};

firebase.initializeApp(config);

var database = firebase.database();

// Create a button to add new trains
$( "#target" ).submit(function( event ) {

  	var trains = $("#trains-input").val().trim();
  	var travelingTo = $("#travel-input").val().trim();
  	var time = moment($("#time-input").val().trim(), "HH:mm").format("X");
  	var frequency = $("#frequency-input").val().trim();

  	var addTrain = {
    	name: trains,
    	destination: travelingTo, 
    	start: time,
    	frequency: frequency
  	};

	database.ref().push(addTrain);

	//console.log(addTrain.name);
	//console.log(addTrain.destination);
	//console.log(addTrain.start);
	//console.log(addTrain.frequency);

	alert("A new tran has been added!");

	$("#trains-input").val("");
	$("#travel-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");

  	return false;
});

//Add a Firebase event that will transfer data to database
database.ref().on("child_added", function(childSnapshot) {

	//console.log(childSnapshot.val());

	var trains = childSnapshot.val().name;
	var travelingTo = childSnapshot.val().destination;
	var time = childSnapshot.val().start;
	var frequency = childSnapshot.val().frequency;

	//console.log(trains);
	//console.log(travelingTo);
	//console.log(time);
	//console.log(frequency);

    var firstTime = moment(time, "HH:mm").subtract(1, "years");
    //console.log(firstTime);

    var timeNow = moment();
    //console.log("CURRENT TIME: " + moment(timeNow).format("HH:mm"));

    var timeLength= moment().diff(moment(firstTime), "minutes");
    //console.log("DIFFERENCE IN TIME: " + timeLength);

    var timeRemaining = timeLength% frequency;
    //console.log(timeRemaining);

    var trainLength = frequency - timeRemaining;
    //console.log("MINUTES TILL TRAIN: " + trainLength);

    var trainNext = moment().add(trainLength, "minutes");
    //console.log("ARRIVAL TIME: " + moment(trainNext).format("HH:mm"));
    var fixedTime = moment(trainNext).format("HH:mm");

	$("#trains > tbody").append("<tr><td>" + trains + "</td><td>" + travelingTo + "</td><td>" + frequency + "</td><td>" + fixedTime + "</td><td>" + trainLength + "</td>");
});
