# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re
import datetime
import json
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import MySQLdb as mysql
import httplib2


class CiView(APIView):
    def __init__(self):
        self.conn = mysql.connect(
                    host='10.43.93.57',
                    port=3306,
                    user='ciroot',
                    passwd='ciroot',
                    db='ciudc'
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
            "complexity": self.mysql_qry(
                '''
                SELECT *
                FROM code_complexity
                WHERE product = 'vManager' AND `executdate` >= '{}' AND complexity > 10.0
                ORDER BY executdate DESC;
                '''.format(from_date),
                200
            ),
        }

        return {k: v() for k, v in _handle.items()}

    def get(self, request):
        data = cache.get("cidata")
        if data is None:
            data = self.get_cidata()
            cache.set("cidata", data)
        return Response(data, status.HTTP_200_OK)


class EcView(APIView):
    def __init__(self):
        self._echost = 'http://10.31.126.16'

    def get_ecdata(self):
        h = httplib2.Http(proxy_info=None)

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }
        body = 'username=10067372&passwd=P*ssword111'
        resp, content = h.request('{}/Login.do'.format(self._echost),
                                  'POST',
                                  headers=headers,
                                  body=body)
        mobj = re.match(r'.*JSESSIONID=([0-9A-Z]*);.*', resp.get('set-cookie', ''))
        if not mobj:
            return Response(status=status.HTTP_404_NOT_FOUND)
        sid = mobj.group(1)

        headers = {
            'Cookie': 'wpdbBrowserInform=hasInform;JSESSIONID={};testName=testValues'.format(sid),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }

        body = '''current=1&rowCount=1000&searchPhrase=&id=10472
&filterID=1097&fieldOneId=&fieldSelectOne=&fieldTwoId=
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

        return {"devinfo": json.loads(content_devinfo), "ccbinfo": json.loads(content_ccbinfo)}

    def get(self, request):
        data = cache.get("ecdata")
        if data is None:
            data = self.get_ecdata()
            cache.set("ecdata", data)
        return Response(data, status.HTTP_200_OK)
