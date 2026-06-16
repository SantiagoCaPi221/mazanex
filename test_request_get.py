import http.client
conn = http.client.HTTPConnection('localhost', 8082)
conn.request('GET', '/api/profile/list')
resp = conn.getresponse()
print('get status', resp.status)
print(resp.read().decode('utf-8', errors='replace'))
conn.close()
