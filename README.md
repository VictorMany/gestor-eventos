# 🎉 Event Booking API – Serverless Microservices 

Este proyecto es una API RESTful construida con **AWS Lambda** y el framework **Serverless v4**, diseñada para gestionar un sistema de reservas de eventos. Utiliza **DynamoDB** como base de datos y expone múltiples endpoints organizados por recursos clave como usuarios, lugares (venues), proveedores (vendors) y cotizaciones (quotes).

---

## 🚀 Tecnologías

* **Node.js 18.x**
* **AWS Lambda**
* **Serverless Framework v4**
* **DynamoDB (PAY\_PER\_REQUEST)**
* **API Gateway**
* **Postman (para pruebas)**

---

## 📦 Estructura del Proyecto

```
.
├── handlers/
│   ├── users/
│   ├── venues/
│   ├── vendors/
│   └── quotes/
├── serverless.yml
└── README.md
```

Cada recurso tiene sus propias funciones para:

* Crear
* Obtener por ID
* Listar
* Actualizar (tipo PATCH)
* Eliminar

---

## 📚 Recursos principales

### ✅ Users

* Campos: `userId`, `email`, `passwordHash`, `fullName`, `role`, `phoneNumber`, `profilePhotoUrl`, `createdAt`, `updatedAt`
* Roles posibles: `host`, `client`, `vendor`, `admin`

### ✅ Venues (Lugares)

* Campos: `placeId`, `hostId`, `name`, `description`, `address`, `city`, `state`, `country`, `latitude`, `longitude`, `capacity`, `pricePerHour`, `rules`, `amenities`, `photosUrls`, `availabilityCalendar`, `createdAt`, `updatedAt`

### ✅ Vendors (Proveedores)

* Campos: `vendorId`, `userId`, `name`, `category`, `description`, `services`, `location`, `contactEmail`, `contactPhone`, `ratings`, `photosUrls`, `createdAt`, `updatedAt`

### ✅ Quotes (Cotizaciones)

* Campos: `quoteId`, `clientId`, `vendorId`, `venueId`, `status` (`pending`, `approved`, `rejected`), `date`, `totalPrice`, `notes`, `createdAt`, `updatedAt`

---

## ⚙️ Comandos comunes

### Desplegar a AWS

```bash
sls deploy
```

### Ejecutar localmente

```bash
sls invoke local --function <functionName> --path event.json
```

### Eliminar stack

```bash
sls remove
```

---

## 📬 API Testing

Puedes probar cada endpoint fácilmente con herramientas como **Postman**. Los métodos soportados incluyen:

* `GET /users`, `GET /users/{id}`
* `POST /vendors`
* `PATCH /quotes/{id}`
* `DELETE /venues/{id}`
* etc.

---

## 📌 Notas

* Cada tabla de DynamoDB utiliza \`\`\*\* como clave primaria\*\*, y tiene configurado `BillingMode: PAY_PER_REQUEST`.
* Las actualizaciones (`PATCH`) están diseñadas para ser **flexibles**, solo aceptan campos válidos.
* Serverless Framework maneja automáticamente el provisioning de las funciones, roles y recursos.
