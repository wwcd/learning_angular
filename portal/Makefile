
default: build

build: .ng.prod .build.dir .cp.files
	cd .build && sudo docker build . -t docker.zte.com.cn:5000/fbi/portal

.ng.prod:
	cd src && ng build --prod

.build.dir:
	rm -rf .build
	mkdir .build

.cp.files:
	cp -rf src/dist/ .build	
	cp -rf scripts/* .build	
