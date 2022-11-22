# Anacleto VS Cloud Run

## Backend
1. Creare servizio backend
2. Farlo puntare al git per avere la continuos delivery
3. 512mb Ram / 1 cpu
4. Configurare le variabili d'ambiente

Di seguito il file di yaml di configurazione
> le proprietà -- to set -- vanno cambiante con le tue

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: backend
  namespace: '657749375287'
  selfLink: /apis/serving.knative.dev/v1/namespaces/657749375287/services/backend
  uid: 6c723a1b-d317-4939-b2eb-fb0bca6073ff
  resourceVersion: AAXozQBi/9k
  generation: 11
  creationTimestamp: '2022-09-16T08:44:20.000076Z'
  labels:
    managed-by: gcp-cloud-build-deploy-cloud-run
    gcb-trigger-id: d98a9c84-ca8f-4030-97f7-2cb3d422239c
    commit-sha: fb67c63b601092cd9d36f282772580a98b2c39d5
    gcb-build-id: dcfa233e-c3f9-4a50-b9fa-29dcde9ff25e
    cloud.googleapis.com/location: europe-west3
  annotations:
    run.googleapis.com/client-name: gcloud
    serving.knative.dev/creator: luca.biasotto@sinesy.it
    serving.knative.dev/lastModifier: 657749375287@cloudbuild.gserviceaccount.com
    client.knative.dev/user-image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/backend:fb67c63b601092cd9d36f282772580a98b2c39d5
    run.googleapis.com/client-version: 402.0.0
    run.googleapis.com/ingress: all
    run.googleapis.com/ingress-status: all
spec:
  template:
    metadata:
      name: backend-00011-den
      labels:
        managed-by: gcp-cloud-build-deploy-cloud-run
        gcb-trigger-id: d98a9c84-ca8f-4030-97f7-2cb3d422239c
        commit-sha: fb67c63b601092cd9d36f282772580a98b2c39d5
        gcb-build-id: dcfa233e-c3f9-4a50-b9fa-29dcde9ff25e
      annotations:
        run.googleapis.com/client-name: gcloud
        client.knative.dev/user-image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/backend:fb67c63b601092cd9d36f282772580a98b2c39d5
        run.googleapis.com/client-version: 402.0.0
        autoscaling.knative.dev/maxScale: '4'
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: 657749375287-compute@developer.gserviceaccount.com
      containers:
      - image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/backend:fb67c63b601092cd9d36f282772580a98b2c39d5
        ports:
        - name: http1
          containerPort: 8080
        env:
        - name: FIREBASE_SERIVCE_ACCOUNT
          value: '--to set--'
        - name: GIT_SYNC_DIR
          value: /tmp/apps
        - name: SUPER_ADMIN_UIDS
          value: '["UDhyadjTgxXIxRRgebGW6k9jbVG2","S6MhvOhlAkad4dpJzqrZOLRoahK2"]'
        - name: TENANTS
          value: '[{"tenant":"SVILU","description":"Sviluppo 1 S.r.l"},{"tenant":"SVIL2","description":"Sviluppo
            2 S.p.a."}]'
        - name: DB_MYSQL
          value: '--to set--'
        - name: DATASTORE_SETTINGS
          value: '--to set--'
        - name: LOG_DIR
          value: /tmp/logs
        - name: APPS
          value: '-- to set--'
        resources:
          limits:
            cpu: 1000m
            memory: 512Mi
  traffic:
  - percent: 100
    latestRevision: true
status:
  observedGeneration: 11
  conditions:
  - type: Ready
    status: 'True'
    lastTransitionTime: '2022-09-16T15:27:35.738006Z'
  - type: ConfigurationsReady
    status: 'True'
    lastTransitionTime: '2022-09-16T15:27:29.421267Z'
  - type: RoutesReady
    status: 'True'
    lastTransitionTime: '2022-09-16T15:27:35.981017Z'
  latestReadyRevisionName: backend-00011-den
  latestCreatedRevisionName: backend-00011-den
  traffic:
  - revisionName: backend-00011-den
    percent: 100
    latestRevision: true
  url: https://backend-lp3w4nafwa-ey.a.run.app
  address:
    url: https://backend-lp3w4nafwa-ey.a.run.app
