from flask import Flask, request, render_template, send_from_directory, jsonify
import os
scriptPath = os.path.dirname(os.path.realpath(__file__))
os.chdir(scriptPath)

template_folder = os.path.join(os.getcwd(), 'templates')
static_folder = os.path.join(os.getcwd(), 'static')
app = Flask(__name__, template_folder=template_folder,
            static_folder=static_folder)


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path, mimetype='text/css')


@app.route("/index")
@app.route("/")		######test
def index():
    return render_template("index.html")


@app.route("/data")
def data():
    return render_template("data.html")

@app.route("/predict")
def predict():
    return render_template("predict.html")

##########test##########
@app.route('/test')
def test():
    print(request.args)
    return jsonify(72)

@app.route('/gender')
def gender():
    return jsonify({
        'maleStroke':'10',
        'maleNoStroke':'20',
        'femaleStroke':'20',
        'femaleNoStroke':'20'
    })

@app.route('/married')
def married():
    return jsonify({
        'neverStroke':'10',
        'neverNoStroke':'20',
        'everStroke':'30',
        'everNoStroke':'40'
    })

@app.route('/residence')
def residence():
    return jsonify({
        'urbanStroke':'20',
        'urbanNoStroke':'20',
        'ruralStroke':'10',
        'ruralNoStroke':'30'
    })

@app.route('/work')
def work():
    return jsonify({
        'childrenStroke':'20',
        'childrenNoStroke':'20',
        'privateStroke':'10',
        'privateNoStroke':'30',
        'selfStroke':'20',
        'selfNoStroke':'20',
        'govtStroke':'10',
        'govtNoStroke':'30',
        'neverStroke':'20',
        'neverNoStroke':'20'
    })

@app.route('/smoking')
def smoking():
    return jsonify({
        'smokesStroke':'20',
        'smokesNoStroke':'20',
        'formerlyStroke':'10',
        'formerlyNoStroke':'30',
        'neverStroke':'20',
        'neverNoStroke':'20',
        'unknownStroke':'10',
        'unknownNoStroke':'30'
})

@app.route('/importance')
def importance():
    return jsonify({
        'age':1.646661,
        'work_type':0.985934,
        'hypertension':0.396372,
        'smoking_status':0.369464,
        'heart_disease':0.283105,
        'avg_glucose_level':0.182338,
        'ever_married':0.180384,
        'residence_type':0.082869,
        'bmi':0.017474,
        'gender':0.013881
})
##########test##########

if __name__ == '__main__':
    app.run(debug=True)
