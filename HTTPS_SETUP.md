# HTTPS Setup Guide

This guide explains how to set up HTTPS for your Node.js application.

## 🚀 Quick Setup (Development)

### 1. Generate Self-Signed Certificates

```bash
./generate-ssl.sh
```

This will create:

- `ssl/private.key` - Private key
- `ssl/certificate.crt` - Self-signed certificate

### 2. Build and Start the Application

```bash
npm run build
pm2 restart referral-tracking-system
```

## 🔒 Production Setup

### Option 1: Let's Encrypt (Recommended)

1. Install Certbot:

   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. Generate certificates:

   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. Copy certificates to your project:
   ```bash
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/private.key
   sudo cp /etc/letsencrypt/live/yourdomain.com/cert.pem ssl/certificate.crt
   sudo chown $USER:$USER ssl/private.key ssl/certificate.crt
   ```

### Option 2: Commercial SSL Certificate

1. Purchase an SSL certificate from a trusted CA
2. Download the certificate files
3. Place them in the `ssl/` directory as:
   - `ssl/private.key` - Your private key
   - `ssl/certificate.crt` - Your certificate

## 🌐 Server Configuration

### Ports

- **HTTP**: 3000 (redirects to HTTPS)
- **HTTPS**: 3443

### Environment Variables

```env
PORT=3000
HTTPS_PORT=3443
NODE_ENV=production
```

## 🔧 Firewall Configuration

Make sure your firewall allows traffic on both ports:

```bash
sudo ufw allow 3000
sudo ufw allow 3443
```

## 🧪 Testing

### Test HTTP to HTTPS Redirect

```bash
curl -I http://yourdomain.com:3000
# Should redirect to https://yourdomain.com:3443
```

### Test HTTPS Endpoint

```bash
curl -k https://yourdomain.com:3443/health
```

## ⚠️ Important Notes

1. **Self-signed certificates** are for development only
2. **Production** should use certificates from trusted CAs
3. **Let's Encrypt** certificates expire every 90 days
4. Set up **automatic renewal** for Let's Encrypt certificates

## 🔄 Certificate Renewal (Let's Encrypt)

Add to crontab for automatic renewal:

```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛠️ Troubleshooting

### Certificate Not Found

- Run `./generate-ssl.sh` for development
- Check certificate paths in production

### Permission Denied

```bash
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt
```

### Port Already in Use

- Check if another service is using ports 3000 or 3443
- Change ports in `ecosystem.config.js` if needed
