require('dotenv').config();

const Spotify = require('node-spotify-api');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

let key = require('./keys.js');
let user1 = process.argv[2];
let user2 = process.argv[3];

const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    songInfo(data);
  });
};

const retrieveSongInfo = name => {
  let spotify = new Spotify(key.spotify);
  spotify.search({ type: 'track', query: name }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(
      `Song Name : ${name.toUpperCase()}\nAlbum : ${
        data.tracks.items[0].album.name
      }\nArtist : ${data.tracks.items[0].album.artists[0].name}\nURL : ${
        data.tracks.items[0].album.external_urls.spotify
      }`
    );
  });
};

const retrieveMovieInfo = name => {
  if (!name) {
    name = 'Mr.Nobody';
  }
  axios
    .get(`http://www.omdbapi.com/?t=${name}&plot=short&apikey=trilogy`)
    .then(function(response) {
      console.log(
        `Title: ${response.data.Title}\n Year: ${response.data.Year}\nRated: ${
          response.data.Rated
        }\nCountry: ${response.data.Country}\nLanguage: ${
          response.data.Language
        }\nPlot: ${response.data.Plot}\nActors: ${
          response.data.Actors
        }\nRotten Tomatoes: ${response.data.Ratings[1].Value}\n Imdb Rating:${
          response.data.imdbRating
        }\n`
      );
    })
    .catch(function(error) {
      console.log(error);
    });
};

const retrieveConcertInfo = name => {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${name}/events?app_id=codingbootcamp`
    )
    .then(function(response) {
      if (!response.data.length) {
        console.log(`No upcoming concerts for ${name}`);
      } else {
        let source = response.data;
        for (let i = 0; i<source.length; i++) {
          console.log(
            `\nLocation : ${source[i].venue.city},${
              source[i].venue.country
            }\nVenue : ${source[i].venue.name}\nDate : ${moment(
              source[i].datetime
            ).format('MM/DD/YYYY')} \n`
          );
        }
      }
    })
    .catch(function(error) {
      console.log(error);
    });
};

switch (user1) {
  case 'spotify-this-song':
  retrieveSongInfo(user2);
    break;
  case 'movie-this':
  retrieveMovieInfo(user2);
    break;
  case 'concert-this':
  retrieveConcertInfo(user2);
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;
  default:
    break;
}
