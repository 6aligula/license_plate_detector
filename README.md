
## 🚗 **Proyecto: Detector de Placas Automático**

Este proyecto utiliza **OpenALPR** para el reconocimiento de matrículas, con un backend desarrollado en **Flask** y un frontend en **React Native**. El backend se ejecuta en un entorno **Dockerizado** para mayor portabilidad y facilidad de despliegue.

---

## ⚙️ **Tecnologías Utilizadas**

- **OpenALPR**: Reconocimiento de matrículas.
- **Flask**: API backend.
- **Docker**: Contenedorización.
- **React Native**: Frontend móvil.
- **Python**: Procesamiento de imágenes y API.
- **JavaScript/TypeScript**: Desarrollo de la app móvil.

---

## 🛠️ **Estructura del Proyecto**

```bash
📂 Proyecto_Deteccion_Placas
    ├── 📂 backend
    │     ├── flask_server.py
    │     ├── placas.py
    │     ├── Dockerfile
    │     └── requirements.txt
    ├── 📂 frontend
    │     ├── App.js
    │     ├── components
    │     └── screens
    ├── docker-compose.yml
    └── README.md
```

---

## 🖥️ **Instrucciones para el Backend (Flask + OpenALPR)**

### 1️⃣ **Clonar el Repositorio del Backend**
```bash
git clone https://github.com/tuusuario/backend_detector_placas.git
cd backend
```

### 2️⃣ **Configurar el Entorno Virtual**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ **Instalar Dependencias**
```bash
pip install -r requirements.txt
```

### 4️⃣ **Construir y Levantar los Contenedores con Docker**
```bash
docker-compose up -d
```
Esto levantará los servicios de OpenALPR y el servidor Flask.

### 5️⃣ **Probar el Servidor Flask**
```bash
curl -X POST -F "file=@matricula.jpg" http://localhost:8080/process_plate
```
Salida esperada:
```json
{
  "best_plate": "0724HPH",
  "confidence": 87.7916
}
```

---

## 📱 **Instrucciones para el Frontend (React Native)**

### 1️⃣ **Clonar el Repositorio del Frontend**
```bash
git clone https://github.com/tuusuario/frontend_detector_placas.git
cd frontend
```

### 2️⃣ **Instalar Dependencias**
```bash
npm install
```

### 3️⃣ **Configurar la URL de la API**
En el archivo `App.js` o configuración global:
```javascript
const API_URL = "http://192.168.1.180:8080/process_plate";
```

### 4️⃣ **Iniciar la Aplicación en un Dispositivo o Emulador**
```bash
npx react-native run-android
# o para iOS
npx react-native run-ios
```

---

## 🎯 **Flujo de Funcionamiento**

1. El usuario toma una foto o selecciona una imagen desde la app móvil.
2. La app envía la imagen al endpoint `/process_plate` del backend.
3. Flask reenvía la imagen al contenedor de OpenALPR.
4. OpenALPR procesa la imagen y devuelve las posibles matrículas.
5. Flask selecciona la matrícula con mayor confianza y la devuelve al frontend.
6. El frontend muestra el resultado al usuario.

---

## 🚀 **Ejemplos de Prueba**

### 📸 **Procesar Imagen desde el Backend**
```bash
curl -X POST -F "file=@matricula.jpg" http://localhost:8080/process_plate
```
Salida esperada:
```json
{
  "best_plate": "0724HPH",
  "confidence": 87.7916
}
```

### 🎞️ **Procesar Video desde el Backend**
```bash
curl -X POST -F "video=@video.mp4" http://localhost:8080/process_video
```

---

## 🔍 **Problemas Comunes y Soluciones**

### ⚠️ 1️⃣ OpenALPR no Detecta Matrículas
- Asegúrate de que las imágenes tengan **buena iluminación** y las matrículas sean **claras**.
- Verifica que el contenedor OpenALPR esté **corriendo**:
  ```bash
  docker ps
  ```

### ⚠️ 2️⃣ Problemas de Conexión entre Flask y OpenALPR
- Revisa que Flask apunte al puerto correcto de OpenALPR.
- Verifica los logs del contenedor con:
  ```bash
  docker logs openalpr-api
  ```

### ⚠️ 3️⃣ La Aplicación Móvil no se Conecta al Backend
- Comprueba que el **IP del backend** es accesible desde el dispositivo móvil.
- Usa **`adb reverse`** para redirigir puertos en Android:
  ```bash
  adb reverse tcp:8080 tcp:8080
  ```

---

## 🌐 **Despliegue en Producción**

1. Cambiar a un servidor WSGI como **Gunicorn**.
2. Utilizar un proxy inverso con **Nginx**.
3. Proteger la API con autenticación y limitar las solicitudes.

---

## 🎯 **Endpoints del Backend**

| Método | Ruta             | Descripción                   |
|--------|------------------|-------------------------------|
| POST   | `/process_plate` | Procesar una imagen para matrícula |
| POST   | `/process_video` | Procesar un video para matrículas |

---

## 🤝 **Contribuciones**

¡Las contribuciones son bienvenidas! Por favor, abre un **issue** o un **pull request** para cualquier mejora.

**Autor:** [Vinicio Alejandro](https://github.com/tuusuario)

🚀 **¡A disfrutar del reconocimiento automático de matrículas!** 🚗💨

