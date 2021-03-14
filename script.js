const REACT_APP_API_KEY = "902bd3bd07msh3bf09281e0f8dd9p1d823cjsn1cfe883a7323";

let depart_city;
let arrive_city;
let currency;
let depart_date;
let return_date;

async function fetchAPI() {
  console.log("in fetchAPI function " + depart_city);
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
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/" + currency + "/en-US/?" +
      new URLSearchParams({ query: depart_city }),
    reqOptions
  )
  .then(response => {console.log(response);})
  .catch(err=>{console.error(err)});
}

function getParams() {
  event.preventDefault();
  depart_city = "";
  arrive_city = "anywhere";
  currency = "USD";
  depart_date = "anytime";
  return_date = "anytime";
  
  depart_city = document.getElementById("depart_city").value;
  arrive_city = document.getElementById("arrive_city").value;
  currency = document.getElementById("currency").value;
  depart_date = document.getElementById("depart_date").value;
  return_date = document.getElementById("return_date").value;
  
  console.log("in param function " + depart_city);
  fetchAPI();
}



