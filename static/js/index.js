var chart_age;
var chart_heart_disease;
var chart_hypertension;
var chart_avg_glucose_level;
var chart_bmi;

// find element by id
function ConnectElementId() {
    console.log("ConnectElementId");
    chart_age = $("#chart_age");
    chart_heart_disease = $("#chart_heart_disease");
    chart_hypertension = $("#chart_hypertension");
    chart_avg_glucose_level = $("#chart_avg_glucose_level");
    chart_bmi = $("#chart_bmi");
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

function BulidIntervalLabel(start, end, step) {
    labels = []
    for (var i = start; i < end; i += step) {
        labels.push(i.toString() + "-" + (i + step).toString());
    }
    return labels;
}

// Age bar chart
function LoadAgeData(data) {
    // console.log("LoadAgeData");
    var data_source = {};
    data_source.labels = BulidIntervalLabel(0, 100, 10);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy Pecentage(%)",
        backgroundColor: "#46BFBD",
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke Pecentage(%)",
        backgroundColor: "#F7464A",
        data: data.stroke
    });

    var options = {
        legend: { display: true },
        title: {
            display: true,
            text: 'Age population - Stroke percentage'
        }
    };

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    new Chart(chart_age, config);

    return true;
}

// Disease Doughnut Chart
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

// Average Glucode Level Line Chart
function LoadAvgGlucodeLevelData(data) {
    var labels = BulidIntervalLabel(40, 260, 20);
    var data = {
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

    const config = {
        type: 'line',
        data: data,
    };

    new Chart(chart_avg_glucose_level, config);
}

function GetBmiConfig(data)
{
    var data_source = {};
    data_source.labels = BulidIntervalLabel(10, 60, 5);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy Pecentage(%)",
        backgroundColor: "#46BFBD",
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke Pecentage(%)",
        backgroundColor: "#F7464A",
        data: data.stroke
    });

    var options = {
        legend: { display: true },
        title: {
            display: true,
            text: 'BMI Percentage'
        }
    };

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    new Chart(chart_bmi, config);
}

function LoadBmiData(data) {
    var data_source = {};
    data_source.labels = BulidIntervalLabel(0, 100, 10);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy Pecentage(%)",
        backgroundColor: "#46BFBD",
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke Pecentage(%)",
        backgroundColor: "#F7464A",
        data: data.stroke
    });

    var options = {
        legend: { display: true },
        title: {
            display: true,
            text: 'Age population - Stroke percentage'
        }
    };

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    new Chart(chart_bmi, config);

    return true;
}

// Load Trigger
window.onload = function () {
    ConnectElementId();
    LoadDataByAjax();
}