var mysql =  require("mysql");
var pool    =    mysql.createPool({
    connectionLimit   :   100,
    host              :   'localhost',
    user              :   'user',
    password          :   'secret',
    database          :   'socketio',
    debug             :   false
});


var Tags = {

	list: function(username, callback) {
		pool.query("SELECT * FROM tag WHERE  ? ", {username: username}, callback);
	},


	show: function(id, callback) {
        pool.query("SELECT id, title, description FROM tag WHERE ? LIMIT 1", {id: id}, callback);
    },


	/*add: function(data, callback) {
		pool.query('INSERT INTO tag SET ?, ?, ?', [{username: data.username}, {title: data.title}, {description: data.description}], callback);		
	},*/

	add: function(data, callback) {
		pool.query('INSERT INTO tag SET ?, ?, ?', [{username: data.username}, {title: data.title}, {description: data.description}], function(err, result) {
	          if (err) throw err;
	          callback(result.insertId);
	        }	        
	    );		
	},
    


    update: function(data, callback) {
        pool.query('UPDATE tag SET ?, ? WHERE ?', [{title: data.title}, {description: data.description}, {id: data.id}], callback);
    
    },
    

	delete: function(id, callback) {
		pool.query('DELETE FROM tag WHERE ? LIMIT 1', {id: id}, callback);
	},

};


module.exports = Tags;