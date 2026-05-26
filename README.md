# 📍 Local Service Finder

Local Service Finder is a full-stack application for discovering, managing, and exploring local services using a spatially-enabled backend and a modern React/Next.js frontend. The application leverages geospatial technology to provide intelligent proximity-based service discovery.

---

## 📌 Project Summary

This repository contains a Django REST API backend with GeoDjango/PostGIS support and a Next.js frontend powered by React. The project provides:

- **Public Service Search**: Real-time search and listing of local services with geospatial nearby search capabilities.
- **Admin Dashboard**: Comprehensive interface for creating, updating, and deleting service records.
- **JWT Authentication**: Secure cookie-based authentication for admin actions.
- **Interactive Map**: Map-based user interface using React Leaflet for visualizing services.
- **Caching Layer**: Redis integration for improved performance and session management.

---

## 🏗️ Project Structure

```
Local_Service_Finder/
├── lsa_backend/                    # Django Project Configuration
│   ├── settings.py                 # Django settings, DB config, installed apps
│   ├── urls.py                     # Main URL routing
│   ├── wsgi.py                     # WSGI application entry point
│   └── asgi.py                     # ASGI application entry point
│
├── ls_backend/                     # Django App (Core Business Logic)
│   ├── models.py                   # User & Servicer models with GeoDjango
│   ├── views.py                    # API endpoint handlers
│   ├── serializers.py              # DRF serializers for API responses
│   ├── permissions.py              # Custom permission classes
│   ├── urls.py                     # App-level URL routing
│   ├── migrations/                 # Database migrations
│   └── admin.py                    # Django admin configuration
│
├── lsa/                            # Next.js Frontend (App Router)
│   ├── app/
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout wrapper
│   │   ├── (auth)/                 # Authentication pages (login, signup)
│   │   ├── (public)/               # Public pages
│   │   │   ├── search/             # Service search page
│   │   │   ├── map/                # Map view page
│   │   │   └── services/           # Service listing page
│   │   ├── (admin)/                # Admin dashboard (protected routes)
│   │   │   ├── dashboard/          # Admin overview
│   │   │   ├── services/           # Manage services
│   │   │   └── users/              # Manage users
│   │   └── api/
│   │       └── [...]/              # API proxy routes to backend
│   ├── components/
│   │   ├── Map.tsx                 # Leaflet map component
│   │   ├── ServiceCard.tsx         # Service display card
│   │   ├── SearchBar.tsx           # Search input component
│   │   ├── AdminNav.tsx            # Admin navigation
│   │   └── AuthProvider.tsx        # JWT authentication context
│   ├── utils/
│   │   ├── api.ts                  # API client utilities
│   │   └── geospatial.ts           # Geospatial helper functions
│   ├── styles/                     # CSS/Tailwind styles
│   ├── next.config.ts              # Next.js configuration (proxy settings)
│   ├── tsconfig.json               # TypeScript config
│   └── package.json                # Frontend dependencies
│
├── docker-compose.yml              # Docker services (PostGIS, Redis)
├── manage.py                       # Django management script
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation

```

---

## 📊 Technology Stack

### **Backend (Python - 19%)**
| Technology | Purpose |
|------------|---------|
| **Django** | Web framework & ORM |
| **Django REST Framework (DRF)** | REST API development |
| **GeoDjango** | Geospatial database support |
| **PostGIS** | PostgreSQL spatial extension |
| **Redis** | Caching & session management |
| **JWT (djangorestframework-simplejwt)** | Authentication tokens |
| **Python 3.9+** | Runtime environment |

### **Frontend (TypeScript - 78.3%)**
| Technology | Purpose |
|------------|---------|
| **Next.js 13+** | React framework with App Router |
| **React 18+** | UI component library |
| **TypeScript** | Static type checking |
| **Leaflet** | Interactive mapping library |
| **React-Leaflet** | React wrapper for Leaflet |
| **Axios / Fetch API** | HTTP client for API calls |
| **Tailwind CSS** | Utility-first CSS framework |
| **Context API** | State management |

