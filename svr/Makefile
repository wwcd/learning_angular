
default: build

build:
	sudo docker build . -t docker.zte.com.cn:5000/fbi/svr

run:
	sudo docker run -d -p 4444:4444 -e "REDIS_IP=10.42.6.0" --name svr docker.zte.com.cn:5000/fbi/svr

test: 
	sudo docker run -d -p 4444:4444 -e "REDIS_IP=10.42.6.0" -v $(shell pwd):/home/svr --name svr docker.zte.com.cn:5000/fbi/svr
