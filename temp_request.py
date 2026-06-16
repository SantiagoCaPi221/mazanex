import urllib.request, urllib.error, json
req = urllib.request.Request('http://localhost:8082/api/profile/sync', data=json.dumps({'email':'test@example.com','name':'test','bio':'hola'}).encode('utf-8'), headers={'Content-Type':'application/json'}, method='POST')
try:
    resp = urllib.request.urlopen(req)
    print('STATUS', resp.status)
    print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('ERROR', e)
