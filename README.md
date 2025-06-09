The Daily Missions App lets users send each other daily missions, earn experience points (EXP), and track progress through leaderboards and profile pages. Users can register, assign missions and view progress. The frontend is built with HTML, CSS and JavaScript while a small Node.js server backed by SQLite stores all data locally.

## Local Development

Run `npm install` and then `node server.js` to start the local API server. It exposes endpoints under `/api` for `pat_users` and `pat_missions`, storing records in a `database.db` SQLite file. The HTML pages now communicate with this server using standard `fetch` calls.
