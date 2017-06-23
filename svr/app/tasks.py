from celery import Celery
from django.core.cache import cache
import httplib2

from . import views

app = Celery()


@app.task
def ci_sync():
    try:
        data = views.CiView().get_cidata()
    except:
        pass
    else:
        cache_data = cache.get("cidata")
        if cache_data != data:
            cache.set("cidata", data)
            h = httplib2.Http(proxy_info=None)
            h.request('http://localhost:8080/api/v1/ci', 'POST')


@app.task
def ec_sync():
    try:
        data = views.EcView().get_ecdata()
    except:
        pass
    else:
        cache_data = cache.get("ecdata")
        if cache_data != data:
            cache.set("ecdata", data)
            h = httplib2.Http(proxy_info=None)
            h.request('http://localhost:8080/api/v1/ec', 'POST')


@app.task
def pipline_sync():
    try:
        data = views.PiplineView().get_piplinedata()
    except:
        pass
    else:
        cache_data = cache.get("piplinedata")
        if cache_data != data:
            cache.set("piplinedata", data)
            h = httplib2.Http(proxy_info=None)
            h.request('http://localhost:8080/api/v1/pipline', 'POST')
