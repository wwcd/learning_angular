# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import MySQLdb as mysql
import datetime
import httplib2
import json
import logging

from . import ws

logger = logging.getLogger(__name__)


class CiView(APIView):
    def __init__(self):
        self.conn = mysql.connect(
                    host='10.43.93.57',
                    port=3306,
                    user='ciroot',
                    passwd='ciroot',
                    db='ciudc',
                    charset='utf8'
                )
        super(CiView, self).__init__()

    def mysql_qry(self, sql, size=None):
        def _execute():
            data = []
            cur = self.conn.cursor()
            info = cur.execute(sql)
            if info > 0:
                data = cur.fetchall()
                for i, v in enumerate(data[0]):
                    if isinstance(v, datetime.date):
                        data = [x for x in data if x[i] == data[0][i]]
                        break
            cur.close()
            return data if size is None else data[:size]
        return _execute

    def get_cidata(self):
        from_date = datetime.date.today() - datetime.timedelta(2)
        _handle = {
            "static_check": self.mysql_qry(
                '''
                SELECT *
                FROM static_check
                WHERE product = 'vManager' AND `executdate` >= '{}'
                ORDER BY executdate DESC;
                '''.format(from_date)
            ),
            "ut_statstic": self.mysql_qry(
                '''
                SELECT *
                FROM case_run
                WHERE product = 'vManager' AND `executdate` >= '{}'
                ORDER BY executdate DESC;
                '''.format(from_date)
            ),
            "coverage": self.mysql_qry(
                '''
                SELECT *
                FROM code_coverage
                WHERE product = 'vManager' AND `executdate` >= '{}'
                ORDER BY executdate DESC;
                '''.format(from_date)
            ),
            "st_statistic": self.mysql_qry(
                '''
                SELECT *
                FROM case_run_st
                WHERE product = 'vManager' AND `executdate` >= '{}'
                ORDER BY executdate DESC;
                '''.format(from_date)
            ),
            "feature_st_history": self.mysql_qry(
                '''
                SELECT *
                FROM feature_st_history_new
                WHERE product = 'vManager' AND `executdate` >= '{}'
                ORDER BY executdate DESC;
                '''.format(from_date),
            ),
        }

        return {k: v() for k, v in _handle.items()}

    def get(self, request):
        data = cache.get("cidata")
        if data is None:
            try:
                data = self.get_cidata()
            except Exception:
                logger.error("get_cidata coredump")
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                cache.set("cidata", data)
        return Response(data, status.HTTP_200_OK)

    def post(self, request):
        data = cache.get("cidata")
        if data is not None:
            if request.data is None:
                ws.ws_send('ci', data)
            else:
                ws.ws_send('ci', data, request.data.get("channel_name", None))
        return Response(status.HTTP_200_OK)


class EcView(APIView):
    def __init__(self):
        self._restapi = 'http://10.40.68.88:8082/QueryIndicatorData'
        super(EcView, self).__init__()

    def get_ecdata(self):
        _maps = {
            'ccbinfo': '每日EC.04.001.待CCB处理变更单（状态）',
            'teaminfo': '每日EC.01.001.待开发处理（按照团队状态）',
            'devinfo': '每日EC.02.001.待开发处理的变更单详细数据（按照人员计）',
        }

        _ecdata = {}
        h = httplib2.Http(proxy_info=None)
        for k, v in _maps.iteritems():
            url = self._restapi + '?WorkSpace=vManager&IndicatorName={}&FilterName='.format(v)
            resp, content = h.request(url, 'GET')
            _ecdata.update({k: json.loads(content)})

        return _ecdata

    def get(self, request):
        data = cache.get("ecdata")
        if data is None:
            try:
                data = self.get_ecdata()
            except Exception:
                logger.error("get_ecdata coredump")
                Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                cache.set("ecdata", data)
        return Response(data, status.HTTP_200_OK)

    def post(self, request):
        data = cache.get("ecdata")
        if data is not None:
            if request.data is None:
                ws.ws_send('ec', data)
            else:
                ws.ws_send('ec', data, request.data.get("channel_name", None))
        return Response(status.HTTP_200_OK)


class PiplineView(APIView):
    def __init__(self):
        self._host = 'http://cloudci.zte.com.cn'
        super(PiplineView, self).__init__()

    def get_piplinedata(self):
        _map = {
            "verify": "gerrit_VNFM-G_verify",
            "single": "build_vManager_singleBranch_pipeline",
            "client": "gerrit_VNFM-G_client_verify",
            "v4comm": "gerrit_VNFM-G_v4comm_verify",
        }

        _ret = {}

        def _pipline_stages(jobname):
            h = httplib2.Http(proxy_info=None)
            api = '/vmanager/job/{}/wfapi/runs?fullStages=true'.format(jobname)
            resp, content = h.request('{}{}'.format(self._host, api), 'GET')
            content = json.loads(content)[0:1]
            for item in content:
                api = '/vmanager/job/{}/{}/api/json'.format(jobname, item.get('id'))
                resp, jobinfo = h.request('{}{}'.format(self._host, api), 'GET')
                item.update(jobinfo=json.loads(jobinfo))

            return content

        for k, v in _map.items():
            _ret.update({k: _pipline_stages(v)})

        return _ret

    def get(self, request):
        data = cache.get("piplinedata")
        if data is None:
            try:
                data = self.get_piplinedata()
            except Exception:
                logger.error("get_piplinedata coredump")
                Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                cache.set("piplinedata", data)
        return Response(data, status.HTTP_200_OK)

    def post(self, request):
        data = cache.get("piplinedata")
        if data is not None:
            if request.data is None:
                ws.ws_send('pipline', data)
            else:
                ws.ws_send('pipline', data, request.data.get("channel_name", None))
        return Response(status.HTTP_200_OK)
