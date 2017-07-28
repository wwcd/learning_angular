
default: build

ng:
	ng build --prod

build: ng
	sudo docker build . -t docker.zte.com.cn:5000/fbi/portal

run:
	sudo docker run -d -p 8080:80 -e "SVR_URL=http://10.42.6.0:4444" --name portal docker.zte.com.cn:5000/fbi/portal

test:
	sudo docker run -d -p 8080:80 -e "SVR_URL=http://10.42.6.0:4444" -v $(shell pwd)/dist:/usr/share/nginx/html --name portal docker.zte.com.cn:5000/fbi/portal
