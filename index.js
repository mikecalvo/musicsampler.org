const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const { getTypeParser } = require('pg-types');
console.log("Database URL = "+process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const getLatestYear = async function() {
    const client = await pool.connect();
    const result = await client.query(`SELECT max(release_year) FROM song`);
    client.release();
    return result.rows[0].max;

}

const getYears = async function() {
    const client = await pool.connect();
    const result = await client.query(`SELECT distinct release_year FROM song order by release_year desc`);
    client.release();
    return { 'results': (result) ? result.rows : null };
}

const getSongs = async function(year) {
    console.log("Getting songs for "+year);
    const client = await pool.connect();
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
  .get("/:year", async (req, res) => {
      try {
          if (req.params.year == 'years') {
            res.render('pages/years', await getYears());
          } else {
            res.render('pages/index', await getSongs(req.params.year));
          }
        } catch (err) {
          console.error(err);
          res.send("Error: "+err);
      }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
