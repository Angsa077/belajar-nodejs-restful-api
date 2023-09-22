# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :
```json
{
  "username": "Angsa77",
  "password": "rahasia",
  "name": "Angga Saputra"
}
```

Response Body Success :
```json
{
  "data": {
    "username": "angsa77",
    "name": "Angga Saputra"
  }
}
```

Response Body Error :
```json
{
  "errors": "username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :
```json
{
    "username": "angsa77",
    "password": "apel5050"
}
```

Response Body Success :
```json
{
  "data": {
    "token" : "unique-token"
  }
}
```

Response Body Error :
```json
{
  "errors": "username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/:id

Headers :
- Authorization : token

Request Body :
```json
{
    "name" : "Angga saputra ok", //optional
    "password" : "new password" //optional
}
```

Response Body Success : 
```json
{
    "data" : {
        "username" : "angsa77",
        "name" : "Angga Saputra"
    }
}
```

Response Body Error : 
```json
{
    "errors" : "Name Length max 100"
}
```

## Get User API

Endpoint : GET /api/users/:id

Headers :
- Authorization : token

Response Body Success :
```json
{
    "data" : {
        "username" : "angsa77",
        "name" : "Angga Sapputra"
    }    
}
```

Response Body Error :
```json
{
    "errors" : "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/user/logout

Headers :
- Authorization : token

Response Body Success : 
```json
{
    "data" : "Ok"
}
```

Response Body Error :
```json
{
    "errors" : "Unauthorized"
}
```