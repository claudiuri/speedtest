FROM node:14
LABEL maintainer="claudiuri"
WORKDIR  /app
COPY  ./src ./src
COPY package.json .
ENV TZ=America/Sao_Paulo
RUN apt-get update
RUN apt-get install -y curl
RUN curl -s https://install.speedtest.net/app/cli/install.deb.sh | bash
RUN apt-get install -y speedtest
RUN speedtest --accept-license --accept-gdpr
RUN  npm install --production
EXPOSE 8000
CMD ["node", "src/index.js"]