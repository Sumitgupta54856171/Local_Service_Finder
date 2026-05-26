# 📍 Local Service Finder

Local Service Finder is a full-stack application for discovering, managing, and exploring local services using a spatially-enabled backend and a modern React frontend.

---

## 📌 Project Overview

This repository contains a Django REST API backend and a Next.js frontend that work together to provide:

- Public search for local services.
- Admin service management.
- Location-based mapping with GeoDjango support.
- JWT cookie authentication for secure access.

---

## 🌐 Architecture

- `lsa_backend/` — Django project configuration, settings, apps, and routing.
- `ls_backend/` — Django application containing models, serializers, views, authentication, and permission logic.
- `lsa/` — Next.js frontend built with the App Router, map UI, admin dashboard, and public pages.
- `docker-compose.yml` — local development containers for PostGIS and Redis.
- `requirements.txt` — backend Python dependencies.

---

## 🚀 Key Features

- **Geospatial services:** `Servicer` records include PointField locations for map-based search.
- **Public API:** browse services, fetch details, and search nearby locations.
- **Admin API:** create, update, and delete services using a dashboard.
- **JWT cookies:** secure token-based session handling with `accessToken` and `refreshToken` cookies.
- **Next.js proxy routing:** frontend uses `/api-backend/*` to avoid CORS in development.

---

## 🧰 Technology Stack

### Backend
- Django 6.0
- Django REST Framework
- Django REST Framework GIS
- SimpleJWT
- GeoDjango / PostGIS support
- Redis

### Frontend
- Next.js 16+
- React 19
- Tailwind CSS
- Formik + Yup
- React Leaflet
- Axios

---

## 📁 Directory Layout

```text
Local_Service_Finder/
├── lsa_backend/         # Django project configuration
├── ls_backend/          # Django app logic, models, views, auth
├── lsa/                 # Next.js frontend application
├── docker-compose.yml   # Local PostGIS + Redis services
├── manage.py            # Django management script
└── requirements.txt     # Python dependencies
```

---

## 🛠️ Setup Guide

### 1. Start local services

```bash
cd /home/vscode/Local_Service_Finder
docker-compose up -d
```

### 2. Backend setup

```bash
cd /home/vscode/Local_Service_Finder
python -m venv myvenv
source myvenv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend setup

```bash
cd /home/vscode/Local_Service_Finder/lsa
npm install
npm run dev
```

### 4. Open the app

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 📌 API Reference

### Public Endpoints
- `GET /api/public/`
- `GET /api/public/<id>/`
- `GET /api/public/<limit>/<skip>/`
- `GET /api/public/search/nearby`

### Admin Endpoints
- `POST /api/login/`
- `POST /api/service/create`
- `PUT/PATCH /api/service/update/<pk>`
- `DELETE /api/service/delete/<pk>`

---

## ⚠️ Notes

- The frontend proxy configuration is defined in `lsa/next.config.ts`.
- Admin-only backend actions require authenticated users with the `admin` role.
- The backend uses spatial data types and is configured to work with PostGIS.

---

## 📄 License

MIT License
