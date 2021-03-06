// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mysql = require('mysql');                     // mysql
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var schedule = require('node-schedule');

// configuration =================

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "fauxcoin"
});
db.connect(function(err) {
  if(err){
    console.log(err);
  } else {
    console.log("MYSQL CONNECTED");
  }
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

var usertest = {id:1,username:'test','password':'test123'};

// passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null,usertest);
  
  // User.findById(id, function(err, user) {
    // done(err, user);
  // });
});

// TODO
passport.use(new LocalStrategy(
  function(username, password, done) {
    done(null,usertest);
    
      // UserDetails.findOne({
        // username: username
      // }, function(err, user) {
        // if (err) {
          // return done(err);
        // }

        // if (!user) {
          // return done(null, false);
        // }

        // if (user.password != password) {
          // return done(null, false);
        // }
        // return done(null, user);
      // });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  }
);

// routes

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

// api ---------------------------------------------------------------------

function sqlQuery(sql,data,res,cb){
  db.query(sql, data, function(err, result) {
    if(err){
      error(res,err);
    } else {
      cb(result);
    }
  });
}

function success(res,data){
  res.json({status:"success",data:data});
}

// invalid parameters
function fail(res,err){
  res.json({status:"fail",message:err});
}

// all other errors
function error(res,err){
  res.json({status:"error",message:err});
}

// Get a list of all users
app.get('/api/users', function(req, res) {
  var sql = "SELECT * FROM user";
  var data = [];
  sqlQuery(sql,data,res,function(result){
    success(res,{users:result});
  });
});

// Get a specific user
app.get('/api/users/:userId', function(req, res) {
  var sql = "SELECT * FROM user WHERE id=?";
  var data = [req.params.userId];
  sqlQuery(sql,data,res,function(result){
    if(result.length){
      success(res,{user:result[0]});
    } else {
      error(res,"user not found");
    }
  });
});

// Get a user's value history
app.get('/api/users/:userId/values', function(req, res) {
  var sql = "SELECT value,date FROM user_value WHERE user_id=? AND date>now()-INTERVAL 24 HOUR";
  var data = [req.params.userId];
  sqlQuery(sql,data,res,function(result){
    success(res,{values:result});
  });
});

// Get a user's coins
app.get('/api/users/:userId/coins', function(req, res) {
  var sql = "SELECT IFNULL(uc.amount,0) AS amount,c.* FROM user_coin uc JOIN coin c ON c.id=uc.coin_id WHERE uc.user_id=? ORDER BY value*amount DESC";
  var data = [req.params.userId];
  
  if(req.query.limit){
    sql += " LIMIT ?";
    data.push(parseInt(req.query.limit));
  }
  
  sqlQuery(sql,data,res,function(result){
    success(res,{coins:result});
  });
});

// Get a specific coin that a user owns
app.get('/api/users/:userId/coins/:coinId', function(req, res) {
  var sql = "SELECT IFNULL(uc.amount,0) AS amount,c.* FROM coin c LEFT JOIN user_coin uc ON uc.coin_id=c.id WHERE c.id = ? AND (uc.user_id=? OR uc.user_id IS NULL)";
  var data = [req.params.coinId,req.params.userId];
  sqlQuery(sql,data,res,function(result){
    if(result.length){
      success(res,{coin:result[0]});
    } else {
      return(res,"coin not owned by user");
    }
  });
});

// Get a list of all coins
app.get('/api/coins', function(req, res) {
  var sql = "SELECT * FROM coin";
  var data = [];
  sqlQuery(sql,data,res,function(result){
    success(res,{coins:result});
  });
});

// Get a coin's value history
app.get('/api/coins/:coinId/values', function(req, res) {
  var sql = "SELECT value,date FROM coin_value WHERE coin_id=? AND date>now()-INTERVAL 24 HOUR";
  var data = [req.params.coinId];
  sqlQuery(sql,data,res,function(result){
    success(res,{values:result});
  });
});

// Get a specific coin
app.get('/api/coins/:coinId', function(req, res) {
  var sql = "SELECT * FROM coin WHERE id=?";
  var data = [req.params.coinId];
  sqlQuery(sql,data,res,function(result){
    if(result.length){
      success(res,{coin:result[0]});
    } else {
      error(res,"coin not found");
    }
  });
});

// Create a coin
app.post('/api/coins', function(req, res) {
  if(!req.body.name){
    fail(res,{name:"A name is required"});
    return;
  }
  
  if(!req.body.value){
    fail(res,{name:"A value is required"});
    return;
  }
  
  var sql = "INSERT INTO coin (name,value) VALUES (?,?)";
  var data = [req.body.name,req.body.value];
  sqlQuery(sql,data,res,function(result){
    success(res,null);
  });
});

// Buy a coin
app.post('/api/buy/:coinId', function(req, res) {
  if(!req.body.amount){
    fail(res,{amount:"An amount is required"});
    return;
  }
  
  var userId = 1;
  var coinId = req.params.coinId;
  var amount = req.body.amount;
  
  // Get the funds of the logged in user
  var sql = "SELECT funds FROM user WHERE id=?";
  var data = [userId];
  sqlQuery(sql,data,res,function(result){
    if(result.length){
      var funds = result[0].funds;
      
      // Get the value of the specified coin
      sql = "SELECT value FROM coin WHERE id=?";
      data = [coinId];
      sqlQuery(sql,data,res,function(result){
        if(result.length){
          var coinValue = result[0].value;
          
          // Get the total value of the buy
          var totalValue = coinValue*amount;
          
          // Apply fee to avoid instant profit
          totalValue = totalValue * 1.01;
          
          // Make sure user has enough funds
          var newFunds = funds-totalValue;
          if(newFunds >= 0){
            // Update the user's funds
            sql = "UPDATE user SET funds=?";
            data = [newFunds];
            sqlQuery(sql,data,res,function(result){
              // Add the coin to the user
              sql = "INSERT INTO user_coin (user_id,coin_id,amount) VALUES (?,?,?) ON DUPLICATE KEY UPDATE amount = amount + ?";
              data = [userId,coinId,amount,amount];
              sqlQuery(sql,data,res,function(result){
                // Increase value of coin (temporary)
                var valueChange = 0.01*amount;
                sql = "UPDATE coin SET value=value+? WHERE id=?";
                data = [valueChange,coinId];
                sqlQuery(sql,data,res,function(result){
                  // Create trade record
                  sql = "INSERT INTO trade (type,coin_id,user_id,amount,coin_value) VALUES (1,?,?,?,?)";
                  data = [coinId,userId,amount,coinValue];
                  sqlQuery(sql,data,res,function(result){
                    success(res,null);
                  });
                });
              });
            });
          } else {
            error(res,"not enough funds");
          }
        } else {
          error(res,"coin not found");
        }
      });
    } else {
      error(res,"user not found");
    }
  });
});

// Sell a coin
app.post('/api/sell/:coinId', function(req, res) {
  if(!req.body.amount){
    fail(res,{amount:"An amount is required"});
    return;
  }
  
  var userId = 1;
  var coinId = req.params.coinId;
  var amount = req.body.amount;
  
  // Get the amount of coins owned by the logged in user
  var sql = "SELECT amount FROM user_coin WHERE user_id=? AND coin_id=?";
  var data = [userId,coinId];
  sqlQuery(sql,data,res,function(result){
    if(result.length){
      // Make sure they have enough coins to sell
      if(result[0].amount >= amount){
        // Get the current value of the coin
        sql = "SELECT value FROM coin WHERE id=?";
        data = [coinId];
        sqlQuery(sql,data,res,function(result){
          if(result.length){
            // Find the total value of the sell
            var coinValue = result[0].value;
            var totalValue = coinValue*amount;
            
            // Apply fee to avoid instant profit
            totalValue = totalValue * 1.01;
            
            // Add the funds to the user
            sql = "UPDATE user SET funds = funds + ? WHERE id=?"
            data = [totalValue,userId];
            sqlQuery(sql,data,res,function(result){
              
              // Update the amount of coins the user now owns
              sql = "UPDATE user_coin SET amount = amount - ? WHERE user_id=? AND coin_id=?";
              data = [amount,userId,coinId];
              sqlQuery(sql,data,res,function(result){
                // Decrease value of coin (temporary)
                var valueChange = 0.01*amount;
                sql = "UPDATE coin SET value=value-? WHERE id=?";
                data = [valueChange,coinId];
                sqlQuery(sql,data,res,function(result){
                  // Create trade record
                  sql = "INSERT INTO trade (type,coin_id,user_id,amount,coin_value) VALUES (2,?,?,?,?)";
                  data = [coinId,userId,amount,coinValue];
                  sqlQuery(sql,data,res,function(result){
                    success(res,null);
                  });
                });
              });
            });
          } else {
            error(res,"coin not found");
          }
        });
      } else {
        error(res,"not enough coins");
      }
    } else {
      error(res,"coin not found for user");
    }
  });
});

// Get a list or a count of trades
app.get('/api/trades', function(req, res) {
  var sql = "SELECT";
  if(req.query.count){
    sql += " COUNT(*) AS count";
  } else {
    sql += " t.*,c.name as coin_name";
  }
  sql += " FROM trade t JOIN coin c ON c.id = t.coin_id"

  var data = [];

  var where = [];
  if(req.query.coinId){
    where.push("coin_id=?");
    data.push(req.query.coinId);
  }
  if(req.query.userId){
    where.push("user_id=?");
    data.push(req.query.userId);
  }
  if(where.length > 0){
    sql += " WHERE " + where.join(" AND ");
  }

  if(req.query.count){
    sqlQuery(sql,data,res,function(result){
      success(res,{count:result[0]['count']});
    });
  } else {
    sql += " ORDER BY date DESC";
  
    if(req.query.limit){
      sql += " LIMIT ?";
      data.push(parseInt(req.query.limit));
    }
  
    sqlQuery(sql,data,res,function(result){
      success(res,{trades:result});
    });
  }
});

// Handle all non-existant API endpoints
app.get('/api/*', function(req, res) {
  var cmd = req.originalUrl.split('/api/',2)[1];
  error(res,'Endpoint does not exist: ' + cmd);
});

// application -------------------------------------------------------------

// app.get('*', function(req, res) {
  // res.sendFile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });

// scheduler ---------------------------------------------------------------
// every 5 minutes
schedule.scheduleJob('*/5 * * * *', function(){
  // Save the current coin values
  var sql = "SELECT * FROM coin";
  var data = [];
  sqlQuery(sql,data,null,function(coins){
    coins.forEach(coin => {
      var sql = "INSERT INTO coin_value (coin_id,value) VALUES (?,?)";
      var data = [coin.id,coin.value];
      sqlQuery(sql,data,null,function(result){});

      // save coin's value from 24h ago
      var sql = "SELECT value FROM coin_value WHERE coin_id=? ORDER BY abs(date-(now()-INTERVAL 24 HOUR)) LIMIT 1";
      var data = [coin.id];
      sqlQuery(sql,data,null,function(coinValues){
        var value24h = 0;
        if(coinValues.length > 0) value24h = coinValues[0].value;
        var sql = "UPDATE coin SET value24h=? WHERE id=?";
        var data = [value24h,coin.id];
        sqlQuery(sql,data,null,function(result){});
      });
    });
  });

  // Save the current user values
  var sql = "SELECT * FROM user";
  var data = [];
  sqlQuery(sql,data,null,function(users){
    for(var i = 0; i < users.length; i++){
      // Calculate the value of the user
      var user = users[i];
      var value = user.funds;
      var sql = "SELECT c.value,uc.amount FROM user_coin uc JOIN coin c ON c.id = uc.coin_id WHERE uc.user_id=?";
      var data = [user.id];
      sqlQuery(sql,data,null,function(coins){
        for(var j = 0; j < coins.length; j++){
          var coin = coins[j];
          value += (coin.value*coin.amount);
        }

        // Save the value
        var sql = "INSERT INTO user_value (user_id,value) VALUES (?,?)";
        var data = [user.id,value];
        sqlQuery(sql,data,null,function(result){});

        // Update the user's current value
        var sql = "UPDATE user SET value=? WHERE id=?";
        var data = [value,user.id];
        sqlQuery(sql,data,null,function(result){});

        // save user's value from 24h ago
        var sql = "SELECT value FROM user_value WHERE user_id=? ORDER BY abs(date-(now()-INTERVAL 24 HOUR)) LIMIT 1";
        var data = [user.id];
        sqlQuery(sql,data,null,function(userValues){
          var value24h = 0;
          if(userValues.length > 0) value24h = userValues[0].value;
          var sql = "UPDATE user SET value24h=? WHERE id=?";
          var data = [value24h,user.id];
          sqlQuery(sql,data,null,function(result){});
        });
      });
    }
  });
});