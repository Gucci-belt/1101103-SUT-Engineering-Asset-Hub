# � SUT Engineering Asset Hub
> **Modern Lab Asset Management System with DevOps & Security Best Practices**

ยินดีต้อนรับสู่ **SUT Engineering Asset Hub** ระบบบริหารจัดการการยืม-คืนครุภัณฑ์ในห้องปฏิบัติการวิศวกรรมคอมพิวเตอร์ โปรเจกต์นี้ถูกพัฒนาขึ้นไม่เพียงเพื่อแก้ปัญหาการจัดการอุปกรณ์ แต่ยังเน้นการใช้ **Modern DevOps & Security Stack** เพื่อให้พร้อมสำหรับการใช้งานจริง (Production Grade)

![App Screenshot](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop) *(ภาพจำลอง)*

---

## 🌟 ฟีเจอร์เด่น (Key Features)

### 🧑‍💻 User Experience
- **Interactive Dashboard:** หน้าต่างแสดงรายการครุภัณฑ์แบบ Real-time พร้อมรูปภาพและสถานะ
- **Smart Booking:** ระบบจองที่ตรวจสอบความพร้อมของอุปกรณ์ทันที
- **History Tracking:** ดูประวัติการยืม-คืนย้อนหลังได้ทั้งหมด

### 🛡️ Security & Pentesting (Verified)
- **Role-Based Access Control (RBAC):** แยกสิทธิ์ Admin/Student ชัดเจน (Verified via Postman)
- **Secure Authentication:** JWT (JSON Web Tokens) + Bcrypt Hashing + PIN Recovery
- **Protection:**
    - ✅ **XSS Protection:** ป้องกันการฝัง Script (Auto-escaping by React)
    - ✅ **IDOR Protection:** ป้องกันการแอบดูข้อมูลผู้อื่น (Secure Token Validation)
    - ✅ **Security Headers:** HSTS, CSP, X-Frame-Options (Verified by OWASP ZAP)

### 🔧 DevOps & Monitoring
- **Containerization:** รันทุกอย่างบน **Docker** (Frontend, Backend, DB, Certbot, Monitoring)
- **CI/CD Pipeline:** อัตโนมัติด้วย **Jenkins** (Poll SCM -> Build -> Deploy)
- **Observability:**
    - **Prometheus:** ดึง Metrics การทำงานของ Server (CPU, RAM, Request Count)
    - **Grafana:** Dashboard สวยงามสำหรับดูสถานะระบบแบบ Real-time
- **Database Management:** **Adminer** (Web GUI) สำหรับจัดการ Database

---

## �️ เทคโนโลยีที่ใช้ (Tech Stack)

| Category | Technology |
|----------|------------|
| **Frontend** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/) |
| **DevOps** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) |
| **CI/CD** | [Jenkins](https://www.jenkins.io/) |
| **Web Server** | [Nginx](https://nginx.org/) (Reverse Proxy, SSL, Caching) |
| **Monitoring** | [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) |
| **Testing** | [Postman](https://www.postman.com/), [OWASP ZAP](https://www.zaproxy.org/) |

---

## 🚀 วิธีการติดตั้งและใช้งาน (Production / Docker)

> **👨‍💻 สำหรับนักพัฒนา / การรันแบบ Local (Dev Mode):**
> หากต้องการรันบนเครื่องตัวเองโดยไม่ใช้ Docker หรือต้องการโหมด **"สาธิต (Demo/WIP)"**
> กรุณาอ่านคู่มือที่ไฟล์ 👉 **[README_DEV.md](./README_DEV.md)**

---

วิธีที่ง่ายที่สุดคือการรันผ่าน **Docker Compose** (ไม่ต้องลง Node/Postgres ในเครื่อง)

### 1. Clone Project
```bash
git clone https://github.com/Gucci-belt/1101103-SUT-Engineering-Asset-Hub.git
cd 1101103-SUT-Engineering-Asset-Hub
```

### 2. Setup Environment Variables
เข้าไปที่โฟลเดอร์ `server` และสร้างไฟล์ `.env`:
```env
DATABASE_URL="postgresql://user:password@db:5432/it_assets?schema=public"
JWT_SECRET="supersecretkey"
PORT=3000
```

### 3. Run with Docker Compose
คำสั่งเดียว จบทุกอย่าง (Frontend, Backend, DB, Prometheus, Grafana, Adminer):
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Access the Application
- **Web App:** `https://your-domain.com` (หรือ `http://localhost`)
- **Grafana (Monitoring):** `http://localhost:3001` (User: `admin` / Pass: `admin`)
- **Adminer (DB GUI):** `http://localhost:8081` (System: `PostgreSQL`, Server: `db`, User: `user`, Pass: `password`)
- **Jenkins:** `http://localhost:8080`

---

## 📝 คู่มือการทดสอบความปลอดภัย (Security Testing)
โปรเจกต์นี้ผ่านการทดสอบความปลอดภัยตามมาตรฐาน **OWASP WSTG Checklist**:
1.  **Automated Scan:** ผ่านการสแกนด้วย **OWASP ZAP** (Baseline Scan)
2.  **Manual Test:**
    - ทดสอบ **XSS** บน React Component
    - ทดสอบ **IDOR** บน Transaction API
    - ทดสอบ **Access Control** บน Admin Route

*(ดูเอกสารฉบับเต็มได้ที่ `Pentest_Guide_TH.md` ในโฟลเดอร์ Documentation)*

---

## � โครงสร้างโปรเจกต์ (Folder Structure)

```
Project Root/
├── client/              # React Frontend + Nginx Config
├── server/              # Express Backend + Prisma
│   ├── src/             
│   │   ├── controllers/ # Business Logic
│   │   ├── routes/      # API Endpoints
│   │   └── middleware/  # Auth & Security Logic
├── tests/               # Load Testing Scripts (k6)
├── docker-compose.prod.yml # Production Orchestration
├── prometheus.yml       # Monitoring Config
├── Jenkinsfile          # CI/CD Pipeline Definitions
└── README.md            # You are here!
```

---
*Developed for Educational Purpose @ SUT*
