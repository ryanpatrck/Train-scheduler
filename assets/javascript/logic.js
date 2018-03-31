// Set Variables
// Initialize Firebase
    // This is the code we copied and pasted from our app page

    
    var config = {
        apiKey: "AIzaSyDrh7bwyNWxmbSWiwEuepsGtN9Q_QNEIOI",
        authDomain: "train-schedule-5c0a7.firebaseapp.com",
        databaseURL: "https://train-schedule-5c0a7.firebaseio.com",
        projectId: "train-schedule-5c0a7",
        storageBucket: "train-schedule-5c0a7.appspot.com",
        messagingSenderId: "365612742180"
      };
      
      firebase.initializeApp(config);

    // Get a reference to the database service
    var database = firebase.database();

    
    $("#submit").on("click", function(event){
        event.preventDefault();
        // Set form values to variables
        var trainName = $("#Name-input").val().trim();
        var destination = $("#Destination-input").val().trim();
        var firstTrain = $("#Train-input").val().trim();
        var frequency = $("#Frequency-input").val().trim();

        // Set form variable to trainInfo in order to push to Firebase
        var trainInfo = {
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };
        
        // pushing trainInfo to Firebase
        database.ref().push(trainInfo);
        
        console.log(trainInfo.name);
        console.log(trainInfo.destination);
        console.log(trainInfo.firstTrain);
        console.log(trainInfo.frequency);

        // clear text-boxes
		$("#Name-input").val("");
		$("#Destination-input").val("");
		$("#Train-input").val("");
		$("#Frequency-input").val("");

		// stop refresh

		return false;
    });
    
// Main Process

database.ref().on("child_added", function(childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    //First Time ( pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "year");

    //Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;

    //Minutes until Train
    var tMinuteTrain = newFreq - tRemainder;

    //Next Train
    var nextTrain = moment().add(tMinuteTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $('#trainschedule').append('<tr><td>' + newTrain + '</td><td>' + newLocation + '</td><td>'+ newFreq + '</td><td>' + catchTrain + '</td><td>' + tMinuteTrain + '</td></tr>');
    
    // Clear Input fields
    $("#Name-input, #Destination-input, #Train-input, #Frequency-input").val("");
    return false;
})

