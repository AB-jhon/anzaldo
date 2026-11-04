# 🚗 Sistema de Gestión y Recepción para Taller Automotriz

Aplicación web progresiva diseñada para optimizar y digitalizar el flujo de recepción vehicular, control de órdenes de servicio y gestión de evidencias fotográficas en talleres mecánicos. El sistema prioriza una experiencia móvil (*Mobile-First*) fluida para el personal operativo en piso.

---

## 🛠️ Tecnologías y Stack Tecnológico

Este proyecto fue desarrollado utilizando herramientas modernas de desarrollo web:

* **Frontend:** React, Vite, Tailwind CSS v4
* **Backend & Base de Datos:** Supabase (PostgreSQL, Row Level Security, Supabase Storage)
* **Despliegue e Infraestructura:** Vercel (Frontend), GitHub Actions (Automatización de mantenimiento de base de datos)

---

## ✨ Características Principales

* **Búsqueda Inteligente y Alta Rápida:** Consulta de vehículos por número de serie (VIN) o placas en tiempo real, con un módulo integrado de alta rápida para nuevos clientes y unidades sobre la marcha.
* **Módulo de Recepción Multimedia Adaptativo:** Soporte dual de captura de evidencias fotográficas utilizando la cámara nativa del dispositivo móvil (mediante input táctil) o webcams en equipos de escritorio.
* **Gestión de Órdenes y Conceptos Dinámicos:** Cálculo automatizado de subtotales y totales para servicios y refacciones, asegurando un registro relacional íntegro en la base de datos.
* **Arquitectura Segura:** Protección de datos mediante políticas de seguridad a nivel de fila (RLS) en Supabase y variables de entorno protegidas.

---

## 🚀 Despliegue en Vivo

Puedes explorar la aplicación funcionando en producción aquí:
👉 **[Enlace de la Aplicación en Vercel](https://anzaldo.vercel.app)**

---

## ⚙️ Configuración y Ejecución Local

Si deseas clonar y ejecutar este proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AB-jhon/anzaldo.git