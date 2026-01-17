# 📚 API Documentation (SUT Engineering Asset Hub)

เอกสารรวบรวม API Endpoints ทั้งหมดของระบบ สำหรับใช้ในการพัฒนาและทดสอบ

**Base URL:** `http://localhost:3000/api`

---

## 🔐 1. Authentication (การยืนยันตัวตน)

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | ลงทะเบียนผู้ใช้งานใหม่ | ❌ No | `{ studentId, password, role? }` |
| **POST** | `/auth/login` | เข้าสู่ระบบเพื่อรับ Token | ❌ No | `{ studentId, password }` |
| **POST** | `/auth/reset-password` | เปลี่ยนรหัสผ่านใหม่ | ❌ No | `{ studentId, newPassword }` |

---

## 📦 2. Assets (จัดการอุปกรณ์)

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/assets` | ดูรายการอุปกรณ์ทั้งหมด | ❌ No | - |
| **POST** | `/assets` | เพิ่มอุปกรณ์ใหม่ | ✅ Admin Token | `{ name, serialNumber, category, imagePath }` |
| **PUT** | `/assets/:id` | แก้ไขข้อมูลอุปกรณ์ | ✅ Admin Token | `{ name, serialNumber, category, status, imagePath }` |
| **DELETE** | `/assets/:id` | ลบอุปกรณ์ (ต้องไม่มีการยืมค้าง) | ✅ Admin Token | `id` (URL Param) |

---

## 🔄 3. Transactions (การยืม-คืน) - User Side

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/transactions/borrow` | ส่งคำขอยืมอุปกรณ์ | ✅ User Token | `{ userId, assetId, dueDate, reason }` |
| **GET** | `/transactions/my-history` | ดูประวัติการยืมของตัวเอง | ✅ User Token | `?userId=...` (Query Param) |
| **DELETE** | `/transactions/:id` | ยกเลิกคำขอ (เฉพาะสถานะ Pending) | ✅ User Token | `id` (URL Param) |

---

## 🛡️ 4. Transactions - Admin Side

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/admin/transactions` | ดูรายการยืม-คืนทั้งหมด | ✅ Admin Token | - |
| **PUT** | `/admin/transactions/:id/approve` | อนุมัติคำขอยืม (เปลี่ยนสถานะเป็น Approved) | ✅ Admin Token | `id` (URL Param) |
| **PUT** | `/admin/transactions/:id/reject` | ปฏิเสธคำขอ | ✅ Admin Token | `id` (URL Param) |
| **PUT** | `/admin/transactions/:id/return` | บันทึกการรับคืน (เปลี่ยนสถานะเป็น Returned) | ✅ Admin Token | `id` (URL Param) |

---

## 👥 5. User Management (จัดการผู้ใช้งาน)

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/users` | ดูรายชื่อผู้ใช้งานทั้งหมด | ✅ Admin Token | - |
| **DELETE** | `/users/:id` | ลบผู้ใช้งานและประวัติทั้งหมด | ✅ Admin Token | `id` (URL Param) |

---

## ☁️ 6. Miscellaneous (อื่นๆ)

| Method | Endpoint | Description | Auth Required | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/upload` | อัปโหลดรูปภาพ | ❌ Public* | `image` (Form-Data) |

> *Note: `/upload` endpoint is functionally public to allow image upload during creation, but front-end usage typically happens inside authenticated modals.*
