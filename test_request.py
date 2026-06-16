import http.client, json
body = json.dumps({'email':'test@example.com','name':'test','bio':'hola'})
conn = http.client.HTTPConnection('localhost', 8082)
conn.request('POST', '/api/profile/sync', body.encode('utf-8'), {'Content-Type': 'application/json'})
resp = conn.getresponse()
print('status', resp.status)
print('headers=', resp.getheaders())
print('body=', resp.read().decode('utf-8', errors='replace'))
conn.close()
