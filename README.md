NOTES:
-practicing morgan logger instead of custom console logger for learning purposes.
-used a separate database js file to separate mongodb connection and have a better error handling system for it if it fails "process.exit(1)"
-added a health route. HOW TO USE IT: once connected to data base, 'npm start' (or node server.js) in terminal, then visit http://localhost:3000/health. Returns { ok: true, uptime: <seconds> }, showing the server is up
    - Also shows 404 and 200 request status in terminal due to morgan