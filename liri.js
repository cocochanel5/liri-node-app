require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);


var userChoice = process.argv[2];
var userInput = process.argv[3];

switch (userChoice) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doThis();
        break;
}

//Bands in Town Call//
function concertThis() {
    var nodeArgs = process.argv;

    var artist = "";
    
    if (userChoice == 'concert-this') {
    for (var i = 3; i < nodeArgs.length; i++) {
    
        if (i > 3 && i < nodeArgs.length) {
          artist = artist + "+" + nodeArgs[i];
        } else {
          artist += nodeArgs[i];
          }
        }
    }

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
     for (var i = 0; i < response.data.length; i++) {

    console.log("Venue Name: "+ response.data[i].venue.name);
    console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
    console.log("Date of the Event: " + moment(response.data[i].datetime).format("L"));
}
    });
};

//Spotify Call//
if (!userInput) {
    userInput = "The Sign Ace of Base";
}
function spotifyThis () {
    spotify.search({ type: 'track', query: userInput }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        else{
            // console.log(data); 
        };
        var userSong = data.tracks.items;
        console.log("Artist: " + userSong[0].artists[0].name);
        console.log("Song Name: " + userSong[0].name);
        console.log("Preview Link: " + userSong[0].preview_url);
        console.log("Album: " + userSong[0].album.name); 
      
      })
};

//OMDB Axios Call//
function movieThis() {
if (!userInput) {
    userInput = "Mr. Nobody";
    return console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/> \nIt's on Netflix!");
    
}

var nodeArgs = process.argv;

var movieName = "";

if (userChoice == 'movie-this') {
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
      }
    }
}

axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    console.log("Title: " + response.data.Title);
    console.log("Release Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
  });
};

function doThis () {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            logThis(err);
        }

        var readArray = data.split(",");

        userInput = readArray[1];

        spotifyThis(userInput);
    })
};