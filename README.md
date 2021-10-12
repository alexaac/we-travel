### Date created

2021-09-28

### Project Title

We Travel App Project

### Description

Travel app - plan a trip by entering the city name, and find out about the weather.

- display demo trip to Paris on page load
- trip info:
  - city photo (country photo if not available)
  - city map
  - departing and return dates
  - the weather for start date
  - weather day and night icons
  - dave and remove buttons for the trip
- the user can use the form to input city name, start date and end date
- all inputs are checked for empty values
- end date is checked against start date, so the user can't enter a smaller value as end date
- start date is checked not to go beyond the 16 days weather forecast interval
- when the user revisits the page, the last visited trip will be displayed
- trips page where the user can see all the locations on a main map, and each trip details listed below by start date

## Project Setup

1. clone the Project - `git clone https://github.com/alexaac/we-travel.git`
2. `cd we-travel`
3. install the dependencies - `npm install`
4. run the dev server - `npm run dev` or run build for production - `npm run build`
5. start the project on localhost:7000 - `npm start`

#### References

[Test Weather App Project](https://github.com/alexaac/test-weather.git)

#### Files

```bash
.
├── controllers
│   └── dataController.js
├── middleware
│   ├── validateParams.js
│   └── validation.js
├── package.json
├── package-lock.json
├── README.md
├── routes
│   └── index.js
├── src
│   ├── client
│   │   ├── index.js
│   │   ├── js
│   │   │   ├── api.js
│   │   │   ├── app.js
│   │   │   ├── helpers.js
│   │   │   ├── map.js
│   │   │   └── ui.js
│   │   ├── styles
│   │   │   ├── base.scss
│   │   │   ├── buttons.scss
│   │   │   ├── colors.scss
│   │   │   ├── footer.scss
│   │   │   ├── form.scss
│   │   │   ├── header.scss
│   │   │   └── trip.scss
│   │   └── views
│   │       └── index.html
│   └── server
│       └── server.js
├── __test__
│   ├── mockData.js
│   └── testApi.spec.js
├── variables.env
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

### TODO

Design system, code cleaning

### Credits

Alexa Cristina | Udacity
