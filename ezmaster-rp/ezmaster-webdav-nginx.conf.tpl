# to give ezmaster backoffice access on the web
# url ex: http://webdav.mondomain.fr
server {

  listen 80;
  server_name webdav.EZMASTER_PUBLIC_DOMAIN;
  access_log  /var/log/nginx/access.log  main;
  error_log   /var/log/nginx/error.log   warn;

  location / {
    # max file upload size
    client_max_body_size 500M;

    proxy_set_header Host $http_host;
    proxy_pass http://ezmaster-webdav:35270/;
    proxy_redirect off;
  }

}
