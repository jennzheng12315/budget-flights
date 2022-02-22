# ✈️Budget Flights✈️ 
### Find cheap, affordable flights for all your travel needs
## Note: Unfortunately, the Skyscanner API is not available anymore so flight information is not generated anymore. However, you can still view the site below: 

**<a href="https://budget-flights-cap1.glitch.me">View Web App</a>**

## 💡 Intro 
With so many travel options available today, planning a trip can become overwhelming. There is a large volume of competing travel websites all claiming to offer the cheapest flights out there. Budget Flights finds all flights that travelers may be interested in and presents it in a consolidated, easily readable way.

## 📋 About the Project

This project was a winning submission for the final round of Capital One's 2021 Software Engineering Summit. Users enter their departure location, arrival location, currency preference, departure date, and return date. Flight info is retrieved using the <a href="https://rapidapi.com/skyscanner/api/skyscanner-flight-search/details">Skyscanner API</a> and presented in a table. The flights are automatically sorted from lowest to highest price, but that can be reversed using a dropdown menu. The cheapest flight is highlighted by green text. An error message appears if invalid inputs are entered. 

For the design of the web app, I aimed for a more simplistic, personable feeling with the use of emojis and plain text, input fields, and easily readable tables. In the future, I may expand upon this.

![Searching Flights](https://user-images.githubusercontent.com/71287285/111535495-8b054580-873f-11eb-97c5-b3c2c888f83e.PNG)  
   
![Flights Results](https://user-images.githubusercontent.com/71287285/111809146-0c2d1b80-88ab-11eb-95ee-6e0919b2ad93.PNG)

## 🛠️ Built with 
* <a href="https://rapidapi.com/skyscanner/api/skyscanner-flight-search/details">Skyscanner API</a>
* JavaScript
* HTML
* CSS
* <a href="https://glitch.com/">Glitch</a> (deployment)
* Emojis! 🥰

## ✏️ Notes 
* The departure/arrival location fields are required and can accept full location names or airport codes. The default currency preference is USD and the default departure/return date is anytime if nothing is entered in those fields.
* While the web app takes an input for Return Date, it is not used since the API does not handle the information.

## 📌 Next Steps
* Improve upon design of web page
* Prevent the sort dropdown menu and button from disappearing when a table is on the screen and the user enters an invalid input
* Have the error message specifically say what the error is (ex. if user does not enter a valid departure location, the error message would say "invalid departure location")
* Perhaps link the flights to their airline's main homepage since the API does not provide direct links to websites where users can book a flight.
* Get return flights
