const { SSL_OP_SINGLE_ECDH_USE } = require('constants');
const fs = require('fs');

fs.readFile("./songs.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const catalog = JSON.parse(jsonString);
      for (year in catalog) {
          const songs = catalog[year];
          for (i = 0; i < songs.length; i++) {
              const title = songs[i].title.replace('"', '""').replace("'", "''").replace("&amp;", "&");
              const artist = songs[i].artist.replace('"', '""').replace("'", "''").replace("&amp;", "&");
              console.log(`INSERT INTO song (track, title, artist, release_year, album) VALUES(${i+1}, '${title}', '${artist}', ${year}, '');`);
          }
      }
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
