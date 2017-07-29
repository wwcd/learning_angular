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
import re
import os

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

    def mysql_qry(self, sql, size=None):
        def _execute():
            data = []
            cur = self.conn.cursor()
            info = cur.execute(sql)
            if info > 0:
                data = cur.fetchall()
                for i, v in enumerate(data[0]):
                    if isinstance(v, datetime.date):
                        data = filter(lambda x: x[i] == data[0][i], data)
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
            "st_detail": self.mysql_qry(
                '''
                SELECT *
                FROM case_run_st_result
                WHERE product = 'vManager' AND `executdate` >= '{}' AND vfield = 'ST_M'
                ORDER BY executdate DESC;
                '''.format(from_date)
            ),
            "st_detail_single": self.mysql_qry(
                '''
                SELECT *
                FROM case_run_st_result
                WHERE product = 'vManager' AND `executdate` >= '{}' AND vfield = 'ST_S'
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
            "complexity": self.mysql_qry(
                '''
                SELECT *
                FROM code_complexity
                WHERE product = 'vManager' AND `executdate` >= '{}' AND complexity > 10.0
                ORDER BY executdate DESC,complexity DESC;
                '''.format(from_date),
                200
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
            except:
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
        self._echost = 'http://10.31.126.16'
        # TODO
        self._hr_id = os.environ['HR_USERNAME']
        self._hr_password = os.environ['HR_PASSWORD']

    def get_ecdata(self):
        h = httplib2.Http(proxy_info=None)

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }
        body = 'username={}&passwd={}'.format(self._hr_id, self._hr_password)
        resp, content = h.request('{}/Login.do'.format(self._echost),
                                  'POST',
                                  headers=headers,
                                  body=body)
        mobj = re.match(r'.*JSESSIONID=([0-9A-Z]*);.*', resp.get('set-cookie', ''))
        if not mobj:
            logger.error("Login failed", resp, content)
            raise Exception("Login failed!")
        sid = mobj.group(1)

        headers = {
            'Cookie': 'wpdbBrowserInform=hasInform;JSESSIONID={};testName=testValues'.format(sid),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }

        body = '''current=1&rowCount=1000&searchPhrase=&id=10524
&filterID=1207&fieldOneId=&fieldSelectOne=&fieldTwoId=
&fieldSelectTwo=&isPaging=true&whereStr=&summariseStr=
&filterType=&emailScheam='''
        resp, content_devinfo = h.request('{}/model/QueryDbTest.do'.format(self._echost),
                                          'POST',
                                          headers=headers,
                                          body=body)

        body = '''current=1&rowCount=1000&searchPhrase=&id=10473
&filterID=1100&fieldOneId=&fieldSelectOne=&fieldTwoId=
&fieldSelectTwo=&isPaging=true&whereStr=&summariseStr=
&filterType=&emailScheam='''
        resp, content_ccbinfo = h.request('{}/model/QueryDbTest.do'.format(self._echost),
                                          'POST',
                                          headers=headers,
                                          body=body)

        body = '''current=1&rowCount=1000&searchPhrase=&id=10232
&filterID=566&fieldOneId=&fieldSelectOne=&fieldTwoId=
&fieldSelectTwo=&isPaging=true&whereStr=&summariseStr=
&filterType=&emailScheam='''
        resp, content_teaminfo = h.request('{}/model/QueryDbTest.do'.format(self._echost),
                                           'POST',
                                           headers=headers,
                                           body=body)

        body = '''current=1&rowCount=1000&searchPhrase=&id=10525
&filterID=1208&fieldOneId=&fieldSelectOne=&fieldTwoId=
&fieldSelectTwo=&isPaging=true&whereStr=&summariseStr=
&filterType=&emailScheam='''
        resp, content_expireinfo = h.request('{}/model/QueryDbTest.do'.format(self._echost),
                                             'POST',
                                             headers=headers,
                                             body=body)

        return {
            "devinfo": json.loads(content_devinfo),
            "ccbinfo": json.loads(content_ccbinfo),
            "teaminfo": json.loads(content_teaminfo),
            "expireinfo": json.loads(content_expireinfo),
        }

    def get(self, request):
        data = cache.get("ecdata")
        if data is None:
            try:
                data = self.get_ecdata()
            except:
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
        self._echost = 'http://cloudci.zte.com.cn'

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
            resp, content = h.request('{}{}'.format(self._echost, api), 'GET')
            # 'vmanager/job/gerrit_VNFM-G_verify/167/api/json'
            content = json.loads(content)[0:2]
            for item in content:
                api = '/vmanager/job/{}/{}/api/json'.format(jobname, item.get('id'))
                resp, jobinfo = h.request('{}{}'.format(self._echost, api), 'GET')
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
            except:
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
