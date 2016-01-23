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


## (Friend/Event)Hittups/GetHittup
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

## (Friend/Event)Hittups/GetAllHittups
### POST format:

```
{ 
    "uid": "<uid>",
    "maxDistance": "<distance in km>", 
    "coordinates": [<long>,<lat>],
    "timeInterval": <seconds>
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
    "isPrivate": <boolean>,
    "duration": <seconds>,
    "dateCreated": <seconds>,
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

## (Friend/Event)Hittups/PostHittup
### POST format:

```
{
    "coordinates": [longitude, latitude],
    "duration": <seconds>,
    "title": "<title>",
    "image": "<base64encodedimage>"
    "isPrivate": <boolean>,
    "uid": "<uid>",
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
                "coordinates":[<long>,<lat>],
                "lastUpdatedTime": <int>
            }
        },
     ...
    ]
}
```
