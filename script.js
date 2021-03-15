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
    .catch(error => {
      //catches error
      console.log(error);
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
    .then(flights_response => flights_response.json())
    .catch(error => {
      //catches error
      console.log(error);
    });

  return flights_response;
}

async function createTable(flights) {
  let table = document.createElement("table"); //create table
  let col = ["Departure Date", "Departure Location", "Arrival Location", "Airline", "Price"];
    
  //Need to create table from JSON file here
  let tr = table.insertRow(-1);
  for (let i = 0; i < col.length; i++){
    let th = document.createElement("th");
    th.innerHTML = col[i];
    tr.appendChild(th);
  }
  
  for (let i = 0; i < Object.keys(flights.Quotes).length; i++){
    tr = table.insertRow(-1);
    for (let j = 0; j < col.length; j++){
      let tabCell = tr.insertCell(-1);
      if (j == 0){
        tabCell.innerHTML = flights.Quotes[i].OutboundLeg.DepartureDate;
      } else if (j == 1){
        tabCell.innerHTML = flights.Quotes[i].OutboundLeg.OriginId;
      } else if (j == 2){
        tabCell.innerHTML = flights.Quotes[i].OutboundLeg.DestinationId;
      } else if (j == 3){
        tabCell.innerHTML = flights.Quotes[i].OutboundLeg.CarrierIds[0];
      } else{
        tabCell.innerHTML = flights.Quotes[i].MinPrice;
      }
    }
  }
  
  let divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

async function getParams() {
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

  //get inputs if they not blank
  if (document.getElementById("depart_loc").value != "") {
    depart_loc = document.getElementById("depart_loc").value;
    depart_placeID = await getPlace(depart_loc, currency);
    console.log("Depart PlaceID: " + depart_placeID);
  }
  if (document.getElementById("arrive_loc").value != "") {
    arrive_loc = document.getElementById("arrive_loc").value;
    arrive_placeID = await getPlace(arrive_loc, currency);
    console.log("Arrive PlaceID: " + arrive_placeID);
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

  if (depart_loc != "" && arrive_loc != "") {
    document.getElementById("Error").innerHTML = ""; //remove error message

    flights = await getFlights(
      depart_placeID,
      arrive_placeID,
      currency,
      depart_date,
      return_date
    );
    
    await createTable(flights); //create table from JSON
  } else {
    //print error message if depart_loc and arrive_loc are not inputted
    document.getElementById("Error").innerHTML =
      "Please Enter A Departure and Arrival Location";
  }

  //clear input fields
  document.getElementById("depart_loc").value = "";
  document.getElementById("arrive_loc").value = "";
  document.getElementById("currency").value = "";
  document.getElementById("depart_date").value = "";
  document.getElementById("return_date").value = "";
}
