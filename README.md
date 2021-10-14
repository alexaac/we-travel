### Date created

2021-09-28

### Project Title

We Travel - Trip Planner

[![build status](https://img.shields.io/travis/alexaac/we-travel/master.svg)](https://travis-ci.org/alexaac/we-travel)

[![build status](https://img.shields.io/travis/alexaac/we-travel/master.svg)](https://travis-ci.org/alexaac/we-travel)

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
- expired trips are listed at the bottom of the page, with a different background
- there is a main map where all locations are displayed, and a popup with the city name on hover

## Project Setup

1. clone the Project - `git clone https://github.com/alexaac/we-travel.git`
2. `cd we-travel`
3. install the dependencies - `npm install`
   3.0 update node to 16 if older version - `nvm use 16`
4. run the dev server - `npm run dev` or run build for production - `npm run build`
5. start the project on localhost:7000 - `npm start`

#### References

[Test Weather App Project](https://github.com/alexaac/test-weather.git)

#### Files

```bash
.
├── controllers
│   ├── dataController.js
│   └── tripsController.js
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
│   │   ├── fonts
│   │   │   ├── DejaVuSerif.ttf
│   │   │   └── SourceSansPro-RyPo.ttf
│   │   ├── index.js
│   │   ├── js
│   │   │   ├── api.js
│   │   │   ├── app.js
│   │   │   ├── data.js
│   │   │   ├── helpers.js
│   │   │   ├── map.js
│   │   │   ├── storage.js
│   │   │   └── ui.js
│   │   ├── media
│   │   ├── styles
│   │   │   ├── main.scss
│   │   │   └── partials
│   │   │       ├── _article.scss
│   │   │       ├── _buttons.scss
│   │   │       ├── _card.scss
│   │   │       ├── _cover.scss
│   │   │       ├── _design.scss
│   │   │       ├── _footer.scss
│   │   │       ├── _form.scss
│   │   │       ├── _header.scss
│   │   │       ├── _layout.scss
│   │   │       ├── _map.scss
│   │   │       ├── _section.scss
│   │   │       ├── _social.scss
│   │   │       ├── _topbtn.scss
│   │   │       ├── _typography.scss
│   │   │       └── _variables.scss
│   │   └── views
│   │       ├── index.html
│   │       └── trips.html
│   └── server
│       └── server.js
├── __test__
│   ├── mockData.js
│   ├── testApi.spec.js
│   └── testData.spec.js
├── variables.env
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

### TODO

More TDD

### Credits

Alexa Cristina
