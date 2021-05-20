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

// const color
const BLUE  = "#46BFBD";
const RED   = "#F7464A";
const BLACK = "#000000";
const GRAY  = "#666666";
const GLOOMY  = "rgba(0, 0, 0, 0.1)";

// find element by id
function ConnectElementId() {
    console.log("ConnectElementId");
    html_chart_age = $("#chart_age");
    html_chart_heart_disease = $("#chart_heart_disease");
    html_chart_hypertension = $("#chart_hypertension");
    html_chart_avg_glucose_level = $("#chart_avg_glucose_level");
    html_chart_bmi = $("#chart_bmi");
}

/**
 * Load Data from Flask by JQury.ajax & Build Chart
 */

function BuildChart(api, data) {
    // console.log("Ajax call LoadData: " + api);
    switch (api) {
        case "/age":
            chart_age = BuildChartAge(data);
            break;

        case "/heart_disease":
            chart_heart_disease = BuildChartHeartDisease(data);
            break;

        case "/hypertension":
            chart_hypertension = BuildChartHypertension(data);
            break;

        case "/avg_glucose_level":
            chart_avg_glucose_level = BuildChartAvgGlucodeLevel(data);
            break;

        case "/bmi":
            chart_bmi = BuildChartBmi(data);
            break;

        default:
            console.error("Unknow Api Called!");
    }
}

function GetDataByAjax(api) {
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
        BuildChart(api, resultJson);
    }
}

function GetData() {
    // console.log("GetDataByAjax");

    GetDataByAjax("/age");
    GetDataByAjax("/heart_disease");
    GetDataByAjax("/hypertension");
    GetDataByAjax("/avg_glucose_level");
    GetDataByAjax("/bmi");
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
            legend: {
                position: "top",
                display: true,
                align: "start",
            },
            title: {
                display: true,
                text: title,
                padding: {
                    top: padding_top,
                    bottom: padding_bottom
                },
                font: {
                    weight: 'bold',
                    size: 24,
                },
                color: BLACK
            },
        }
    };

    return options;
}

function GetAgeData(data) {
    var data_source = {};
    data_source.labels = BulidIntervalLabel(0, 100, 10);
    data_source.datasets = [];
    data_source.datasets.push({
        label: "Healthy People(%)",
        backgroundColor: BLUE,
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke People(%)",
        backgroundColor: RED,
        data: data.stroke
    });

    return data_source;
}


// Age bar chart
function BuildChartAge(data) {
    // console.log("BuildChartAge");
    var data_source = GetAgeData(data);
    var options = BuildOptions("Age Distribution", 5, 5);

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    return new Chart(html_chart_age, config);
}

function GetDoughnutData(data, labels) {
    var data_source = {};
    data_source.labels = labels;
    data_source.datasets = [];

    var colors = [
        RED,
        BLUE,
        BLACK,
        GRAY
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

function BuildChartHeartDisease(data) {
    var labels = ["Healthy have", "Healthy NOT have", "Stroke have", "Stroke NOT have"];
    var title = 'Heart Disease';
    return BuildDoughnutChart(html_chart_heart_disease, data, labels, title)
}

function BuildChartHypertension(data) {
    var labels = ["Healthy have", "Healthy NOT have", "Stroke have", "Stroke NOT have"];
    var title = 'Hypertension';
    return BuildDoughnutChart(html_chart_hypertension, data, labels, title)
}


// Average Glucode Level Line Chart
function GetAvgGlucodeLevelData(data) {
    var labels = BulidIntervalLabel(40, 260, 20);
    var data_source = {
        labels: labels,
        datasets: [{
            label: 'Healthy People(%)',
            data: data.healthy,
            borderColor: '#46BFBD',
            // pointBackgroundColor: '#46BFBD',
            tension: 0.1
        },
        {
            label: 'Stroke People(%)',
            data: data.stroke,
            borderColor: '#F7464A',
            // pointBackgroundColor: '#F7464A',
            tension: 0.1
        }]
    };
    return data_source;
}

function BuildChartAvgGlucodeLevel(data) {

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
        backgroundColor: BLUE,
        data: data.healthy
    });
    data_source.datasets.push({
        label: "Stroke People(%)",
        backgroundColor: RED,
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

function BuildChartBmi(data) {
    const config = GetBmiConfig(data);
    return new Chart(html_chart_bmi, config);
}


/**
 * Update Chart
 */

 function GetIndexInInterval(start, end, step, target) {
    for (var i = start; i < end; i += step) {
        if (target >= i && target < i+step){
            return (i - start) / step;
        }
    }
    // fixed boundary
    return (i - start - step) / step;
}


function UpdateBarChart(chart, index, length)
{
    var healthy_colors = [];
    for (var i = 0; i < length; i++){
        healthy_colors.push(GLOOMY);
    }

    healthy_colors[index] = BLUE;
    // deepcopy
    var stroke_colors = healthy_colors.filter(() => true);
    stroke_colors[index] = RED;

    chart.data.datasets[0].backgroundColor = healthy_colors;
    chart.data.datasets[1].backgroundColor = stroke_colors;

    chart.update();
}

function UpdateLineChart(chart, index, length)
{
    var healthy_colors = [];
    for (var i = 0; i < length; i++){
        healthy_colors.push(GLOOMY);
    }

    healthy_colors[index] = BLUE;
    // deepcopy
    var stroke_colors = healthy_colors.filter(() => true);
    stroke_colors[index] = RED;
    
    chart.data.datasets[0].borderColor = healthy_colors;
    chart.data.datasets[0].pointBackgroundColor = healthy_colors;
    chart.data.datasets[1].borderColor = stroke_colors;
    chart.data.datasets[1].pointBackgroundColor = stroke_colors;

    // chart.data.datasets.forEach((dataset) => {
    //     dataset.fill = true;
    // });

    chart.update();
}

function UpdateChartAge(age)
{
    var index = GetIndexInInterval(0, 100, 10, age);
    var length = chart_age.data.datasets[0].data.length;
    UpdateBarChart(chart_age, index, length);
}

function UpdateChartDisease(chart, haveDisease)
{
    var colors = [RED, BLUE, BLACK, GRAY];

    if (haveDisease){
        colors[0] = GLOOMY;
        colors[2] = GLOOMY;
    }else{
        colors[1] = GLOOMY;
        colors[3] = GLOOMY;
    }
    
    console.log(chart);
    chart.data.datasets.forEach((dataset) => {
        dataset.backgroundColor = colors;
    });

    chart.update();
}

function UpdateChartAvgGlucodeLevel(avg_glucode_level)
{
    var index = GetIndexInInterval(40, 260, 20, avg_glucode_level);
    var length = chart_avg_glucose_level.data.datasets[0].data.length;
    UpdateLineChart(chart_avg_glucose_level, index, length);
}

function UpdateChartBmi(bmi)
{
    var index = GetIndexInInterval(10, 60, 5, bmi);
    var length = chart_bmi.data.datasets[0].data.length;
    UpdateBarChart(chart_bmi, index, length);
}

function UpdateChartByUserData() {
    UpdateChartAge(32);
    UpdateChartDisease(chart_heart_disease, true);
    UpdateChartDisease(chart_hypertension, false);
    UpdateChartAvgGlucodeLevel(82);
    UpdateChartBmi(40);
}

// Load Trigger
window.onload = function () {
    ConnectElementId();
    GetData();
    UpdateChartByUserData();
}