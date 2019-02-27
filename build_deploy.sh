#!/bin/bash
ng build --prod --base-href /automation/ --aot --buildOptimizer
scp -i ~/.ssh/testlink_20190222 -r dist/* root@118.24.41.169:/var/www/html/automation