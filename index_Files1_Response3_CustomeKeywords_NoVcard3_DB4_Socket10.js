const express = require('express')
const app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const mysql = require('mysql');
var path = require('path')

//loads the index.html file; wonder if I can specify which file I want to use.  also I should put this is a public folder
app.use(express.static(__dirname));

//Parising the express message
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


//DB connection
function BD() {
 var con = mysql.createConnection({
   host: "ondbinstance.cleykwinz5ul.us-east-1.rds.amazonaws.com",
   user: "pokerface5",
   password: "basketball5",
   database: 'obdemo',
   port : '3306'
   });
    return con;
}


//Sockets
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

/*
// Send current time to all connected clients
function sendTime() {
    //io.emit('time', { time: new Date().toJSON() });
    io.emit('time', { time: "7036554116" });
}
*/

//loadContacts("jim", "man");


//Establish Sockets
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    //socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    //socket.on('i am client', console.log);

    //On sending a chat message
    socket.on('chatSend', function (data) {
        //console.log(data);
        //sentText("7036554116", "Hi jim");
        //sendText(data.phoneNumber, data.message);
        //insertChat("7036554116", "jim", "chat message", "testpword");
    });
    //On recieving a chat message
    socket.on('chatRecieve', function (data) {
        //console.log(data);
        //sentText("7036554116", "Hi jim");
        //sendText(data.phoneNumber, data.message);
        //need to replace with actual message values
        //insertChat("7036554116", "jim", "chat message", "testpword");
    });
    socket.on('loadContacts', function (data) {
        //console.log(data);
        loadContacts("jim", "man");
        //console.log(contacts[1])
        //sentText("7036554116", "Hi jim");
        //sendText(data.phoneNumber, data.message);
        //need to replace with actual message values
        //insertChat("7036554116", "jim", "chat message", "testpword");
    });
    socket.on('loadChats', function (data) {
        console.log(data);
        console.log(data.phoneNumber); 
        //get the message string for the associated phone number
        loadChats("jim", "da man", data.phoneNumber);
    });
    socket.on('saveChats', function (data) {
        //console.log(data);
        //get the message string for the associated phone number
        //loadChats("jim", "da man", "7036554119");
        //send to the website
        updateMessage(data.phoneNumberRecieve, "jim", data.message, "daman");
    });
    socket.on('saveContact', function (data) {
        //console.log(data);
        //get the message string for the associated phone number
        //loadChats("jim", "da man", "7036554119");
        //send to the website
        insertChat(data.phoneNumberRecieve, "jim", data.message, "daman");
    });
    socket.on('error', function (data) {
        console.log("Jim's socket error catch kicked in, fingures crossed we are still running");
        console.log(data);
    });
    socket.on('uncaughtException', function (data) {
        console.log("Jim's 2 socket error catch kicked in, fingures crossed we are still running");
        console.log(data);
    });
    socket.on('disconnect', function (data) {
        console.log("Jim's 3 socket error catch kicked in, fingures crossed we are still running");
        console.log(data);
    });
    //socket.on('error', console.error.bind(console));
    //sendTime();
});


function insertChat(phoneNumberRecieve, userID, message, password)
{
 console.log("inserting chat into DB");
  //DB connection 
  var con = BD();

  con.connect((err) => {
   if(err){
     console.log('Error connecting to DB' + err);
     return;
   }
   //console.log('DB Connection established');
   var post  = {ID: "", phoneNumberRecieve: phoneNumberRecieve, message: message};

   con.query('INSERT INTO `obdemo`.`master` SET ?', post, function (err, result, fields) {
     if (err) throw err;
     //console.log(result);
   });
  });
}

