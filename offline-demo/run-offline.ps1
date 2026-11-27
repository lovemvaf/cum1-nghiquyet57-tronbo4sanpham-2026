# Trinh chieu Offline Khong Can Internet — LAC HONG SO (Cum 1 - NQ 57)
$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir '..')
$DistIndex = Join-Path $RootDir 'dist\index.html'
$Port = 4175
$Url = "http://127.0.0.1:$Port/cum1-nghiquyet57-tronbo4sanpham-2026/"

if (-not (Test-Path $DistIndex)) {
  Write-Host '[LOI] Chua co thu muc dist\. Dang thu build lai...' -ForegroundColor Yellow
  Push-Location $RootDir
  try {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
      pnpm run build
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
      npm run build
    } else {
      throw 'Khong tim thay dist\ va khong co pnpm/npm de build.'
    }
  } finally {
    Pop-Location
  }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  LAC HONG SO — TRINH CHIEU OFFLINE TRON BO 04 SAN PHAM   " -ForegroundColor Cyan
Write-Host "  Mo trinh duyet tai: $Url" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

Start-Job -ScriptBlock {
  param($TargetUrl)
  Start-Sleep -Seconds 2
  Start-Process $TargetUrl
} -ArgumentList $Url | Out-Null

if (Get-Command node -ErrorAction SilentlyContinue) {
  node (Join-Path $ScriptDir 'server.mjs')
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  Write-Host 'Dang dung Python fallback server (khuyen nghi dung Node de ho tro seek video tot nhat)...' -ForegroundColor Yellow
  Push-Location (Join-Path $RootDir 'dist')
  try {
    python -m http.server $Port --bind 127.0.0.1
  } finally {
    Pop-Location
  }
} else {
  throw 'Khong tim thay Node.js hoac Python tren may tinh nay.'
}
