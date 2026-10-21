# React + Go monorepo (without Nx)

สำเนาแอปจากโปรเจกต์เดิม โดยไม่ใช้ Nx, Nx Cloud หรือ Nx plugins
คงโค้ดแอปและ tests เดิมไว้ ใช้ Bun scripts เรียก Vite, TypeScript, Vitest และ Go โดยตรง
Dependencies ของ frontend อยู่ที่ root ไม่จำเป็นต้องมี package workspace แยกต่อแอป

## เครื่องมือที่ต้องใช้

- Node.js 24 ขึ้นไป (Vite และ Vitest ทำงานบน Node.js)
- Bun 1.1.30 ตาม `packageManager` และ CI
- Go ตามเวอร์ชันใน [apps/backend/go.mod](apps/backend/go.mod)

## เริ่มใช้งาน

รันคำสั่งจากโฟลเดอร์นี้:

1. `bun install --frozen-lockfile`
2. `bun run dev` เพื่อเริ่ม frontend และ backend พร้อมกัน (Ctrl+C เพื่อหยุดทั้งคู่)
3. เปิด http://localhost:4200

คำสั่ง `bun run dev`, `bun run dev:frontend` และ `bun run dev:backend` เรียกจากโฟลเดอร์ย่อยได้เช่นกัน
โดย scripts จะอ้างอิงตำแหน่ง root package โดยอัตโนมัติ ส่วนคำสั่งอื่นให้รันจาก root

Frontend proxy `/api` ไปยัง backend ที่ http://localhost:8080 ทั้งโหมด dev และ preview
Backend อ่านและเขียน [apps/backend/data.json](apps/backend/data.json) โดยอ้างอิง working directory ของโปรเซส
Scripts จึงเข้าโฟลเดอร์ backend ก่อนเริ่มเซิร์ฟเวอร์

## คำสั่ง

| คำสั่ง | การทำงาน |
| --- | --- |
| `bun run dev` | เปิดทั้งสองแอปพร้อมกัน |
| `bun run dev:frontend` | เปิด Vite ที่พอร์ต 4200 |
| `bun run dev:backend` | เปิด Go API ที่พอร์ต 8080 |
| `bun run typecheck` | ตรวจ types ของ frontend, tests และ Vite config |
| `bun run test` | ทดสอบ frontend และ backend (Go race detector) |
| `bun run test:frontend` | รัน Vitest ครั้งเดียว |
| `bun run test:frontend:watch` | รัน Vitest แบบ watch |
| `bun run test:frontend:coverage` | เก็บ frontend coverage |
| `bun run test:backend` | รัน Go tests พร้อม race detector |
| `bun run vet` | ตรวจ Go ด้วย `go vet` |
| `bun run build` | Build frontend และ backend ไว้ใน `dist/` |
| `bun run preview` | เปิด frontend ที่ build แล้วบนพอร์ต 4300; ต้องเปิด backend แยก |
| `bun run check` | Typecheck, tests, vet และ build ตามลำดับ เหมือน CI |

ผล build: frontend อยู่ใน `dist/frontend/` และ backend binary อยู่ใน `dist/backend/todo-backend`
เมื่อเรียก binary เอง ให้กำหนด working directory เป็น `apps/backend` หากต้องการใช้ข้อมูลเดิม

## ความต่างจากโปรเจกต์เดิม

- ไม่มี Nx dependencies, Nx config, project configs หรือ Nx agent customizations
- Vite ใช้ React plugin โดยตรง; CSS modules และ asset types ใช้ `vite/client`
- ไม่ต้องมี path-alias plugin เพราะโปรเจกต์เดิมไม่ได้กำหนด path aliases
- ตัดหน้า welcome ตัวอย่างของ Nx ที่แอปไม่ได้ใช้ออก
- สร้าง Bun lockfile ใหม่สำหรับ dependencies ที่ไม่มี Nx
- CI เรียก `bun run check` ตรวจทุกแอป ไม่มี affected detection, task cache หรือ distributed execution ของ Nx
- ไม่แก้ไขหรือลบโปรเจกต์ต้นฉบับ

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) ใช้เมื่อโฟลเดอร์นี้เป็น repository root
หากนำไปใช้ใน repository ที่เก็บทั้งสองตัวอย่างไว้ด้วยกัน ต้องวาง workflow ใน `.github/workflows/`
ของ repository root และกำหนด working directory และ path ของ Go module ให้ตรงกับโฟลเดอร์นี้