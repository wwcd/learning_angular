FROM docker.zte.com.cn:5000/aha/nginx

COPY portal.nginx.template /etc/nginx/conf.d/
COPY dist/ /usr/share/nginx/html

CMD envsubst < /etc/nginx/conf.d/portal.nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
