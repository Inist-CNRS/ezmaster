
server {
  listen 80;
  server_name EZMASTER_RP_INSTANCE_SERVER_NAME;

  location / {
    proxy_pass http://EZMASTER_RP_INSTANCE_HOST:EZMASTER_RP_INSTANCE_PORT;
  }
}
