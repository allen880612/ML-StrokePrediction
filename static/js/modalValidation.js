var personalInfoModal = document.getElementById('personalInfoModal')
personalInfoModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget
  // Extract info from data-bs-* attributes
  var recipient = button.getAttribute('data-bs-whatever')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalTitle = personalInfoModal.querySelector('.modal-title')
  var modalBodyInput = personalInfoModal.querySelector('.modal-body input')

  modalTitle.textContent = 'Personal Information' + recipient
  modalBodyInput.value = recipient
})

//個人信息窗口隱藏時的觸發事件
$("#personalInfoModal").on('hidden.bs.modal', function () {
    $("#age_hint").hide();
    $("#bmi_hint").hide();
    $("#glucose_hint").hide();
    $("#gender_hint").hide();
    $("#smoking_hint").hide();
    $("#work_hint").hide();
    $("#residence_hint").hide();
    $("#age_input").val("");
    $("#bmi_input").val("");
    $("#glucose_input").val("");
    $("#gender_option").val("");
    $("#smoking_status_option").val("");
    $("#work_type_option").val("");
    $("#residence_type_option").val("");
    $("#hypertension_check").prop('checked', false); 
    $("#heart_disease_check").prop('checked', false);
    $("#ever_married_check").prop('checked', false);
});

//輸入欄位值改變觸發事件
function OnInputValueChange(value,hintElement){
    if(value != ""){
        if(value <= 0){
            hintElement.text("Must be > 0");
        }else{
            hintElement.hide();
            return true;
        }
    }else{
        hintElement.text("Input Required");
    }
    hintElement.show();
    return false;
}

//選項欄位值改變觸發事件
function OnOptionValueChange(value,hintElement){
    if(value == ""){
        hintElement.show();
        return false;
    }
    hintElement.hide();
    return true;
}

function OnAgeValueChange(value){
    return OnInputValueChange(value,$("#age_hint"))
}

function OnBmiValueChange(value){
    return OnInputValueChange(value,$("#bmi_hint"))
}

function OnGlucoseValueChange(value){
    return OnInputValueChange(value,$("#glucose_hint"))
}

function OnGenderValueChange(value){
    return OnOptionValueChange(value,$("#gender_hint"))
}

function OnSmokingValueChange(value){
    return OnOptionValueChange(value,$("#smoking_hint"))
}

function OnWorkTypeValueChange(value){
    return isWorkValid = OnOptionValueChange(value,$("#work_hint"))
}

function OnResidenceTypeValueChange(value){
    return isResidenceValid = OnOptionValueChange(value,$("#residence_hint"))
}

function ShowPersonalInfo(){
    var hypertension = "Not Have";
    var heartDisease = "Not Have";
    var everMarried = "Never";
    if($("#hypertension_check").is(':checked')){
        hypertension = "Have";
    }
    if($("#heart_disease_check").is(':checked')){
        heartDisease = "Have";
    }
    if($("#ever_married_check").is(':checked')){
        everMarried = "Ever";
    }
    $("#gender").text($("#gender_option option:selected").text());
    $("#age").text($("#age_input").val());
    $("#hypertension").text(hypertension);
    $("#heart_disease").text(heartDisease);
    $("#ever_married").text(everMarried);
    $("#work_type").text($("#work_type_option option:selected").text());
    $("#Residence_type").text($("#residence_type_option option:selected").text());
    $("#avg_glucose_level").text($("#glucose_input").val());
    $("#bmi").text($("#bmi_input").val());
    $("#smoking_status").text($("#smoking_status_option option:selected").text());

}

//點擊Predict按鈕的觸發事件
function OnPredictClick(){
    var age = $("#age_input").val();
    var bmi = $("#bmi_input").val();
    var glucose = $("#glucose_input").val();
    var gender = $("#gender_option").val();
    var smokingStatus = $("#smoking_status_option").val();
    var workType = $("#work_type_option").val();
    var residenceType = $("#residence_type_option").val();
    var hypertension = $("#hypertension_check").is(':checked'); 
    var heartDisease = $("#heart_disease_check").is(':checked'); 
    var everMarried = $("#ever_married_check").is(':checked');
    
    var isAgeValid=false;
    var isBmiValid=false;
    var isGlucoseValid=false;
    var isGenderValid=false;
    var isSmokingValid=false;
    var isWorkValid=false;
    var isResidenceValid=false;

    isAgeValid = OnAgeValueChange(age);
    isBmiValid = OnBmiValueChange(bmi);
    isGlucoseValid = OnGlucoseValueChange(glucose);
    isGenderValid = OnGenderValueChange(gender);
    isSmokingValid = OnSmokingValueChange(smokingStatus);
    isWorkValid = OnWorkTypeValueChange(workType);
    isResidenceValid = OnResidenceTypeValueChange(residenceType);

    if(isAgeValid && isBmiValid && isGlucoseValid && isGenderValid && isSmokingValid && isWorkValid && isResidenceValid){

        var personalInfoData = {
            gender:gender,
            age:age,
            hypertension:hypertension,
            heart_disease:heartDisease,
            ever_married:everMarried,
            work_type:workType,
            Residence_type:residenceType,
            avg_glucose_level:glucose,
            bmi:bmi,
            smoking_status:smokingStatus
        }

        //獲取預測結果並更新圖表及資訊
        $.getJSON(
            '/test',
            personalInfoData,
            function(data) {
                //test            
                var ranNum = Math.floor(Math.random()*100)+1;
                predictChart.data.datasets[0].data[0] = ranNum;
                predictChart.data.datasets[0].data[1] = 100-ranNum;
                $("#stroke_rate").text(ranNum + '%');
                Update();
                //test
        });
        ShowPersonalInfo();
        
        $("#personalInfoModal").modal('hide');
        $("#prediction_result").show();
    }
}