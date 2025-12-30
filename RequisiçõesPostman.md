# Guia das requisições que podem ser feitas na API

**Url base em produção:** `http://localhost:3000/`
**Url base em desenvolvimento:** `http://localhost:3000/`

## Ver TODOS
`GET` `usArtistas`

## Ver todos artistas
`GET` `usArtistas/artistas`

## Ver todos adms
`GET` `usArtistas/adm`

## Adicionar artista
`POST` `UrlBase + usArtistas/add`

**Body raw JSON:**
```json
{
    "nome": "Antonio",
    "passhash": "1234"
}
```

## Alterar artista
`PUT` `UrlBase + usArtistas/update/:id`

**Body raw JSON:**
```json
{
    "nome": "Antonio",
    "passhash": "1234"
}
```

## Adicionar pontuação
`PUT` `UrlBase + usArtistas/update/:id`

**Body raw JSON:**
```json
{
    "nome": "Antonio",
    "passhash": "1234"
}
```

## Remover artista
`DELETE` `UrlBase + usArtistas/delete/:id`


## No caso de requisições bloqueadas colocar chave e key no header

{"x-api-key": "senha"}
