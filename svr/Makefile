
default: build

build: .build.dir .cp.files
	cd .build && sudo docker build . -t docker.zte.com.cn:5000/fbi/svr

.build.dir:
	rm -rf .build
	mkdir .build

.cp.files:
	cp -rf src/ .build
	cp -rf scripts/* .build	

