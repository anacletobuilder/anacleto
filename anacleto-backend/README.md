# anacleto-backend
Anacleto builder library

[![NPM](https://img.shields.io/npm/v/anacleto-frontend.svg)](https://www.npmjs.com/package/anacleto-frontend) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

`anacleto-backend` is a library that you can import into your React project.
> Note, anacleto-backend cannot be run directly, but must be imported as a library in a NodeJS new project

## Usage

1. Craete backend project folder
```shell
mkdir sample-app-backend
```

2. Init node project
```shell
npm init
```

3. create `index.js` file
```js
require("dotenv").config({ path: __dirname + "/.env" });

const Anacleto = require("anacleto-backend");

Anacleto();
```

4. installa anacleto backend
```
npm install anacleto-backend
```

5. add star `script` to `package.json`
```json
{
  "name": "sample-app-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
      "anacleto-backend": "^1.0.0",
      "dotenv": "^16.0.3"
  }
}
```

6. Create `.env` file and save on anacleto-backend root.

```bash
# Enviroment
## development,test,prodution
ENV=development
LOG_DIR=/tmp/logs

# Firebase service account JSON
FIREBASE_SERIVCE_ACCOUNT={...}

# Server listening port
PORT=3001

# Logs settings
LOGS_MAX_SIZE=20m
LOGS_MAX_FILE=1d

# Apps
## Firebase UID of super admin (they can access all app and all tenants)
SUPER_ADMIN=["UDhyadjTgxXIxRRgebGW6k9jbVG2","S6MhvOhlAkad4dpJzqrZOLRoahK2"]
## Sync folder
GIT_SYNC_DIR=/Users/luca.biasotto/Workspaces/ReactJS/Luca/apps
## App git data, for auth see: https://isomorphic-git.org/docs/en/authentication.html
APPS={"ANACLETO_SAMPLE":{"id":"ANACLETO_SAMPLE","name":"SampleApp","repository":"https:\/\/github.com/cicciopasticcio/anacleto_sample.git","oauth2format":"github","username":"YOUR_GITHUB_TOKEN","password":"x-oauth-basic"},"ANACLETO_SAMPLE2":{"id":"ANACLETO_SAMPLE2","name":"SampleApp2","repository":"https:\/\/github.com/cicciopasticcio/anacleto_sample_2.git","oauth2format":"github","username":"YOUR_GITHUB_TOKEN","password":"x-oauth-basic"}}
## Tenants list
TENANTS=[{"tenant":"TENANT1","description":"Tenant 1 SRL"},{"tenant":"TENANT2","description":"Tenant 2 SRL"}]

## My sql Connection
MYSQL_SETTINGS={"CONNECTION_NAME":{"connectionLimit":10,"host":"","user":"","password":"","database":""}}

```
- `ENV`: project enviroment: development / test / production
- `PORT`: listening port (Ex 3001)
- `LOG_DIR`: log directory path
- `FIREBASE_SERIVCE_ACCOUNT`: firebase service account json. To generate a private key file for your service account:
  1. In the Firebase console, open Settings > Service Accounts.
  1. Click Generate New Private Key, then confirm by clicking Generate Key.
  1. Securely store the JSON file containing the key.
  1. Copy service account JSON in this .env variable
- `LOGS_MAX_SIZE`: max log file size (ex 20m)
- `LOGS_MAX_FILE`: max log age (ex 1d)
- `SUPER_ADMIN`: array of super admin id
- `GIT_SYNC_DIR`: folder where the app sources are downloaded
- `APPS`: a JSON with the apps data, you can specify a connection for each app:
  - `APP`
    - `id`
    - `name`
    - `repository`
    - `username`
    - `password`

  ex:
  ```json
  {
    "ANACLETO_SAMPLE": {
      "id": "ANACLETO_SAMPLE",
      "name": "SampleApp",
      "repository": "https://github.com/cicciopasticcio/anacleto_sample.git",
      "oauth2format": "github",
      "username": "YOUR_GITHUB_TOKEN",
      "password": "x-oauth-basic"
    },
    "ANACLETO_SAMPLE2": {
      "id": "ANACLETO_SAMPLE2",
      "name": "SampleApp2",
      "repository": "https://github.com/cicciopasticcio/anacleto_sample_2.git",
      "oauth2format": "github",
      "username": "YOUR_GITHUB_TOKEN",
      "password": "x-oauth-basic"
    }
  }
  ```
- `TENANTS`: array of available tenants
  ```json
  [
    {
      "tenant": "TENANT1",
      "description": "Tenant 1 SRL"
    },
    {
      "tenant": "TENANT2",
      "description": "Tenant 2 SRL"
    }
  ]
  ```
- `MYSQL_SETTINGS`: MySql connections
  ```json
  {
    "MY_DB1": {
      "connectionLimit": 10,
      "host": "100.155.1.10",
      "user": "ciccio",
      "password": "ciccio_password",
      "database": "db1"
    },
    "MY_DB2": {
      "connectionLimit": 10,
      "host": "100.155.1.11",
      "user": "pasticcio",
      "password": "pasticcio_password",
      "database": "db2_blabla"
    }
  }
  ```
- `DATASTORE_SETTINGS`: Googl Datastore connection data
  ```json
  {
    "type": "service_account",
    "project_id": "<project_id>",
    "private_key_id": "<private_key_id>",
    "namespace": "SVILUPPO",
    "private_key": "-----BEGIN PRIVATE KEY-----\n<private key>\n-----END PRIVATE KEY-----\n",
    "client_email": "<client_email>",
    "client_id": "<client_id>",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "<client_x509_cert_url>"
  }
  ```

- `BIGQUERY_SETTINGS`: Google BigQuery connection data
  ```json
  {
    "BIG_QUERY_1" : {
      "location" : "europe-west2",
      "defaultDataset" : {
        "datasetId": "my_scheme",
        "projectId": "my-gcp-project"
      }
    }
  }
  ```


7. Start anacleto-backend module

```shell
npm start
```

## Devs: working with localy version of Anacleto
> Follow this guide if you are a dev and want to edit `anacleto-backend`

We suggest that you organize your files this way, but feel free to organize them however you like.

```
workspace
│
└───anacleto
│   └───anacleto-backend
│   └───anacleto-frontend
└───anacleto-apps
│   └───sample-app-1-frontend
│   └───sample-app-1-data
│   └───sample-app-1-logs
│   └───sample-app-2-frontend
│   └───sample-app-2-data
│   └───sample-app-2-logs
```

1. Connect yout `sample-app-backend` applicaiton to the local version of `anacleto-backend`:
```bash
cd <application-path>
npm link <anacleto-backend-path>/anacleto-backend
```
> Es: `cd workspace/anacleto-apps/sample-app-1-frontend && sudo npm link ../../anacleto/anacleto-backend/`


# License

MIT © [lucabiasotto](https://github.com/lucabiasotto) & [AndreaDeP](https://github.com/AndreaDeP) & [Havock94](https://github.com/Havock94)

