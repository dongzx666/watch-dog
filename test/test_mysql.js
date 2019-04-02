var mysql      = require('mysql');
// const config = require('../config/index.js').mysql_config;
const config = {
      host: 'localhost',
      user     :  'root',
      password :  'oneinstack',
      database :  'watch-dog'
    }
var connection = mysql.createConnection(config);

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
