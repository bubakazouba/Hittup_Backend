# Hittup-Backend

# Production
```
npm install
forever start server.js
```
to stop server: `forever stop server.js`

# Development

default port is 8080

```
npm install
npm start
```

# Routes

## FriendAndEventHittups/GetAllHittups
### POST format:
same as `/GetHittups`
### Response format:
```
{"success":true, "hittups":[
  {
    "_id": "<uid>",
    "title": "<title>",
    "isPrivate": <boolean>,
    "duration": <seconds>,
    "dateCreated": <seconds>,
    "images": [ {
		"lowQualityImageurl": "<full url>",
		"highQualityImageurl": "<full url>"
    },...],
    "usersJoined": [
       "_id": "<uid>",
       "fbid": "<fbid>",
       "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "usersInvited": [ {
       "_id": "<uid>",
       "fbid": "<fbid>",
        "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "loc": {
      "state": "<state>",
      "city": "<city>",
      "type": "Point",
      "coordinates": [<long>, <lat>],
      "lastUpdatedTime": <Int>
    }
  }
  , ...
]
}
```

## (Friend/Event)Hittups/UnjoinHittup
### POST format:
```
{
	"hittupuid": "<uid>",
	"useruid": "<uid>"
}
```
### Response format:
```
{"success":true}
```
or

```
{"success":false, "error":"<error message>"}
```

## (Friend/Event)Hittups/RemoveHittup
### POST format:
```
{
	"hittupuid": "<uid>",
	"owneruid": "<uid>"
}
```
### Response format:
```
{"success":true}
```
or

```
{"success":false, "error":"<error message>"}
```


## FriendHittups/GetHittup
### POST format:
the first image is the image posted by the host

```
{
	"uid": "<uid>"
}
```
### Response format:
```
{"success":true, "hittup": {
    "_id": "<uid>",
    "owner": {
    	"firstName": "<firstname>",
    	"lastName: "<lastName>",
    	"fbid": "<fbid>"
    },
    "title": "<title>",
    "isPrivate": <boolean>,
    "duration": <seconds>,
    "dateCreated": <seconds>,
    "images": [ {
		"lowQualityImageurl": "<full url>",
		"highQualityImageurl": "<full url>"
    },...],
    "usersJoined": [ {
       "_id": "<uid>",
       "fbid": "<fbid>",
       "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "usersInvited": [ {
       "_id": "<uid>",
       "fbid": "<fbid>",
        "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "loc": {
      "state": "<state>",
      "city": "<city>",
      "type": "Point",
      "coordinates": [<long>, <lat>],
      "lastUpdatedTime": <Int>
    }
  }
}
```


## EventHittups/GetHittup
the first image is the image posted by the host
### POST format:
```
{
	"uid": "<uid>"
}
```
### Response format:
```
{"success":true, "hittup": {
    "_id": "<uid>",
    "owner": {
    	"name": "<name>",
    	"imageurl": "<url>"
    },
    "title": "<title>",
    "isPrivate": <boolean>,
    "duration": <seconds>,
    "dateStarts": <seconds>,
    "description": "<description >",
    "dateCreated": <seconds>,
    "images": [ {
		"lowQualityImageurl": "<full url>",
		"highQualityImageurl": "<full url>"
    },...],
    "usersJoined": [ {
       "_id": "<uid>",
       "fbid": "<fbid>",
       "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "usersInvited": [ {
       "_id": "<uid>",
       "fbid": "<fbid>",
        "firstName": "<firstName>",
        "lastName": "<lastName>",
        },
        ...
    ],
    "loc": {
      "state": "<state>",
      "city": "<city>",
      "type": "Point",
      "coordinates": [<long>, <lat>],
      "lastUpdatedTime": <Int>
    }
  }
}
```


## FriendHittups/GetAllHittups
gets all the hittups created by the user or by any of his friends
### POST format:

```
{ 
    "uid": "<uid>"
}
```

### Response format:
```
[ FriendHittups ] //just like the one in GetHittup
```

## EventHittups/GetAllHittups
get all events starts within the next 24 hours
### POST format:

```
{ 
    "uid": "<uid>"
}
```

### Response format:
```
[ EventHittups ] //just like the one in GetHittup
```

## (Friend/Event)Hittups/JoinHittup
### POST format:

```
{
    "owneruid": "<uid>",
    "hittupuid": "<uid>"
}
```
### Response format:
```
{"success":true}
```
or

