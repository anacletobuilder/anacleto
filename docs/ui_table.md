# Table
Controllo di tipo tabella, dato uno store consente di caricare i dati una tabella.

## Caricamento
- `store` path dello store
- `skeletonRow` numero di skeleton da mostrare

## Pagionazione
- `pagination` true / false
- `paginationType` client / server

## Ordinamento
- `sortField` campo di default per cui ordinare (NB al momento funziona solo offline)
- `sortOrder` ordinamento di default per il campo `sortField`

## Filtri
- `globalFilterFields` lista campi disponibili nel filtro globale
- `globalFilterMode` client / server