```

## Frontend
1. Creare servizio frontend
2. Farlo puntare al git per avere la continuos delivery
3. 1GB Ram / 1 cpu
4. Configurare le variabili d'ambiente

Di seguito il file di yaml di configurazione
> le proprietà -- to set -- vanno cambiante con le tue

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: frontend
  namespace: '657749375287'
  selfLink: /apis/serving.knative.dev/v1/namespaces/657749375287/services/frontend
  uid: 6acd1f70-c5fc-4f5d-9470-0809d36b2e93
  resourceVersion: AAXozQp20EY
  generation: 6
  creationTimestamp: '2022-09-16T10:25:55.957733Z'
  labels:
    managed-by: gcp-cloud-build-deploy-cloud-run
    gcb-trigger-id: 0231ebad-a857-4221-a6d3-cd0659cef947
    commit-sha: fb67c63b601092cd9d36f282772580a98b2c39d5
    gcb-build-id: 6a8f0544-70da-4454-bfbb-89fa2968d4c7
    cloud.googleapis.com/location: europe-west3
  annotations:
    run.googleapis.com/client-name: gcloud
    serving.knative.dev/creator: luca.biasotto@sinesy.it
    serving.knative.dev/lastModifier: 657749375287@cloudbuild.gserviceaccount.com
    client.knative.dev/user-image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/frontend:fb67c63b601092cd9d36f282772580a98b2c39d5
    run.googleapis.com/client-version: 402.0.0
    run.googleapis.com/ingress: all
    run.googleapis.com/ingress-status: all
spec:
  template:
    metadata:
      name: frontend-00006-vud
      labels:
        managed-by: gcp-cloud-build-deploy-cloud-run
        gcb-trigger-id: 0231ebad-a857-4221-a6d3-cd0659cef947
        commit-sha: fb67c63b601092cd9d36f282772580a98b2c39d5
        gcb-build-id: 6a8f0544-70da-4454-bfbb-89fa2968d4c7
      annotations:
        run.googleapis.com/client-name: gcloud
        client.knative.dev/user-image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/frontend:fb67c63b601092cd9d36f282772580a98b2c39d5
        run.googleapis.com/client-version: 402.0.0
        autoscaling.knative.dev/maxScale: '4'
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: 657749375287-compute@developer.gserviceaccount.com
      containers:
      - image: eu.gcr.io/test-luca-cd-362708/anacletocdsinesy/frontend:fb67c63b601092cd9d36f282772580a98b2c39d5
        ports:
        - name: http1
          containerPort: 8080
        env:
        - name: REACT_APP_BACKEND_HOST
          value: --to set--
        - name: REACT_APP_LOGIN_MESSAGE
          value: --to set--
        resources:
          limits:
            cpu: 1000m
            memory: 1Gi
  traffic:
  - percent: 100
    latestRevision: true
status:
  observedGeneration: 6
  conditions:
  - type: Ready
    status: Unknown
    reason: AssigningTraffic
    message: Assigning traffic to latest specified targets.
    lastTransitionTime: '2022-09-16T15:30:25.051718Z'
  - type: ConfigurationsReady
    status: 'True'
    lastTransitionTime: '2022-09-16T15:30:24.789685Z'
  - type: RoutesReady
    status: Unknown
    reason: AssigningTraffic
    message: Assigning traffic to latest specified targets.
    lastTransitionTime: '2022-09-16T15:30:25.051718Z'
  latestReadyRevisionName: frontend-00006-vud
  latestCreatedRevisionName: frontend-00006-vud
  traffic:
  - revisionName: frontend-00005-paq
    percent: 100
    latestRevision: true
  url: https://frontend-lp3w4nafwa-ey.a.run.app
  address:
    url: https://frontend-lp3w4nafwa-ey.a.run.app
```