# Visor Formula 1

## Pasos para correrlo

```bash
docker build -t formula-backend:1.0 -f ./Dockerfile.dev . # construir la imagen
docker run -p 8080:8080 formula-backend:1.0 # correr el contenedor
```

Una vez creada la imagen de `formula-frontend2` y `formula-backend`, correr el comando `docker-compose up` en el directorio donde está el archivo `docker-compose.yml`. El backend correrá en `localhost:3000/`.

## Pasos para detenerlo

```bash
docker compose down
```
