# watch-over

A tool to check if doors are closed.

Create `list.json` file and fill it like this:

```json
[
    {
        "address": "192.168.0.35:8888",
        "password": "mypassword",
        "nickname": "Mom garage",
        "number": "2",
        "single": true
    }
]
```

Create a `config.json` file and fill it like this:
```json
{
    "language": "fr",
    "sender": {
        "user": "sender@gmail.com",
        "pass": "mypassword"
    },
    "mails": [
        "mymail@gmail.com"
    ]  
}
```


## Docker

Build docker image:
```
docker build -t watch-over .
```

Test:
```
docker-compose up
```

Docker compose:
```
docker-compose up -d
```

Share to [Docker Hub](https://hub.docker.com/r/cedced19/watch-over):
```
docker tag watch-over:latest cedced19/watch-over:latest
docker push cedced19/watch-over:latest
```

Multiple platform:
```
docker buildx build   --platform linux/amd64,linux/arm64   -t cedced19/watch-over:latest   --push .
```