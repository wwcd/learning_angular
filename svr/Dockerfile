FROM docker.zte.com.cn:5000/aha/centos:7.3.1611

RUN rm -rf /etc/yum.repos.d/*
COPY resolv.conf /etc/
COPY *.repo /etc/yum.repos.d/

RUN yum makecache \
    && yum install -y python python-pip python-dev python-virtualenv mariadb-devel gcc gcc-c++ \
    && yum clean all

COPY . /home/svr/
RUN cd /home/svr/ \
    && virtualenv env \
    && source env/bin/activate \
    && pip install -i http://mirrors.zte.com.cn/pypi/simple -U pip \
    && pip install --no-cache-dir -i http://mirrors.zte.com.cn/pypi/simple --trusted-host mirrors.zte.com.cn -r requirement.txt

CMD cd /home/svr/ \ 
    && source env/bin/activate \
    && uwsgi --http :7372 -M --module svr.wsgi
