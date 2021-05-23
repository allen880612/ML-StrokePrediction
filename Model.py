import random
import json

class ArrayModel():

    # healthy = [7.00, 10.5, 12, 6.5, 13, 10.2, 8, 10, 12.8, 10]
    # stroke = [0, 0, 4.3, 5, 15, 20.7, 25, 30, 0]

    def __init__(self, healthy=[float], stroke=[float]):
        self.healthy = healthy
        self.stroke = stroke


class DiseaseModel():
    def __init__(self, healthy_disease=float, healthy_not_disease=float, stroke_disease=float, stroke_not_disease=float):
        self.healthy_disease = healthy_disease
        self.healthy_not_disease = healthy_not_disease
        self.stroke_disease = stroke_disease
        self.stroke_not_disease = stroke_not_disease


class T_TestModel():
    data_label = [
        'age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi',
        'work_type_Govt_job', 'work_type_Never_worked', 'work_type_Private',
        'work_type_Self-employed', 'work_type_children',
        'smoking_status_Unknown', 'smoking_status_formerly smoked',
        'smoking_status_never smoked', 'smoking_status_smokes', 'gender_Female',
        'gender_Male', 'gender_Other', 'ever_married_No', 'ever_married_Yes',
        'Residence_type_Rural', 'Residence_type_Urban']
    
    data_dict = {}
    for l in data_label:
        data_dict[l] = random.uniform(0.1, 2)
    
    def toJson(self):
        return json.dumps(self.data_dict)

# import json
# model = AgeModel([1, 2, 3], [1, 2, 3, 4])
# print (json.dumps(model.__dict__))
# model = DiseaseModel(52.3, 47.7, 76.5, 23.5)
# print (json.dumps(model.__dict__))

# print(T_TestModel().toJson())
