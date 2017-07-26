FROM docker.zte.com.cn:5000/aha/centos:7.3.1611

COPY resolv.conf /etc/

RUN rm -rf /etc/yum.repos.d/*
COPY ZTE_BASE.repo /etc/yum.repos.d/
COPY ZTE_EPEL.repo /etc/yum.repos.d/

RUN yum makecache \
    && yum install -y python python-pip python-dev python-virtualenv mariadb-devel gcc gcc-c++ openssl openssl-devel ca-certificates \
    && yum clean all

COPY . /home/svr/

RUN cd /home \
    && virtualenv env \
    && source env/bin/activate \
    && pip install -i http://mirrors.zte.com.cn/pypi/simple -U pip \
    && easy_install -i http://mirrors.zte.com.cn/pypi/simple twisted \
    && pip install -vvv --no-index --find-links=file:///home/svr/pkg -r /home/svr/requirement.txt 

CMD cd /home \
    && source env/bin/activate \
    && cd /home/svr \
    && supervisord -c supervisord.conf
