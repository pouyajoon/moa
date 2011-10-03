from fabric.api import *

application_dir        = '/home/moa/'
code_fetched_from_repo = False

env.hosts = ['root@91.121.223.149']


def deploy():
	deploy_config()
	deploy_tools()
	deploy_appli()

def get_code_from_repo():
	global code_fetched_from_repo
	if (code_fetched_from_repo == False):
		run('rm -rf /tmp/moa')
		run('mkdir /tmp/moa');
		run('git clone https://github.com/pouyajoon/moa /tmp/moa/');
		code_fetched_from_repo = True

# APPLI

def deploy_appli():
	get_code_from_repo()
	run('rm -rf ' + application_dir + '/server')
	run('rm -rf ' + application_dir + '/client')
	run('mkdir -p ' + application_dir)
	run('cp -R ' + '/tmp/moa/server ' + application_dir + 'server');
	run('cp -R ' + '/tmp/moa/client ' + application_dir + 'client');
	after_deploy_appli()

def after_deploy_appli():
	restart_node_appli()

def restart_node_appli():
	run('nohup ' + application_dir + 'tools/start_webserver/start_webserver.sh >& /dev/null  &', False, False)

# TOOLS

def deploy_tools():
	get_code_from_repo()
	run('rm -rf ' + application_dir + '/tools')
	run('mkdir -p ' + application_dir)
	run('cp -R ' + '/tmp/moa/tools ' + application_dir + 'tools');

# CONFIG

def deploy_config():
	get_code_from_repo()

