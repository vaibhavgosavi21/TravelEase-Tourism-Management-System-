git # TravelEase – Tourism Management System

A full-stack tourism booking web application built with **Spring Boot** and **React.js**.
Users can browse destinations, book tour packages, and manage their profile.
Admins can manage packages, bookings, users, and view a real-time dashboard.

---

## Live Demo

| Service  | URL |
|---|---|
| Frontend | https://travelease.vercel.app |
| Backend  | https://travelease-api.onrender.com |
| Swagger  | https://travelease-api.onrender.com/swagger-ui.html |

> Demo credentials — Email: `admin@travelease.com` | Password: `admin123`

---

## Screenshots

> Add screenshots here after deployment.
> <img width="1903" height="919" alt="image" src="https://github.com/user-attachments/assets/7304ced8-3026-4ac1-a0a2-25f4ecc22457" />
<img width="576" height="757" alt="image" src="https://github.com/user-attachments/assets/b847c698-a1f0-4d4b-8d7a-00b8a304be49" />

<img width="1900" height="859" alt="image" src="https://github.com/user-attachments/assets/c16d839a-5e7f-489c-9dbf-613a1cc368a4" />
<img width="1841" height="899" alt="image" src="https://github.com/user-attachments/assets/3ddd357d-1ee2-45c5-b087-d8ab0a023827" />
<img width="1916" height="919" alt="image" src="https://github.com/user-attachments/assets/c745fc8a-7d1f-4072-a6d9-0763f38f84d0" />
<img width="1908" height="916" alt="image" src="https://github.com/user-attachments/assets/d2d20aae-dd4e-4f7d-82bb-0df7124f8496" />
<img width="1591" height="728" alt="image" src="https://github.com/user-attachments/assets/54e16df1-2d39-4809-a755-6ad4946fcd4c" />

<img width="1210" height="784" alt="image" src="https://github.com/user-attachments/assets/80b09796-be6c-4bd6-8487-59bf0d637559" />



---

## Features

### Customer
- Register and login with JWT authentication
- Browse and search tour packages
- Filter packages by category, price range, destination
- View full package details with reviews
- Book a tour package with date and traveler count
- Live total price calculation before booking
- View booking history with status badges
- Cancel a booking
- Submit reviews with star ratings
- Update profile and change password
- Contact us form

### Admin
- Dashboard with total users, bookings, revenue, unread messages
- Booking status breakdown — Pending, Confirmed, Cancelled, Completed
- Manage tour packages — Create, Edit, Delete
- Manage destinations — Create, Edit, Delete
- Manage all bookings — Update status
- Manage registered users — Enable / Disable accounts
- Manage reviews — View and delete
- View and manage contact messages — Mark as read

### Async Booking Flow (Amazon SQS)
- Booking created → Message sent to SQS queue
- Background consumer picks up message
- Generates PDF invoice using iText
- Sends booking confirmation email with invoice attached
- Updates booking status to CONFIRMED

---

## Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 3.3 | REST API framework |
| Spring Security | Authentication and authorization |
| JWT (jjwt 0.12) | Stateless token-based auth |
| Spring Data JPA | Database ORM |
| Hibernate | JPA implementation |
| MySQL | Relational database |
| Amazon SQS | Async booking message queue |
| iText 8 | PDF invoice generation |
| JavaMail | Booking confirmation emails |
| Swagger / OpenAPI | API documentation |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Tailwind CSS | Utility-first styling |
| React Hook Form | Form validation |
| Framer Motion | Subtle animations |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |

### Cloud & Deployment
| Service | Purpose |
|---|---|
| Amazon SQS | Booking message queue |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MySQL (Free tier) | Production database |

---

## Project Architecture

```
React Frontend (Vercel)
        │
        │ HTTP / REST API
        ▼
Spring Boot Backend (Render)
        │
        ├── Spring Security (JWT Filter)
        ├── Controllers → Services → Repositories
        └── MySQL Database
                │
                ▼
        Amazon SQS Queue
                │
                ▼
        Background Consumer
                │
                ├── Generate PDF Invoice (iText)
                └── Send Confirmation Email (JavaMail)
```

---

## Database Schema

```
roles ──────────────── users
users ──────────────── bookings
users ──────────────── reviews
users ──────────────── contact_messages
destinations ────────── tour_packages
tour_packages ────────── bookings
tour_packages ────────── reviews
bookings ────────────── payments
bookings ────────────── invoices
```

**Tables:** `roles`, `users`, `destinations`, `tour_packages`, `bookings`,
`payments`, `reviews`, `invoices`, `contact_messages`, `notifications`

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java | 21 |
| Maven | 3.9+ |
| MySQL | 8.0+ |
| Node.js | 18+ |
| npm | 9+ |

---

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/travelease.git
cd travelease/travelease-backend
```

**2. Create MySQL database**
```sql
CREATE DATABASE travelease_db;
```

**3. Configure environment**

Open `src/main/resources/application.properties` and update:
```properties
spring.datasource.password=your_mysql_password
```

Or set environment variables:
```env
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_256_bit_secret_key
```

**4. Run the application**
```bash
mvn spring-boot:run
```

**5. Verify startup**

Open: `http://localhost:8080/swagger-ui.html`

