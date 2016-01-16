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

## FriendAndEventHittups/GetHittups
### POST format:
same as gethittup
### Response format:
```
{"success":"true", "hittups":[
  {
    "_id": "<uid>",
    "title": "<title>",
	"isPrivate": "<bool>",
    "duration": "<seconds>",
    "dateCreated": "<seconds>",
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
      "coordinates": ["<long>", "<lat>"]
    }
  }
  , ...
]
}
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
{"success":"true"}
```
or

```
{"success":"false", "error":"<error message>"}
```

## (Friend/Event)Hittups/InviteFriends
### POST format:
```
{
	"inviteruid": "<uid>",
	"hittupuid": "<uid>",
	"friendsuids": ["<uid>", ..]
}
```

### Response format:

```
{
	"success": "true", //means no errors
	"<uid>": "invited",
	"<uid>": "alreadyinvited",
	...
}
```

or

```
{"success":"false", "error":"<error message>"}
```
## (Friend/Event)Hittups/GetInvitations
POST format:

```
{"success":"false", "error":"<error message>"}
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
    "isPrivate": "<boolean>",
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
        "coordinates": [
            "<longitude>",
            "<latitude>"
        ]
    }
}
```

## (Friend/Event)Hittups/PostHittup
### POST format:

```
{
	"coordinates": [longitude, latitude],
	"duration": "<seconds>",
	"title": "<title>",
	"isPrivate": "<bool>",
	"uid": "<uid>",
	"usersInviteduids": ["<uid>","<uid>",...]
}
```

### Response format:
```
{"success":"true", "uid": "<uid>"}
```
or

```
{"success":"false", "error":"<error message>"}
```

## (Friend/Event)Hittups/GetHittups
### POST format:

```
{ 
	"uid": "<uid>",
	"maxDistance": "<distance in km>", 
	"coordinates": ["<long>","<lat>"],
	"timeInterval": "<seconds>"
}
```
`maxDistance` is optional, default behaviour would be looking for hittups in the same city.
`timeInterval` is optional, default is 24\*60\*60.

### Response format:
```
[
  {
    "_id": "<uid>",
    "title": "<title>",
	"isPrivate": "<bool>",
    "duration": "<seconds>",
    "dateCreated": "<seconds>",
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
      "coordinates": ["<long>", "<lat>"]
    }
  }
  , ...
]
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
{"city":location.city,"success":"true"}
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
			"coordinates":[<long>,<lat>]
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
	"uid": "<uid>"
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
                "coordinates":[<long>,<lat>]
            }
        },
     ...
    ]
}
```
