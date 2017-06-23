
default: build

build:
	sudo docker build . -t portal

run:
	sudo docker run -d -p 8080:80 -e "SVR_URL=http://10.42.6.225:4444" --name portal portal

test:
	sudo docker run -d -p 8080:80 -e "SVR_URL=http://10.42.6.225:4444" -v $(pwd)/dist:/usr/share/nginx/html --name portal portal
