var io = require('socket.io');
/* Models */
var tags = require('./models/tags');
/*Validator*/
var isEmptyObject = require('./lib/empty');
var validator = require('validator');
/* Errors */
var errors = require('./config/errors');
var tag_title_errors = errors.tag.title;
var tag_description_errors = errors.tag.description;



exports.initialize = function(server) {

  io = io.listen(server);

  io.sockets.on("connection", function(socket){

    socket.send(JSON.stringify({type:'serverMessage', message: 'Welcome to the Socket.io Dashboard!'}));

    socket.on("set_name", function(data){
      //Set nickname
      socket.nickname = data.name;
      socket.emit('name_set', data);
      socket.send(JSON.stringify({type:'serverMessage', message: 'Welcome to the Socket.io Dashboard!'}));
      //socket.broadcast.emit('user_entered', data);
      //Retrive all user's tags
      tags.list(socket.nickname, function(error, rows) {
        /*res.render('albums/index', { title: 'Albums List', albums: albums, messages: req.flash('info') });*/
        if(error){
          console.log(error);
          socket.emit('error', 'no tags returned');
          return;
        }
        //var tags = JSON.stringify(rows);
        var user = {};
        user.tags = rows;
        user.name = socket.nickname;
        user = JSON.stringify(user);

        //console.log(tags);
        socket.emit('all_tags', user);  
      });

    });
           
  

    socket.on("get_tag", function(data) {
      var id = data.id;
      tags.show(id, function(err, tag) {
        var data = {};
        if (isEmptyObject(tag)) {          
          data.result = 'error';
          data.message = 'Tag Not Found';
        }
        else {
          data.result = 'ok';
          data.item = tag;
        }
        data = JSON.stringify(data);
        //console.log(data);
        socket.emit('tag_value', data);
      })
    });


    socket.on("add_tag", function(data) {
      var data = JSON.parse(data);
      var tag = {};
      tag.username = socket.nickname;
      tag.title = data.title;
      tag.description = data.description;
      //Errors
      var errors = new Array();
      if ( validator.isLength(tag.title, 2, 100) !== true ) {
        errors.push(tag_title_errors);
      }
      if ( validator.isLength(tag.description, 3, 1000) !== true ) {
        errors.push(tag_description_errors);
      }
      //Sent data
      var response = {};
      if (isEmptyObject(errors)) {
        /*tags.add(tag, function() {          
        });*/
        tags.add(tag, function(n) {          
          //console.log(n); //last_insert_id
          var item = {};
          item.id = n;
          item.title = tag.title;
          response.result = 'ok';
          response.message = 'Tag added';
          response.item = item;
          response = JSON.stringify(response);
          socket.emit("tag_added", response);
        });               
      }
      else {
        response.result = 'error';
        response.errors = errors;
        response = JSON.stringify(response);
        socket.emit("tag_added", response);
      }
            
    });



    socket.on("edit_tag", function(data) {
      var id = data.id;
      tags.show(id, function(err, tag) {
        var data = {};
        if (isEmptyObject(tag)) {          
          data.result = 'error';
          data.message = 'Tag Not Found';
        }
        else {
          data.result = 'ok';
          data.item = tag;
        }
        data = JSON.stringify(data);
        //console.log(data);
        socket.emit('tag_edit', data);
      })
    });


    socket.on("update_tag", function(data) {
      var data = JSON.parse(data);
      var tag = {};
      tag.id = data.id;
      //tag.username = socket.nickname;
      tag.title = data.title;
      tag.description = data.description;
      //Errors
      var errors = new Array();
      if ( validator.isLength(tag.title, 2, 100) !== true ) {
        errors.push(tag_title_errors);
      }
      if ( validator.isLength(tag.description, 3, 1000) !== true ) {
        errors.push(tag_description_errors);
      }
      //Sent data
      var response = {};
      if (isEmptyObject(errors)) {
        tags.update(tag, function() {       
        });
        response.result = 'ok';
        response.message = 'Tag updated';              
      }
      else {
        response.result = 'error';
        response.errors = errors;        
      }
      response = JSON.stringify(response);
      socket.emit("tag_updated", response);
      //console.log(response);
    });



    //Delete tag
    socket.on("delete_tag", function(data) {
      var id = data.id;
      tags.delete(id, function(err, tag) {
        var response = {};
        if (err) {
          response.result = 'error';
          response.message = 'Tag Not Found';
        }
        else {
          response.result = 'ok';
          response.item = id;
        }
        response = JSON.stringify(response);
        //console.log(response);
        socket.emit('tag_deleted', response);
      })
    });



  }); //end socket.io connection



}