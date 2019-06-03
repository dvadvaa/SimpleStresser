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

```
HOST=127.0.0.1
PORT=3333
NODE_ENV=production
CACHE_VIEWS=true
APP_KEY=WdpmKSRNxJhejBxxwvgtdGbPM0JBlRxm
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=adonis_stresser
DB_USER=**YOUR_DB_USER**
DB_PASSWORD=**YOUR_DB_PASSWORD**
```

```bash
npm i -g @adonisjs/cli

adonis migration:run --force
```
## Set Up Nginx as a Reverse Proxy Server

```bash
sudo nano /etc/nginx/sites-available/default
```
Within the `server` block you should have an existing `location /` block. Replace the contents of that block with the following configuration:

```
    location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://127.0.0.1:3333;
    proxy_set_header Host $http_host;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
    }
```

```bash
sudo nginx -t

sudo systemctl restart nginx
```
## Set Up phpMyAdmin
```bash
sudo nano /etc/nginx/conf.d/phpmyadmin.conf
```

And paste the following into it replacing **pma.example.com**:

```
server {
  listen 80;
  listen [::]:80;
  server_name pma.example.com;
  root /usr/share/phpmyadmin/;
  index index.php index.html index.htm index.nginx-debian.html;

  access_log /var/log/nginx/phpmyadmin_access.log;
  error_log /var/log/nginx/phpmyadmin_error.log;

  location / {
    try_files $uri $uri/ /index.php;
  }

  location ~ ^/(doc|sql|setup)/ {
    deny all;
  }

  location ~ \.php$ {
    fastcgi_pass unix:/run/php/php7.2-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    include snippets/fastcgi-php.conf;
  }

  location ~ /\.ht {
    deny all;
  }
}
```

```bash
sudo nginx -t

sudo systemctl reload nginx
```

**If you have any errors or questions, contact me:**
- VK: [vk.com/pri2che](https://vk.com/pri2che)
- Telegram:[t.me/sup_ban](https://t.me/sup_ban)
