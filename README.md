# SimpleStresser on NodeJS + AdonisJS

This is the fullstack stresser for AdonisJs.
For the database is used MySQL.

- [x] Authorization
- [x] Registration
- [x] Attack Hub
- [x] UserCP
- [x] Purchase
- [ ] Captcha
- [ ] Multithreaded launch attacks


## Setup

```bash
sudo apt-get update

sudo apt-get install nginx
```
====
If use ubuntu:
```bash
sudo ufw allow 'Nginx HTTP'
```
====

```bash
sudo apt-get install mysql-server

sudo mysql_secure_installation

mysql -u root -p
(enter your pass)

CREATE DATABASE adonis_stresser;

ALTER USER 'root'@'localhost' IDENTIFIED BY 'your new password'; 

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your new password';

exit;

git clone https://github.com/2d4me/SimpleStresser.git

cd SimpleStresser

npm install --production

nano .env
```
And paste the following into it:
>HOST=127.0.0.1
PORT=3333
NODE_ENV=production
CACHE_VIEWS=true
APP_KEY=WdpmKSRNxJhejBxxwvgtdGbPM0JBlRxm
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=adonis_stresser
DB_USER=**YOUR_DB_USER**
DB_PASSWORD=**YOUR_DB_PASSWORD**

```bash
npm i -g @adonisjs/cli

adonis migration:run --force
```
## Set Up Nginx as a Reverse Proxy Server

```bash
sudo nano /etc/nginx/sites-available/default
```

> location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://127.0.0.1:3333;
    proxy_set_header Host $http_host;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
  }
