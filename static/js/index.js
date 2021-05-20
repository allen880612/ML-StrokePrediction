// html canvas element
var html_chart_age;
var html_chart_heart_disease;
var html_chart_hypertension;
var html_chart_avg_glucose_level;
var html_chart_bmi;

// Chart object
var chart_age;
var chart_heart_disease;
var chart_hypertension;
var chart_avg_glucose_level;
var chart_bmi;

// find element by id
function ConnectElementId() {
    console.log("ConnectElementId");
    html_chart_age = $("#chart_age");
    html_chart_heart_disease = $("#chart_heart_disease");
    html_chart_hypertension = $("#chart_hypertension");
    html_chart_avg_glucose_level = $("#chart_avg_glucose_level");
    html_chart_bmi = $("#chart_bmi");
}

// Load data from flask by JQuery Ajax

function LoadData(api, data) {
    // console.log("Ajax call LoadData: " + api);
    switch (api) {
        case "/age":
            chart_age = LoadAgeData(data);
            break;

        case "/heart_disease":
            chart_heart_disease = LoadHeartDiseaseData(data);
            break;

        case "/hypertension":
            chart_hypertension = LoadHypertensionData(data);
            break;

        case "/avg_glucose_level":
            chart_avg_glucose_level = LoadAvgGlucodeLevelData(data);
            break;

        case "/bmi":
            chart_bmi = LoadBmiData(data);
            break;

        default:
            console.error("Unknow Api Called!");
    }
}

function GetData(api) {
    // console.log("GetData: " + api);
    var response = null;

    $.ajax(
        {
            type: "GET",
            async: false,
            url: api,
            dataType: "text",
            success: function (data) {
                // alert("success " + data);
                console.log(data);
                response = data;
            },
            error: function (jQRe) {
                alert("error! " + jQRe.status);
                console.log(jQRe);
            }
        });

    if (response) {
        var resultJson = JSON.parse(response)
        LoadData(api, resultJson);
    }
}

function GetDataByAjax() {
    // console.log("GetDataByAjax");

    GetData("/age");
    GetData("/heart_disease");
    GetData("/hypertension");
    GetData("/avg_glucose_level");
    GetData("/bmi");
}

// Element build by Cahrt js

function BulidIntervalLabel(start, end, step) {
    labels = []
    for (var i = start; i < end; i += step) {
        labels.push(i.toString() + "-" + (i + step).toString());
    }
    return labels;
}

// Config Builder

function BuildOptions(title, padding_top, padding_bottom) {

    var options = {
        plugins: {
            title: {
                display: true,
                text: title,
                padding: {
                    top: padding_top,
                    bottom: padding_bottom
                },
                font:{
                    weight: 'bold',
                    size: 24,
                },
                color : "#000000"
            }
        }
    };

    return options;
}

function GetAgeData(data)
{
    var data_source = {};
    data_source.labels = BulidIntervalLabel(0, 100, 10);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy People(%)",
        backgroundColor: "#46BFBD",
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke People(%)",
        backgroundColor: "#F7464A",
        data: data.stroke
    });

    return data_source;
}

// Age bar chart
function LoadAgeData(data) {
    // console.log("LoadAgeData");
    var data_source = GetAgeData(data);
    var options = BuildOptions("Age Distribution", 5, 5);

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    return new Chart(html_chart_age, config);
}

function GetDoughnutData(data, labels){
    var data_source = {};
    data_source.labels = labels;
    data_source.datasets = [];

    var colors = [
        "#F7464A",
        "#46BFBD",
        "#000000",
        "#666666"
    ];
    var healthy_data = {
        data: [data.healthy_disease, data.healthy_not_disease, 0, 0],
        backgroundColor: colors
    };
    var stroke_data = {
        data: [0, 0, data.stroke_disease, data.stroke_not_disease],
        backgroundColor: colors
    };
    data_source.datasets.push(healthy_data, stroke_data);

    return data_source;
}

// Disease Doughnut Chart
function BuildDoughnutChart(chart, data, labels, title) {
    var data_source = GetDoughnutData(data, labels);
    var options = BuildOptions(title, 5, 5);

    const config = {
        type: 'doughnut',
        data: data_source,
        options: options
    };

    return new Chart(chart, config);
}

function LoadHeartDiseaseData(data) {
    var labels = ["Healthy have(%)", "Healthy NOT have(%)", "Stroke have(%)", "Stroke NOT have(%)"];
    var title = 'Heart Disease';
    BuildDoughnutChart(html_chart_heart_disease, data, labels, title)
}

function LoadHypertensionData(data) {
    var labels = ["Healthy have(%)", "Healthy NOT have(%)", "Stroke have(%)", "Stroke NOT have(%)"];
    var title = 'Hypertension';
    return BuildDoughnutChart(html_chart_hypertension, data, labels, title)
}

// Get Disease data
function GetAvgGlucodeLevelData(data)
{
    var labels = BulidIntervalLabel(40, 260, 20);
    var data_source = {
        labels: labels,
        datasets: [{
            label: 'Healthy People(%)',
            data: data.healthy,
            fill: false,
            borderColor: '#46BFBD',
            tension: 0.1
        },
        {
            label: 'Stroke People(%)',
            data: data.stroke,
            fill: false,
            borderColor: '#F7464A',
            tension: 0.1
        }]
    };
    return data_source;
}

// Average Glucode Level Line Chart
function LoadAvgGlucodeLevelData(data) {

    var data_source = GetAvgGlucodeLevelData(data);
    var options = BuildOptions('Average Glucode Level Distribution', 5, 5);

    const config = {
        type: 'line',
        data: data_source,
        options: options
    };

    return new Chart(html_chart_avg_glucose_level, config);
}

// Bmi Bar Chart 
function GetBmiConfig(data) {
    var data_source = {};
    data_source.labels = BulidIntervalLabel(10, 60, 5);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy People(%)",
        backgroundColor: "#46BFBD",
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke People(%)",
        backgroundColor: "#F7464A",
        data: data.stroke
    });

    var options = BuildOptions('BMI Distribution', 5, 5);
    
    const config = {
        type: 'bar',
        data: data_source,
        options: options
    }
    return config;
}

function LoadBmiData(data) {
    const config = GetBmiConfig(data);
    return new Chart(html_chart_bmi, config);
}

// Load Trigger
window.onload = function () {
    ConnectElementId();
    GetDataByAjax();
}