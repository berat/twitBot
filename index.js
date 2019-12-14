const cron = require('node-cron')
const express = require('express')
const config = require('./config');
const twiti = require('twit');

const twit = new twiti(config);
const app = express();
const port = 3000
// setup cron job
cron.schedule("*/20 * * * *", () => {
    let params = {
        q: 'evleniyorum',
        count: 15,
        result_type: 'recent',
    }
    twit.get('search/tweets', params, (err, data, response) => {
        let tweets = data.statuses
        var sayac = 0;
        for (let dat of tweets) {
            let username = dat.user.screen_name
            let tweetID = dat.id_str
            let reply = dat.in_reply_to_status_id_str
            if (!err && reply === null && sayac === 0) {
                twit.post('statuses/update',
                    {
                        status: `@${username} Düğününde dijital davetiye oluşturmaya ne dersin? Hemen örnek bir davetiyeyi incele: davetiyem.co/damatgelin . Seni aramızda görmekten mutluluk duyarız.`,
                        in_reply_to_status_id: tweetID
                    }
                )
                    .catch(() => {
                        console.log("error")
                    })
                    .then(() => {
                        sayac = 1;
                        console.log(`sayac : ${sayac} degeri bu ve ${username} tweet atıldı`)
                        console.log(username + ' tweeted!')
                    })
                twit.post('favorites/create',
                    {
                        id: tweetID
                    }
                )
                    .catch(() => {
                        console.log('CANNOT BE FAVORITE... Error');
                    })
                    .then(() => {
                        console.log('FAVORITED... Success!!!');
                    })

            }
        }
    })
})
// configure routes
app.get("/", (req, res) => {
    res.send("15 dakikada bir bot çalışıyor")
})
// start the server
app.listen(port, () => console.log(`Server: PORT ${port} active`))