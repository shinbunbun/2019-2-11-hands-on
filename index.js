// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
// パラメータ設定
const line_config = {
    channelAccessToken: '', //AccessTokenをセット
    channelSecret: '' //channelSecretをセット
};

// Webサーバー設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);
    // イベントオブジェクトを順次処理。
    req.body.events.map((event) => {
        //メッセージタイプごとに関数を分ける
        switch (event.type) {
            case "message":
                //messageイベントの場合
                message(event);
                break;
            /*case "postback":
                //postbackイベントの場合
                postback(event);
                break;
            case "join":
                //joinイベントの場合
                join(event);
                break;
            case "leave":
                //leaveイベントの場合
                leave(event);
                break;*/
        }
    });
});

const message = (e) => {
    //テキストではないメッセージ（画像や動画など）が送られてきた場合はコンソールに「テキストではないメッセージが送られてきました」と出力する
    if (e.message.type != "text") {
        console.log("テキストではないメッセージが送られてきました");
        return;
    }

    // ユーザーから送られてきたメッセージ
    const userMessage = e.message.text;

    //ユーザーから送られてきたメッセージをコンソールに出力する
    console.log(`メッセージ：${userMessage}`);

    //ユーザーにメッセージを返信する
    bot.replyMessage(e.replyToken, {
        type: "text",
        text: userMessage
    });
};