//updateMessage("7036554119", "jim", "", "daman");
//Update hte message into the DB
function updateMessage(phoneNumberRecieve, userID, message, password)
{
 console.log("Updating chat in the DB at: " + phoneNumberRecieve);
  //DB connection 

  var phoneNumberRecieve2 = phoneNumberRecieve;
  //var phoneNumberRecieve3 = "7036554119  jim";
 
  //var message2 = " jim test message add on";
  message3 = message;
  var con = BD();

  con.connect((err) => {
   if(err){
     console.log('Error connecting to DB' + err);
     return;
   }
   //console.log('DB Connection established');
   var post  = {ID: "", phoneNumberRecieve: phoneNumberRecieve, message: message};

   con.query('UPDATE `obdemo`.`master` SET message = CONCAT_WS("" , message, ' + "\"" + message3 + "\"" + ') WHERE phoneNumberRecieve = '+phoneNumberRecieve2+';', post, function (err, result, fields) {
     if (err) throw err;
     console.log(result);
   });
  });
}



//Add get
function loadContacts(userID, password)
{
 console.log("getting contacts");
  //DB connection 
  var con = BD();

  con.connect((err) => {
   if(err){
     console.log('Error connecting to DB' + err);
     return;
   }
   //console.log('DB Connection established');
   //var post  = {ID: "", phoneNumberRecieve: phoneNumberRecieve, message: message};

  con.query("SELECT DISTINCT phoneNumberRecieve FROM master", function (err, result, fields) {
     if (err) throw err;
     //console.log(result);
     io.emit('loadingContacts', { contacts: result });
   });
    //return contacts;
  });
}


//Add get
function loadChats(userID, password, phoneNumber)
{
 console.log("getting chats");
  //DB connection 
  var con = BD();

  con.connect((err) => {
   if(err){
     console.log('Error connecting to DB' + err);
     return;
   }
   //console.log('DB Connection established');
   //var post  = {ID: "", phoneNumberRecieve: phoneNumberRecieve, message: message};

  con.query("SELECT message FROM master WHERE phoneNumberRecieve = " + phoneNumber , function (err, result, fields) {
     if (err) throw err;
     console.log(result);
     io.emit('loadingChats', { chats: result });
   });
    //return contacts;
  });
}

function sendText(phoneNumber, message)
{
  // Twilio Credentials 
  var accountSid = 'ACf2cfa484fc1d842197755ec74df3ff23'; 
  var authToken = 'e662aa5a24bd8a20768b170ff82da773'; 
 
  //require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 

  
  //Make Twilio message
    client.messages.create({ 
      to: phoneNumber, 
      from: "+12406604113", 
      body: message, 
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/han.jpg",
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg",
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/HR.vcf",
    }, function(err, message) { 

      //Get message system ID
      //console.log(message.sid); 
    });
}



app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const message = twiml.message();
  var msg = req.body.Body;
  var number = req.body.From;
 
  var tokenMsg = "~#^zQl1" + msg;
  
  //save text to the DB
  updateMessage(number, "jim", tokenMsg, "daman");
 
  //send the message to the site as a receive message with a socket
  loadChats("jim", "da man", number);

  
 if(req.body.Body.toUpperCase().includes("WELCOME1"))
 {
     var picURL = "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg";
     var hrURL = "https://s3.amazonaws.com/twiliotestingjim/HR4.vcf";
     var itURL = "https://s3.amazonaws.com/twiliotestingjim/IT3.vcf";
     var secURL = "https://s3.amazonaws.com/twiliotestingjim/Security1.vcf";

     msg = 'We\'re excited for your first day so we\'ve sent you some useful contacts. Let us know if you have any questions and welcome aboard!!';
     message.media(picURL);
     message.media(hrURL);
     message.media(itURL);
     message.media(secURL);
  }
  else if(req.body.Body.toUpperCase().includes("WELCOME"))
  {
     var picURL = "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg";

     msg = 'We\'re excited for your first day so we\'ve sent you some useful contacts. Let us know if you have any questions and welcome aboard!!\nHR: 7036445114\nIT: 7036445115\nSecurity: 7036445116';
     message.media(picURL)
  }  
  else if(req.body.Body.toUpperCase().includes("CONNECT1"))
  {
    msg = 'Sorry the contact files didn\'t come through but here are the numbers to save:\nHR: 7036445114\nIT: 7036445115\nSecurity: 7036445116';
  }
  else if(req.body.Body.toUpperCase().includes("BUDDY1"))
  {
    msg = 'Welcome to the new hire buddy program!\nWe\'ve teamed you up with Mike Chait who will call you soon to set up a time to meet!';
  }
  else if(req.body.Body.toUpperCase().includes("LUNCH1"))
  {
    msg = 'Welcome to the lunch group!\nEvery week we\'ll add you to a different group of 10 new people you can message for lunch!';
  }
  else if(req.body.Body.toUpperCase().includes("ACTIVITY1"))
  {
    msg = 'Welcome to the activity thread!\nWe\'ll send you a message when sport leauges start, for spontaious Happy Hours, or other great events!\nYou can also check out http://www.companyevents.com/ for a list of all company clubs and events or to start your own!';
  }
  else if(req.body.Body.toUpperCase().includes("TICKETS1"))
  {
    msg = 'Welcome to the tickets thread!\nWe\'ll let you know when any free company tickets become available!';
  }
  else if(req.body.Body.toUpperCase().includes("Bill1"))
  {
    msg = '2 Welcome to the tickets thread!\nWe\'ll let you know when any free company tickets become available!';
  }
  else if(req.body.Body.toUpperCase().includes("STUDENT1"))
  {
    var picURL = "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg";
    msg = 'Welcome to the best years of your life!\nWe\'excited to share them with you!\n\nCampus Safety: 7036445114\nIT: 7036445115\nRA: 7036445116';
    message.media(picURL);
  }
  else{
    //msg = "Invalid option";
  }

  message.body(msg);
 
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

});

