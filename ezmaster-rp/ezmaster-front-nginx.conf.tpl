# to give ezmaster backoffice access on the web
# url ex: http://ezmaster.mondomain.fr
server {

  listen 80;
  server_name ezmaster.EZMASTER_PUBLIC_DOMAIN;
  access_log  /var/log/nginx/ezmaster-rp/ezmaster-front.access.log  main;
  error_log   /var/log/nginx/ezmaster-rp/ezmaster-front.error.log   warn;

  location / {
    proxy_pass http://ezmaster-front:35268;
  }

  # Block nginx from serving .git directories
  location ~ /\.git {
    deny all;
  }
  # or, all . directories/files in general (including .htaccess, etc)
  location ~ /\. {
    deny all;
  }

}
