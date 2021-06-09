from flask import Flask, request, render_template, send_from_directory, redirect
import os
import pandas as pd
import numpy as np
import json
from xgboost import XGBClassifier
import pickle
from flask import request

def get_patients_data():
    patients = pd.read_csv("healthcare-dataset-stroke-data.csv")
    patients.stroke = patients.stroke.apply(lambda x: True if x==1 else False)
    patients.ever_married = patients.ever_married=="Yes"
    return patients

patients = get_patients_data()
model = pickle.load(open("model.pkl", "rb"))

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
@app.route("/")		######test
def index():
    return render_template("index.html")


@app.route("/data")
def data():
    return render_template("data.html")


@app.route("/predict_page")
def predict_page():
    return render_template("predict.html")

#APIs
@app.route("/gender", methods=['GET'])
def get_gender():
    res = {
        "maleStroke":sum((patients.gender=="Male") & (patients.stroke)),
        "maleNoStroke":sum((patients.gender=="Male") & (~patients.stroke)),
        "femaleStroke":sum((patients.gender=="Female") & (patients.stroke)),
        "femaleNoStroke":sum((patients.gender=="Female") & (~patients.stroke)),
    }
    return json.dumps(res)

@app.route("/married", methods=['GET'])
def get_married():
    res = {
        "neverStroke":sum((~patients.ever_married) & (patients.stroke)),
        "neverNoStroke":sum((~patients.ever_married) & (~patients.stroke)),
        "everStroke":sum((patients.ever_married) & (patients.stroke)),
        "everNoStroke":sum((patients.ever_married) & (~patients.stroke)),
    }
    return json.dumps(res)

@app.route("/residence", methods=['GET'])
def get_residence():
    res = {
        "urbanStroke":sum((patients.Residence_type=="Urban") & (patients.stroke)),
        "urbanNoStroke":sum((patients.Residence_type=="Urban") & (~patients.stroke)),
        "ruralStroke":sum((patients.Residence_type=="Rural") & (patients.stroke)),
        "ruralNoStroke":sum((patients.Residence_type=="Rural") & (~patients.stroke))
    }
    return json.dumps(res)

@app.route("/work", methods=['GET'])
def get_work():
    res = {
        "childrenStroke":sum((patients.work_type=="children") & (patients.stroke)),
        "childrenNoStroke":sum((patients.work_type=="children") & (~patients.stroke)),
        "privateStroke":sum((patients.work_type=="Private") & (patients.stroke)),
        "privateNoStroke":sum((patients.work_type=="Private") & (~patients.stroke)),
        "selfStroke":sum((patients.work_type=="Self-employed") & (patients.stroke)),
        "selfNoStroke":sum((patients.work_type=="Self-employed") & (~patients.stroke)),
        "govtStroke":sum((patients.work_type=="Govt_job") & (patients.stroke)),
        "govtNoStroke":sum((patients.work_type=="Govt_job") & (~patients.stroke)),
        "neverStroke":sum((patients.work_type=="Never_worked") & (patients.stroke)),
        "neverNoStroke":sum((patients.work_type=="Never_worked") & (~patients.stroke))
    }
    print(res)
    return json.dumps(res)

@app.route("/smoking", methods=['GET'])
def get_smoking():
    res = {
        "smokesStroke":sum((patients.smoking_status=="smokes") & (patients.stroke)),
        "smokesNoStroke":sum((patients.smoking_status=="smokes") & (~patients.stroke)),
        "formerlyStroke":sum((patients.smoking_status=="formerly smoked") & (patients.stroke)),
        "formerlyNoStroke":sum((patients.smoking_status=="formerly smoked") & (~patients.stroke)),
        "neverStroke":sum((patients.smoking_status=="never smoked") & (patients.stroke)),
        "neverNoStroke":sum((patients.smoking_status=="never smoked") & (~patients.stroke)),
        "unknownStroke":sum((patients.smoking_status=="Unknown") & (patients.stroke)),
        "unknownNoStroke":sum((patients.smoking_status=="Unknown") & (~patients.stroke)),
        
    }
    return json.dumps(res)

@app.route("/test_get_data", methods=["GET"])
def test_get_data():
    return json.dumps(request.args)

@app.route("/t_test", methods=["GET"])
def get_t_test_result():
    res = {
        'Residence_type_Rural': 0.6726720440894055,
        'Residence_type_Urban': 0.6726720440894076,
        'age': 3.6556933219806625e-61,
        'avg_glucose_level': 1.3799691107259876e-22,
        'bmi': 0.0029832690997420824,
        'ever_married_No': 1.5644079058362266e-13,
        'ever_married_Yes': 1.5644079058361983e-13,
        'gender_Female': 0.6313076318772126,
        'gender_Male': 0.6269370366326462,
        'gender_Other': 0.8330099212436719,
        'heart_disease': 2.774232441236691e-22,
        'hypertension': 1.0816791323337411e-23,
        'smoking_status_Unknown': 1.4250714281814548e-07,
        'smoking_status_formerly smoked': 5.860858628293931e-05,
        'smoking_status_never smoked': 0.452566637191093,
        'smoking_status_smokes': 0.13147677049124915,
        'work_type_Govt_job': 0.8034483430870814,
        'work_type_Never_worked': 0.3216316850308596,
        'work_type_Private': 0.29550587359637775,
        'work_type_Self-employed': 0.00010426677876820362,
        'work_type_children': 1.338562708809395e-08
    }
    return json.dumps(res)

