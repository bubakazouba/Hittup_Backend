# Hittup-Backend


# Running Locally

```
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).


# Routes

### Hittups/GetInvitations
POST format:

```
{
	"uid": "<uid>"
}
```

### Hittups/PostHittup
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

### Hittups/GETHittups
POST format:

```
{ 
	"uid": "<uid>",
	"maxDistance": "<distance in km>", 
	"coordinates": ["<long>","<lat>"],
	"timeInterval": "<time in seconds>"
}
```
`maxDistance` is optional, default behaviour would be looking for hittups in the same city.
`timeInterval` is optional, default is 24\*60\*60.


```

### Users/UpdateUserLocation
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

### Users/GetFriendsList
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


### Users/AddUser
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
