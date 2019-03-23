var express = require('express');
var router = express.Router();


const processSomething = callback => {
    setTimeout(callback, 20000);
}

router.post("/hook", (req, res, next) => {
    processSomething(() => {
        const webhookUrl = req.params.url;
        console.log('Client connected..');

        socket.on('auth',  (data) => {
            console.log(data);
        });
        /**
         * Your Kafka action or something else. There
         * you should collect info about success or
         * fail of client's action.
         */

        /**
         * Your API call to webhookUrl with
         * your defined body about status of event
         */
    });

    res.status(200).send('OK')
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ATEM Cams' });
});

module.exports = router;
