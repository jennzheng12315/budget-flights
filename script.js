const REACT_APP_API_KEY = "902bd3bd07msh3bf09281e0f8dd9p1d823cjsn1cfe883a7323";

let depart_city = "NYC";
let arrive_city = "anywhere";
let currency = "USD";
let depart_date = "anytime";
let return_date = "anytime";

function getParams() {
  
  
  depart_city = document.getElementById("depart_city").value;
  document.getElementById("demo").innerHTML = depart_city;

  arrive_city = document.getElementById("arrive_city").value;
  document.getElementById("demo2").innerHTML = arrive_city;

  currency = document.getElementById("currency").value;
  document.getElementById("demo3").innerHTML = currency;

  depart_date = document.getElementById("depart_date").value;
  document.getElementById("demo4").innerHTML = depart_date;
  return_date = document.getElementById("return_date").value;
  console.log("in param function" + depart_city);
}

console.log(depart_city);

async function fetchAPI() {
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

fetchAPI();

