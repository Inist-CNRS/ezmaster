# to give ezmaster backoffice access on the web
# url ex: http://ezmaster.mondomain.fr
server {

  listen 80;
  server_name ezmaster.EZMASTER_PUBLIC_DOMAIN;
  access_log  /var/log/nginx/access.log  main;
  error_log   /var/log/nginx/error.log   warn;

  location / {
    # max file upload size
    client_max_body_size 500M;

    proxy_set_header Host $http_host;
    proxy_pass http://ezmaster-front:35268;
  }

  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://ezmaster-front:35268;
  }

}
