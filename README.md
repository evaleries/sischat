# Sischat (An online chat)

Built with __Express__ and __VueJS__.

## API

API Documentation.

---

### __POST__ /auth/register

Endpoint for register.

#### Request

| Field  | Description |
| --------- | --------- |
| username  | Username user |
| password  | Password user |

#### Success Response

```json
{
    "error": false,
    "message": "Pendaftaran berhasil",
    "user": {
        "messages": [],
        "_id": "5ff733d43d14661e945dff72",
        "username": "esdeath11",
        "password": "4796613750512023847353541266442328211009062039930782554973716933650911435477771551463030559170533381089107561602924091963990351493394926447326975959067011",
        "email": "esdeath11@gmail.com",
        "jenis_kelamin": "L",
        "alamat": "Jember",
        "createdAt": "2021-01-07T16:16:20.281Z",
        "updatedAt": "2021-01-07T16:16:20.281Z",
        "__v": 0
    }
}
```

---

### __POST__ /auth/login

Endpoint for login.

#### Request

| Field  | Description |
| --------- | --------- |
| username  | Username user |
| password  | Password user |

#### Success Response

```json
{
    "_id": "5ff7207e8fe5c81e8cd19b36",
    "username": "test",
    "alamat": "test",
    "jenis_kelamin": "L",
    "email": "test@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJykabcde.bB_t0TTLgN6h7rrQlZDzFj5zjXXZlUxrhk0u5q_lQ-g"
}
```

#### Error Response
```json
{
    "error": true,
    "message": "Login Gagal! username atau password Anda salah"
}
```

---

### __GET__ /users/profile

Current authenticated user.

#### Request

| Header  | Description |
| --------- | --------- |
| Authorization  | Bearer token from login |

#### Success Response
```json
{
    "message": "Profile user",
    "user": {
        "_id": "5ff7207e8fe5c81e8cd19b36",
        "username": "test",
        "alamat": "test",
        "jenis_kelamin": "L",
        "email": "test@gmail.com"
    }
}
```

---

### __POST__ /users/findUsername

Find user by username.

#### Request

| Header  | Description |
| --------- | --------- |
| Authorization  | Bearer token from login |

| Field  | Description |
| --------- | --------- |
| username  | username of the user |

#### Success Response

```json
{
    "error": false,
    "user": {
        "id": "5ff7207e8fe5c81e8cd19b36",
        "username": "test",
        "jenis_kelamin": "L",
        "alamat": "test"
    }
}
```

#### Error Response

HTTP Code `404`

---

### __GET__ /message/conversationsWith/:user_id

Get conversations from specific user. `user_id = _id` on user.

#### Request

| Header  | Description |
| --------- | --------- |
| Authorization  | Bearer token from login |

#### Success Response [WIP]

#### Error Response

Http Code `404`

---

## Socket

All request are handled by `socket.js`

### Events

#### `DISCONNECT`

| Parameter  | Description |
| --------- | --------- |
| user  | current logged in user. |

#### `ALL_ONLINE_USERS`
Shows all online users.

#### `NEW_USER`
Emit this event after logged in.
| Parameter  | Description |
| --------- | --------- |
| user  | current logged in user |

#### `SEND_MESSAGE`
Emit this event to send a new message.
| Parameter  | Description |
| --------- | --------- |
| from  | current logged in user |
| to    | user to talk to |
| messageContent | the message |

#### `START_TYPING`
Emit this event on typing
| Parameter  | Description |
| --------- | --------- |
| data  | current talking to user. |

#### `STOP_TYPING`
Emit this event on stop typing
| Parameter  | Description |
| --------- | --------- |
| data  | current talking to user. |