@app.route("/predict", methods=['GET'])
def get_predict():

    age = [float(request.args["age"])]
    hypertension = [1 if request.args["hypertension"] else 0]
    heart_disease = [1 if request.args["heart_disease"] else 0]
    avg_glucose_level = [float(request.args["avg_glucose_level"])]
    bmi = [float(request.args["bmi"])]

    if(request.args["work_type"]==0):
        work_type=[1, 0, 0, 0, 0]
    elif(request.args["work_type"]==1):
        work_type=[0, 1, 0, 0, 0]
    elif(request.args["work_type"]==2):
        work_type=[0, 0, 1, 0, 0]
    elif(request.args["work_type"]==3):
        work_type=[0, 0, 0, 1, 0]
    else:
        work_type=[0, 0, 0, 0, 1]

    if(request.args["smoking_status"]==0):
        smoking_status = [1, 0, 0, 0]
    elif(request.args["smoking_status"]==1):
        smoking_status = [0, 1, 0, 0]
    elif(request.args["smoking_status"]==2):
        smoking_status = [0, 0, 1, 0]
    else:
        smoking_status = [0, 0, 0, 1]

    if(request.args["gender"]==0):
        gender = [1, 0, 0]
    else:
        gender = [0, 1, 0]

    if(request.args["ever_married"]):
        ever_married = [0, 1]
    else:
        ever_married = [1, 0]

    if(request.args["Residence_type"]==0):
        Residence_type = [1, 0]
    else:
        Residence_type = [0, 1]

    data = pd.DataFrame(age+hypertension+heart_disease+avg_glucose_level+bmi+work_type+smoking_status+gender+ever_married+Residence_type, 
             ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi', 
              'work_type_Govt_job', 'work_type_Never_worked', 'work_type_Private',
              'work_type_Self-employed', 'work_type_children',
              'smoking_status_Unknown', 'smoking_status_formerly smoked',
              'smoking_status_never smoked', 'smoking_status_smokes',
              'gender_Female', 'gender_Male', 'gender_Other',
              'ever_married_No', 'ever_married_Yes', 
              'Residence_type_Rural', 'Residence_type_Urban']).T
    
    res = {
        "result": float(model.predict_proba(data)[0][1])
    }
    return json.dumps(res)

@app.route("/age", methods=['GET'])
def get_age():
    health_age = patients.loc[~patients.stroke].age
    stroke_age = patients.loc[patients.stroke].age
    health_count = []
    stroke_count = []
    for i in range(0, 100, 10):
        health_count.append(100*sum((health_age>=i) & (health_age<i+10))/len(health_age))
        stroke_count.append(100*sum((stroke_age>=i) & (stroke_age<i+10))/len(stroke_age))
    res = {
        "healthy" : health_count,
        "stroke" : stroke_count
    }

    return json.dumps(res)

@app.route("/heart_disease", methods=['GET'])
def get_disease():
    healthy_len = len(patients.loc[~patients.stroke])
    stroke_len = len(patients.loc[patients.stroke])

    res = {
        "healthy_disease":100*sum((patients.heart_disease==1) & (~patients.stroke))/healthy_len,
        "healthy_not_disease":100*sum((patients.heart_disease==0) & (~patients.stroke))/healthy_len,
        "stroke_disease":100*sum((patients.heart_disease==1) & (patients.stroke))/stroke_len,
        "stroke_not_disease":100*sum((patients.heart_disease==0) & (~patients.stroke))/stroke_len,
    }

    return json.dumps(res)

@app.route("/hypertension", methods=['GET'])
def get_hypertension():
    healthy_len = len(patients.loc[~patients.stroke])
    stroke_len = len(patients.loc[patients.stroke])

    res = {
        "healthy_disease":100*sum((patients.hypertension==1) & (~patients.stroke))/healthy_len,
        "healthy_not_disease":100*sum((patients.hypertension==0) & (~patients.stroke))/healthy_len,
        "stroke_disease":100*sum((patients.hypertension==1) & (patients.stroke))/stroke_len,
        "stroke_not_disease":100*sum((patients.hypertension==0) & (~patients.stroke))/stroke_len,
    }

    return json.dumps(res)

@app.route("/avg_glucose_level", methods=['GET'])
def get_avg_glucose_level():
    health_avg_glucose_level = patients.loc[~patients.stroke].avg_glucose_level
    stroke_avg_glucose_level = patients.loc[patients.stroke].avg_glucose_level
    health_count = []
    stroke_count = []
    for i in range(40, 260, 20):
        health_count.append(100*sum((health_avg_glucose_level>=i) & (health_avg_glucose_level<i+20))/len(health_avg_glucose_level))
        stroke_count.append(100*sum((stroke_avg_glucose_level>=i) & (stroke_avg_glucose_level<i+20))/len(stroke_avg_glucose_level))
    res = {
        "healthy" : health_count,
        "stroke" : stroke_count
    }

    return json.dumps(res)

@app.route("/bmi", methods=['GET'])
def get_bmi():
    health_bmi = patients.loc[~patients.stroke].bmi
    stroke_bmi = patients.loc[patients.stroke].bmi
    health_count = []
    stroke_count = []
    for i in range(10, 60, 10):
        health_count.append(100*sum((health_bmi>=i) & (health_bmi<i+10))/len(health_bmi))
        stroke_count.append(100*sum((stroke_bmi>=i) & (stroke_bmi<i+10))/len(stroke_bmi))
    res = {
        "healthy" : health_count,
        "stroke" : stroke_count
    }

    return json.dumps(res)

@app.route("/importance")
def get_logistic_regression_importance():
    res = {
        "age":1.646661,
        "work_type":0.985934,
        "hypertension":0.396372,
        "smoking_status":0.369464,
        "heart_disease":0.283105,
        "avg_glucose_level":0.182338,
        "ever_married":0.180384,
        "residence_type":0.082869,
        "bmi":0.017474,
        "gender":0.013881
    }

    return json.dumps(res)


if __name__ == 'main':
    app.run(debug=True, use_debugger=True, use_reloader=True)
