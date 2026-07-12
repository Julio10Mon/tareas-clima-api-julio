cat << 'EOF' > respuestas.md
# 🌐 Control de Códigos de Estado HTTP - API de Tareas

En este proyecto se implementaron respuestas estandarizadas utilizando los códigos de estado del protocolo HTTP para asegurar una comunicación clara, predecible y segura entre el cliente (Postman) y nuestro servidor Node.js/Express.

A continuación, se detalla la justificación y diferencia de cada código utilizado durante las pruebas:

---

### 1. `200 OK`
* **¿Qué significa?** La petición fue recibida correctamente por el servidor, se procesó con éxito y se están devolviendo los datos solicitados en el cuerpo de la respuesta.
* **Ejemplo en el proyecto:** Al realizar una petición `GET /api/tareas`, el servidor responde con un estado `200 OK` y adjunta la lista de todas las tareas activas almacenadas en el sistema.

### 2. `201 Created`
* **¿Qué significa?** La petición se completó con éxito y, como resultado directo, se ha creado un nuevo recurso dentro del servidor (por ejemplo, en la base de datos o memoria).
* **Ejemplo en el proyecto:** Al hacer un `POST /api/tareas` enviando el título de una nueva tarea, el servidor valida la información, la registra asignándole un ID único y responde con un `201 Created` junto al objeto creado.

### 3. `400 Bad Request`
* **¿Qué significa?** Es un error por parte del cliente. Indica que el servidor no pudo entender o procesar la petición porque los datos enviados están mal estructurados, incompletos o no pasaron los filtros de validación de seguridad.
* **Ejemplo en el proyecto:** Al probar el endpoint seguro `POST /api/registro`, si se envía un cuerpo vacío o un correo electrónico con formato inválido, los middlewares de `express-validator` capturan la anomalía y devuelven un `400 Bad Request` con el arreglo de errores correspondientes para mitigar ataques por inyección de datos maliciosos.

### 4. `404 Not Found`
* **¿Qué significa?** Es un error por parte del cliente. Significa que el servidor está en línea, pero el recurso específico solicitado mediante la URL (un endpoint inexistente o un ID que no concuerda) no existe en el sistema.
* **Ejemplo en el proyecto:** Durante el reto de la sesión, al ejecutar un `DELETE /api/tareas/999`, el servidor busca en el arreglo de memoria el ID `999`. Al verificar que no existe, intercepta la solicitud y responde de forma segura con un `404 Not Found` y el mensaje de error "Tarea no encontrada".

### Diferencia fundamental entre errores 404 y 502
* **`404 Not Found`:** Es un error adjudicado enteramente al cliente interno de la API. Significa que nuestro servidor Express funciona bien, pero lo que se está buscando (como un ID de tarea incorrecto) no existe en la memoria o base de datos.
* **`502 Bad Gateway`:** Es un error de pasarela. Significa que nuestro servidor funciona perfectamente y procesó la solicitud, pero el servicio externo de terceros del que depende (OpenWeatherMap) falló, regresó un error de autenticación, o no respondió a tiempo (`timeout`).