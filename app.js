
// Altenen Bot
// Remake in node.js

const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
var querystring = require('querystring');
const { spawn } = require('child_process');
var net = require('net');

bot = new TelegramBot("YOUR BOT TOKEN", {polling: false});
var Header = "💳 _New Credit Card from_ *Altenen*";
var HeaderC = "💳 _New Credit Card from_ *Chknet*";
var Footer = "💣 @Cardify2";
var channelid = -1001338461858;

var ircname = Math.random().toString(36).substr(2, 5);

var Cookies = ""; // Don't change
var LatestThreadID = "0"; // Don't change
var Logged = false; // Don't change
var savedIDs = []; // Don't change

var first1 = true
var lastgroupid = ""

var server = { host: "51.254.102.137", port: 6667 }
var host = "51.254.102.137";
var port = 6667;

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function markdw(cc) {
    var tr = cc;
    tr = tr.replace(/[0-9]+/g, "`" + "$&" + "`")
    return tr;
}

var client = new net.Socket();
client.connect(port, host, function () {
    console.log("\r\n + Connected to irc.chknet.eu 6667");
    client.write("NICK " + ircname + "\n")
    client.write("USER " + ircname + " * * :" + ircname + "\n")
});

client.on('data', function(data) {
    msg = data.toString();
    if (data.toString().startsWith("PING")) {
        var sp = data.toString().split(' ');
        client.write("PONG " + sp[1]);
        console.log(" + Replied to PING correctly. (irc.chknet.eu)")
    } else {
        if (msg.includes("chkViadex") && msg.includes("APROVADA")) {
            var Author = ""
            var Content = ""
            try {
                Author = "✍️ Author: " + msg.split('<')[1].split('>')[0];
                Content = "✍️ Content: \r\n\r\n" + markdw(msg.split('> ')[1].replace(msg.split('A')[0], ""));
                if (Content.includes("TESTADO!"))
                    return;
            } catch (err) { 
                return;
            }
            console.log(" + New CC found, posting from Chknet");
            bot.sendMessage(channelid, HeaderC + "\r\n\r\n" + Author + "\r\n" + Content.replace("3A", "A").substring(1) + "\r\n✅ This credit card is *LIVE.*\r\n" + Footer, {
                parse_mode: "Markdown"
            }).then(function (msg) { });
        }
    }
});

client.on('error', function() {});

client.on('close', function() {
    console.log(' + Connection closed with Chknet, trying to reconnect...');
    setTimeout(function () {
        client.connect(port, host, function () {
            console.log("\r\n + Connected to irc.chknet.eu 6667");
            client.write("NICK " + ircname + "\n")
            client.write("USER " + ircname + " * * :" + ircname + "\n")
        });
    }, 5000);
});

client.on('disconnect', function() {
    console.log(' + Connection closed with Chknet, trying to reconnect...');
    setTimeout(function () {
        client.connect(port, host, function () {
            console.log("\r\n + Connected to irc.chknet.eu 6667");
            client.write("NICK " + ircname + "\n")
            client.write("USER " + ircname + " * * :LXVII\n")
        });
    }, 5000);
});

var first = "";
console.log("\r\nStarting ATNBot by @TheFamilyTeam...");

var pass = {
    "filters[nodeid]": '45',
    "filters[view]": 'activity',
    "filters[per-page]": '1',
    "filters[pagenum]": '1',
    "filters[maxpages]": '20',
    "filters[userid]": '0',
    "filters[showChannelInfo]": '1',
    "filters[filter_time]": 'time_today',
    "filters[filter_show]": 'vBForum_Text',
    "filters[filter_new_topics]": '1',
    "isAjaxTemplateRender": 'true',
    "isAjaxTemplateRenderWithData": 'true',
    "securitytoken": 'guest'
}
strn = querystring.stringify(pass);

idn = 0;
function getLastThread() {
  try {
  idn++;
  console.log("Searching for a new thread... #" + idn);
  first = Date.now();
  request.post({
    uri: "https://altenens.org/activity/get",
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        "Content-Type": 'application/x-www-form-urlencoded'
    },
    body: strn,
    method: 'POST'
  }, function (err, res, body) {
    try {
        rep = JSON.parse(body)['nodes'];
    } catch (err) {
        getLastThread();
        return;
    }
    post = rep[Object.keys(rep)[0]];
    var Time = Date.now() - first;
    Time = Time / 1000;
    if (!savedIDs.includes(post['nodeid'])) {
        savedIDs.push(post['nodeid']);
        var Title = "✍️ Title: " + post['title'];
        var Author = "✍️ Author: " + post['authorname'];
        var Content = "✍️ Content: \r\n\r\n" + markdw(post['description']);
        console.log("New CC found, posting " + post['nodeid'])
        bot.sendMessage(channelid, Header + "\r\n\r\n" + Title + "\r\n" + Author + "\r\n" + Content.replace("<br />", " ") + "\r\n\r\n" + "⏰ Time spent: " + Time + "s\r\n" + Footer, {
          parse_mode: "Markdown"
        });
    } else {}
    setTimeout(getLastThread, 1000);
  })
  } catch (err) {
    console.log("Error, waiting 8 seconds until next request...");
    setTimeout(getLastThread, 8000);
  }
}

getLastThread();
