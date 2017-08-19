## 1 简介

vManager CI监控

```
    +---------------------------------------+
    |              Portal                   |
    +---------------------------------------+
                       A
                       | 数据推送(WEBSOCKET)
    +---------------------------------------+
    | Django                                |
    |  +---------------------------------+  |
    |  |        websocket svr            |  |
    |  +---------------A-----------------+  |
    |                  | 数据变化推送       |
    |  +---------------------------------+  |
    |  |        celery beat定时          |  |
    |  +---------------------------------+  |
    +------|-----------|-------------|------+
       SQL |   RESTAPI |     RESTAPI |
           V           V             V
     +---------+ +-----------+ +----------+
     |度量MYSQL| | Jinkens   | | 无线度量 |
     +---------+ +-----------+ +----------+
```


## 2 组件简单说明

### 2.1 后端

#### 2.1.1 技术栈

Django WEB框架
* django-rest-framework REST框架
* celery 分布式模块
* chnaeels WEBSOCKET模块

#### 2.1.2 开发环境搭建

PYTHON版本为2.7.X，使用虚拟环境构造开发环境

```
virtualenv env
source env/bin/activate
pip install svr/scripts/requirement.txt
```

#### 2.1.3 版本构建和运行

使用Docker的容器方式部署

镜像制作

```
cd svr
make
```

运行, HR_USERNAME/HR_PASSWORD需要根据实际情况填写

```
docker run -d \
    --restart=always \
    --name svr \
    -p 4444:4444 -p 9001:9001 -p 9002:9002 \
    -e REDIS_IP=10.42.6.0 \
    -e HR_USERNAME=10067372 -e HR_PASSWORD=***** \
    docker.zte.com.cn:5000/fbi/svr
```

- `4444`端口RESTFUL访问接口
- `9001`端口supervisord监控访问接口
- `9002`端口celery-flower监控访问接口

#### 2.1.4 源代码说明

- `svr/src/app/views.py`，restful实现文件
    * `CiView`对接vManager的度量MYSQL
    * `EcView`对接无线的度量系统
    * `PiplineView`对接Jenkins
- `svr/src/app/wc.py`, websocket服务端实现
- `svr/src/app/tasks.py`, celery定时任务, 后台定时同步数据，数据有变量，主动推送给前端
- `svr/svr/celery.py`, 定时任务配置

### 2.2 前端

Angular框架
- bootstrap css框架
- chart 图表
- rxjs 异步架构WEBSOCKET

#### 2.1.2 开发环境搭建

```
cd portal/src
npm install
```

#### 2.1.3 版本构建和运行

使用Docker的容器方式部署

镜像制作

```
cd poartal
make
```

运行, SVR_URL需要根据实际情况填写

```
docker run -d \
    --restart=always \
    --name portal  \
    -p 8080:80 \
    -e "SVR_URL=http://10.42.6.0:4444" \
    docker.zte.com.cn:5000/fbi/portal
```

- `8080`端口WEB访问接口

#### 2.2.4 源代码说明

- `portal/src/src/app/ci`，ci数据展示
- `portal/src/src/app/ec`，ec数据展示
- `portal/src/src/app/gitbr`，特性分支数据展示
- `portal/src/src/app/pipline`，pipline数据展示
