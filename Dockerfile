FROM node:15
WORKDIR /app
COPY package.json .

ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm install --only=production; \
        else npm install; \
        fi

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]