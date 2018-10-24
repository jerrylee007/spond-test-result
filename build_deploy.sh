#!/bin/bash
ng build --prod --base-href /automation/
scp -i ~/.ssh/tencent_20180605 -r dist/* root@118.24.41.169:/var/www/html/automation