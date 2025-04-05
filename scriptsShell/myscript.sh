#!/usr/bin/bash

docker run --rm -d -p 4567:5432 -e POSTGRES_PASSWORD=parola123 postgres

docker run --rm -d -p 3000:3000 --name node-competition -v $(pwd):/app competition:myImage

/mnt/d/recap/nume-aplicatie