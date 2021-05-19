var chart_age;
var chart_heart_disease;
var chart_hypertension;
var chart_avg_glucose_level;
var chart_bmi;

// set element by id
function ConnectElementId() {
    console.log("ConnectElementId");
    chart_age = $("#chart_age");
    chart_heart_disease = $("#chart_heart_disease");
    chart_hypertension = $("#chart_hypertension");
    chart_avg_glucose_level = $("#chart_avg_glucose_level");
    chart_bmi = $("#chart_avg_glucose_level");
}

// Load data from flask by JQuery Ajax

function LoadData(api, data) {
    // console.log("Ajax call LoadData: " + api);
    switch (api) {
        case "/age":
            return LoadAgeData(data);

        case "/heart_disease":
            return LoadHeartDiseaseData(data);

        case "/hypertension":
            return LoadHypertensionData(data);

        case "/avg_glucose_level":
            return LoadAvgGlucodeLevelData(data);

        case "/bmi":
            return LoadBmiData(data);

        default:
            return false;
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
                alert("success " + data);
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

function LoadDataByAjax() {
    // console.log("LoadDataByAjax");

    GetData("/age");
    GetData("/heart_disease");
    GetData("/hypertension");
    GetData("/avg_glucose_level");
    GetData("/bmi");
}

// Element build by Cahrt js

// Age bar chart
function LoadAgeData(data) {
    // console.log("LoadAgeData");

    config.labels = BulidAgeLabel();
    config.datasets = [];
    config.datasets.push({
        label: "Healthy Pecentage(%)",
        data: data.healthy
    })

    config.datasets.push({
        label: "Stroke Pecentage(%)",
        backgroundColor: "#ff0000",
        data: data.stroke
    })

    new Chart(chart_age,
        {
            type: 'bar',
            data: config,
            options: {
                legend: { display: true },
                title: {
                    display: true,
                    text: 'Age population - Stroke percentage'
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        });

    return true;
}

var config = {
    labels: [],
    datasets: [
    ],
    xHighlightRange: {
        begin: 50,
        end: 60,
        fillStyle: "#000000",
    }
};

function BulidAgeLabel() {
    ageLabels = []
    for (var i = 0; i < 100; i += 10) {
        ageLabels.push(i.toString() + "-" + (i + 10).toString());
    }
    return ageLabels;
}


function BuildDoughnutChart(chart, data, labels, title) {
    var colors = [
        "#F7464A",
        "#46BFBD",
        "#000000",
        "#666666"
    ];

    var datasets = [];
    var healthy_data = {
        data: [data.healthy_disease, data.healthy_not_disease, 0, 0],
        backgroundColor: colors
    };
    var stroke_data = {
        data: [0, 0, data.stroke_disease, data.stroke_not_disease],
        backgroundColor: colors
    };
    datasets.push(healthy_data, stroke_data);

    var options = {
        legend: { display: true },
        title: {
            display: true,
            text: title
        }
    };

    new Chart(chart,
        {
            type: 'doughnut',
            options: options,
            data: {
                datasets: datasets,
                labels: labels
            }
        })
}

function LoadHeartDiseaseData(data) {
    var labels = ["Healthy have disease(%)", "Healthy not have disease(%)", "Stroke have disease(%)", "Stroke not have disease(%)"];
    var title = 'Have heart disease';
    BuildDoughnutChart(chart_heart_disease, data, labels, title)
}

function LoadHypertensionData(data) {
    var labels = ["Healthy have disease(%)", "Healthy not have disease(%)", "Stroke have disease(%)", "Stroke not have disease(%)"];
    var title = 'Have hypertension';
    BuildDoughnutChart(chart_hypertension, data, labels, title)
}

window.onload = function () {
    ConnectElementId();
    LoadDataByAjax();
}