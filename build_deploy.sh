#!/bin/bash
ng build --prod --base-href /automation/ --aot --buildOptimizer
scp -i ~/.ssh/jenkins_20190401 -r dist/* root@118.24.41.169:/var/www/html/automation
