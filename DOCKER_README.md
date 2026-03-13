# Docker Deployment - BPM USNI

Panduan deploy aplikasi BPM USNI menggunakan Docker dengan konfigurasi:
- **Port**: 2018
- **IP Binding**: 10.8.0.1
- **Network**: global_usni_network

## Prasyarat

1. Docker dan Docker Compose sudah terinstall
2. Network `global_usni_network` sudah dibuat (jika belum, jalankan perintah di bawah)

## Langkah Instalasi

### 1. Buat Network Docker (jika belum ada)

```bash
docker network create --driver bridge --subnet=10.8.0.0/24 global_usni_network
```

### 2. Build dan Jalankan Container

```bash
# Build image
docker-compose build --no-cache

# Jalankan container
docker-compose up -d

# Lihat logs
docker-compose logs -f
```

### 3. Verifikasi Instalasi

```bash
# Cek status container
docker-compose ps

# Cek health status
docker inspect --format='{{.State.Health.Status}}' bpm-usni-app
```

## Akses Aplikasi

Setelah container berjalan, akses aplikasi di:
- **URL**: `http://<server-ip>:2018`
- **Admin Panel**: `http://<server-ip>:2018/admin/login`

## Struktur Volume

Data akan tersimpan di host machine:

| Host Path | Container Path | Keterangan |
|-----------|----------------|------------|
| `./db` | `/app/db` | Database SQLite |
| `./public/uploads` | `/app/public/uploads` | File upload (gambar, dokumen) |

## Perintah Docker

```bash
# Start container
docker-compose up -d

# Stop container
docker-compose down

# Restart container
docker-compose restart

# Lihat logs
docker-compose logs -f

# Rebuild container
docker-compose build --no-cache && docker-compose up -d

# Masuk ke container
docker exec -it bpm-usni-app sh

# Backup database
cp ./db/custom.db ./db/backup/custom.db.$(date +%Y%m%d_%H%M%S)

# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz ./public/uploads
```

## Environment Variables

| Variable | Value | Keterangan |
|----------|-------|------------|
| `NODE_ENV` | production | Environment mode |
| `PORT` | 2018 | Port aplikasi |
| `DATABASE_URL` | file:/app/db/custom.db | Lokasi database |
| `NEXT_TELEMETRY_DISABLED` | 1 | Disable telemetry |

## Troubleshooting

### Container tidak bisa start

```bash
# Cek logs
docker-compose logs bpm-usni

# Cek apakah port sudah digunakan
netstat -tlnp | grep 2018
```

### Database tidak bisa diakses

```bash
# Cek permission folder db
ls -la ./db

# Fix permission
chmod -R 755 ./db
```

### Upload tidak berfungsi

```bash
# Cek permission folder uploads
ls -la ./public/uploads

# Fix permission
chmod -R 755 ./public/uploads
```

### Network tidak ditemukan

```bash
# Buat ulang network
docker network create --driver bridge --subnet=10.8.0.0/24 global_usni_network

# Cek network
docker network ls | grep global_usni_network
```

## Update Aplikasi

```bash
# Pull changes terbaru
git pull

# Rebuild dan restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup & Restore

### Backup

```bash
# Backup database
cp ./db/custom.db ./backup/custom.db.$(date +%Y%m%d_%H%M%S)

# Backup uploads
tar -czf ./backup/uploads_$(date +%Y%m%d_%H%M%S).tar.gz ./public/uploads
```

### Restore

```bash
# Restore database
cp ./backup/custom.db.YYYYMMDD_HHMMSS ./db/custom.db

# Restore uploads
tar -xzf ./backup/uploads_YYYYMMDD_HHMMSS.tar.gz -C ./
```

## Default Admin Account

Setelah instalasi, gunakan akun default:
- **Email**: admin@usni.ac.id
- **Password**: admin123

**PENTING**: Segera ubah password setelah login pertama!
