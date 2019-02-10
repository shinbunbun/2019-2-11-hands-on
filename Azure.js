const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
// パラメータ設定
const line_config = {
    channelAccessToken: '', //AccessTokenをセット
    channelSecret: '' //channelSecretをセット
};

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

module.exports = async function (context, req) {

    // イベントオブジェクトを順次処理。
    req.body.events.map((event) => {
        //メッセージタイプごとに関数を分ける
        switch (event.type) {
            case "message":
                //messageイベントの場合
                message(event, context);
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

    context.res = {
        status: 200,
    };

};

const message = (e, context) => {
    //テキストではないメッセージ（画像や動画など）が送られてきた場合はコンソールに「テキストではないメッセージが送られてきました」と出力する
    if (e.message.type != "text") {
        context.log("テキストではないメッセージが送られてきました");
        return;
    }

    // ユーザーから送られてきたメッセージ
    const userMessage = e.message.text;

    //ユーザーから送られてきたメッセージをコンソールに出力する
    context.log(`メッセージ：${userMessage}`);

    //ユーザーにメッセージを返信する
    bot.replyMessage(e.replyToken, {
        type: "text",
        text: userMessage
    });
};