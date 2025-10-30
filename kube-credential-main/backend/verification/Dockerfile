FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Ensure postinstall script exists during npm install
COPY scripts ./scripts

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
