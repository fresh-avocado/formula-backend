# Visor Formula 1

## Pasos para correrlo

```bash
docker build -t formula-backend:1.0 -f ./Dockerfile.dev . # construir la imagen
```

Una vez creada la imagen de `formula-frontend2` y `formula-backend`, correr el comando `docker-compose up` en el directorio donde está el archivo `docker-compose.yml`. El backend correrá en `localhost:3000/`.

## Pasos para detenerlo

```bash
docker compose down # borrará los datos de la BD
```

## Pasos para crear los datos en la BD

```bash
curl -X POST http://localhost:8080/v1/results/generate # demora 7 segundos porque lee CSVs e inserta varios datos en Mongo
```

O ejecutar el HTTP Request llamado `Generate Data` en Postman.

## Notas

- Se usó [Fuse.js](https://fusejs.io/) para implementar el buscados de constructores. Esta librería crea un índice y le hace consultas **en el main thread de Node.js**. Por lo tanto, bloquea el _event loop_ y si el número de constructores aumenta, las operaciones que Fuse.js usa podrían bloquear el _event loop_ por más tiempo, por lo que subsiguientes _requests_ no podrán ser servidas. Por lo tanto, estas operaciones deberían correr idealmente en un _worker thread_ con la ayuda de la librería nativa de Node.js llamada [worker-threads](https://nodejs.org/api/worker_threads.html).

- La clase `ConstructorSearch` sirve dos propósitos: índice de texto y caché de los constructores. Dado que el _autocomplete_ de la web hace varias peticiones al backend, sería ineficiente hacerle todas estas peticiones a Mongo. Por lo tanto, el presente backend revalida cada `ttlMinutes` (atributo de `ConstructorSearch`) los constructores pidiéndoselos a Mongo. De esta manera, cuando el frontend pide los constructores, la consulta se ejecuta rápidamente en el mismo backend (no se accede a la base de datos). Al mismo tiempo, se m
antiene la data de constructores _relativamente_ actualizada al revalidar los constructores cada `ttlMinutes`.

- Podría poner más notas sobre la implementación, pero sería un documento muy extenso. Por lo tanto, cualquier duda de implementación no duden en escribirme por correo (__gabriel.spranger@utec.edu.pe__) o Discord (__mrmm#7777__).
