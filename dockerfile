FROM node:22.17.1

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
