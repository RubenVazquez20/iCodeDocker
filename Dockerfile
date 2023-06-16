# Imagen base
FROM node:14-alpine

# Create the principal directory
RUN mkdir /MindScript

# Directorio de trabajo dentro del contenedor
WORKDIR /MindScript

# Copiar el package.json y el yarn.lock al contenedor
COPY ./src/client/MindScript/package.json ./src/client/MindScript/yarn.lock ./

# Instalar las dependencias
RUN yarn install

# Copiar el resto de los archivos al contenedor
COPY ./src/client/MindScript .

# Construir la aplicación React
RUN yarn run build

# Puerto en el que la aplicación escucha
EXPOSE 5173

# Comando para ejecutar la aplicación React
CMD ["yarn", "run", "vite", "--host", "0.0.0.0"]