### **Infrastructure (2.3% CSS + 0.4% Other)**
| Technology | Purpose |
|------------|---------|
| **Docker & Docker Compose** | Containerization & orchestration |
| **PostgreSQL** | Primary relational database |
| **PostGIS Extension** | Geospatial data handling |
| **Nginx** | Reverse proxy (optional) |

---

## 🌐 Architecture Overview Diagrams

### **System Architecture - High Level**

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Browser["Browser<br/>(HTTP/HTTPS)"]
    end
    
    subgraph Frontend["Frontend Layer<br/>(TypeScript - 78.3%)"]
        NextApp["Next.js Application<br/>(App Router)"]
        Components["React Components<br/>(Maps, Forms, Dashboard)"]
        Auth["Auth Context<br/>(JWT Handler)"]
    end
    
    subgraph Proxy["API Proxy Layer"]
        Middleware["API Middleware<br/>(/api-backend/*)"]
    end
    
    subgraph Backend["Backend Layer<br/>(Python - 19%)"]
        Django["Django REST API<br/>(Port 8000)"]
        Models["Models<br/>(User, Servicer)"]
        Views["Views & Serializers<br/>(APIViews, Permissions)"]
        Auth_Backend["JWT Authentication"]
    end
    
    subgraph Data["Data Layer"]
        PostGIS["PostGIS Database<br/>(Geospatial Queries)"]
        Redis["Redis Cache<br/>(Sessions, Performance)"]
    end
    
    subgraph Infrastructure["Infrastructure"]
        Docker["Docker Compose<br/>(Orchestration)"]
    end
    
    Browser -->|HTTP Requests| NextApp
    NextApp --> Components
    Components --> Auth
    Auth -->|API Calls| Middleware
    Middleware -->|Proxy to Backend| Django
    Django --> Models
    Django --> Views
    Django --> Auth_Backend
    Views -->|Read/Write| PostGIS
    Views -->|Cache| Redis
    Docker -->|Runs| PostGIS
    Docker -->|Runs| Redis
    
    style Client fill:#e1f5ff
    style Frontend fill:#fff3e0
    style Backend fill:#f3e5f5
    style Data fill:#e8f5e9
    style Infrastructure fill:#fce4ec
