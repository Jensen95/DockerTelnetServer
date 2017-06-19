FROM node:6-alpine

ENV DIR=/opt/docker-telnet

COPY package.json ${DIR}/
COPY yarn.lock ${DIR}/

WORKDIR $DIR

RUN cd ${DIR} && yarn && \
  rm -rf /etc/ssl /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

COPY . $DIR

EXPOSE 2323
CMD npm start