import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const google_api_key = process.env.GOOGLE_API_KEY;

app.use(express.json());

app.post('/addresses', async (req, res) => {
  if (!req.body.addresses) {
    res.status(404).send({ ERROR: 'value addresses not found.' });
    return;
  }

  let formatted_addresses = req.body.addresses.split(';');
  console.log(formatted_addresses);

  if (formatted_addresses.length < 2) {
    res.send({ ERROR: 'Please provide more than 1 address' });
    return;
  }

  const adressesWithCoordinates = await getCoordinates(formatted_addresses);
  console.log(JSON.stringify(adressesWithCoordinates));

  let longestDistance = 0;
  let shortestDistance = 0;
  let shortestDistanceText = '';
  let longestDistanceText = '';
  let allDistances = [];
  for (let i = 0; i < adressesWithCoordinates.length; i++) {
    for (let j = i + 1; j < adressesWithCoordinates.length; j++) {
      const distance = getDistanceFromLatLonInKm(
        {
          lat: adressesWithCoordinates[i].lat,
          lng: adressesWithCoordinates[i].lng,
        },
        {
          lat: adressesWithCoordinates[j].lat,
          lng: adressesWithCoordinates[j].lng,
        }
      );

      allDistances.push({
        distance: `${distance} meters`,
        address_1: adressesWithCoordinates[i].address,
        address_2: adressesWithCoordinates[j].address,
      });

      if (shortestDistance === 0 && longestDistance === 0) {
        shortestDistance = distance;
        shortestDistanceText = `The shortest distance is ${shortestDistance} meters BETWEEN ${adressesWithCoordinates[i].address} AND ${adressesWithCoordinates[j].address}`;
        longestDistance = distance;
        longestDistanceText = `The longest distance is ${longestDistance} meters BETWEEN ${adressesWithCoordinates[i].address} AND ${adressesWithCoordinates[j].address}`;
      } else {
        if (distance < shortestDistance) {
          shortestDistance = distance;
          shortestDistanceText = `The shortest distance is ${shortestDistance} meters BETWEEN ${adressesWithCoordinates[i].address} AND ${adressesWithCoordinates[j].address}`;
        }
        if (distance > longestDistance) {
          longestDistance = distance;
          longestDistanceText = `The longest distance is ${longestDistance} meters BETWEEN ${adressesWithCoordinates[i].address} AND ${adressesWithCoordinates[j].address}`;
        }
      }
    }
  }

  res.send({
    distances: allDistances,
    shortestDistance: shortestDistanceText,
    longestDistance: longestDistanceText,
  });
});

app.listen(port, () => {
  console.log(`API STARTED AT PORT ${port}`);
});

const getCoordinates = async (formatted_addresses) => {
  const address_data = [];
  for (const elem of formatted_addresses) {
    const parameters = encodeURI(elem);
    const urlBase = `https://maps.googleapis.com/maps/api/geocode/json?address=${parameters}&key=${google_api_key}`;
    try {
      const response = await axios.get(urlBase);
      const location_data = response.data.results[0].geometry.location;
      address_data.push({
        address: elem,
        ...location_data,
      });
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }
  return address_data;
};

function getDistanceFromLatLonInKm(coord1, coord2) {
  'use strict';
  const deg2rad = function (deg) {
    return deg * (Math.PI / 180);
  };
  const R = 6371;
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLng = deg2rad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) *
      Math.cos(deg2rad(coord1.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c * 1000).toFixed();
}
