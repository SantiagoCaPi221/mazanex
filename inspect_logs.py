import subprocess, time, json, os

# make request
body = json.dumps({'email':'test@example.com','name':'test','bio':'hola'})
print('sending request')
proc = subprocess.run(['curl.exe','-i','-X','POST','http://localhost:8082/api/profile/sync','-H','Content-Type: application/json','--data-binary',body], capture_output=True, text=True)
print('curl exit', proc.returncode)
print(proc.stdout)
print(proc.stderr)
# wait a bit and capture logs
print('sleeping')
time.sleep(2)
proc2 = subprocess.run(['docker','logs','--since','2s','mazanex-profile'], capture_output=True, text=True)
print('docker logs:\n', proc2.stdout)
print('docker err:', proc2.stderr)

