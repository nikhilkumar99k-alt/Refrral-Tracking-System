#!/bin/bash

# Generate SSL certificates for development
echo "🔐 Generating SSL certificates for development..."

# Create private key
openssl genrsa -out ssl/private.key 2048

# Create certificate signing request
openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Create self-signed certificate
openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt

# Set proper permissions
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates are in the ssl/ directory:"
echo "   - ssl/private.key (private key)"
echo "   - ssl/certificate.crt (certificate)"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted CA." 