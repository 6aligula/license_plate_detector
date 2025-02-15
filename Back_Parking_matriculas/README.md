# **📌 Explicación del Funcionamiento de la API de OpenALPR y Flask**

En este proyecto, **OpenALPR** es el motor de reconocimiento de matrículas, y **Flask** actúa como un servidor HTTP intermediario para procesar y filtrar los resultados. Vamos a desglosar cómo funciona cada parte.

---

## **📌 1️⃣ ¿Cómo Funciona OpenALPR?**
### **🛠️ Descripción de OpenALPR**
OpenALPR (**Open Automatic License Plate Recognition**) es una herramienta de reconocimiento automático de matrículas basado en **OCR (Reconocimiento Óptico de Caracteres)** y **Machine Learning**.

**📌 Funciones clave:**
- Procesa imágenes y detecta matrículas en diferentes países.
- Devuelve **varias posibles matrículas** con diferentes niveles de **confianza**.
- Es rápido y eficiente, y puede ejecutarse en **Docker** o como aplicación nativa.

### **📝 Ejemplo de Uso de OpenALPR en la Línea de Comandos**
Si tienes una imagen llamada `matricula.jpg`, puedes analizarla con:
```bash
alpr -c us matricula.jpg
```
Salida esperada:
```bash
plate0: 10 results
    - 0724   confidence: 84.0282
    - B0724  confidence: 80.9354
    - 80724  confidence: 76.3656
    - 30724  confidence: 76.0828
```
Aquí, OpenALPR ha detectado **10 posibles matrículas** con distintos niveles de confianza.

### **📡 OpenALPR como API HTTP en Docker**
En lugar de ejecutarlo manualmente, lo corremos como un servicio en un contenedor Docker:
```bash
docker run -d -p 5000:5000 --name openalpr-api openalpr-api
```
Esto nos permite **enviar imágenes a OpenALPR** a través de una API HTTP.

📌 **Ejemplo de llamada a la API HTTP de OpenALPR**:
```bash
curl -X POST -F "file=@matricula.jpg" http://localhost:5000/recognize
```
Salida esperada:
```json
{
  "output": "plate0: 10 results\n
    - 0724   confidence: 84.0282\n
    - B0724  confidence: 80.9354\n
    - 80724  confidence: 76.3656\n"
}
```
El problema es que **OpenALPR devuelve múltiples opciones y necesitamos elegir la mejor**. Para eso, usamos Flask.

---

## **📌 2️⃣ ¿Cómo Funciona el Servidor Flask?**
### **🌐 Flask como Servidor HTTP Intermediario**
Flask nos permite construir un **servidor HTTP** que:
1. **Recibe imágenes** a través de una API (`/process_plate`).
2. **Envía las imágenes a OpenALPR**.
3. **Filtra el mejor resultado** basándose en la confianza.
4. **Devuelve una respuesta limpia** con solo la mejor matrícula.

### **📡 Cómo Flask Se Comunica con OpenALPR**
1. Un cliente envía una imagen a Flask (`POST /process_plate`).
2. Flask reenvía la imagen a OpenALPR (`POST /recognize` en el contenedor Docker).
3. Flask analiza la respuesta y extrae la **mejor matrícula**.
4. Devuelve un **JSON** con la mejor matrícula y su confianza.

---

## **📌 3️⃣ Explicación del Código en `flask_server.py`**
### **1️⃣ Recibir la imagen**
📌 En Flask, el endpoint `/process_plate` recibe una imagen como un **archivo multipart/form-data**.
```python
@app.route("/process_plate", methods=["POST"])
def process_plate():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
```
🔹 **Si no hay archivo**, devuelve un error `400`.

---

### **2️⃣ Enviar la imagen a OpenALPR**
📌 Flask reenvía la imagen a la API de OpenALPR.
```python
file = request.files["file"]
files = {"file": (file.filename, file.stream, file.mimetype)}
response = requests.post(OPENALPR_URL, files=files)
```
🔹 `requests.post(OPENALPR_URL, files=files)` envía la imagen a OpenALPR.  
🔹 `OPENALPR_URL = "http://localhost:5000/recognize"` es la API que corre en Docker.

---

