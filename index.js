const express = require('express');
const CronJob = require('cron').CronJob;
const config = require('./config');
const twiti = require('twit');

const twit = new twiti(config);
const app = express();


app.get('/', (req, res) => {
    
    new CronJob('*/15 * * * *', function() {
        let params = {
            q: 'evleniyorum',
            count: 10,
            result_type: 'recent',
        }
        twit.get('search/tweets', params, (err, data, response) => {
            let tweets = data.statuses
            var sayac = 0;
            for (let dat of tweets) {
                console.log(`sayac degeri : ${sayac}`)
                let username = dat.user.screen_name
                let tweetID = dat.id_str
                let reply = dat.in_reply_to_status_id_str
                if (!err && reply === null && sayac === 0) {
                    console.log(`sayac degeri : ${sayac} girdi`)
                    twit.post('statuses/update', {
                        status: `@${username} düğününde dijital davetiye oluşturmaya ne dersin? Hemen örnek bir davetiyeyi incele: davetiyem.co/damatgelin`,
                        in_reply_to_status_id: tweetID
                    }, function (err, data, response) {
                        if (err) {
                            console.log("error")
                        } else {
                            sayac = 1;
                            console.log(`sayac : ${sayac} degeri bu ve ${username} tweet atıldı`)
                            twit.post('favorites/create', {
                                id: tweetID
                            }, function (errorr, dataa, responsee) {
                                if (errorr) {
                                    console.log('CANNOT BE FAVORITE... Error');
                                }
                                else {
                                    console.log('FAVORITED... Success!!!');
                                }
                            })
                            console.log(username + ' tweeted!')
                        }
                    })
                }
            }
        })
    }, null, true, 'Europe/Istanbul');


})

app.listen(process.env.PORT || 3000, () => console.log("server ayakta"))
