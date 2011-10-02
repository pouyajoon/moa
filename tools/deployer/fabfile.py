from fabric.api import *

application_dir = '/home/node/woa/'

env.hosts = ['root@91.121.223.149']

def deploy():
	before_deploy()
	deploy_config()
	deploy_appli()

def before_deploy():
	run('rm -rf /tmp/moa')
	run('mkdir /tmp/moa');
	run('git clone https://github.com/pouyajoon/woanode /tmp/moa/');

def deploy_appli():
	run('rm -rf ' + application_dir + '/server')
	run('rm -rf ' + application_dir + '/client')
	run('mkdir -p ' + application_dir)
	run('cp -R ' + '/tmp/moa/server ' + application_dir + 'server');
	run('cp -R ' + '/tmp/moa/client ' + application_dir + 'client');
	after_deploy_appli()

def deploy_config():
	local('')

def after_deploy_appli():
	restart_node_appli()

def restart_node_appli():
	pouet = run('`ps x | grep \'node web-server.js\' | grep -v grep | cut -d\' \' -f 1`');
	if (pouet != ''):
		run('kill -9 ' + pouet)
	run('cd ' + application_dir + 'server/ && node web-server.js & ', False, False)
