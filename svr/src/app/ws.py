# In consumers.py
from channels import Group, Channel
from channels.sessions import channel_session

import json
import datetime
import httplib2


# Connected to websocket.connect
@channel_session
def ws_add(message):
    # Accept the connection
    message.reply_channel.send({"accept": True})

    g = message.content['path'].strip("/").split("/")[-1]

    message.channel_session['g'] = g

    # Add to the chat group
    Group(message.channel_session['g']).add(message.reply_channel)

    # Invoke sync
    h = httplib2.Http(proxy_info=None)
    payload = json.dumps({"channel_name": message.reply_channel.name})
    headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
    h.request('http://localhost:4444/api/v1/{}'.format(g),
              'POST',
              headers=headers,
              body=payload)


# Connected to websocket.receive
@channel_session
def ws_message(message):
    Group(message.channel_session['g']).send({
        "text": "%s" % message.content['text'],
    })


# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    Group(message.channel_session['g']).discard(message.reply_channel)


class __Encoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%Y-%m-%d")

        if isinstance(obj, datetime.datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")

        return json.JSONEncoder.default(self, obj)


def ws_send(g, data, channel_name=None):
    if not isinstance(data, str):
        data = json.dumps(data, cls=__Encoder)

    payload = {"text": "%s" % data}
    if channel_name is None:
        Group(g).send(payload)
    else:
        Channel(channel_name).send(payload)
