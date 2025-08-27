# Usa Node 18
FROM node:18.18.1-bullseye-slim

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta usada pelo backend
EXPOSE 5000

# Comando para rodar o backend (npm run dev)
CMD ["npm", "run", "dev"]
