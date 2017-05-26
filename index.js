'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);

        // "fulfillment": {
        //     "speech": " action: search_artist",
        //     "source": "berniewebhook",
        //     "displayText": " action: search_artist",
        //     "messages": [
        //     {
        //       "type": 0,
        //       "speech": " action: search_artist"
        //     },
        //     {
        //       "type": 0,
        //       "speech": " MDR"
        //     }
        //     ],
        //     "data": {
        //     "hologramme": "lol",
        //     "shit": true
        //     }
        // }

        return res.json({
            speech: "speech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeechspeech speech speech speech speechspeechspeechspeechspeechspeech speechspeechspeech",
            displayText: speech,
            data: {
                "hologramme": "lol",
                "shit": true
            },
            messages: [
                {
                  "type": 0,
                  "speech": " action: search_artist"
                },
                {
                "type": 0,
                "speech": " MDR"
                }
            ],
            source: 'berniewebhook'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
