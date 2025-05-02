#!/usr/bin/bash

# docker run --rm -d -p 4567:5432 -e POSTGRES_PASSWORD=parola123 postgres

# docker run --rm -d -p 3000:3000 --name node-competition -v $(pwd):/app competition:myImage

# /mnt/d/recap/nume-aplicatie

docker run -d \
  --name db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=parola123 \
  -e POSTGRES_DB=recap \
  -p 1234:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:latest


# docker exec -it db sh

npx prisma migrate dev

npm run dev

# exit