On first startup the app automatically seeds:
- Roles: `ROLE_ADMIN`, `ROLE_CUSTOMER`
- Admin user: `admin@travelease.com` / `admin123`
- 5 sample destinations
- 4 sample tour packages

---

### Frontend Setup

**1. Navigate to frontend**
```bash
cd travelease/travelease-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
```

**4. Start development server**
```bash
npm run dev
```

Open: `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/users/me` | Customer |
| PUT | `/api/v1/users/me` | Customer |
| PUT | `/api/v1/users/me/change-password` | Customer |
| GET | `/api/v1/admin/users` | Admin |
| PUT | `/api/v1/admin/users/{id}/toggle-status` | Admin |

### Destinations
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/destinations` | Public |
| GET | `/api/v1/destinations/{id}` | Public |
| POST | `/api/v1/admin/destinations` | Admin |
| PUT | `/api/v1/admin/destinations/{id}` | Admin |
| DELETE | `/api/v1/admin/destinations/{id}` | Admin |

### Tour Packages
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/packages?search=&category=&minPrice=&maxPrice=` | Public |
| GET | `/api/v1/packages/{id}` | Public |
| POST | `/api/v1/admin/packages` | Admin |
| PUT | `/api/v1/admin/packages/{id}` | Admin |
| DELETE | `/api/v1/admin/packages/{id}` | Admin |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/bookings` | Customer |
| GET | `/api/v1/bookings` | Customer |
| PUT | `/api/v1/bookings/{id}/cancel` | Customer |
| GET | `/api/v1/admin/bookings` | Admin |
| PUT | `/api/v1/admin/bookings/{id}/status` | Admin |

### Reviews & Contact
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/reviews/package/{id}` | Public |
| POST | `/api/v1/reviews` | Customer |
| POST | `/api/v1/contact` | Public |
| GET | `/api/v1/admin/contact` | Admin |

### Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/admin/dashboard` | Admin |

Full API documentation available at `/swagger-ui.html`

---

## Environment Variables

### Backend
```env
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_256_bit_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
SQS_QUEUE_URL=https://sqs.ap-south-1.amazonaws.com/account/travelease-bookings
SQS_ENABLED=false
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Project Structure

### Backend
```
src/main/java/com/travelease/
├── config/          # Security, AWS, Swagger, DataSeeder
├── controller/      # REST controllers
├── dto/             # Request and response objects
├── entity/          # JPA entities
├── exception/       # Global exception handling
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter and utilities
└── service/         # Business logic
```

### Frontend
```
src/
├── api/             # Axios instance and API service functions
├── components/
│   ├── common/      # Spinner, ErrorMessage, RouteGuards
│   ├── home/        # Hero, DestinationCard
│   ├── layout/      # Navbar, Footer, Layout, AdminLayout
│   └── packages/    # PackageCard
├── context/         # AuthContext (global auth state)
├── hooks/           # useFetch custom hook
├── pages/
│   ├── admin/       # Admin dashboard pages
│   └── *.jsx        # Public and customer pages
└── utils/           # Helper functions
```

---

## Git Commit History

```
chore: initialize Spring Boot project with base configuration
docs: add complete database schema and ER diagram
feat: implement JWT authentication with register and login
feat: add user profile and admin user management module
feat: add destination module with public and admin APIs
feat: add tour package module with search and filter support
feat: implement booking module with SQS message dispatch
feat: integrate Amazon SQS with invoice generation and email
feat: add admin dashboard, review module, and contact module
feat: initialize React frontend with routing, auth context, and API layer
feat: build Navbar, Footer, Login, Register, and Home page
feat: build Packages, PackageDetail, Booking, MyBookings, Profile pages
feat: build complete admin dashboard with all management pages
```

---

## Key Concepts Used

- **JWT Authentication** — Stateless token-based auth, no server sessions
- **Spring Security Filter Chain** — Every request passes through `JwtFilter`
- **Role-Based Access Control** — `ROLE_ADMIN` and `ROLE_CUSTOMER`
- **Amazon SQS** — Decouples booking creation from email/invoice processing
- **Soft Delete** — Destinations and packages are deactivated, not deleted
- **DTO Pattern** — Entities never exposed directly, always mapped to DTOs
- **Global Exception Handler** — Consistent JSON error responses for all errors
- **React Context** — Global auth state without prop drilling
- **Custom useFetch Hook** — Reusable data fetching with loading and error states

---

## Common Interview Questions This Project Covers

- How does JWT authentication work?
- What is the difference between authentication and authorization?
- What is Spring Security Filter Chain?
- Why use a message queue like Amazon SQS?
- What is the difference between `@RestController` and `@Controller`?
- What is `@Transactional` and when is it needed?
- What is soft delete and why is it preferred?
- What is the DTO pattern and why not return entities directly?
- How does React Context differ from Redux?
- What are Axios interceptors?

---

## Author

**Vaibhav**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## License

This project is open source and available under the [MIT License](LICENSE).
