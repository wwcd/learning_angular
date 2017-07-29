FROM docker.zte.com.cn:5000/aha/centos:7.3.1611

RUN rm -rf /etc/yum.repos.d/*
COPY ZTE_BASE.repo /etc/yum.repos.d/
COPY ZTE_EPEL.repo /etc/yum.repos.d/

COPY resolv.conf /etc/

RUN yum makecache \
    && yum install -y python python-pip python-dev python-virtualenv mariadb-devel gcc gcc-c++ openssl openssl-devel ca-certificates \
    && yum clean all

COPY requirement.txt /home/svr/

RUN pip install -i http://mirrors.zte.com.cn/pypi/simple -U pip \
    && easy_install -i http://mirrors.zte.com.cn/pypi/simple twisted \
    && pip install -i http://mirrors.zte.com.cn/pypi/simple --trusted-host mirrors.zte.com.cn -r /home/svr/requirement.txt 

COPY . /home/svr/

WORKDIR /home/svr/

CMD supervisord -c supervisord.conf
