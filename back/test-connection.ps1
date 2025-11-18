# Script de diagnóstico de conectividad
Write-Host "`n=== DIAGNÓSTICO DE CONECTIVIDAD ===" -ForegroundColor Cyan

# 1. Verificar IP local
Write-Host "`n1️⃣  IP Local:" -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"})[0].IPAddress
Write-Host "   $localIP" -ForegroundColor Green

# 2. Verificar IP pública
Write-Host "`n2️⃣  IP Pública:" -ForegroundColor Yellow
$publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
Write-Host "   $publicIP" -ForegroundColor Green

# 3. Verificar puerto en escucha
Write-Host "`n3️⃣  Puerto 3100 en escucha:" -ForegroundColor Yellow
$listening = netstat -ano | Select-String ":3100.*LISTENING"
if ($listening) {
    Write-Host "   ✅ Puerto abierto" -ForegroundColor Green
    Write-Host "   $listening" -ForegroundColor White
} else {
    Write-Host "   ❌ Puerto NO está en escucha" -ForegroundColor Red
    Write-Host "   Inicia el servidor con: npm run dev" -ForegroundColor Yellow
}

# 4. Test localhost
Write-Host "`n4️⃣  Test localhost HTTPS:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://localhost:3100/" -SkipCertificateCheck -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Localhost OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Localhost FALLA" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 5. Test IP local
Write-Host "`n5️⃣  Test IP local HTTPS:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://$localIP:3100/" -SkipCertificateCheck -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ IP local OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ IP local FALLA" -ForegroundColor Red
    Write-Host "   Verifica firewall de Windows" -ForegroundColor Yellow
}

# 6. Test IP pública (desde dentro de la red)
Write-Host "`n6️⃣  Test IP pública desde red local:" -ForegroundColor Yellow
Write-Host "   ⚠️  Este test puede fallar por NAT loopback" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://$publicIP:3100/" -SkipCertificateCheck -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ IP pública OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  IP pública no accesible desde red local (normal)" -ForegroundColor Yellow
    Write-Host "   Prueba desde móvil con datos móviles" -ForegroundColor Cyan
}

# 7. Verificar reglas de firewall
Write-Host "`n7️⃣  Reglas de Firewall:" -ForegroundColor Yellow
$rules = Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Cosmos*"}
if ($rules) {
    $rules | ForEach-Object {
        Write-Host "   ✅ $($_.DisplayName) - $($_.Direction) - $($_.Action)" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  No hay reglas de firewall para Cosmos Rol" -ForegroundColor Yellow
    Write-Host "   Crea reglas con el script anterior" -ForegroundColor Cyan
}

Write-Host "`n=== FIN DEL DIAGNÓSTICO ===`n" -ForegroundColor Cyan

# Resumen
Write-Host "📋 RESUMEN:" -ForegroundColor Yellow
Write-Host "   IP Local: $localIP" -ForegroundColor White
Write-Host "   IP Pública: $publicIP" -ForegroundColor White
Write-Host "`n🔧 CONFIGURACIÓN ROUTER:" -ForegroundColor Yellow
Write-Host "   Puerto Externo: 3100" -ForegroundColor White
Write-Host "   Puerto Interno: 3100" -ForegroundColor White
Write-Host "   IP Interna: $localIP" -ForegroundColor Cyan
Write-Host "   Protocolo: TCP" -ForegroundColor White