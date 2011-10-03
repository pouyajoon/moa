from fabric.api import *

app                    = 'moa'
app_dir                = '/home/' + app + '/'
repo                   = 'https://github.com/pouyajoon/' + app
code_fetched_from_repo = False


env.hosts = ['root@91.121.223.149']

def deploy(version = 'HEAD'):
	deploy_config(version)
	deploy_tools(version)
	deploy_appli(version)

def get_code_from_repo(version = 'HEAD'):
	global code_fetched_from_repo
	if (code_fetched_from_repo == False):
		run('rm -rf /tmp/' + app)
		run('cd /tmp && git clone -n ' + repo + ' && cd ' + app + ' && git archive ' + version + ' | tar x');
		code_fetched_from_repo = True

# APPLI

def deploy_appli(version = 'HEAD'):
	get_code_from_repo()
	run('rsync -a ' + '/tmp/' + app + '/server/ ' + app_dir + 'server/');
	run('rsync -a ' + '/tmp/' + app + '/client/ ' + app_dir + 'client/');
	after_deploy_appli()

def after_deploy_appli():
	restart_node_appli()

def restart_node_appli():
	# nohup + pipe redirections + & => required to make it nonblocking
	run('nohup ' + app_dir + 'tools/start_webserver/start_webserver.sh >& /dev/null  &', False, False)

# TOOLS

def deploy_tools(version = 'HEAD'):
	get_code_from_repo(version)
	run('rsync -a ' + '/tmp/' + app + '/tools/ ' + app_dir + 'tools/');

# CONFIG

def deploy_config(version = 'HEAD'):
	get_code_from_repo(version)

