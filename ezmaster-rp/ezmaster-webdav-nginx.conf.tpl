# to give ezmaster backoffice access on the web
# url ex: http://webdav.mondomain.fr
server {

  listen 80;
  server_name webdav.EZMASTER_PUBLIC_DOMAIN;
  access_log  /var/log/nginx/access.log  main;
  error_log   /var/log/nginx/error.log   warn;

  location / {
    client_max_body_size 0;

    set $dest $http_destination;
    if ($http_destination ~ "^https://(.+)") {
        set $dest http://$1;
    }
    proxy_set_header Destination $dest;

    proxy_set_header Host $http_host;
    proxy_pass http://ezmaster-webdav:35270/;
    proxy_redirect off;
    proxy_request_buffering off;
    proxy_buffering off;
  }

}
