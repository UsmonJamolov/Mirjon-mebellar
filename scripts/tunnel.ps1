# Telefondan ochish — Cloudflare (IP parol yo'q, localtunnel o'rniga)
# Shop :3001 yoki Admin :3000 ishlashi kerak

param(
  [ValidateSet("shop", "admin")]
  [string]$Target = "shop"
)

$port = if ($Target -eq "admin") { 3000 } else { 3001 }

Write-Host ""
Write-Host "Cloudflare tunnel -> http://localhost:$port" -ForegroundColor Cyan
Write-Host "URL chiqgach .env.local ga TELEGRAM_SHOP_URL va NEXTAUTH_URL qo'ying." -ForegroundColor Yellow
Write-Host "Telefonda IP parol SO'RALMAYDI (localtunnel dan farqli)." -ForegroundColor Green
Write-Host ""

npx --yes cloudflared tunnel --url "http://localhost:$port"
