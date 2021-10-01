### Date created

2021-09-28

### Project Title

We Travel App Project

### Description

Travel app - plan a trip by entering the city name, and find out about the weather.

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
