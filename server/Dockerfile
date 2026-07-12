# Dockerfile para el backend
FROM node:18-alpine

WORKDIR /app

# Copiar package.json desde la raíz del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install --production --legacy-peer-deps

# Copiar código del servidor desde la carpeta server/
COPY server/ .

# Crear carpeta uploads
RUN mkdir -p uploads

# Exponer puerto
EXPOSE 3006

# Iniciar servidor
CMD ["node", "server.js"]
