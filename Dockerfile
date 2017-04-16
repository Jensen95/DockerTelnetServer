FROM node:6-alpine

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN apk upgrade --update-cache --available
RUN apk add yarn

ENV DIR=/opt/docker-telnet

COPY package.json ${DIR}/
COPY yarn.lock ${DIR}/

WORKDIR $DIR

RUN cd ${DIR} && yarn && \
  rm -rf /etc/ssl /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

COPY . $DIR

EXPOSE 2323
CMD npm start