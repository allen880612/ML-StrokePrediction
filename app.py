from flask import Flask, request, render_template, send_from_directory
import os
scriptPath = os.path.dirname(os.path.realpath(__file__))
os.chdir(scriptPath) 

template_folder = os.path.join(os.getcwd(),'templates')
static_folder = os.path.join(os.getcwd(),'static')
app = Flask(__name__, template_folder=template_folder,static_folder=static_folder)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path,mimetype='text/css')

@app.route("/index")
def index():
    return render_template("index.html")

if __name__ == 'main':
    app.run()