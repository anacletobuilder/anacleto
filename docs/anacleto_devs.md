# Anacleto Devs
We are a democracy but the code that does not respect the guidelines could be rejected: [Guidelines](guidelines.md)

## Before starting
- [React first tutorial](https://reactjs.org/tutorial/tutorial.html)
- [kentcdodds](https://kentcdodds.com/) some very interesting courses:
    - https://github.com/kentcdodds/react-fundamentals
    - https://github.com/kentcdodds/react-hooks
    - https://github.com/kentcdodds/advanced-react-hooks
    - https://github.com/kentcdodds/advanced-react-patterns
    - https://github.com/kentcdodds/react-performance
    - https://github.com/kentcdodds/testing-react-apps
    - https://github.com/kentcdodds/react-suspense
    - https://github.com/kentcdodds/bookshelf

## Community 
- [Project Board](https://github.com/orgs/anacletobuilder/projects/1/views/1)
- Slack

## Repository

```
root
│   
└───anaclet-backend
|   └───example: backend example
|   └───src: library source code
└───anaclet-fontend
    └───example: fontend example
    └───src: library source code
```


## Users, logins, authorizations
User management is delegated to Firebase Authentication: [Docs](https://firebase.google.com/docs/auth)


>Users must not be duplicated by tenant/application etc. Each user has only one login!

Once the user logs in, he will be able to access the list of applications he has access to (GSuite style) and can easily change the application, without having to log in again and without seeing applications to which he does not have access.

Once entered into an application, a user can change the visibility of the data from a combo in the toolbar. (such as the Organizations of the GCP portal, or in YouTube etc ...)

```
user
│   id (uid firebase)
│   username
│   password   
│
└───apps
│   └───app1
│   └───app2
└───tenant
│   └───tenant1
│   └───tenant2
```

### Auth token
User verification will be done by exchanging a token in JWT format returned by Firebase Auth.
Google takes care of automatically refreshare the token.


### Roles - Custom claims by Firebase
Docs: https://firebase.google.com/docs/auth/admin/custom-claims
ES: https://www.toptal.com/firebase/role-based-firebase-authentication

Custom claims are only used to provide access control. They are not designed to store additional data (such as profile and other custom data). While this may seem like a convenient mechanism to do so, it is strongly discouraged as these claims are stored in the ID token and could cause performance issues because all authenticated requests always contain a Firebase ID token corresponding to the signed in user.
- Use custom claims to store data for controlling user access only. All other data should be stored separately via the real-time database or other server side storage.
- Custom claims are limited in size. Passing a custom claims payload greater than 1000 bytes will throw an error.


Custom claims format:
```
{
    ...
    "TENANT1": {
        "ANACLETO_SAMPLE": ["ADMIN"],
        "ANACLETO_SAMPLE2": ["ROLE_1", "ROLE_2"]
    }
}
```

> The claims contain a JS object and have a limit of about 1k of characters per user. If the limit is exceeded in Anacleto, a logic has been managed that zip the String.

> If a user is admin of everything (such as a dev), use the SUPER_ADMIN property directly without giving him infinite roles

### Login alternative auth0
**TODO** Firebase alternative: https://auth0.com/ + https://www.passportjs.org/

## Useful commands
One of our mantras is to frequently update the libraries used in the project (if you stop for too long you are dead), usually the project managers take care of it.
- `npm audit` check of libraries with vulnerabilities
- `npm audit fix` update vulnerable libraries
- `npm outdated` returns libraries that can be updated


## Script lato server
Using the `runInNewContext` method it is possible to execute JS statements using the same VM as nodeJS but in a different context.
In this way it is **NOT** possible to execute code in the main context. [Docs](https://nodejs.org/docs/latest/api/vm.html#vmruninnewcontextcode-contextobject-options)

```javascript
vm.runInNewContext(script, contextObject);
```