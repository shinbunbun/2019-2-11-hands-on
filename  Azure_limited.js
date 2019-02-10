module.exports = function (context, event) {
    const https = require("https");
    const accessToken = '';
    const events = event.body.events;
    let message;
    events.forEach(function (event) {
        switch (event.type) {
            case "message":
                //messageイベントの場合
                message = messageFunc(context, event);
                break;
            /*case "postback":
                //postbackイベントの場合
                postback(context, event);
                break;
            case "join":
                //joinイベントの場合
                join(context, event);
                break;
            case "leave":
                //leaveイベントの場合
                leave(context, event);
                break;*/
        }
        if (message != undefined) {
            context.log(message);
            const postData = {
                "replyToken": event.replyToken,
                "messages": [message]
            };
            const postDataStr = JSON.stringify(postData)
            const options = {
                "host": "api.line.me",
                "path": "/v2/bot/message/reply",
                "method": "post",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken,
                    'Content-Length': Buffer.byteLength(postDataStr)
                }
            };
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    context.log('BODY: ' + chunk);
                });
            });
            req.on('error', (e) => {
                context.log('problem with request: ' + e.message);
            });
            req.write(postDataStr);
            req.end();
            context.res = {
                status: 200,
                body: {
                    message: 'succeed',
                }
            };
        }
        context.done();
    });
};