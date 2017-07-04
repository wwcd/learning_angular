FROM docker.zte.com.cn:5000/aha/centos:7.3.1611

COPY resolv.conf /etc/
COPY net_proxy.sh /etc/profile.d/

RUN rm -rf /etc/yum.repos.d/*
COPY ZTE_BASE.repo /etc/yum.repos.d/
COPY ZTE_EPEL.repo /etc/yum.repos.d/

RUN yum makecache \
    && yum install -y python python-pip python-dev python-virtualenv mariadb-devel gcc gcc-c++ openssl ca-certificates \
    && yum clean all

COPY . /home/svr/
RUN cd /home/svr/ \
    && virtualenv env \
    && source env/bin/activate \
    && pip install -i http://mirrors.zte.com.cn/pypi/simple -U pip==8.1.2 \
    && pip install --no-index --find-links=file:///home/svr/pkg -r requirement.txt

CMD cd /home/svr/ \ 
    && source env/bin/activate \
    && supervisord -c supervisord.conf
