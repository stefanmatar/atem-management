var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const Atem = require('atem');
const myAtemDevice = new Atem('192.168.2.15');


myAtemDevice.on('connectionStateChange', function(state) {
    console.log('state', state);
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
            try {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            } catch (e) {}
        });
    });

    function online(cam) {
        try {
            ws.send(cam + '+o');
        } catch (e) {}
    }
    function preview(cam) {
        try {
            ws.send(cam + '+p');
        } catch (e) {}
    }

    myAtemDevice.on('previewBus', function(state) {
        preview(state)
    });
    myAtemDevice.on('programBus', function(state) {
        online(state)
    });

});


var ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function (event) {
    try {
        request = event.data.split("+");
        if(request[1] === "o") {
            console.log('Cam ' + request[0] + " is online.")
        } else {
            console.log('Cam ' + request[0] + " is on preview.")
        }
        console.log();
    } catch (e) {
    }
};

ws.onerror = () => {
    console.log("A client died.");
};




module.exports = app;
