--------now------------
change structure of events to have owneruid/ownername/ownerimageurl inside it
    but then we will need to update owner's name and ownerimageurl every time it's updated

events:coordinates,duration,emoji,title,description,dateStarts,imageurl,ownerName,ownerImageurl

switch to google maps
fix the maxDistance thing
webhook:
    what happens when fb token expires for the webhook?
    check blocks
    check unfriending
    check adding friends
    check someone just signed up, do other people get notifications? does that person get notifications?
    if other people get notifications when someone just signs up to the app, we would need to make an upsert because we 

push notifications: handle errors: report to Logger when it doesn't work uing .on('error')
==================
Port Forwarding Instructions: http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2

problem: when a new user is added, we can't know if it's the webhook that will come first  or if it's the /AddUser that will come first, so both of them will need to check if the user was added already if not they will need to add him to the DB

* I need to know if the user get all friends from the beginning in the FB_webhook. so would we need to add the friends or not?
====================
-----------------later------------------
DO FIRST THE STUFF THAT DON'T REQUIRE CHANGING CLIENT SIDE

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