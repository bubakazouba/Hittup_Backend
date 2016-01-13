# Hittup-Backend


# Running Locally

```
npm install
npm start
```

Your app should now be running on [localhost:8080](http://localhost:8080/).


# Routes
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
            firstName: "<firstName>",
            lastName: "<lastName>"
        }
        ],
    "usersInvited": [
        {
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
{"success":"true"}
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
    "_id": "5691d8dd1451737d532e9a2b",
    "title": "<title>",
	"isPrivate": "<bool>",
    "duration": "<seconds>",
    "dateCreated": "<seconds>",
    "__v": 0,
    "usersJoined": [
       "firstName": "<firstName>",
    	"lastName": "<lastName>",
    	},
    	...
    ],
    "usersInvited": [ {
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
[ {"firstName":"<firstname>", "lastName": "<lastname>", "uid": "<uid>", "fbid": fbid, "city": "<city>"}, {}..]
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
	"fbFriends": [{"uid": "<uid>", "fbid": <fbid>, "firstname": <firstname>, "lastname": <lastname>, "city": "<city>", "state": "<state>"}]
}
```
