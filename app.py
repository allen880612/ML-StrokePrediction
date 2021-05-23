from flask import Flask, request, render_template, send_from_directory, redirect
import os
scriptPath = os.path.dirname(os.path.realpath(__file__))
os.chdir(scriptPath)

template_folder = os.path.join(os.getcwd(), 'templates')
static_folder = os.path.join(os.getcwd(), 'static')
app = Flask(__name__, template_folder=template_folder,
            static_folder=static_folder)

app.config['TEMPLATES_AUTO_RELOAD'] = True


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path, mimetype='text/css')


@app.route("/")
def root():
    return redirect("/index")


@app.route("/index")
def index():
    return render_template("index.html")


@app.route("/data")
def data():
    return render_template("data.html")


@app.route("/predict")
def predict():
    return render_template("predict.html")

import json
import Model
@app.route("/age")
def age():
    healthy = [7.00, 10.5, 12, 6.5, 13, 10.2, 8, 10, 12.8, 10]
    stroke = [0, 0, 4.3, 5, 15, 20.7, 22.5, 32.5, 0, 0]
    model = Model.ArrayModel(healthy, stroke)
    return json.dumps(model.__dict__)
    
@app.route("/bmi")
def bmi():
    healthy = [2, 8.5, 9, 14.5, 18, 12.2, 8, 10, 12.8, 5]
    stroke = [0, 0, 4.3, 5, 5, 15.7, 27.5, 32.5, 10, 0]
    model = Model.ArrayModel(healthy, stroke)
    return json.dumps(model.__dict__)

@app.route("/heart_disease")
def heart_disease():
    model = Model.DiseaseModel(52.3, 47.7, 76.5, 23.5)
    # return {"healthy_disease": 52.3, "healthy_not_disease": 47.7, "stroke_disease": 76.5, "stroke_not_disease": 23.5}
    return json.dumps(model.__dict__)

@app.route("/hypertension")
def hypertension():
    model = Model.DiseaseModel(51.6, 48.4, 82.3, 17.7)
    # return {"healthy_disease": 52.3, "healthy_not_disease": 47.7, "stroke_disease": 76.5, "stroke_not_disease": 23.5}
    return json.dumps(model.__dict__)

@app.route("/avg_glucose_level")
def avg_glucose_level():
    healthy = [7, 10.5, 12, 6.5, 13, 10.2, 8, 10, 12.8, 4.5, 5.5]
    stroke = [0, 0, 4.3, 5, 10, 20.7, 22.5, 27.5, 5, 4.5, 0.5, 0]
    model = Model.ArrayModel(healthy, stroke)
    return json.dumps(model.__dict__)


if __name__ == 'main':
    app.run(debug=True, use_debugger=True, use_reloader=True)
