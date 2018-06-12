# ezmaster instance nginx config template
# to give ezmaster instance access on the web
# url ex: http://mon-instance-1.mondomain.fr
server {

  listen 80;
  server_name EZMASTER_RP_INSTANCE_SERVER_NAME;
  access_log  /var/log/nginx/ezmaster-rp/instances/EZMASTER_RP_INSTANCE_SERVER_NAME.access.log  main;
  error_log   /var/log/nginx/ezmaster-rp/instances/EZMASTER_RP_INSTANCE_SERVER_NAME.error.log   warn;

  location / {
    # max file upload size
    client_max_body_size 500M;

    proxy_set_header Host $http_host;
    proxy_pass http://EZMASTER_RP_INSTANCE_HOST:EZMASTER_RP_INSTANCE_PORT;
  }

  # enable websocket support (only support socket.io stuff)
  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://EZMASTER_RP_INSTANCE_HOST:EZMASTER_RP_INSTANCE_PORT;
  }

}
