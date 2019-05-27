
// Altenen Bot
// Remake in node.js

const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
var querystring = require('querystring');
const { spawn } = require('child_process');

bot = new TelegramBot("YOUR BOT TOKEN", {polling: false});
var Header = "💳 _New Credit Card from_ *Altenen*";
var Footer = "💣 @Cardify2";

var Cookies = ""; // Don't change
var LatestThreadID = "0"; // Don't change
var Logged = false; // Don't change
var savedIDs = []; // Don't change

var first1 = true
var lastgroupid = ""

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

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
    uri: "https://altenen.nz/activity/get",
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
        var Content = "✍️ Content: \r\n\r\n" + post['description'];
        console.log("New CC found, posting " + post['nodeid'])
        bot.sendMessage(-1001338461858, Header + "\r\n\r\n" + Title + "\r\n" + Author + "\r\n" + Content.replace("<br />", " ") + "\r\n\r\n" + "⏰ Time spent: " + Time + "s\r\n" + Footer, {
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
