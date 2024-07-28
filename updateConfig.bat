@echo off
echo let config='' + > "./config.js"
FOR /F "tokens=* delims=" %%x in (./config.json) DO (echo '%%x' + >> "./config.js")
echo '' >> "./config.js"