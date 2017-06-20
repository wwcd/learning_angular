from celery import Celery
from django.core.cache import cache

from . import views

app = Celery()


@app.task
def db_sync():
    cache.set("cidata", views.CiView().get_cidata())