### **3️⃣ Filtrar el mejor resultado**
📌 Flask analiza la respuesta de OpenALPR y selecciona **la matrícula con mayor confianza**:
```python
def get_best_plate(response_text):
    plate_candidates = []
    output_lines = response_text.split("\n")

    plate_regex = r"-\s+([A-Z0-9]+)\s+confidence:\s+([\d\.]+)"

    for line in output_lines:
        match = re.search(plate_regex, line)
        if match:
            plate, confidence = match.groups()
            plate_candidates.append((plate, float(confidence)))

    if plate_candidates:
        plate_candidates.sort(key=lambda x: x[1], reverse=True)
        best_plate, confidence = plate_candidates[0]
        return {"best_plate": best_plate, "confidence": confidence}
    else:
        return {"best_plate": "No plate detected", "confidence": 0}
```
🔹 **Extrae solo líneas que contengan matrículas y confianza** usando **expresiones regulares (`re.search`)**.  
🔹 **Ordena por confianza** (`sort(key=lambda x: x[1], reverse=True)`).  
🔹 **Devuelve la mejor opción** o `"No plate detected"` si no hay matrículas.

---

### **4️⃣ Devolver el resultado en JSON**
📌 Una vez extraída la mejor matrícula, Flask la devuelve como JSON.
```python
if response.status_code == 200:
    plate_data = get_best_plate(response.text)
    return jsonify(plate_data)
else:
    return jsonify({"error": "OpenALPR failed"}), 500
```
🔹 Si OpenALPR responde correctamente (`200 OK`), se procesa la matrícula.  
🔹 Si hay un error (`500`), Flask informa que OpenALPR falló.

---

## **📌 4️⃣ Ejemplo de Uso**
### **Enviar una imagen a Flask**
```bash
curl -X POST -F "file=@matricula.jpg" http://localhost:8080/process_plate
```
Salida esperada:
```json
{
  "best_plate": "0724",
  "confidence": 84.0282
}
```
Si OpenALPR no detecta nada:
```json
{
  "best_plate": "No plate detected",
  "confidence": 0
}
```

---

---
# Ejemplo de uso con un video

Construir el contenedor o en su defecto arrancarlo
```bash
 docker start openalpr-api
```

Arrancar en flask_server.py y placas.py

```bash
python flask_server.py
python placas.py
```
Salida:

```bash
* Serving Flask app 'flask_server'
 * Debug mode: on
INFO:werkzeug:WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://192.168.1.180:8080
INFO:werkzeug:Press CTRL+C to quit
INFO:werkzeug: * Restarting with stat
WARNING:werkzeug: * Debugger is active!
INFO:werkzeug: * Debugger PIN: 101-057-117
```

Lanzo el video

```bash
curl -X POST -F "video=@video.mp4" http://localhost:8080/process_video
```
Salida en el placas.py:

```bash
192.168.1.190 - - [14/Feb/2025 20:00:12] "GET /api/spots HTTP/1.1" 200 -
127.0.0.1 - - [14/Feb/2025 20:01:04] "POST /api/spots HTTP/1.1" 201 -
127.0.0.1 - - [14/Feb/2025 20:01:04] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:05] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:05] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:05] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:05] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:06] "POST /api/spots HTTP/1.1" 201 -
127.0.0.1 - - [14/Feb/2025 20:01:06] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:06] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:06] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:06] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:07] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:07] "POST /api/spots HTTP/1.1" 201 -
127.0.0.1 - - [14/Feb/2025 20:01:07] "POST /api/spots HTTP/1.1" 409 -
127.0.0.1 - - [14/Feb/2025 20:01:07] "POST /api/spots HTTP/1.1" 409 -
192.168.1.190 - - [14/Feb/2025 20:01:20] "GET /api/spots HTTP/1.1" 200 -
```
Los estados 201 son los que se han detectado como buenos
---
Salida en el flask_server:

```bash
DEBUG:urllib3.connectionpool:Starting new HTTP connection (1): localhost:5000
DEBUG:urllib3.connectionpool:http://localhost:5000 "POST /recognize HTTP/1.1" 200 406
DEBUG:root:Encontrada placa: 0724HPH con confianza: 87.7916
DEBUG:root:Encontrada placa: D724HPH con confianza: 84.5612
DEBUG:root:Encontrada placa: Q724HPH con confianza: 82.6089
DEBUG:root:Encontrada placa: O724HPH con confianza: 82.5743
DEBUG:root:Encontrada placa: 80724HPH con confianza: 82.2578
DEBUG:root:Encontrada placa: U0724HPH con confianza: 81.8027
DEBUG:root:Encontrada placa: J0724HPH con confianza: 81.7891
DEBUG:root:Encontrada placa: D0724HPH con confianza: 81.6378
DEBUG:root:Encontrada placa: B0724HPH con confianza: 81.606
DEBUG:root:Encontrada placa: 8D724HPH con confianza: 79.0274
INFO:root:Mejor placa: 0724HPH con confianza: 87.7916
```
Los estados 201 son los que se han detectado como buenos

Ya solo qudaria hacer peticiones al endpoint:

```bash
 private const val API_URL = "http://192.168.1.180:6000/api/spots"
```
🚀 **¡Ahora tienes una API robusta para reconocer matrículas!** 🚗💨