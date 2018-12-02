//setting up to be able to use npm packages
require("dotenv").config();

//fs
var fs = require("fs");

//axios
var axios = require("axios");

//spotify npm
var Spotify = require('node-spotify-api');

//moment
var moment = require('moment');
moment().format();

//fs to read/write/append to txt files
var fs = require("fs");

//linking to spotify api keys in different file
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var selection = process.argv[2];

var userInput = process.argv.slice(3).join(" ");

//Concert Search Function
function concertThis(userInput) {
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp").then(
        function (response) {
            var venues = response.data;
            console.log("Upcoming " + userInput + " concerts: ");
            for (var i = 0; i < venues.length; i++) {
                var dayTime = moment(venues[i].datetime).format("MM/DD/YY")

                var concertInfo = `\nVenue name: ${venues[i].venue.name} \nVenue location: ${venues[i].venue.city}, ${venues[i].venue.region} \nConcert date: ${dayTime}\n---------------------------`;
                console.log(concertInfo)

                fs.appendFile("log.txt", concertInfo, function (err) {
                    if (err) {
                        console.log(err);
                    }               
                })
            }
        }
    );
}

//Spotify Search Function
function spotifyThisSong(userInput) {
    if (userInput === "") {
        spotify.search({ type: 'track', query: "The Sign + Ace of Base", limit: 2 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var track = data.tracks.items[0];
            var trackInfo = `\nArtist: ${track.artists[0].name} \nSong name: ${track.name} \nSpotify url: ${track.external_urls.spotify} \nAlbum name: ${track.album.name} \n--------------------`
            // console.log("Artist: " + track.artists[0].name);
            // console.log("Song name: " + track.name);
            // console.log("Spotify url: " + track.external_urls.spotify);
            // console.log("Album name: " + track.album.name)

            fs.appendFile("log.txt", trackInfo, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log(trackInfo);
            })
        });
    } else {
        spotify.search({ type: 'track', query: userInput, limit: 2 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var track = data.tracks.items[0];
            var trackInfo = `\nArtist: ${track.artists[0].name} \nSong name: ${track.name} \nSpotify url: ${track.external_urls.spotify} \nAlbum name: ${track.album.name} \n--------------------`

            fs.appendFile("log.txt", trackInfo, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log(trackInfo);
            })
        });
    }
}

//movie search function
function movieThis(userInput) {
    if (userInput === "") {
        axios.get("http://www.omdbapi.com/?t=" + "Mr. Nobody" + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                var movieInfo = `\nTitle: ${response.data.Title} \nRelease date: ${response.data.Released} \nIMDB Rating: ${response.data.imdbRating} \nRotten Tomatoes Rating: ${response.data.Ratings[1].Value} \nProduced in: ${response.data.Country} \nLanguage: ${response.data.Language} \nPlot: ${response.data.Plot} \nStarring: ${response.data.Actors} \n--------------------`
                fs.appendFile("log.txt", movieInfo, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(movieInfo);
                });
            }
        );
    } else {
        axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                var movieInfo = `\nTitle: ${response.data.Title} \nRelease date: ${response.data.Released} \nIMDB Rating: ${response.data.imdbRating} \nRotten Tomatoes Rating: ${response.data.Ratings[1].Value} \nProduced in: ${response.data.Country} \nLanguage: ${response.data.Language} \nPlot: ${response.data.Plot} \nStarring: ${response.data.Actors} \n--------------------`
                fs.appendFile("log.txt", movieInfo, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(movieInfo);
                });
            }
        );
    }
}

//do-what-it-says function
function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function (error, data) {
        if (error) {
            return console.log(error);
        };
        var commands = data.split(",");
        selection = commands[0];
        userInput = commands[1];

        switch (selection) {
            case "spotify-this-song":
                spotifyThisSong(userInput);
                break;
            case "movie-this":
                movieThis(userInput);
                break;
            case "concert-this":
                concertThis(userInput);
                break;
            default:
                break;
        }
    })
}

switch (selection) {
    case "spotify-this-song":
        spotifyThisSong(userInput);
        break;
    case "movie-this":
        movieThis(userInput);
        break;
    case "concert-this":
        concertThis(userInput);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please select one of these terms: 'spotify-this-song', 'movie-this', 'concert-this', or 'do-what-it-says'");
}