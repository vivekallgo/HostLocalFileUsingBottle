#!/usr/bin/python3
#
# Files here : http://localhost:8080/static/ServiceLogs.txt
import os
import os.path
import json2html 
import argparse
import urllib
from bottle import Bottle, request, response, static_file, server_names
from json2html import *


def startServer(staticFilesRoot, http_port, wsgiServerName):
    app = Bottle()   
    datetimeFormat = "%Y-%m-%d %H:%M:%S"

    def jsonp(request, dictionary):
        if (request.query.callback):
            return "%s(%s)" % (request.query.callback, dictionary)
        return dictionary

    def make_tree(path):
        folderPath = path.replace(path,"http://localhost:8080/static")
        tree = dict(parent=folderPath, children=[])
        try: lst = os.listdir(path)
        except OSError:
            pass #ignore errors
        else:
            for parent in lst:
                #print(name.replace(path,""))
                fn = os.path.join(path, parent)
                tree['children'].append(dict(parent=(fn.replace(path,"http://localhost:8080/static")).replace('\\','/')))
        return tree
    
    

    @app.route('/')
    def server_static(filepath="index.html"):
        tempPath = staticFilesRoot.replace('\\','/')
        infoFromJson = make_tree(tempPath)
        infoFromJson = json2html.convert(json = infoFromJson,table_attributes="id=\"info-table\" class=\"table table-bordered table-hover\"")
        return infoFromJson;   

    @app.route('/images/<filename:re:.*\.png>')
    def send_image(filename):
        return static_file(filename, root=staticFilesRoot + '/images', mimetype='image/png')

    @app.route('/static/<filename:path>')
    def send_static(filename):
        return static_file(filename, root=staticFilesRoot)        
 
    app.run(host='0.0.0.0', port=http_port, server=wsgiServerName)




if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="server to host Local Log Files")
    parser.add_argument('-f','--server_html_files_dir', default = ".", help='Dir name where html content resides. Relevant only in server mode and only if you will use HTML5 web interface.')
    parser.add_argument('-r','--runmode', default = "server", help='run as  server.')
    parser.add_argument('-t','--http_port', default = 8080, help='http port for web server.')
    parser.add_argument('-w','--wsgi_server', default = 'waitress', help='WSGI server framework to use for running webserver. Relevant only for server mode. Default waitress.')
    args = parser.parse_args()

    
    run_as_server = args.runmode == "server"
    server_html_files_dir = args.server_html_files_dir
    
    http_port = int(args.http_port)
    wsgiServerName = args.wsgi_server

    if run_as_server:
        startServer(server_html_files_dir, http_port, wsgiServerName)
    else:
        parser.print_help()
        print("Available WSGI server names: ", ",".join(server_names.keys()))
        exit(1)

