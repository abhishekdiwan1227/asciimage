FROM node:latest AS build
WORKDIR /app
COPY . . 
RUN npm i
RUN npx tsc

FROM node:lts-slim AS prod
RUN apt-get update || : && apt-get install python3 python3-pip python3-venv -y
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y
WORKDIR /app
RUN python3 -m venv asciimage
COPY --from=build /app/dist/ .
COPY --from=build /app/package.json .
COPY tools/asciimg.py tools/asciimg.py
COPY tools/requirements.txt tools/requirements.txt
RUN asciimage/bin/pip install -r tools/requirements.txt
RUN npm i --prod
EXPOSE 3000
ENTRYPOINT [ "node", "index.js" ]