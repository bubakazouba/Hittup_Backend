--------now------------
switch to google maps

add this everywhere after I merge in /invite >> if(!mongodb.db) {return callback({"success": "false", "error": "DB not connected"});}

add upsert for /join

make sure when we query FB that we don't need to go through the "paging" url to go to the next page, i.e make sure it gets all the users in one page

load balancer
push notificaitons:
    whenever a user joins ur hittup
    whenever a hittup is added
    for when a user is invited
    when a hittup has been deleted if a user was joined or invited

* add error handling if server didn't receive anything
* ask if the fbtoken would update automatically?
* /inviteFriends: error handling check if hittup exists first
* what if I was trying to insert a user with all his fb friends then one was missing because he signed up at the same time and 
   wasn't inserted yet in the DB


* make sure server returns json everywhere

* don't make getAllHittups serial
* write in 2 databases and auto delete both friend and hittups when they are done: http://blog.mehdivk.net/auto-delete-mongodb-documents-using-expiry-date/
==================
Port Forwarding Instructions: http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2

problem: when a new user is added, we can't know if it's the webhook that will come first  or if it's the /AddUser that will come first, so both of them will need to check if the user was added already if not they will need to add him to the DB

* I need to know if the user get all friends from the beginning in the FB_webhook. so would we need to add the friends or not?
====================


-----------------later------------------
1 hide coordinates of user whenever he is retrieved from DB in anyway
2 whenever we return uid of hittup to clientside, name it uid instead of _id
3 log all requests node
4 move any heavy lifting from serverside to client side so we don't have to pay a lot for servers
    - converting low quality image
    - google maps requests
5 testing everywhere
6 jenkins
7 let the image upload as in form not json so we can upload a file (more efficient)

good design practices mongodb??

check character limits on server side too
>>>>>>>>>>>>>>>>>android a day every week
security:
    add some basic security for updateHittup/deleteHittup, to make sure the user sending is the owner  
    hide uid's for users when returning to clientside, and for /InviteFriends invite by fbid's

cleaning up the project:
    - reindent all code to be 4 spaces
    - add a CONTRIBUTING.md with all the naming conventions
    - make a _config
        * lel port
        * mongoose.set('debug', true)
        * debugging on console
        * use a different testing DB for everyone of us

efficiency:
    * change my getAvailableHitups to use the function rohit found $elemMatch
    * use upsert for /adduser and see if he was already there (check if that would work tho) (http://stackoverflow.com/questions/13955212/check-if-mongodb-upsert-did-an-insert-or-an-update)

use redis
use aggregation so I don't need to make 2 queries in getAllFriendHittups: https://docs.mongodb.org/manual/aggregation/