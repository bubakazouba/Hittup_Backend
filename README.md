# Hittup-Backend


# Running Locally

```
npm install
npm start
```

Your app should now be running on [localhost:8080](http://localhost:8080/).


# Routes

### Hittups/GetInvitations
POST format:

```
{
	"uid": "<uid>"
}
```

## Hittups/PostHittup
### POST format:

```
{
	"coordinates": [longitude, latitude],
	"duration": "<seconds>",
	"title": "<title>",
	"isPrivate": "<bool>",
	"owneruid": "<uid>",
	"usersInviteduids": ["<uid>","<uid>",...]
}
```

### response format:
```
{"success":"true"}
```
or

```
{"success":"false", "error":"<error message>"}
```

## Hittups/GetHittups
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

### response format:
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

### response format:

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

### response format:

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

### response format:

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
