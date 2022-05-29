import os
import sys
import boto3

# os['TABLE_NAMESPACE'] = 'ShoeStore'
# add source dir to path
source_path = os.path.realpath('.') + '/lib/services/orders/py'
print('\n')
print(source_path)
sys.path.append(source_path)

from create import handler
result = handler({}, {})
print(result)

