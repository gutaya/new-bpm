# ===========================================
# BPM USNI - Docker Deployment Guide
# ===========================================

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Deploy dengan IP Binding 10.8.0.1 dan Port 2018

```bash
# 1. Buat direktori dan masuk ke dalamnya
mkdir bpm-usni && cd bpm-usni

# 2. Clone atau copy project files

# 3. Buat struktur direktori
mkdir -p db public/uploads/images prisma

# 4. Copy database yang ada (jika ada)
# cp /path/to/existing/custom.db db/

# 5. Build dan jalankan
chmod +x docker.sh
./docker.sh start
```

## 📋 Perintah yang Tersedia

| Perintah | Deskripsi |
|----------|-----------|
| `./docker.sh start` | Build dan jalankan aplikasi |
| `./docker.sh stop` | Hentikan aplikasi |
| `./docker.sh restart` | Restart aplikasi |
| `./docker.sh logs` | Lihat log aplikasi |
| `./docker.sh build` | Build Docker image |
| `./docker.sh ps` | Status container |
| `./docker.sh shell` | Akses shell container |
| `./docker.sh db-push` | Push schema ke database |
| `./docker.sh clean` | Hapus semua container dan volume |
| `./docker.sh backup` | Backup database dan uploads |

---

## 🔧 Konfigurasi

### Network Configuration
- **IP Binding**: `10.8.0.1`
- **Subnet**: `10.8.0.0/24`
- **Gateway**: `10.8.0.254`
- **Port**: `2018`

### Volume Mounts
Data akan disimpan di host machine:

| Host Path | Container Path | Keterangan |
|-----------|----------------|------------|
| `./db` | `/app/db` | Database SQLite |
| `./public/uploads` | `/app/public/uploads` | File uploads |
| `./prisma` | `/app/prisma` | Prisma schema |

### Environment Variables
Copy `.env.docker` ke `.env` untuk production:

```bash
cp .env.docker .env
```

---

## 🗃️ Database

### Database Baru
Jika database belum ada, akan dibuat otomatis saat container pertama kali dijalankan.

### Database yang Sudah Ada
Copy database ke folder `db/`:

```bash
cp /path/to/custom.db db/
```

### Menjalankan Migration
```bash
./docker.sh db-push
```

---

## 📁 Struktur Folder

```
bpm-usni/
├── db/
│   └── custom.db          # Database SQLite
├── public/
│   └── uploads/
│       └── images/        # Uploaded images
├── prisma/
│   └── schema.prisma      # Database schema
├── docker-compose.yml
├── Dockerfile
├── docker.sh
├── .env.docker
└── .dockerignore
```

---

## 🌐 Akses Aplikasi

Setelah deployment, aplikasi dapat diakses di:

| Akses | URL |
|-------|-----|
| Local | http://localhost:2018 |
| Network | http://10.8.0.1:2018 |
| Admin Panel | http://10.8.0.1:2018/admin/login |

---

## 🔍 Monitoring

### Health Check
Container memiliki health check otomatis:
- Interval: 30 detik
- Timeout: 10 detik
- Endpoint: `/api/identity`

### Melihat Logs
```bash
./docker.sh logs
# atau
docker-compose logs -f
```

---

## 🔄 Backup & Restore

### Backup
```bash
./docker.sh backup
```
Backup akan disimpan di `backups/YYYYMMDD_HHMMSS/`

### Restore
```bash
# Stop container
./docker.sh stop

# Restore database
cp backups/YYYYMMDD_HHMMSS/db/custom.db db/

# Restore uploads
cp -r backups/YYYYMMDD_HHMMSS/uploads/* public/uploads/

# Start container
./docker.sh start
```

---

## ⚠️ Troubleshooting

### Container tidak bisa start
```bash
# Lihat logs
./docker.sh logs

# Rebuild dari awal
./docker.sh clean
./docker.sh start
```

### Database error
```bash
# Push schema
./docker.sh db-push

# Atau akses shell dan reset database
./docker.sh shell
npx prisma db push --force-reset
```

### Permission denied
```bash
chmod +x docker.sh
chmod -R 755 db public/uploads
```

---

## 🔒 Security Recommendations

1. Ganti default credentials setelah deployment
2. Gunakan HTTPS dengan reverse proxy (nginx/traefik)
3. Setup firewall untuk membatasi akses port 2018
4. Backup database secara berkala
5. Update image secara berkala untuk security patches

---

## 📞 Support

Untuk bantuan teknis, hubungi tim IT BPM USNI.
