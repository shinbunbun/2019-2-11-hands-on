'use strict';

// モジュールのインポート
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const express = require('express');
// パラメータ設定
const line_config = {
    channelAccessToken: '', //AccessTokenをセット
    channelSecret: '' //channelSecretをセット
};

// Webサーバー設定
const PORT = process.env.PORT || 3000;
const app = express();

console.log(`Server running at ${PORT}`);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// ルーター設定
app.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);
    // イベントオブジェクトを順次処理。
    req.body.events.map((event) => {
        let message;
        //イベントタイプごとに関数を分ける
        switch (event.type) {
            case "message":
                //messageイベントの場合
                message = messageFunc(event);
                break;
            /*case "postback":
                //postbackイベントの場合
                message = postbackFunc(event);
                break;
            case "join":
                //joinイベントの場合
                message = joinFunc(event);
                break;
            case "leave":
                //leaveイベントの場合
                message = leaveFunc(event);
                break;*/
        }

        //ユーザーにメッセージを返信する
        if (message != undefined) {
            bot.replyMessage(event.replyToken, message);
        }
    });
});

const messageFunc = (e) => {
    //テキストではないメッセージ（画像や動画など）が送られてきた場合はコンソールに「テキストではないメッセージが送られてきました」と出力する
    if (e.message.type != "text") {
        console.log("テキストではないメッセージが送られてきました");
        return;
    }

    // ユーザーから送られてきたメッセージ
    const userMessage = e.message.text;

    //ユーザーに返信するメッセージを作成
    let message;
    message = {
        type: "text",
        text: userMessage
    };

    //「こんにちは」というメッセージが送られてきたら「Hello World」と返信して、「おはよう」と送られてきおたら「Good Morning!!」と返信するメッセージを作成
    /*if (userMessage == "こんにちは") {
        message = {
            type: "text",
            text: "Hello World"
        };
    } else if (userMessage == "おはよう") {
        message = {
            type: "text",
            text: "Good Morning!!"
        };
    }*/

    //ユーザーから送られてきたメッセージをコンソールに出力する
    console.log(`メッセージ：${userMessage}`);

    //送信するメッセージを32行目に返す
    return message;
};

//サーバー起動
app.listen(port, () => console.log(`listening on ${port}`));