```
{"success":false, "error":"<error message>"}
```

## (Friend/Event)Hittups/GetInvitations
POST format:

```
{"success":false, "error":"<error message>"}
```


## Hittups/GetInvitations
### POST format:

```
{
    "uid": "<uid>"
}
```
### Response format:
```
{
    "owner": {
        firstName: "<firstName>",
        lastName: "<lastName>"
    },
    "title": "<title>",
    "isPrivate": <boolean>,
    "duration": "<duration>",
    "dateCreated": "<dateCreated>",
    "usersJoined": [
       {
            "_id": "<uid>",
            "fbid": "<fbid>",
            firstName: "<firstName>",
            lastName: "<lastName>"
        }
        ],
    "usersInvited": [
        {
            "_id": "<uid>",
            "fbid": "<fbid>",
            firstName: "<firstName>",
            lastName: "<lastName>"
        }
    ],
    "loc": {
        "state": "<state>",
        "city": "<city>",
        "type": "<Point>",
        "coordinates":[<long>,<lat>],
        "lastUpdatedTime": <int>
    }
}
```

## FriendHittups/PostHittup
### POST format:

```
{
    "coordinates": [longitude, latitude],
    "duration": <seconds>,
    "title": "<title>",
    "image": "<base64encodedimage>"
    "isPrivate": <boolean>,
    "uid": "<useruid>",
    "usersInviteduids": ["<uid>","<uid>",...],
    "image": "<base64encodedstring>"
}
```
format of the image doesn't matter

### Response format:
```
{"success":true, "uid": "<uid>"}
```
or

```
{"success":false, "error":"<error message>"}
```

## EventHittups/PostHittup
### POST format:

```
{
    "coordinates": [longitude, latitude],
    "duration": <seconds>,
    "title": "<title>",
    "description": "<title>",
    "image": "<base64encodedimage>"
    "isPrivate": <boolean>,
    "uid": "<EventOrganizeruid>",
    "dateStarts": <seconds>,
    "image": "<base64encodedstring>"
}
```
format of the image doesn't matter

### Response format:
```
{"success":true, "uid": "<uid>"}
```
or

```
{"success":false, "error":"<error message>"}
```


## (Friend/Event)Hittups/UpdateHittup
### POST format:
```
{
    "hittupuid": "<uid>",
    "owneruid": "<uid>",
    "title": "<title>",
    "coordinates": [<long>,<lan>],
    "isPrivate": <boolean>,
    "duration": <seconds>
}
```
### Response format:
```
{"success":true, "uid": "<uid>"}
```
or

```
{"success":false, "error":"<error message>"}
```

## (Friend/Event)Hittups/InviteFriends
### POST format:
```
{
    "inviteruid": "<uid>",
    "hittupuid": "<uid>",
    "friendsuids": ["<uid>","<uid>"]
}
```
### Response format:
```
{"success":true}
```
or

```
{"success":false, "error":"<error message>"}
```



## Users/UpdateUserLocation
### POST format:

```
{
    "coordinates": [longitude, latitude]
    "uid": "<uid>"
}
```

### Response format:

```
{"city":location.city,"success":true}
```

## Users/GetFriendsList
### POST format:

```
{
    "uid": "<uid>"
}
```

### Response format:

```
{"fb_friends":
[ 
    {
        "firstName":"<firstname>",
        "lastName": "<lastname>",
        "_id": "<uid>",
        "fbid": fbid,
        "loc":{
            "type":"Point",
            "state":"<state>",
            "city":"<city>",
            "coordinates":[<long>,<lat>],
            "lastUpdatedTime": <int>
        }
    },
        ...
]
}

```


## Users/AddUser
### POST format:

```
{
    "fbid": "<fbid>"
    "fbToken": "<fbToken>"
}
```

### Response format:

if user doesn't exist:

```
{
    "userStatus": "new",
    "uid": "<uid>",
    "fb_friends": [ ... ] (same as below)
}
```

if user already exists:

```
{
    "userStatus": "returning",
    "uid": "<uid>",
    "fb_friends":
    [ 
        {
            "firstName":"<firstname>",
            "lastName": "<lastname>",
            "_id": "<uid>",
            "fbid": fbid,
            "loc":{
                "type":"Point",
                "state":"<state>",
                "city":"<city>",
                "coordinates":[<long>,<lat>],
                "lastUpdatedTime": <int>
            }
        },
     ...
    ]
}
```
