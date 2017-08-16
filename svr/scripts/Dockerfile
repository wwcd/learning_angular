FROM docker.zte.com.cn:5000/aha/centos:7.3.1611

COPY conf/resolv.conf /etc/
COPY conf/ZTE_BASE.repo conf/ZTE_EPEL.repo /etc/yum.repos.d/
RUN rm -rf /etc/yum.repos.d/CentOS-* \
    && yum makecache \
    && yum install -y python-pip python-dev python-virtualenv mariadb-devel gcc gcc-c++ \
    && yum -y clean all

COPY requirement.txt /tmp/
RUN easy_install -i http://mirrors.zte.com.cn/pypi/simple twisted \
    && pip install -i http://mirrors.zte.com.cn/pypi/simple --trusted-host mirrors.zte.com.cn -r /tmp/requirement.txt 

WORKDIR /home/svr/

COPY src conf/supervisord.conf /home/svr/
RUN python manage.py makemigrations && python manage.py migrate --run-syncdb

CMD supervisord -c supervisord.conf
