# ✈️Budget Flights✈️ 
### Find cheap, affordable flights for all your travel needs

**<a href="https://budget-flights-cap1.glitch.me">View Web App</a>**

## 💡 Intro 
With so many travel options available today, planning a trip can become overwhelming. There is a large volume of competing travel websites all claiming to offer the cheapest flights out there. Budget Flights finds all flights that travelers may be interested in and presents it in a consolidated, easily readable way.

## 📋 About the Project

This project was made for Capital One's 2021 Software Engineering Summit Coding Challenge. Users enter their departure location, arrival location, currency preference, departure date, and return date. Flight info is retrieved using the <a href="https://rapidapi.com/skyscanner/api/skyscanner-flight-search/details">Skyscanner API</a> and presented in a table. The flights are automatically sorted from lowest to highest price, but that can be reversed using a dropdown menu. 

The web app will continue to create tables every time the user submits parameters. An error message appears if invalid inputs are entered. 

![Searching Flights](https://user-images.githubusercontent.com/71287285/111535495-8b054580-873f-11eb-97c5-b3c2c888f83e.PNG)  
   
![Flights Result](https://user-images.githubusercontent.com/71287285/111535529-948ead80-873f-11eb-896d-90d9cfffee1d.PNG)

## 🛠️ Built with 
* <a href="https://rapidapi.com/skyscanner/api/skyscanner-flight-search/details">Skyscanner API</a>
* JavaScript
* HTML
* CSS
* Glitch (deployment)
* Emojis! 🥰

## ✏️ Notes: 
* The departure/arrival location fields are required. The default currency preference is USD and the default departure/return date is anytime if nothing is entered in those fields.
* While the web app takes an input for Return Date, it is not used since the API does not handle the information.
* The sort dropdown menu and the sort button disappears when an error message appears, regardless if there is a table on the screen or not. I did not have time to fix this.

### Enjoy! 😀
