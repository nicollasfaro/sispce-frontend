# Etapa 1: build do Angular
FROM node:18 AS build
WORKDIR /app

# Ignora SSL corporativo e instala pnpm
RUN npm config set strict-ssl false
RUN npm install -g pnpm

# Copia apenas manifestos primeiro (melhora cache de build)
COPY package*.json ./

# Instala dependências com pnpm
RUN pnpm install --no-frozen-lockfile

# Copia o resto do projeto
COPY . .

# Faz build em modo produção
RUN pnpm ng build --configuration production --optimization=false

# Etapa 2: Nginx para servir
FROM nginx:alpine
COPY --from=build /app/dist/sispce/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
