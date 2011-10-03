from fabric.api import *

application_dir        = '/home/moa/'
repo                   = 'https://github.com/pouyajoon/moa'
code_fetched_from_repo = False


env.hosts = ['root@91.121.223.149']

def deploy(version = ''):
	deploy_config(version)
	deploy_tools(version)
	deploy_appli(version)

def get_code_from_repo(version = ''):
	global code_fetched_from_repo
	if (code_fetched_from_repo == False):
		run('rm -rf /tmp/moa')
		run('mkdir /tmp/moa');
		run('cd /tmp/moa && git init && git remote add origin ' + repo + ' && git fetch origin ' + version + ' && git reset --hard FETCH_HEAD');
		code_fetched_from_repo = True

# APPLI

def deploy_appli(version = ''):
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
	# nohup + pipe redirections + & => required to make it nonblocking
	run('nohup ' + application_dir + 'tools/start_webserver/start_webserver.sh >& /dev/null  &', False, False)

# TOOLS

def deploy_tools(version = ''):
	get_code_from_repo(version)
	run('rm -rf ' + application_dir + '/tools')
	run('mkdir -p ' + application_dir)
	run('cp -R ' + '/tmp/moa/tools ' + application_dir + 'tools');

# CONFIG

def deploy_config(version = ''):
	get_code_from_repo(version)

