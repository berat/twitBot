const config = require('./config');
const twiti = require('twit');

const twit = new twiti(config);


// 

function retweet() {
    let params = {
        q: 'evleniyorum',
        count: 1
    }
    twit.get('search/tweets', params, (err, data, response) => {
        let tweets = data.statuses
        let username = tweets[0].user.screen_name
        let tweetID = tweets[0].id_str
        let reply = tweets[0].in_reply_to_status_id_str
        let sayac = 0;
        console.log(tweets[3].id_str)
        if (!err && reply === null && sayac === 0) {
            twit.post('statuses/update', {
                status: `@${username} daha önce dijital davetiye oluşturmayı denedin mi? Hemen incele davetiyem.co/damatgelin`,
                in_reply_to_status_id: tweetID
            }, function (err, data, response) {
                if (err) {
                    console.log(err)
                } else {
                    sayac = 1;
                    console.log(data.text + ' tweeted!')
                }
            })

        }
    })
}
retweet()