```

### **Data Model - Entity Relationship Diagram**

```mermaid
erDiagram
    USER ||--o{ SERVICE_RECORD : "creates/edits"
    SERVICE_RECORD {
        int id PK "Primary Key"
        string name "Service Name"
        string category "Type: Hospital, ATM, Shop, etc"
        point location "GeoDjango PointField"
        float rating "1.0 - 5.0"
        text description "Service Description"
        string phone "Contact Number"
        datetime created_at "Creation Timestamp"
        datetime updated_at "Last Update"
    }
    
    USER {
        int id PK "Primary Key"
        string username "Unique Username"
        string email "Unique Email"
        string password "Hashed Password"
        string role "admin or public"
        boolean is_active "Account Status"
        datetime created_at "Account Creation"
    }
```

### **Frontend ↔ Backend Integration Flow**

```mermaid
graph LR
    subgraph Frontend_Components["Frontend Components"]
        HomePage["🏠 Home Page"]
        SearchPage["🔍 Search Page"]
        MapView["🗺️ Map View"]
        AdminDash["⚙️ Admin Dashboard"]
        ServiceForm["📝 Service Form"]
    end
    
    subgraph API_Layer["API Endpoints"]
        Auth["POST /api/login<br/>POST /api/logout"]
        PublicAPI["GET /api/public<br/>GET /api/public/search/nearby"]
        AdminAPI["POST /api/service/create<br/>PUT /api/service/update<br/>DELETE /api/service/delete"]
    end
    
    subgraph Backend_Logic["Backend Processing"]
        Views["DRF Views<br/>(APIView, ViewSet)"]
        Serializers["DRF Serializers<br/>(Validation, Transformation)"]
        Permissions["Permission Classes<br/>(IsAuthenticated, IsAdmin)"]
        Queries["GeoDjango Queries<br/>(Spatial Index, Filtering)"]
    end
    
    HomePage -->|Browse Services| PublicAPI
    SearchPage -->|Search Nearby| PublicAPI
    MapView -->|Fetch Services| PublicAPI
    AdminDash -->|Manage Services| AdminAPI
    ServiceForm -->|Create/Update| AdminAPI
    AdminDash -->|Login| Auth
    
    PublicAPI --> Views
    AdminAPI --> Auth
    Auth --> Permissions
    Views --> Serializers
    Serializers --> Queries
    
    style Frontend_Components fill:#fff3e0
    style API_Layer fill:#e3f2fd
    style Backend_Logic fill:#f3e5f5
```

### **Request-Response Cycle - Sequence Diagram**

```mermaid
sequenceDiagram
    participant User as 👤 User/Browser
    participant FE as 🔷 Next.js Frontend
    participant Proxy as 🔄 API Proxy
    participant BE as 🔶 Django Backend
    participant DB as 🗄️ PostGIS DB
    participant Cache as ⚡ Redis Cache
    
    User->>FE: Click "Search Nearby"
    FE->>FE: Get user location (lat, lng)
    FE->>Proxy: GET /api-backend/api/public/search/nearby?lat=40.7&lng=-74.0&radius=5000
    Proxy->>BE: Forward request to Django
    
    par Backend Processing
        BE->>Cache: Check if result cached
        Cache-->>BE: Cache miss
        BE->>DB: Spatial query: ST_Distance(location, point) < radius
        DB-->>BE: Return 50 nearby services
    end
    
    BE->>BE: Serialize services to JSON
    BE-->>Proxy: JSON response with services
    Proxy-->>FE: Response received
    FE->>FE: Parse JSON & render Map
    FE->>FE: Add markers & info windows
    FE-->>User: Display interactive map
    
    User->>User: Click on service marker
    FE->>FE: Show service details popup
```

### **Geospatial Query Flow**

```mermaid
graph TB
    UserInput["User Input<br/>(Lat, Lng, Radius)"]
    APIRequest["API Request<br/>(GET /search/nearby)"]
    GeoDjangoORM["GeoDjango ORM<br/>(QuerySet)"]
    SpatialIndex["PostGIS<br/>Spatial Index<br/>(GIST/BRIN)"]
    STFunctions["ST_Distance<br/>ST_DWithin<br/>ST_Contains"]
    Results["Filtered Results<br/>(Sorted by Distance)"]
    Serialization["DRF Serialization<br/>(JSON)"]
    Response["API Response<br/>(JSON Array)"]
    MapRender["Map Render<br/>(Leaflet)"]
    
    UserInput --> APIRequest
    APIRequest --> GeoDjangoORM
    GeoDjangoORM --> SpatialIndex
    SpatialIndex --> STFunctions
    STFunctions --> Results
    Results --> Serialization
    Serialization --> Response
    Response --> MapRender
    
    style SpatialIndex fill:#c8e6c9
    style STFunctions fill:#ffccbc
    style MapRender fill:#bbdefb
```

---

## 📚 API Reference

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/login/` | Authenticate user & set JWT cookie | ❌ |
| `POST` | `/api/logout/` | Clear JWT cookie | ✅ |
| `POST` | `/api/refresh/` | Refresh JWT token | ✅ |

### **Public Service Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/api/public/` | List all services (paginated) | ❌ |
| `GET` | `/api/public/<id>/` | Get service by ID | ❌ |
| `GET` | `/api/public/<limit>/<skip>/` | Paginated listing | ❌ |
| `GET` | `/api/public/search/nearby` | Geospatial nearby search | ❌ |

**Query Parameters for nearby search:**
- `lat` (float): User latitude
- `lng` (float): User longitude
- `radius` (int): Search radius in meters (default: 5000)
- `limit` (int): Max results (default: 50)

### **Admin Service Management Endpoints**

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| `POST` | `/api/service/create/` | Create new service | ✅ | Admin |
| `GET` | `/api/service/<id>/` | Retrieve service | ✅ | Admin |
| `PUT` | `/api/service/update/<pk>/` | Update service | ✅ | Admin |
| `PATCH` | `/api/service/update/<pk>/` | Partial update | ✅ | Admin |
| `DELETE` | `/api/service/delete/<pk>/` | Delete service | ✅ | Admin |

**POST /api/service/create/ - Request Body:**
```json
{
  "name": "City Hospital",
  "category": "Hospital",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  },
  "rating": 4.5,
  "description": "24/7 Emergency Services",
  "phone": "+1-555-0123"
}
```

---

## 🔎 Data Model Details

### **User Model**
- **id**: Primary key (auto-generated)
- **username**: Unique username for login
- **email**: Unique email address
- **password**: Hashed password (bcrypt/PBKDF2)
- **role**: "admin" or "public"
- **is_active**: Account status flag
- **created_at**: Account creation timestamp

### **Servicer Model**
- **id**: Primary key (auto-generated)
- **name**: Service/place name (indexed)
- **category**: Choice field (Hospital, ATM, Shop, Restaurant, Pharmacy, Other)
- **location**: GeoDjango PointField (WGS84 - SRID 4326)
- **rating**: Float field (1.0 - 5.0)
- **description**: Text field with service details
- **phone**: Contact phone number
- **created_at**: Creation timestamp
- **updated_at**: Last modification timestamp

**Important Notes:**
- `Servicer.location` is indexed using GIST or BRIN for efficient spatial queries
- Coordinates are stored in WGS84 (latitude/longitude)
- Distance calculations use PostGIS `ST_Distance` function

---

## 🛠️ Setup & Development Guide

### **Prerequisites**
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 13+

### **Step 1: Clone Repository**
```bash
git clone https://github.com/Sumitgupta54856171/Local_Service_Finder.git
cd Local_Service_Finder
```

### **Step 2: Start Docker Services**
```bash
# Start PostGIS and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### **Step 3: Setup Backend**
```bash
# Create virtual environment
python -m venv myvenv
source myvenv/bin/activate  # On Windows: myvenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server (Port 8000)
python manage.py runserver
```

### **Step 4: Setup Frontend**
```bash
# Navigate to frontend directory
cd lsa

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server (Port 3000)
npm run dev
```

### **Step 5: Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/docs/ (if Swagger is configured)

---

## 📁 Key File Locations

### **Backend Configuration**
- `lsa_backend/settings.py` — Database, installed apps, middleware
- `lsa_backend/urls.py` — Main URL routing
- `ls_backend/models.py` — User & Servicer models

### **API Implementation**
- `ls_backend/views.py` — API endpoint handlers
- `ls_backend/serializers.py` — Request/response serializers
- `ls_backend/permissions.py` — Custom permission classes
- `ls_backend/urls.py` — API route definitions

### **Frontend Pages & Components**
- `lsa/app/page.tsx` — Landing page
- `lsa/app/(public)/search/page.tsx` — Search interface
- `lsa/app/(public)/map/page.tsx` — Map view
- `lsa/app/(admin)/dashboard/page.tsx` — Admin dashboard
- `lsa/components/Map.tsx` — Leaflet map component
- `lsa/components/SearchBar.tsx` — Search input

### **Configuration Files**
- `lsa/next.config.ts` — Next.js proxy configuration
- `docker-compose.yml` — Docker services definition
- `requirements.txt` — Python dependencies
- `lsa/package.json` — Node.js dependencies

---

## 🔐 Authentication Flow

```mermaid
graph TD
    A["User Visits Admin Panel<br/>(lsa/app/admin)"]
    B["Check JWT Cookie"]
    C{Cookie Valid?}
    D["Redirect to Login"]
    E["POST /api/login<br/>(username + password)"]
    F["Backend Validates Credentials<br/>(User.check_password)"]
    G{Valid?}
    H["Generate JWT Token<br/>(Access + Refresh)"]
    I["Set HTTP-Only Cookie"]
    J["Store in Browser"]
    K["Access Admin Dashboard"]
    L["Include Cookie in API Requests"]
    M["Backend Verifies JWT<br/>(JWTAuthentication)"]
    N{Authorized?}
    O["Grant Access"]
    P["401 Unauthorized"]
    
    A --> B
    B --> C
    C -->|No/Expired| D
    D --> E
    C -->|Yes| K
    E --> F
    F --> G
    G -->|No| D
    G -->|Yes| H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N -->|Yes| O
    N -->|No| P
    
    style D fill:#ffcccc
    style O fill:#ccffcc
    style P fill:#ffcccc
```

---

## 📚 Contributing Guidelines

### **Code Style**
- **Python**: Follow PEP 8 (use `black` and `flake8`)
- **TypeScript**: Use ESLint configuration in project
- **Commit Messages**: Use conventional commits (feat:, fix:, docs:, etc.)

### **Adding Features**

#### **New Backend Model**
1. Define model in `ls_backend/models.py`
2. Create serializer in `ls_backend/serializers.py`
3. Create view in `ls_backend/views.py`
4. Add URL pattern in `ls_backend/urls.py`
5. Generate migration: `python manage.py makemigrations`
6. Apply migration: `python manage.py migrate`

#### **New Frontend Page**
1. Create component in `lsa/app/page.tsx` or `lsa/app/(group)/page.tsx`
2. Add navigation link in header/sidebar
3. Implement API integration in component
4. Style with Tailwind CSS

#### **Geospatial Optimizations**
- Always index location fields with GIST or BRIN index
- Use `ST_DWithin` for faster distance filtering
- Cache frequently accessed spatial queries in Redis
- Use PostGIS `ST_Buffer` for area searches

---

## ⚠️ Important Notes

### **Configuration**
- Frontend proxy: `/api-backend/*` → Django backend (defined in `lsa/next.config.ts`)
- Admin operations require `role='admin'`
- PostGIS extension required for all location-based features
- Redis for caching and session management

### **Environment Variables**
```env
# Backend (.env)
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/lsf_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-jwt-secret

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAP_TOKEN=your-mapbox-token-if-needed
```

### **Performance Considerations**
- Spatial queries use indexed location fields
- Redis caches frequently accessed services
- Pagination limits default to 50 results per page
- Consider database connection pooling for production

### **Security**
- Passwords hashed using Django's default hasher (PBKDF2)
- JWT tokens stored in HTTP-only cookies (CSRF protection)
- API endpoints protected with permission classes
- Admin endpoints require authentication and admin role

---

## 🚀 Deployment

### **Production Checklist**
- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure allowed hosts and CORS
- [ ] Use environment-specific `.env` file
- [ ] Generate new `SECRET_KEY`
- [ ] Use PostgreSQL with PostGIS in production
- [ ] Setup Redis for caching
- [ ] Configure SSL/TLS certificates
- [ ] Use Gunicorn/uWSGI for Django
- [ ] Use Vercel/Netlify for Next.js or self-host with Nginx
- [ ] Setup monitoring and logging

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support & Contact

For issues, questions, or contributions, please open a GitHub issue or contact the maintainers.

**Repository**: [Local Service Finder](https://github.com/Sumitgupta54856171/Local_Service_Finder)

---

**Last Updated**: 2026-05-26
