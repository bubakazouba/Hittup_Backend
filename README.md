# Hittup-Backend


# Running Locally

```
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).


# Routes

### /PostHittup
POST format:

```
{
	"coordinates": [longitude, latitude],
	"duration": "<seconds>",
	"title": "<title>",
	"isPrivate": "<bool>",
	"owner": {"uid": "<uid>", "fbid": <fbid>, "firstName": "<firstname>", "lastName": "<lastname>"},
	"usersInvited": [{"uid": "<uid>", "fbid": <fbid>, "firstname": <firstname>, "lastname": <lastname>}],
}
```

### /UpdateUserLocation
POST format:

```
{
	"coordinates": [longitude, latitude]
	"uid": "<uid>"
}
```

returns:

```
{"city":location.city,"success":"true"}
```

### /GetFriendsList
POST format:

```
{
	"uid": "<uid>"
}
```

response:

```
{"fb_friends":
[ {"firstName":"<firstname>", "lastName": "<lastname>", "uid": "<uid>", "fbid": fbid, "city": "<city>"}, {}..]
}

```


### /AddUser
POST format:

```
{
	"fbid": "<fbid>"
	"fbToken": "<fbToken>"
}
```

response:

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