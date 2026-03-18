# Docker Deployment - BPM USNI

Panduan deploy aplikasi BPM USNI menggunakan Docker dengan build lokal.

## Konfigurasi
- **Port**: 2018
- **Database**: SQLite (persistent)
- **Uploads**: Persistent volume

## Prasyarat

1. Node.js 20+ sudah terinstall di server
2. Docker dan Docker Compose sudah terinstall

## Langkah Instalasi

### 1. Build Aplikasi Secara Lokal

```bash
# Install dependencies
npm install

# Build aplikasi
npm run build
```

### 2. Copy File ke Standalone Folder

```bash
# Copy static files
cp -r .next/static .next/standalone/.next/

# Copy public folder
cp -r public .next/standalone/
```

### 3. Build dan Jalankan Docker

```bash
# Build Docker image
docker-compose build

# Jalankan container
docker-compose up -d

# Cek status
docker-compose ps

# Lihat logs
docker-compose logs -f
```

## Akses Aplikasi

- **URL**: `http://localhost:2018`
- **Admin Panel**: `http://localhost:2018/admin/login`

## Default Admin Account

- **Email**: admin@usni.ac.id
- **Password**: admin123

> **PENTING**: Segera ubah password setelah login pertama!

## Struktur Volume

| Host Path | Container Path | Keterangan |
|-----------|----------------|------------|
| `./db` | `/app/db` | Database SQLite |
| `./public/uploads` | `/app/public/uploads` | File upload |

## Perintah Docker

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Logs
docker-compose logs -f

# Masuk container
docker exec -it bpm-usni-app sh

# Rebuild (setelah update)
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
docker-compose build --no-cache
docker-compose up -d
```

## Update Aplikasi

```bash
# 1. Pull code terbaru
git pull

# 2. Install dependencies baru (jika ada)
npm install

# 3. Build ulang
npm run build

# 4. Copy files
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# 5. Rebuild dan restart Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup & Restore

### Backup

```bash
# Database
cp ./db/custom.db ./backup/custom.db.$(date +%Y%m%d_%H%M%S)

# Uploads
tar -czf ./backup/uploads_$(date +%Y%m%d_%H%M%S).tar.gz ./public/uploads
```

### Restore

```bash
# Stop container
docker-compose down

# Restore database
cp ./backup/custom.db.YYYYMMDD_HHMMSS ./db/custom.db

# Restore uploads
tar -xzf ./backup/uploads_YYYYMMDD_HHMMSS.tar.gz

# Start container
docker-compose up -d
```

## Troubleshooting

### Build gagal

```bash
# Bersihkan cache dan build ulang
rm -rf .next node_modules
npm install
npm run build
```

### Container tidak bisa start

```bash
# Cek logs
docker-compose logs

# Cek port
lsof -i :2018
```

### Permission denied

```bash
# Fix permission
chmod -R 755 ./db ./public/uploads
```
