FROM node:6

WORKDIR /src

RUN curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN apt-get clean

# If you need npm, don't use a base tag
ADD package.json .
RUN yarn

ADD . .

EXPOSE 2323
CMD npm start