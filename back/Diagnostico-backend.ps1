# Script de Diagnóstico Completo del Backend Cosmos Rol
# Ejecutar como Administrador

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DIAGNÓSTICO BACKEND COSMOS ROL" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar si Node.js está corriendo
Write-Host "1️⃣  Verificando procesos Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ✅ Node.js está corriendo" -ForegroundColor Green
    $nodeProcesses | ForEach-Object {
        Write-Host "   PID: $($_.Id) | Memoria: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ Node.js NO está corriendo" -ForegroundColor Red
    Write-Host "   Inicia el servidor con: npm run dev" -ForegroundColor Yellow
    exit
}

# 2. Verificar puerto 3100
Write-Host "`n2️⃣  Verificando puerto 3100..." -ForegroundColor Yellow
$port3100 = netstat -ano | Select-String ":3100.*LISTENING"
if ($port3100) {
    Write-Host "   ✅ Puerto 3100 en escucha" -ForegroundColor Green
    $pidMatch = $port3100 -match "LISTENING\s+(\d+)"
    if ($matches) {
        $pid = $matches[1]
        Write-Host "   PID: $pid" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ Puerto 3100 NO está en escucha" -ForegroundColor Red
    Write-Host "   Verifica que el servidor esté iniciado correctamente" -ForegroundColor Yellow
}

# 3. Verificar MongoDB
Write-Host "`n3️⃣  Verificando MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "   ✅ MongoDB está corriendo" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB no detectado" -ForegroundColor Yellow
    Write-Host "   El backend necesita MongoDB para funcionar" -ForegroundColor Yellow
}

# 4. Test localhost
Write-Host "`n4️⃣  Test conexión localhost..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://localhost:3100/api/languages" `
        -SkipCertificateCheck `
        -UseBasicParsing `
        -TimeoutSec 5 `
        -ErrorAction Stop
    Write-Host "   ✅ Localhost OK (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Localhost FALLA" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test IP local
Write-Host "`n5️⃣  Test IP local (79.145.123.81)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://79.145.123.81:3100/api/languages" `
        -SkipCertificateCheck `
        -UseBasicParsing `
        -TimeoutSec 5 `
        -ErrorAction Stop
    Write-Host "   ✅ IP local OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ IP local FALLA" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifica reglas de Firewall" -ForegroundColor Yellow
}

# 6. Verificar reglas de Firewall
Write-Host "`n6️⃣  Verificando Firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule | Where-Object {
    $_.DisplayName -like "*3100*" -or 
    $_.DisplayName -like "*Cosmos*" -or
    $_.DisplayName -like "*Node*"
}
if ($firewallRules) {
    $firewallRules | ForEach-Object {
        $status = if ($_.Enabled) { "✅" } else { "❌" }
        Write-Host "   $status $($_.DisplayName) - $($_.Direction) - $($_.Action)" -ForegroundColor $(if ($_.Enabled) { "Green" } else { "Red" })
    }
} else {
    Write-Host "   ⚠️  No se encontraron reglas específicas" -ForegroundColor Yellow
}

# 7. Verificar certificados SSL
Write-Host "`n7️⃣  Verificando certificados SSL..." -ForegroundColor Yellow
$certPath = Join-Path $PSScriptRoot "server.cert"
$keyPath = Join-Path $PSScriptRoot "server.key"

if (Test-Path $certPath) {
    Write-Host "   ✅ server.cert encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ server.cert NO encontrado" -ForegroundColor Red
}

if (Test-Path $keyPath) {
    Write-Host "   ✅ server.key encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ server.key NO encontrado" -ForegroundColor Red
}

# 8. Verificar archivos .env
Write-Host "`n8️⃣  Verificando configuración .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Write-Host "   ✅ Archivo .env encontrado" -ForegroundColor Green
    $envContent = Get-Content $envPath
    Write-Host "   Configuración:" -ForegroundColor Gray
    $envContent | ForEach-Object {
        if ($_ -notmatch "PASSWORD|SECRET") {
            Write-Host "   $_" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ❌ Archivo .env NO encontrado" -ForegroundColor Red
}

# 9. Test de latencia
Write-Host "`n9️⃣  Test de latencia..." -ForegroundColor Yellow
$times = @()
for ($i = 1; $i -le 3; $i++) {
    try {
        $sw = [Diagnostics.Stopwatch]::StartNew()
        $null = Invoke-WebRequest -Uri "https://localhost:3100/" `
            -SkipCertificateCheck `
            -UseBasicParsing `
            -TimeoutSec 2 `
            -ErrorAction Stop
        $sw.Stop()
        $times += $sw.ElapsedMilliseconds
        Write-Host "   Test $i : $($sw.ElapsedMilliseconds) ms" -ForegroundColor Green
    } catch {
        Write-Host "   Test $i : FALLO" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

if ($times.Count -gt 0) {
    $avgTime = ($times | Measure-Object -Average).Average
    Write-Host "   Latencia promedio: $([math]::Round($avgTime, 2)) ms" -ForegroundColor Cyan
}

# RESUMEN Y RECOMENDACIONES
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   RESUMEN Y RECOMENDACIONES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 Configuración actual:" -ForegroundColor Yellow
Write-Host "   IP: 79.145.123.81" -ForegroundColor White
Write-Host "   Puerto: 3100" -ForegroundColor White
Write-Host "   Protocolo: HTTPS" -ForegroundColor White
Write-Host "   Base de datos: MongoDB (localhost:27017)" -ForegroundColor White

Write-Host "`n💡 Si el servidor se desconecta después de un tiempo:" -ForegroundColor Yellow
Write-Host "   1. Verifica timeout en CORS (actualmente sin límite)" -ForegroundColor White
Write-Host "   2. Revisa logs del servidor en la terminal" -ForegroundColor White
Write-Host "   3. Considera implementar keep-alive" -ForegroundColor White
Write-Host "   4. Verifica configuración de timeout en MongoDB" -ForegroundColor White

Write-Host "`n🔧 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   Reiniciar servidor: npm run dev" -ForegroundColor White
Write-Host "   Ver logs: Get-Process node | Select-Object *" -ForegroundColor White
Write-Host "   Matar proceso: Stop-Process -Name node -Force" -ForegroundColor White

Write-Host "`n========================================`n" -ForegroundColor Cyan