//Listen for post request on Send
app.post('/Send', function(req, res) {

    //Get message variables
    var message = req.body.welcomemessage
    //console.log("Welcome Message: " + message);
    message = message + "\n";

    var includePic = req.body.Pic;
    var includeHR = req.body.HR;
    var includeIT = req.body.IT;
    var includeSecurity = req.body.Security;
    //console.log("Checkbox Values: Pic: " + includePic + ", HR: " + includeHR + ", IT: " + includeIT + ", Security: " + includeSecurity)

    var employeeNumber = req.body.phoneNumber;
    var countryCode = "+1";
    var phoneNumber = countryCode.concat(employeeNumber);
    //console.log("texting: " + phoneNumber)
    //phoneNumber = "+17036554116";
   

    // Twilio Credentials 
    var accountSid = 'ACf2cfa484fc1d842197755ec74df3ff23'; 
    var authToken = 'e662aa5a24bd8a20768b170ff82da773'; 
 
    //require the Twilio module and create a REST client 
    var client = require('twilio')(accountSid, authToken); 

    //Build MedialURL array
    var picURL = "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg";
    var hrURL = "https://s3.amazonaws.com/twiliotestingjim/HR4.vcf";
    var itURL = "https://s3.amazonaws.com/twiliotestingjim/IT3.vcf";
    var secURL = "https://s3.amazonaws.com/twiliotestingjim/Security1.vcf";

    var mediaArray = [];

    if(includeSecurity == "true")
    {
      //mediaArray.push(secURL);
       message = message + "\nSecurity: 7036445116";
    }

   if(includeIT == "true")
    {
      //mediaArray.push(itURL);
      message = message + "\nIT: 7036445115";
    }
     if(includeHR == "true")
    {
      //mediaArray.push(hrURL);
      message = message + "\nHR: 7036445114";
    }
    message = message + "\n\nSent using OnBoard at http://onboard.fyi/";
   
    if(includePic == "true")
    {
      mediaArray.push(picURL);
    }

    //Make Twilio message
    client.messages.create({ 
      to: phoneNumber, 
      from: "+12406604113", 
      body: message, 
      mediaUrl: mediaArray
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/han.jpg",
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/welcome.jpg",
      //mediaUrl: "https://s3.amazonaws.com/twiliotestingjim/HR.vcf",
    }, function(err, message) { 

      //Get message system ID
      //console.log(message.sid); 
    });

    //for some reason can't remove the redirect or edit it
    res.redirect('http://onboard.fyi/');
    //res.end();

})




//Listen on the port
http.listen(3000, function () {
  console.log('OnBoard listening on port 3000!')
})