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