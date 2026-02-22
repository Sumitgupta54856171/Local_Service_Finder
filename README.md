# 📍 Local Service Finder

A professional, high-performance platform designed to help users find and manage local services efficiently. This project features a robust **Django REST Framework** backend with spatial capabilities and a modern **Next.js** frontend.

---

## 🏗️ Project Structure

```text
Local_Service_Finder/
├── 📂 lsa_backend/          # Django Project Configuration
├── 📂 ls_backend/           # Django App (Business Logic, Models, Views)
│   ├── 📂 utils/            # Helper functions & middleware
│   ├── 📄 models.py         # Database schema
│   └── 📄 views.py          # API Endpoints
├── 📂 lsa/                   # Next.js Frontend (Primary)
│   ├── 📂 app/              # App router & pages
│   ├── 📂 components/       # Reusable UI components
│   └── 📂 public/           # Static assets
├── 📂 my-app/                # Secondary/Alternative Frontend
├── 📄 docker-compose.yml    # ELK Stack (Elasticsearch, Logstash, Kibana)
├── 📄 JENKINSFILE           # CI/CD Pipeline Configuration
├── 📄 manage.py             # Django management script
└── 📄 README.md             # Project documentation
```

---

## 🚀 Tech Stack

### Backend
- **Framework:** Django 6.0 + Django REST Framework (DRF)
- **Database:** PostgreSQL + **PostGIS** (for Location-based services)
- **Authentication:** SimpleJWT (JSON Web Tokens)
- **Search & Analytics:** ELK Stack (Elasticsearch, Logstash, Kibana)

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Redux Toolkit
- **Maps:** React Leaflet & Google Maps API
- **Forms:** Formik + Yup

### DevOps & Infrastructure
- **CI/CD:** Jenkins
- **Containerization:** Docker & Docker Compose
- **Environment Management:** Python-environ

---

## ✨ Key Features

- 🗺️ **Geospatial Search:** Find services near you using PostGIS.
- 🔐 **Secure Auth:** JWT-based authentication with token rotation.
- 📊 **Monitoring:** Integrated ELK stack for log analysis and data visualization.
- ⚡ **Performance:** Optimized API with custom throttling and exception handling.
- 📱 **Responsive UI:** Modern, mobile-first design using Next.js and Tailwind.

---

## 🛠️ Installation & Setup

### 1. Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd Local_Service_Finder

# Create and activate virtual environment
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install dependencies (ensure you have libpq-dev and gdal-bin for PostGIS)
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env  # Update .env with your DB credentials

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd lsa
npm install
npm run dev
```

### 3. ELK Stack (Optional)
```bash
docker-compose up -d
```
- **Kibana:** http://localhost:5601
- **Elasticsearch:** http://localhost:9200

---

## 🛠 CI/CD
This project uses **Jenkins** for automated builds and deployments. Refer to the `JENKINSFILE` for pipeline stages.

---

## 📝 License
This project is licensed under the MIT License.
