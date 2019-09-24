
const channels = JSON.parse(pm.variables.get('channels'));
const threads = JSON.parse(pm.variables.get('threads'));
const users = JSON.parse(pm.variables.get('users'));


const update = {
    "description": "This is a sample POST request",
    "url": "https://api.getpostman.com/environments/5302990-eccd6cd8-5772-48df-b6ff-c675e8530224",
    "method": "PUT",
    "header": [
        {
            "key": "Content-Type",
            "value": "application/json"
        },
        {
            "key": "x-api-key",
            "value": "3a464852f4e04cdba66ac7d998bc5d9a"
        }
    ],
    "body": {
        'mode': 'raw',
        'raw': JSON.stringify({
        "environment": {
        "name": "refactor",
            "values": [
                {"key": "baseUrl", "value": baseUrl},
                {"key": "users", "value": JSON.stringify(users)}
            ]
    }})
    }
};


pm.sendRequest(update, function (err, res) {
  console.log(err ? err : res.json());
});