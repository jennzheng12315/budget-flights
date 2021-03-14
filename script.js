const REACT_APP_API_KEY = "902bd3bd07msh3bf09281e0f8dd9p1d823cjsn1cfe883a7323";

let depart_loc;
let arrive_loc;
let currency;
let depart_date;
let return_date;
let placeID;

async function getPlace() {
  const reqOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": REACT_APP_API_KEY,
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      useQueryString: true
    }
  };

  let response = await fetch(
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/" +
      currency +
      "/en-US/?" +
      new URLSearchParams({ query: depart_loc }),
    reqOptions
  )
    .then(response => response.json())
    .then(places => {
      placeID = places.Places[0].PlaceId;
    })
    .catch(error => {
      console.log(error);
    });

  return;
}

async function getParams() {
  event.preventDefault();

  //default for parameters
  depart_loc = "";
  arrive_loc = "anywhere";
  currency = "USD";
  depart_date = "anytime";
  return_date = "anytime";

  //get inputs if they not blank
  if (document.getElementById("depart_loc").value != "") {
    depart_loc = document.getElementById("depart_loc").value;
  }
  if (document.getElementById("arrive_loc").value != "") {
    arrive_loc = document.getElementById("arrive_loc").value;
  }
  if (document.getElementById("currency").value != "") {
    currency = document.getElementById("currency").value;
  }
  depart_date = document.getElementById("depart_date").value;
  return_date = document.getElementById("return_date").value;

  await getPlace(); //wait for this function to finish before continuin; prevents placeID = undefined
  console.log("PlaceID2: " + placeID);

  document.getElementById("depart_loc").value = ""; //clear input field
}
