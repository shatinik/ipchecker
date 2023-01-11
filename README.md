# Backend Position Technical Task

## Implement REST API that allows users to:
- [x] Lookup for a particular IP address info via https://ipwhois.io/ and store in to DB
- [x] Response with a stored lookup info from DB in case the spefic IP was already searched (DB-caching)
- [x] Remove cached result by IP
## Required parts
- [x] SQL or noSQL database or file
- [x] Typescript
- [x] Clean Architecture
## Up to candidate
- [x] Tests
- [x] Deployment infrastructure preparation (Docker, Serverless, etc.)
## Requirements
* Docker with docker-compose script or a new version with available syntax "docker compose up"

## Running the app

```bash
$ docker compose up
```

## To run tests keep docker up and run following

```bash
$ yarn
$ yarn test:e2e
```

## To connect to DB use following connection string
```
postgresql://postgres:SomePassw0rd@postgres:5432/testtask
```

# Eamples
```
curl --location --request GET 'http://localhost/ip/127.0.0.99'
```
```
curl --location --request GET 'http://localhost/ip/46.64.37.185'
```
```
curl --location --request DELETE 'http://localhost/ip/46.64.37.185'
```