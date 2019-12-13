const express = require('express');
const config = require('./config');
const twiti = require('twit');

const twit = new twiti(config);
const app = express();


app.get('/', (req, res) => {

    function retweet() {
        let params = {
            q: 'evleniyorum',
            count: 10,
            result_type: 'recent',
        }
        twit.get('search/tweets', params, (err, data, response) => {
            let tweets = data.statuses
            console.log(data)
            var sayac = 0;
            for (let dat of tweets) {
                let username = dat.user.screen_name
                let tweetID = dat.id_str
                let reply = dat.in_reply_to_status_id_str
                if (!err && reply === null && sayac === 0) {
                    twit.post('statuses/update', {
                        status: `@${username} Daha önce dijital davetiye oluşturmayı denedin mi? Hemen incelemek için aşağıdaki linke tıkla: davetiyem.co/damatgelin`,
                        in_reply_to_status_id: tweetID
                    }, function (err, data, response) {
                        if (err) {
                            console.log("error")
                        } else {
                            sayac = 1;
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
    }
    setInterval(retweet, 900000)


})

app.listen(process.env.PORT || 3000, () => console.log("server ayakta"))
