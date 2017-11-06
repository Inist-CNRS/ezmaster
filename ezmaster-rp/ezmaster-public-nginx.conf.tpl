# to give ezmaster backoffice access on the web
# url ex: http://ezmaster.mondomain.fr
server {
  listen 80;
  server_name ezmaster.EZMASTER_PUBLIC_DOMAIN;

  location / {
    proxy_pass http://ezmaster-front:35268;
  }
}
