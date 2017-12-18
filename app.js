
// Altenen Bot
// Remake in node.js

var axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Modify Here
bot = new TelegramBot("YOUR BOT TOKEN", {polling: false});
var LoginUsername = "YOUR USERNAME";
var LoginPassword = "YOUR PASSWORD";
var ChatID = -1001121096065;
var Header = "💳 _New Credit Card from_ *Altenen*";
var Footer = "💣 @Cardify";

var Cookies = ""; // Don't change
var LatestThreadID = "0"; // Don't change
var Logged = false; // Don't change
var savedIDs = []; // Don't change

var first = "";
console.log("\r\n" + "Starting ATNBot by @TheFamilyTeam...");
function Login(username, password) {
  axios.get("http://altenen.com").then(function (request) {
    if (request.data.includes('<body>Loading...')) {
      var key = request.data.split('toNumbers("')[1].split('"')[0];
      var iv = request.data.split('toNumbers("')[2].split('"')[0];
      var input = request.data.split('toNumbers("')[3].split('"')[0];
      axios.get("http://extranet.cryptomathic.com/aescalc/index?key=" + key + "&iv=" + iv + "&input=" + input + "&mode=cbc&action=Decrypt&output=").then(function (AESapi) {
        bpckey = AESapi.data.split('name="output" rows="10">')[1].split('<')[0].toLowerCase();
        var querystring = require('querystring');
        var datas = querystring.stringify({
              "vb_login_username": LoginUsername,
              "vb_login_password": LoginPassword,
              "cookieuser": 1,
              "s": null,
              "securitytoken": "guest",
              "do": "login",
              "vb_login_md5password": null,
              "vb_login_md5password_utf": null
          });
        console.log("Your resolved BPC -> " + bpckey);
        axios({
          method: 'post',
          url: 'http://altenen.com/login.php?do=login',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "BPC=" + bpckey + "; ",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.24 Safari/537.36',
            "Content-Type": 'application/x-www-form-urlencoded'
          },
          data: datas
        }).then(response => {
          console.log(response.headers["set-cookie"]);
          Cookies = response.headers["set-cookie"];
          Cookies.push("BPC=" + bpckey + "; ");
          Logged = true;
          LatestThreadID = getLastThread();
        }).catch(error => {
          throw(error);
        })
      })
    }
    else {

    }
  });
}

function getLastThread() {
  axios({
    url: 'http://altenen.com/forumdisplay.php?f=41',
    method: 'get',
    headers: {
      'Cookie': Cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.24 Safari/537.36'
    }
  }).then(response => {
    var thead = response.data.split('<td class="thead" colspan="10" style="height: 15px;">')[1];
    var lastthrid = thead.split('<a href="showthread.php?t=')[1].split('"')[0];
    console.log(lastthrid);
    if (!savedIDs.includes(lastthrid)) {
      first = Date.now();
      getThread(lastthrid);
    } else {
      getLastThread();
    }
  })
}

function getThread(threadID) {
  savedIDs.push(threadID);
  LatestThreadID = threadID;
  axios({
    url: 'http://altenen.com/showthread.php?t=' + threadID,
    method: 'get',
    headers: {
      'Cookie': Cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.24 Safari/537.36'
    }
  }).then(response => {
    var Title = "✍️ Title: " + response.data.split('<title>')[1].split('<')[0];
    var Author = "✍️ Author: " + response.data.split('<span style="font-size: 9pt">')[1].split('<')[0];
    var Content = "✍️ Content: \r\n" + response.data.split('class="vb_postbit">')[1].split('</div>')[0].replace('<br />', ' ').replace('\r\n\r\n', '\r\n');
    var Time = Date.now() - first;
    Time = Time / 1000;
    bot.sendMessage(ChatID, Header + "\r\n\r\n" + Title + "\r\n" + Author + "\r\n" + Content + "\r\n" + "⏰ Time spent: " + Time + "s\r\n" + Footer, {
      parse_mode: "Markdown"
    });
  })
  getLastThread();
}

Login();
