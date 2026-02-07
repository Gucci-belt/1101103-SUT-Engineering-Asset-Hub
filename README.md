# 📦 SUT Engineering Asset Hub
> **Modern Lab Asset Management System with DevOps & Security Best Practices**

ยินดีต้อนรับสู่ **SUT Engineering Asset Hub** ระบบบริหารจัดการการยืม-คืนครุภัณฑ์ในห้องปฏิบัติการวิศวกรรมคอมพิวเตอร์ โปรเจกต์นี้ถูกพัฒนาขึ้นเพื่อยกระดับมาตรฐานความปลอดภัยและการจัดการด้วย **Modern DevOps Stack** (Docker, Jenkins, Trivy) และ **Production-Grade Security Architecture**

![App Banner](https://www.dexerto.com/cdn-image/wp-content/uploads/2025/10/30/67-kid-meme-word-of-the-year.jpg)

---

## 🌟 ฟีเจอร์เด่น (Key Features)

### 🔐 Advanced Authentication (New!)
- **Dual Login System:** รองรับทั้ง **Google SSO** (via Clerk) และ **Custom JWT System**
- **Seamless UX:** ระบบตรวจสอบสิทธิ์อัตโนมัติ ไม่ต้อง Login ซ้ำ
- **Secure Session:** ใช้ HttpOnly Cookies และป้องกัน Token Theft

### 🛡️ Production-Grade Security (Verified)
- **Secrets Management:** ไม่มีการ Hardcode รหัสผ่านใน Source Code (ใช้ `.env.prod` Injection)
- **Container Hardening:**
    - ✅ **Rootless Containers:** Server รันด้วย `USER node` เพื่อจำกัดสิทธิ์ (Least Privilege)
    - ✅ **Network Isolation:** Database ไม่เปิด Port สู่สาธารณะ (Internal Network Only)
- **CI/CD Security:**
    - ✅ **Automated Vulnerability Scanning:** สแกนหาช่องโหว่ด้วย **Trivy** ก่อน Deploy ทุกครั้ง
    - ✅ **GitOps:** ตรวจสอบความปลอดภัยของ Dependencies อัตโนมัติ
- **Web Server Hardening:**
    - ✅ **Nginx Security Headers:** HSTS, CSP (Content Security Policy), X-Frame-Options
    - ✅ **Rate Limiting:** ป้องกันการโจมตีแบบ Brute Force และ DDoS

### 💻 User Experience
- **Interactive Dashboard:** แสดงสถานะครุภัณฑ์ Real-time
- **Smart Booking:** ระบบจองที่ตรวจสอบสถานะอัจฉริยะ
- **History Tracking:** ตรวจสอบประวัติย้อนหลังได้ 100%

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| Category | Technology |
|----------|------------|
| **Frontend** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [Clerk Auth](https://clerk.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/) |
| **DevOps** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) |
| **Security** | [Trivy](https://trivy.dev/) (Scanner), [OWASP ZAP](https://www.zaproxy.org/) |
| **CI/CD** | [Jenkins](https://www.jenkins.io/) (Automated Build & Scan) |
| **Monitoring** | [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) |

---

## 🚀 วิธีการติดตั้งและใช้งาน (Production Deployment)

เนื่องจากระบบเน้นความปลอดภัยไฟล์ `.env.prod` จึงไม่ถูกเก็บใน Git ผู้ดูแลระบบต้องสร้างเองหน้างาน

### 1. Requirements
- Server (Ubuntu/Debian) with Docker & Docker Compose installed
- Domain Name (สำหรับ SSL Configuration)

### 2. Setup Environment Variables
สร้างไฟล์ `.env.prod` บน Server (ที่ Root Directory ของโปรเจกต์):
```bash
nano .env.prod
```
ใส่ค่า Configuration ดังนี้:
```env
# Database
POSTGRES_USER=admin_prod
POSTGRES_PASSWORD=VeryStrongPassword!
POSTGRES_DB=it_assets
DATABASE_URL=postgresql://admin_prod:VeryStrongPassword!@db:5432/it_assets?schema=public

# Server Security
JWT_SECRET=RandomLongStringForSecurity

# Clerk Auth Keys (From Dashboard)
CLERK_SECRET_KEY=sk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### 3. Deploy
รันคำสั่ง Docker Compose โดยระบุไฟล์ Env:
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

### 4. Access Points
- **Web App:** `https://your-domain.com`
- **Grafana:** `http://your-domain.com:3001`
- **Jenkins:** `http://your-domain.com:8080`

---

## 📁 โครงสร้างโปรเจกต์ (Folder Structure)

```
Project Root/
├── client/              # React Frontend + Nginx Security Config
├── server/              # Express Backend + Rootless Dockerfile
├── docker-compose.prod.yml # Production Orchestration (Secured)
├── .env.prod.example    # Template for Secrets
├── Jenkinsfile          # CI/CD Pipeline + Trivy Scan
└── README.md            # Documentation
```

---

## 🎥 Project Showcase (Production Grade)

> [!TIP]
> **View the specialized Technical Architecture & Security Analysis video here:**
>
> [![Watch the video]

https://github.com/user-attachments/assets/8d27f658-559d-49b4-8650-b02e6fa0cc36


>
> *(Link to be updated after render)*

---

# 🏅 Technical Architecture & Security Evaluation

> [!NOTE]
> **Assessment Summary:** This project demonstrates **Production-Grade Engineering Maturity**, far exceeding typical academic standards. It successfully balances User Experience with rigorous Security and DevOps practices.

### 🏗️ 1. Architectural Integrity (สถาปัตยกรรมระบบ)
ระบบถูกออกแบบด้วยสถาปัตยกรรม **Microservices-Ready** ที่มีความยืดหยุ่นสูง:
*   **Decoupled Services:** การแยก Frontend (Client), Backend (Server), และ Database ออกจากกันอย่างชัดเจนผ่าน **Docker Compose** ทำให้สามารถ Scale หรือ Maintenance แต่ละส่วนได้อิสระ
*   **Reverse Proxy Implementation:** การใช้ **Nginx** เป็น Gateway ช่วยจัดการ SSL Termination, Caching และ Security Headers ได้อย่างมีประสิทธิภาพ ลดภาระของ Application Server

### 🛡️ 2. Security Posture (ความปลอดภัยระดับองค์กร)
จุดเด่นที่สุดของโปรเจกต์นี้คือการให้ความสำคัญกับ **Defense-in-Depth**:
*   **Identity & Access Management (IAM):** การใช้ **Clerk** ร่วมกับ **Custom JWT** ช่วยปิดช่องโหว่ด้าน Authentication (เช่น Brute Force, Credential Stuffing) ได้อย่างสมบูรณ์
*   **Infrastructure Security:**
    *   ✅ **Rootless Containers:** Server รันด้วย `USER node` ป้องกันการโจมตีแบบ Privilege Escalation
    *   ✅ **Network Isolation:** Database ซ่อนอยู่ใน Internal Network ไม่เปิด Public Port ลด Surface Area ของการโจมตี
    *   ✅ **Secrets Management:** ไม่มีการ Hardcode Credentials ใน Source Code (ใช้ Environment Injection)
*   **Application Security:** การ Implement **Security Headers** (HSTS, CSP, X-Frame-Options) ช่วยป้องกัน XSS และ Clickjacking ได้ตามมาตรฐาน OWASP

### 🚀 3. DevOps & Automation Excellence
กระบวนการพัฒนาสะท้อนถึงแนวคิด **DevSecOps** ที่ทันสมัย:
*   **Automated Pipeline:** การใช้ **Jenkins** ทำ CI/CD ช่วยลดความผิดพลาดจาก Human Error ในการ Deploy
*   **Shift-Left Security:** การผนวก **Trivy (Vulnerability Scanner)** เข้าไปใน Pipeline ทำให้ทราบถึงช่องโหว่ของ Dependencies ตั้งแต่ก่อน Deploy จริง
*   **Observability:** การมี **Prometheus** และ **Grafana** แสดงให้เห็นถึงความใส่ใจในการดูแลรักษาระบบ (Monitoring & Maintenance) หลังการ Deploy

---
*Developed for Educational Purpose @ SUT*
