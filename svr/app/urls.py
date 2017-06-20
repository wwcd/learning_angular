from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    url(r'^ci$', views.CiView.as_view(), name='ci'),
    url(r'^ec$', views.EcView.as_view(), name='ec'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
