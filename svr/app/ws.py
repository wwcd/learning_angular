# In consumers.py
from channels import Group
from channels.sessions import channel_session

import json


# Connected to websocket.connect
@channel_session
def ws_add(message):
    # Accept the connection
    message.reply_channel.send({"accept": True})

    g = message.content['path'].strip("/").split("/")[-1]

    message.channel_session['g'] = g

    # Add to the chat group
    Group(message.channel_session['g']).add(message.reply_channel)


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


def ws_send(g, data):
    if not isinstance(data, str):
        data = json.dumps(data)
    Group(g).send({
        "text": "%s" % data,
    })
