// Note: I would include the API key as an environment variable but I'm not sure how to do it with vanilla JavaScript
// since an .env file does not work. Instead, I removed it from the code on GitHub. 
// I did not remove it from the code in Glitch so the web app still works.
const REACT_APP_API_KEY = "insert_key_here";

//global variables to make my life easier for handleSort function
let depart_loc = ""; //user inputted departure location
let arrive_loc = ""; //user inputted arrival location
let flights = ""; //promise of flight info
let startingOption = "Lowest to Highest Price"; //starting option for sort drop down menu

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
      "/" +
      return_date,
    reqOptions
  ).then(flights_response => flights_response.json()); //turn promise into JSON

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
//creates a table of flight info that is ordered by lowest to highest price
//Note: Skyscanner API does not give inbound dates so I have excluded it from the table
async function createTable(flights, depart_loc, arrive_loc) {
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

  //prints message if there are no flights
  if (Object.keys(flights.Quotes).length == 0) {
    tr = table.insertRow(-1);
    tr.innerHTML = "&nbsp;";
    tr = table.insertRow(-1);
    tr.innerHTML = "No Flights Found";
  } else {
    for (let i = 0; i < Object.keys(flights.Quotes).length; i++) {
      //loop through every flight
      tr = table.insertRow(-1); //create row
      
      //give class name to cheapest flights for color change in HTML
      if (i == 0){
        tr.className = "cheapest";
      }

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
  }

  document.getElementById("table_name").innerHTML =
    "Flights From " +
    depart_loc.toUpperCase() +
    " To " +
    arrive_loc.toUpperCase();
  let divContainer = document.getElementById("show_data");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

//takes JSON of flights as argument
//creates a table of flight info that is ordered from highest to lowest price
//Note: Skyscanner API does not give inbound dates so I have excluded it from the table
async function createReverseTable(flights, depart_loc, arrive_loc) {
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

  //prints message if there are no flights
  if (Object.keys(flights.Quotes).length == 0) {
    tr = table.insertRow(-1);
    tr.innerHTML = "&nbsp;";
    tr = table.insertRow(-1);
    tr.innerHTML = "No Flights Found";
  } else {
    for (let i = Object.keys(flights.Quotes).length - 1; i >= 0; i--) {
      //loop through every flight
      tr = table.insertRow(-1); //create row
      
      //give class name to cheapest flights for color change in HTML
      if (i == 0){
        tr.className = "cheapest";
      }

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
  }

  document.getElementById("table_name").innerHTML =
    "Flights From " +
    depart_loc.toUpperCase() +
    " To " +
    arrive_loc.toUpperCase();
  let divContainer = document.getElementById("show_data");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

//runs when sort button is pressed
function handleSort() {
  let sortMethod = document.getElementById("sortMethod");
  let option = sortMethod.options[sortMethod.selectedIndex].text; //gets chosen option

  //to prevent from making new unneccessary tables, only create a new table if the
  //startingOption is opposite from the chosen option

  if (
    option == "Highest to Lowest Price" &&
    startingOption == "Lowest to Highest Price"
  ) {
    document.getElementById("show_data").value = ""; //reset table
    createReverseTable(flights, depart_loc, arrive_loc); //create new table with reverse order
    startingOption = "Highest to Lowest Price"; //startingOption is now the chosen option
  }

  if (
    option == "Lowest to Highest Price" &&
    startingOption == "Highest to Lowest Price"
  ) {
    document.getElementById("show_data").value = ""; //reset table
    createTable(flights, depart_loc, arrive_loc); //create new table with default order
    startingOption = "Lowest to Highest Price"; //startingOption is now the chosen option
  }
}

//creates sort drop down menu
function createSort() {
  let values = ["Lowest to Highest Price", "Highest to Lowest Price"];

  //create drop down menu
  let select = document.createElement("select");
  select.name = "sortMethod";
  select.id = "sortMethod";

  //add options
  for (const val of values) {
    let option = document.createElement("option");
    option.value = val;
    option.text = val.charAt(0).toUpperCase() + val.slice(1);
    select.appendChild(option);
  }

  let label = document.createElement("label");
  label.htmlFor = "sortMethod";

  document
    .getElementById("sort_menu")
    .appendChild(label)
    .appendChild(select);
}

//runs when search button is pressed
async function handleSubmit() {
  event.preventDefault();

  //makes sure button is hidden at the beginning
  document.getElementById("sort_button").style.visibility = "hidden";

  //deletes old sort drop down menu so copies do not appear
  if (document.getElementById("sortMethod") != null) {
    document.getElementById("sortMethod").remove();
  }

  let currency;
  let depart_date;
  let return_date;

  let depart_placeID;
  let arrive_placeID;

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

      //gets promise of flights
      flights = await getFlights(
        depart_placeID,
        arrive_placeID,
        currency,
        depart_date,
        return_date
      );

      createSort(); //create sort drop down menu
      document.getElementById("sort_button").style.visibility = "visible";
      await createTable(flights, depart_loc, arrive_loc); //create table from JSON
    } else {
      //print error if depart location and arrival location
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

  //clear table
  document.getElementById("show_data").value = "";
}
