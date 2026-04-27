FROM node:18

# 2. Creamos y definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero (para optimizar la caché de Docker)
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install --legacy-peer-deps
# 5. Copiamos el resto del código de la aplicación
# Esto copiará la carpeta 'src', el archivo '.env', etc.
COPY . .

# 6. Exponemos el puerto que usa nuestra app (el 4000)
EXPOSE 4000

# 7. Comando para arrancar la aplicación
CMD ["node", "src/app.js"]