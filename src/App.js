import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({
		loading: false,
		data: {},
		error: false,
	});

	const toDateFunction = () => {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		];
		const WeekDays = [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
		];
		const currentDate = new Date();
		const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
		return date;
	};

	const search = async (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setInput('');
			setWeather({ ...weather, loading: true });
			const url = 'https://api.openweathermap.org/data/2.5/weather';
			const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
			await axios
				.get(url, {
					params: {
						q: input,
						units: 'metric',
						appid: api_key,
					},
				})
				.then((res) => {
					setWeather({ data: res.data, loading: false, error: false });
				})
				.catch((error) => {
					setWeather({ ...weather, data: {}, error: true });
					setInput('');
				});
		}
	};

	return (
		<div className="App">
			<h1 className="app-name">Weather Now</h1>
			<div className="search-bar">
				<input
					type="text"
					className="city-search"
					placeholder="Enter City Name..."
					name="query"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					onKeyPress={search}
				/>
			</div>

			{weather.loading && (
				<>
					<div className="loader">
						<Oval type="Oval" color="#ffffff" height={80} width={80} />
					</div>
				</>
			)}

			{weather.error && (
				<div className="error-message">
					<FontAwesomeIcon icon={faFrown} className="error-icon" />
					<p>City not found. Please try again.</p>
				</div>
			)}

			{weather && weather.data && weather.data.main && (
				<div className="weather-details">
					<div className="city-name">
						<h2>{weather.data.name}, <span>{weather.data.sys.country}</span></h2>
					</div>
					<div className="date">
						<span>{toDateFunction()}</span>
					</div>
					<div className="icon-temp">
						<img
							className="weather-icon"
							src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
							alt={weather.data.weather[0].description}
						/>
						<h3>{Math.round(weather.data.main.temp)}<sup className="deg">°C</sup></h3>
					</div>
					<div className="des-wind">
						<p className="description">{weather.data.weather[0].description.toUpperCase()}</p>
						<p className="wind">Wind Speed: {weather.data.wind.speed} m/s</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default WeatherApp;
