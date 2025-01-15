import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

const Weather = ({ isDarkMode }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
        const API_KEY = 'dbc59b75fc1117790949f6e3e4f22c76';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Unable to fetch weather data');
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            // Check specific error codes
            if (err.code === 1) {  // Permission denied
              setPermissionDenied(true);
            } else {
              setError('Unable to get location');
            }
          }
        );
      } else {
        setError('Geolocation is not supported');
      }
    };

    getLocation();
  }, []);

  // Return null (render nothing) if permission is denied
  if (permissionDenied) {
    return (
      <div className={`p-3 rounded shadow-sm mb-4 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
        <p className={`m-0 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
          Weather information unavailable - Location access is required to show weather updates
        </p>
      </div>
    );
  }

  // Return null for other errors as well
  if (error) {
    return null;
  }

  if (!weather) {
    return (
      <div className={`p-3 rounded shadow-sm mb-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
        <p className="m-0">Loading weather...</p>
      </div>
    );
  }

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 600) return <CloudRain className="me-2" />;
    if (weatherCode >= 800) return <Sun className="me-2" />;
    return <Cloud className="me-2" />;
  };

  return (
    <div className={`p-3 rounded shadow-sm mb-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <div className="d-flex align-items-center mb-2">
        {getWeatherIcon(weather.weather[0].id)}
        <span className="h5 mb-0">{weather.name}</span>
      </div>
      <div className="d-flex align-items-center">
        <Thermometer className="me-2" />
        <span className="h4 mb-0">{Math.round(weather.main.temp)}°C</span>
        <span className="ms-3">{weather.weather[0].description}</span>
      </div>
      <div className="mt-2 small">
        <span>Humidity: {weather.main.humidity}%</span>
        <span className="ms-3">Wind: {Math.round(weather.wind.speed)} m/s</span>
      </div>
    </div>
  );
};

export default Weather;