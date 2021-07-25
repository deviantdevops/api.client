FROM node:15.4.0-buster

COPY [--chown=1000:1000] ./ /home/node/app
WORKDIR /home/node/app


EXPOSE 9000
CMD [ "npm run prod" ]
