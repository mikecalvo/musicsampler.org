const express = require('express')
const path = require('path')
const request = require('request-promise');

const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const { getTypeParser } = require('pg-types');
const { log } = require('console');
const { response } = require('express');
console.log("Database URL = "+process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var spotifyAccessToken;
const authSpotify = async function() {

  const client_id = 'fea2fd5462e84d81b737e78ab46550bf';
  const client_secret = 'ad98afbd5cbe46f8a0086a7c0c194aa3';

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  console.log('Authenticating via spotify');
  await request(authOptions).then(function (response){
    spotifyAccessToken = response.access_token;
    console.log('spotify access token: '+ spotifyAccessToken);
  }); 
};

const spotifyGetPlaylist = async function(playlistId) {

  const options = {
    url: 'https://api.spotify.com/v1/playlists/'+playlistId+'/tracks?fields=items(track(name,artists(name),album(release_date,name, images)))',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + spotifyAccessToken
    },
    json: true
  };

  const trackList = await request(options)
    .then(function (response) {
      // console.log('response: '+JSON.stringify(response));
      return response.items.map(function (item) {
        const track = item.track;
        console.log('track='+JSON.stringify(track.images));
        const artist = track.artists.map( a => a.name).join(', ');
        console.log('Artist: '+artist);
        console.log('Track: '+track.name);
        console.log('Release Date: '+track.album.release_date);
        return {
          'title': track.name, 
          'artist': artist, 
          'releaseDate': track.album.release_date, 
          'album': track.album.name, 
          'images':track.album.images
        };
      });
    })
    .catch(function(error) {
      console.log('Error getting playlist details: '+error);
    });

    console.log('Playlist songs: '+JSON.stringify(trackList));
    return trackList;
};

const getLatestYear = async function() {
  console.log('Getting latest year...')
    const client = await pool.connect();
    const result = await client.query(`SELECT max(year) FROM spotify_playlist`);
    //const result = await client.query(`SELECT max(release_year) FROM song`);
    client.release();
    return result.rows[0].max;

}

const getYears = async function() {
    const client = await pool.connect();
    const result = await client.query(`SELECT distinct year FROM spotify_playlist order by year desc`);
    client.release();
    return { 'results': (result) ? result.rows : null };
}

const getSongs = async function(year) {
    console.log("Getting songs for "+year);

    const client = await pool.connect();
    const playlist_results = await client.query(`SELECT spotify_id FROM spotify_playlist where year=${year}`);

    // TODO: pull the spotify playlist id from databse
    if (playlist_results && playlist_results.rows.length == 1 && playlist_results.rows[0].spotify_id) {
      const spotify_id = playlist_results.rows[0].spotify_id;
      console.log('Fetching Spotify Playlist for Year '+year+'('+spotify_id+')');
      await authSpotify();
      var tracks = await spotifyGetPlaylist(spotify_id);
      return { 'results': {tracks: tracks, playlist_id:spotify_id, year: year } };
    }

    const result = await client.query(`SELECT * FROM song where release_year=${year} order by track asc`);
    client.release();
    return { 'results': (result) ? result.rows : null };
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => {
    try {
        res.render('pages/index', await getSongs(await getLatestYear()) );
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
  })
  .get("/images/:image", async (req, res) => {
    console.log('Sending image '+req.params.image);
    var options = {
      root: path.join(__dirname, 'web'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    res.sendFile(req.params.image, options);
  })
  .get("/:year", async (req, res) => {
      try {
          if (req.params.year == 'years') {
            res.render('pages/years', await getYears());
          } else if (!isNaN(req.params.year)) {
            res.render('pages/index', await getSongs(req.params.year));
          } else {
            console.log('No response for '+req.params.year);
            res.send('');
          }
        } catch (err) {
          console.error(err);
          res.send("Error: "+err);
      }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
