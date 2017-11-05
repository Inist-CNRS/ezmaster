
server {
  listen 80;
  server_name EZMASTER_INSTANCE_TECHNICAL_NAME;

  location / {
    proxy_pass http://EZMASTER_INSTANCE_TECHNICAL_NAME:EZMASTER_INSTANCE_HTTP_PORT;
  }
}
