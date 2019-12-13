const config = require('./config');
const twiti = require('twit');

const twit = new twiti(config);


// 
while (1) {
    function retweet() {
        let params = {
            q: 'evleniyorum',
            count: 1,
            result_type: 'recent',
        }
        twit.get('search/tweets', params, (err, data, response) => {
            let tweets = data.statuses
            let username = tweets[0].user.screen_name
            let tweetID = tweets[0].id_str
            console.log(tweets)
            let reply = tweets[0].in_reply_to_status_id_str
            let sayac = 0;
            console.log(tweets[0].id_str)
            if (!err && reply === null && sayac === 0) {
                twit.post('statuses/update', {
                    status: `@${username} Daha önce dijital davetiye oluşturmayı denedin mi? Hemen incelemek için aşağıdaki linke tıkla: davetiyem.co/damatgelin`,
                    in_reply_to_status_id: tweetID
                }, function (err, data, response) {
                    if (err) {
                        console.log(err)
                    } else {
                        sayac = 1;
                        twit.post('favorites/create', {
                            id: tweetID
                        }, function (err, data, response) {
                            if (err) {
                                console.log('CANNOT BE FAVORITE... Error');
                            }
                            else {
                                console.log('FAVORITED... Success!!!');
                            }
                        })
                        console.log(data.text + ' tweeted!')
                    }
                })
            }
        })
    }
}
retweet()