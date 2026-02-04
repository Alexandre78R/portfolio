# 🖥️ Server Infrastructure & Memory Configuration

## Overview

The application is deployed on a Linux VPS optimized for small-to-medium Node.js workloads  
(Portfolio, API services, admin dashboard, and database).

Server configuration:

- CPU: 4 vCores
- RAM: 4 GB
- Storage: 80 GB SSD
- OS: Ubuntu/Debian Linux
- Process manager: PM2
- Database: MySQL (local)
- Runtime: Node.js (Next.js / Express / GraphQL)

---

## Memory Stability Strategy

To ensure reliability and prevent crashes caused by memory exhaustion (OOM – Out Of Memory),
a **4 GB swap space** has been configured.

### Why swap?

Node.js builds (Next.js), database processes, and Docker containers can temporarily exceed available RAM.
Without swap, the system may kill processes, causing:

- application crashes
- API downtime
- failed builds

Swap provides:

- improved stability
- graceful memory overflow handling
- reduced risk of unexpected shutdowns

The system prioritizes RAM and only uses swap when necessary.

---

## Swap Configuration

A dedicated 4 GB swap file has been created and enabled:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

### Kernel optimization

To minimize performance impact, swappiness is reduced:

```bash
sudo sysctl vm.swappiness=10
```

This ensures:
- RAM is prioritized
- swap is used only as a fallback

---

## Result

The server now benefits from:

- 4 GB RAM
- 4 GB swap
- improved resilience under load
- safer Next.js builds
- stable Node/DB processes

This setup is well-suited for production deployment of lightweight full-stack applications and personal projects.

---

## Notes

Swap is not intended to replace RAM but to provide a safety buffer.
If traffic or workload increases significantly, upgrading the VPS RAM would be recommended.
