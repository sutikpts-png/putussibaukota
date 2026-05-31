@echo off
echo =========================================
echo Sinkronisasi Otomatis ke GitHub
echo =========================================
echo.

cd /d "%~dp0"

echo [1/3] Menarik (pull) data terbaru dari GitHub...
git pull origin main --rebase

echo.
echo [2/3] Menyimpan (commit) perubahan lokal...
git add .
git commit -m "Auto-sync update dari lokal"

echo.
echo [3/3] Mengirim (push) perubahan ke GitHub...
git push origin main

echo.
echo =========================================
echo Sinkronisasi Selesai!
echo =========================================
pause
