## Table of contents

- [General info](#general-info)
- [Libraries](#libraries)
- [Setup](#setup)
- [Request](#request)
- [Response](#response)

# General Info

Challenge Calindra is a REST API with a POST route that receives 2 or more addresses as parameters.

## Libraries

```
* axios version 0.21.1
* dotenv version 8.2.0
* express version 4.17.1
```

## Setup

```
npm install
yarn start
```

## Request

```
POST /addresses
```

```
curl -i -H 'Content-Type: application/json' -X POST -d '{"addresses":"Av. Rio Branco, 1 Centro, Rio de Janeiro RJ, 20090003;Praça Mal. Âncora, 122 Centro, Rio de Janeiro RJ, 20021200;Rua 19 de Fevereiro, 34 Botafogo, Rio de Janeiro RJ, 22280030"}' http://localhost:5000/addresses
```

## Response

```
HTTP/1.1 200 OK
Date: Mon, 29 Mar 2021 14:34:28 GMT
Status: 200 OK
Content-Type: application/json
Content-Length: 903

{
  "distances": [
    {
      "distance": "1254 meters",
      "address_1": "Av. Rio Branco, 1 Centro, Rio de Janeiro RJ, 20090003",
      "address_2": "Praça Mal. Âncora, 122 Centro, Rio de Janeiro RJ, 20021200"
    },
    {
      "distance": "5981 meters",
      "address_1": "Av. Rio Branco, 1 Centro, Rio de Janeiro RJ, 20090003",
      "address_2": "Rua 19 de Fevereiro, 34 Botafogo, Rio de Janeiro RJ, 22280030"
    },
    {
      "distance": "5492 meters",
      "address_1": "Praça Mal. Âncora, 122 Centro, Rio de Janeiro RJ, 20021200",
      "address_2": "Rua 19 de Fevereiro, 34 Botafogo, Rio de Janeiro RJ, 22280030"
    }
  ],
  "shortestDistance": "The shortest distance is 1254 meters BETWEEN Av. Rio Branco, 1 Centro, Rio de Janeiro RJ, 20090003 AND Praça Mal. Âncora, 122 Centro, Rio de Janeiro RJ, 20021200",
  "longestDistance": "The longest distance is 5981 meters BETWEEN Av. Rio Branco, 1 Centro, Rio de Janeiro RJ, 20090003 AND Rua 19 de Fevereiro, 34 Botafogo, Rio de Janeiro RJ, 22280030"
}
```
