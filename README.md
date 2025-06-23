# Google Flights Clone

A responsive React-based clone of Google Flights using the Sky Scrapper API from RapidAPI.

## Features

- Search for flights with flexible dates
- One-way and round-trip options
- Airport autocomplete
- Interactive flight map
- Responsive design
- Real-time flight search
- Beautiful UI with Tailwind CSS and dark theme

## Prerequisites

- Node.js (v14 or higher)
- npm
- RapidAPI account and API key for Sky Scrapper API
- Google Maps API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/google-flights.git
cd google-flights
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:

```
REACT_APP_RAPID_API_KEY=your_rapidapi_key_here
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key_here
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Environment Variables

- `REACT_APP_RAPID_API_KEY`: Your RapidAPI key for accessing the Sky Scrapper API
- `REACT_APP_GOOGLE_MAPS_KEY`: Your Google Maps API key for the flight map

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Axios
- Day.js
- Google Maps JavaScript API

## API Reference

This project uses the following APIs:

- [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) from RapidAPI for flight search functionality
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) for the interactive flight map

## License

This project is open source and available under the MIT License.
