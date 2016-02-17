--------now------------
fix the facebook module, in case a user doesn't haveany fbfriends, it will need the new code i added in the scraper, add it there and test if it works

scraper:
    test the code I have (didn't commit yet)
    change them to be the same DB
    http://localhost:3000/events?lat=40.710803&lng=-73.964040&distance=1000&access_token=1645233332355281|dUU_R1ksZlyDlpZtHXjVRbmSG8I

webhook:
    * error handling: when the access token expires
    * view all the "//log error" comments


push notifications:
    handle errors: report to Logger when it doesn't work uing .on('error')
    notify friends around
-----------------later------------------
DO FIRST THE STUFF THAT DON'T REQUIRE CHANGING CLIENT SIDE

right now I have 3 db.js and 2 facebook.js and some models in the 3 repos I have, webhook/scraper/hittup_backend, i need to fix that
switch to google maps
hide coordinates of user whenever he is retrieved from DB in anyway, hide deviceTokens
whenever we return uid of hittup to clientside, name it uid instead of _id
log all requests node
move any heavy lifting from serverside to client side so we don't have to pay a lot for servers
    - converting low quality image
    - google maps requests
testing everywhere
jenkins
let the image upload as in form not json so we can upload a file (more efficient)
don't make getAllHittups serial
actually delete hittups when they're done using TTL, and automatically calculate statistics --> add all hittups marked as deleted for statistics and delete them

write tests

webhook:
    * problem: when a new user is added, we can't know if it's the webhook that will come first  or if it's the /AddUser that will come first.
        -> solution: delay everything by 20 seconds
    * when a user gets deleted, make sure to remove him from database (how i'm gonna know if a user was deleted, token expired??)
    * make it really efficient by
        - gathering all requests in the last minute and searching through DB at once
        - making one request to DB updating all users at once
        - define the callback function one time instead of doing it in the for loop
        - instad of finding the user, then finding his friends uids then updating him by another query, we can user the updatedUser to udpate again, i tihnk it'd be more efficient


good design practices mongodb??

check character limits on server side too
>>>>>>>>>>>>>>>>>android a day every week
security:
    add some basic security for updateHittup/deleteHittup, to make sure the user sending is the owner  
    hide uid's for users when returning to clientside, and for /InviteFriends invite by fbid's
    hide deviceToken

cleaning up the project:
    - reindent all code to be 4 spaces
    - add a CONTRIBUTING.md with all the naming conventions
    - make a _config
        * lel port
        * mongoose.set('debug', true)
        * debugging on console
        * use a different testing DB for everyone of us

continuous integration server (suggestion: jenkins)
remote server deployment tool (suggestion: capistrano)

efficiency:
    * change my getAvailableHitups to use the function rohit found $elemMatch
    * find a way to populate and update at the same time for /joinHitup
    * use upsert for /adduser and see if he was already there (check if that would work tho) (http://stackoverflow.com/questions/13955212/check-if-mongodb-upsert-did-an-insert-or-an-update)

use redis
use aggregation so I don't need to make 2 queries in getAllFriendHittups: https://docs.mongodb.org/manual/aggregation/