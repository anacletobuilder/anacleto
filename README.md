# Anacleto
Anacleto is an application builder developed using: `NodeJS`, `Express`, `React`, `PrimeReact`.

Anacleto consists of 2 components:
- Anacleto frontend: draw yours windows
- Anacleto backend: execute yours backend scripts

# Setup
1. Create your `Anacleto frontend` application: [Docs](anacleto-frontend/README.md)
2. Create your `Anacleto backend` application: [Docs](anacleto-backend/README.md)

# Docs 
- [UI](docs/ui.md)
- [Script](docs/code.md)


# Google
Anacleto is a cloud based solution, works perfectly on Google Cloud Platform.

## Deploy Cloud Run
> Advice: not do it manually but do it with continuous delivery if you can.

### Settings Cloud Run Automaticaly
[Settings Cloud Run Automaticaly](docs/cloud_run.md)

### Settings Cloud Run Manualu
```shell
$ gcloud config set project test-luca-172110
$ cd root_progetto
$ gcloud run deploy
```

## Connetc CloudSQL and CloudRun
- https://cloud.google.com/sql/docs/mysql/connect-run#node.js

# Anacleto Devs
Are you a dev and want to help us improve Anacleto? See [Anacleto devs docs](docs/anacleto_devs.md)


# Contributors

Thanks goes to these wonderful people

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
        <td align="center">
            <a href="https://github.com/lucabiasotto">
            <img src="https://avatars.githubusercontent.com/u/11436914?v=4?s=100" width="100px;" alt="Luca"/><br /><sub><b>Luca</b></sub>
            </a>
            <br />
            <a href="https://github.com/anacletobuilder/anacleto/commits?author=lucabiasotto" title="Documentation">📖</a>
        </td>
        <td align="center">
            <a href="https://github.com/AndreaDeP">
            <img src="https://avatars.githubusercontent.com/u/32370523?v=4?s=100" width="100px;" alt="Luca"/><br /><sub><b>Andrea</b></sub>
            </a>
            <br />
            <a href="https://github.com/anacletobuilder/anacleto/commits?author=AndreaDeP" title="Documentation">📖</a>
        </td>
        <td align="center">
            <a href="https://github.com/Havock94">
            <img src="https://avatars.githubusercontent.com/u/7635248?v=4?s=100" width="100px;" alt="Luca"/><br /><sub><b>Luca</b></sub>
            </a>
            <br />
            <a href="https://github.com/anacletobuilder/anacleto/commits?author=Havock94" title="Documentation">📖</a>
        </td>
    </tr>
  </tbody>
</table>

# License

MIT © [lucabiasotto](https://github.com/lucabiasotto) & [AndreaDeP](https://github.com/AndreaDeP) & [Havock94](https://github.com/Havock94)
