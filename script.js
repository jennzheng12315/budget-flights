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
      placeID = places.Places[0].PlaceId;  //gets first Skyscanner placeID
    })
    .catch(error => {    //catches error
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
  let flight_response = await fetch(
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
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });

  return;
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

  //default for parameters
  depart_loc = "";
  arrive_loc = "anywhere";
  currency = "USD";
  depart_date = "anytime";
  return_date = "anytime";

  //get inputs if they not blank
  if (document.getElementById("depart_loc").value != "") {
    depart_loc = document.getElementById("depart_loc").value;
    depart_placeID = await getPlace(depart_loc, currency); //wait for this function to finish before continuing; prevents depart_placeID = undefined
    console.log("Depart PlaceID: " + depart_placeID);
  }
  if (document.getElementById("arrive_loc").value != "") {
    arrive_loc = document.getElementById("arrive_loc").value;
    arrive_placeID = await getPlace(arrive_loc, currency); //wait for this function to finish before continuing; prevents arrive_placeID = undefined
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

  await getFlights(
    depart_placeID,
    arrive_placeID,
    currency,
    depart_date,
    return_date
  );

  //clear input fields
  document.getElementById("depart_loc").value = "";
  document.getElementById("arrive_loc").value = "";
  document.getElementById("currency").value = "";
  document.getElementById("depart_date").value = "";
  document.getElementById("return_date").value = "";
}
