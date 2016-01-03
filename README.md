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

### /GetFriendsList
POST format:

```
{
	"uid": "<uid>"
}
```

