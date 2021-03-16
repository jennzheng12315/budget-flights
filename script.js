//Note: PLEASE DO NOT USE KEY
// I would make the key an environment variable but I'm not sure how to do it with JavaScript
// I believe an .env file does not work for vanilla JavaScript
const REACT_APP_API_KEY = "902bd3bd07msh3bf09281e0f8dd9p1d823cjsn1cfe883a7323";

//takes location and currency as arguments
//finds the Skyscanner placeID of the location
async function getPlace(location, currency) {
  let placeID;

  const reqOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": REACT_APP_API_KEY,
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      useQueryString: true
    }
  };

  //fetch API
  let place_response = await fetch(
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/" +
      new URLSearchParams({ query: currency }) +
      "/en-US/?" +
      new URLSearchParams({ query: location }),
    reqOptions
  )
    .then(place_response => place_response.json()) //turn promise into JSON
    .then(places => {
      placeID = places.Places[0].PlaceId; //gets first Skyscanner placeID
    })
    .then(places => {
      document.getElementById("Error").value = ""; //if successful, remove error message
    });

  return placeID;
}

//takes depart_location, arrival_location, currency, depart_date, and return_date as arguments
//finds flights that fall within the parameters
async function getFlights(
  depart_location,
  arrival_location,
  currency,
  depart_date,
  return_date
) {
  const reqOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": REACT_APP_API_KEY,
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
    }
  };

  //fetch API
  let flights_response = await fetch(
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/" +
      currency +
      "/en-US/" +
      depart_location +
      "/" +
      arrival_location +
      "/" +
      depart_date +
      "?inboundpartialdate=" +
      return_date,
    reqOptions
  )
    .then(flights_response => flights_response.json()); //turn promise into JSON

  return flights_response;
}

//takes a flight as an argument
//returns only the date portion
function getDepartureDate(flightOption) {
  let date = flightOption.OutboundLeg.DepartureDate.slice(0, 10);
  return date;
}

//takes a flight and the flight places as arguments
//returns the name of the place that matches the flight's origin id
function getDepartLoc(flightOption, flightPlaces) {
  let flight_loc_name = "";

  //loop through every place in flightPlaces
  for (let i = 0; i < Object.keys(flightPlaces).length; i++) {
    //compare place ids from flight and places and get name of place
    if (flightPlaces[i].PlaceId == flightOption.OutboundLeg.OriginId) {
      flight_loc_name = flightPlaces[i].Name;
    }
  }

  return flight_loc_name;
}

//similar to getDepartLoc function
//takes a flight and the flight places as arguments
//returns the name of the place that matches the flight's destination id
function getArrivalLoc(flightOption, flightPlaces) {
  let flight_loc_name = "";

  //loop through every place in flightPlaces
  for (let i = 0; i < Object.keys(flightPlaces).length; i++) {
    //compare place ids from flight and places and get name of place
    if (flightPlaces[i].PlaceId == flightOption.OutboundLeg.DestinationId) {
      flight_loc_name = flightPlaces[i].Name;
    }
  }

  return flight_loc_name;
}

//takes a flight and the flight carriers as arguments
//returns the name of the airline that matches the flight's carrier id
function getAirline(flightOption, flightCarriers) {
  let flight_carrier_name = "";

  //loop through every carrier in flightCarriers
  for (let i = 0; i < Object.keys(flightCarriers).length; i++) {
    //compare carrier ids from flight and carriers and get name of carrier
    if (flightCarriers[i].CarrierId == flightOption.OutboundLeg.CarrierIds[0]) {
      flight_carrier_name = flightCarriers[i].Name;
    }
  }

  return flight_carrier_name;
}

//takes a flight and the flight currency as arguments
//returns the price with the currency symbol in front of it
function getPrice(flightOption, flightCurrencies) {
  return flightCurrencies[0].Symbol + flightOption.MinPrice;
}

//takes JSON of flights as argument
//creates a table of flight info
//Note: Skyscanner API does not give inbound dates so I have excluded it from the table
async function createTable(flights) {
  let table = document.createElement("table"); //create table
  let col = [
    "Departure Date",
    "Departure Location",
    "Arrival Location",
    "Airline",
    "Price"
  ];

  //create headers
  let tr = table.insertRow(-1);
  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th");
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  for (let i = 0; i < Object.keys(flights.Quotes).length; i++) {
    //loop through every flight
    tr = table.insertRow(-1); //create row

    for (let j = 0; j < col.length; j++) {
      //loop through every column
      let tabCell = tr.insertCell(-1); //create cell

      if (j == 0) {
        //departure date column
        tabCell.innerHTML = getDepartureDate(flights.Quotes[i]);
      } else if (j == 1) {
        //departure location column
        tabCell.innerHTML = getDepartLoc(flights.Quotes[i], flights.Places);
      } else if (j == 2) {
        //arrival location column
        tabCell.innerHTML = getArrivalLoc(flights.Quotes[i], flights.Places);
      } else if (j == 3) {
        //airline column
        tabCell.innerHTML = getAirline(flights.Quotes[i], flights.Carriers);
      } else {
        //price column
        tabCell.innerHTML = getPrice(flights.Quotes[i], flights.Currencies);
      }
    }
  }

  let divContainer = document.getElementById("show_data");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

async function handleSubmit() {
  event.preventDefault();
  let depart_loc;
  let arrive_loc;
  let currency;
  let depart_date;
  let return_date;

  let depart_placeID;
  let arrive_placeID;

  let flights;

  //default for parameters
  depart_loc = "";
  arrive_loc = "";
  currency = "USD";
  depart_date = "anytime";
  return_date = "anytime";
  try {
    //get inputs if they not blank
    if (document.getElementById("depart_loc").value != "") {
      depart_loc = document.getElementById("depart_loc").value;
      depart_placeID = await getPlace(depart_loc, currency);
    }
    if (document.getElementById("arrive_loc").value != "") {
      arrive_loc = document.getElementById("arrive_loc").value;
      arrive_placeID = await getPlace(arrive_loc, currency);
    }
    if (document.getElementById("currency").value != "") {
      currency = document.getElementById("currency").value;
    }
    if (document.getElementById("depart_date").value != "") {
      depart_date = document.getElementById("depart_date").value;
    }
    if (document.getElementById("return_date").value != "") {
      return_date = document.getElementById("return_date").value;
    }

    if (
      depart_loc != "" &&
      arrive_loc != "" &&
      document.getElementById("Error").value == ""
    ) {
      document.getElementById("Error").innerHTML = ""; //remove error message

      flights = await getFlights(
        depart_placeID,
        arrive_placeID,
        currency,
        depart_date,
        return_date
      );

      await createTable(flights); //create table from JSON
      
    } else { //print error if depart location and arrival location 
      document.getElementById("Error").innerHTML =
        "Invalid Input. Please Try Again.";
    }
  } catch {
    //print error message if error occurs
    if (document.getElementById("Error").value == "") {
      document.getElementById("Error").innerHTML =
        "Invalid Input. Please Try Again.";
    }
  }

  //clear input fields
  document.getElementById("depart_loc").value = "";
  document.getElementById("arrive_loc").value = "";
  document.getElementById("currency").value = "";
  document.getElementById("depart_date").value = "";
  document.getElementById("return_date").value = "";
  document.getElementById("show_data").value = "";
}
