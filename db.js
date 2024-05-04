var mysql = require('mysql2');

var connection = mysql.createConnection(
    {
        host: 'localhost', 
        database: 'dbproj',
        user: 'root',
        password: 'root'
    }
);

module.exports = connection;

connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})