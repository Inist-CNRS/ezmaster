# to give ezmaster backoffice access on the web
# url ex: http://webdav.mondomain.fr
server {

  listen 80;
  server_name webdav.EZMASTER_PUBLIC_DOMAIN;
  access_log  /var/log/nginx/ezmaster-rp/ezmaster-webdav.access.log  main;
  error_log   /var/log/nginx/ezmaster-rp/ezmaster-webdav.error.log   warn;

  location / {
    # max file upload size should be in sync with ezmaster-webdav/nginx.conf
    client_max_body_size 500M;

    proxy_pass http://ezmaster-webdav:35270;
  }

}
