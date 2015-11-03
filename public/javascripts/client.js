//var socket=io('ws://localhost:8080');
var socket=io();

//First after username input
socket.on('name_set', function(data){

  $('#nameform').hide();
  $('#messages').append('<div class="systemMessage">Hello, '+data.name+'</div>');
  
  //Welcome message
  socket.on('message', function (data) {
    data = JSON.parse(data);
    if(data.username){
      $('#messages').append('<div class="'+data.type+'"><span class="name">' + data.username + ":</span> " + data.message + '</div>');
    }else{
      $('#messages').append('<div class="'+data.type+'">' + data.message + '</div>');
    }
  });
  
});



//List all user's tags
socket.on("all_tags", function(data){
  var user = JSON.parse(data);
  $('section.tags').append("<h3>Your tags list</h3>");
  //All tags
  var tags = user.tags;
  tags.forEach(function(item, i, tags) {      
    var line = "<p class='single' id='p" + item.id + "'><a class='single_tag' href=/view#" + item.id + ">" + item.title + "</a><span class='icons'><a class='edit_single_tag' href=/edit#" + item.id + "><img src='/images/edit.ico'/></a>&nbsp;&nbsp;<a class='del_single_tag' href=/delete#" + item.id + "><img src='/images/delete.ico'/></a></span></p>";    
    $('section.tags').append(line);
  });
  /*var line1 = "<p class='single' id='p4'><a class='single_tag' href=/view#4>Test</a><span class='icons'><a class='edit_single_tag' href=/edit#4><img src='/images/edit.ico'/></a>&nbsp;&nbsp;<a class='del_single_tag' href=/delete#4><img src='/images/delete.ico'/></a></span></p>";
  $('section.tags').append(line1);*/
});


//Single item
socket.on("tag_value", function(data) {
  var tag = JSON.parse(data);
  if (tag.result == 'ok') {
    var item = tag.item[0];
    //console.log(tag.item[0]);
    $('#tag_id').empty().append(item.id);
    $('#tag_title').empty().append(item.title);
    $('#tag_description').empty().append(item.description);
    $('section#taginfo').fadeIn("slow");
  }
  else {    
    var message = "<h6>" + tag.message + "</h6>";
    $('section#tagempty div.empty_mes').empty().append(message);
    $('section#tagempty').fadeIn("slow");
  } 
  
});


//Add item
socket.on("tag_added", function(data) {
  var response = JSON.parse(data);
  if (response.result == 'ok') {
    $('#add_title').val('');
    $('#add_description').val('');
    $('#tagform div.div_errors').empty();
    $('section#tagform').fadeOut("slow");
    //console.log(response.item.id);
    var line = "<p class='single' id='p" + response.item.id + "'><a class='single_tag' href=/view#" + response.item.id + ">" + response.item.title + "</a><span class='icons'><a class='edit_single_tag' href=/edit#" + response.item.id + "><img src='/images/edit.ico'/></a>&nbsp;&nbsp;<a class='del_single_tag' href=/delete#" + response.item.id + "><img src='/images/delete.ico'/></a></span></p>";    
    $('section.tags').append(line);
  }
  else {
    $('#tagform div.div_errors').empty();
    var errors = response.errors;
    errors.forEach(function(error, i, errors) {
      var item = "<p class='p_error'>" + error + "</p>";
      $('#tagform div.div_errors').prepend(item);
    });    
  }
});




//Edit item
socket.on("tag_edit", function(data) {
  var tag = JSON.parse(data);
  if (tag.result == 'ok') {
    var item = tag.item[0];
    //console.log(tag.item[0]);
    $('#edit_tag_id').empty().append(item.id);
    $('#edit_title').val(item.title);
    $('#edit_description').val(item.description);
    $('section#tagedit').fadeIn("slow");
  }
  else {    
    var message = "<h6>" + tag.message + "</h6>";
    $('section#tagempty div.empty_mes').empty().append(message);
    $('section#tagempty').fadeIn("slow");
  } 
  
});



//Update item
socket.on("tag_updated", function(data) {
  var response = JSON.parse(data);
  if (response.result == 'ok') {
    $('#edit_title').val('');
    $('#edit_description').val('');
    $('#tagedit div.div_errors').empty();
    $('section#tagedit').fadeOut("slow");
    //console.log(response.item.id);    
  }
  else {
    $('#tagedit div.div_errors').empty();
    var errors = response.errors;
    errors.forEach(function(error, i, errors) {
      var item = "<p class='p_error'>" + error + "</p>";
      $('#tagedit div.div_errors').prepend(item);
    });    
  }
});


//Delete item
socket.on("tag_deleted", function(data) {
  var response = JSON.parse(data);
  //console.log(response);
  if (response.result == 'ok') {
    var id = response.item;
    $('p#p' + id).remove();   
  } 
});







//Click handlers

$(function(){

  //Enter username
  $('#setname').click(function(){
    socket.emit("set_name", {name: $('#nickname').val()});       
  });

  //Get single tag
  $('section.tags').on('click', 'a.single_tag', function(e) {
    var href = $(this).attr('href');
    var id = href.split(/\#/)[1];
    socket.emit("get_tag", {id: id});
    e.preventDefault();
  });

  $('#close_tag').click(function(e) {
    $('section#taginfo').fadeOut("slow");
    e.preventDefault();
  });  

  $('#close_tag2').click(function(e) {
    $('section#tagempty').fadeOut("slow");
    e.preventDefault();
  });


  //Add Tag
  $('a.add_tag').click(function(e) {
    $('section#tagform').fadeIn("slow");
    e.preventDefault();
  });

  $('#set_tag').click(function(e) {
    var data = {};
    data.title = $('#add_title').val();
    data.description = $('#add_description').val();
    data = JSON.stringify(data);
    socket.emit("add_tag", data);    
    e.preventDefault();
  });

  $('#close_add_tag').click(function(e) {
    $('#tagform div.div_errors').empty();
    $('section#tagform').fadeOut("slow");
    e.preventDefault();
  });


  //Edit tag
  $('section.tags').on('click', 'a.edit_single_tag', function(e) {
    var href = $(this).attr('href');
    var id = href.split(/\#/)[1];
    socket.emit("edit_tag", {id: id});
    e.preventDefault();
  });

  $('#close_edit_tag').click(function(e) {
    $('section#tagedit').fadeOut("slow");
    e.preventDefault();
  });

  $('#edit_tag').click(function(e) {
    var data = {};
    data.id = $('#edit_tag_id').text();
    data.title = $('#edit_title').val();
    data.description = $('#edit_description').val();
    data = JSON.stringify(data);
    socket.emit("update_tag", data);
    //console.log(data)  
    e.preventDefault();
  });


  //Delete tag
  $('section.tags').on('click', 'a.del_single_tag', function(e) {
    var href = $(this).attr('href');
    var id = href.split(/\#/)[1];
    socket.emit("delete_tag", {id: id});
    e.preventDefault();
  });
  


});//end jQuery()


$(window).on('beforeunload', function(){
    socket.close();
});