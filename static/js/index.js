var genderData;
var marriedData;
var residenceData;
var workData;
var smokingData;
GetPieData();

var genderLabel = ['Stroke-Female','NoStroke-Female',
                    'Stroke-Male', 'NoStroke-Male' ];
genderData = [
    {
      backgroundColor: ['rgba(253, 6, 209, 0.7)', 'rgba(253, 6, 209, 0.3)'],
      data: [genderData.femaleStroke, genderData.femaleNoStroke]
    },
    {
      backgroundColor: ['rgba(6, 35, 253, 0.7)', 'rgba(6, 35, 253, 0.3)'],
      data: [genderData.maleStroke, genderData.maleNoStroke]
    }
];

var MarriedLabel = ['Stroke-Never', 'NoStroke-Never',
                    'Stroke-Ever','NoStroke-Ever' ];                        

marriedData = [
    {
      backgroundColor: ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.3)'],
      data: [marriedData.neverStroke, marriedData.neverNoStroke]
    },
    {
      backgroundColor: ['rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.3)'],
      data: [marriedData.everStroke, marriedData.everNoStroke]
    }
];

var residenceLabel = ['Stroke-Urban', 'NoStroke-Urban',
                          'Stroke-Rural','NoStroke-Rural' ];                          

residenceData = [
    {
      backgroundColor: ['rgba(0, 140, 225, 0.7)', 'rgba(0, 140, 225, 0.3)'],
      data: [residenceData.urbanStroke, residenceData.urbanNoStroke]
    },
    {
      backgroundColor: ['rgba(185, 110, 0, 0.7)', 'rgba(185, 110, 0, 0.3)'],
      data: [residenceData.ruralStroke, residenceData.ruralNoStroke]
    }
];

var workLabel = ['Stroke-Govt Job','NoStroke-Govt Job',
                'Stroke-Self Empolyed','NoStroke-Self Empolyed',
                'Stroke-Private','NoStroke-Private',
                'Stroke-Children', 'NoStroke-Children',
                'Stroke-Never Worked','NoStroke-Never Worked'];

workData = [
    {
        backgroundColor: ['rgba(0, 0, 255, 0.7)', 'rgba(0, 0, 255, 0.3)'],
        data: [workData.govtStroke, workData.govtNoStroke]
    },
    {
        backgroundColor: ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.3)'],
        data: [workData.selfStroke, workData.selfNoStroke]
    },
    {
      backgroundColor: ['rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.3)'],
      data: [workData.privateStroke, workData.privateNoStroke]
    },
    {
      backgroundColor: ['rgba(255, 255, 0, 0.7)', 'rgba(255, 255, 0, 0.3)'],
      data: [workData.childrenStroke, workData.childrenNoStroke]
    },
    {
        backgroundColor: ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0,  0, 0.3)'],
        data: [workData.neverStroke, workData.neverNoStroke]
    }
];

var smokingLabel = ['Stroke-Formerly','NoStroke-Formerly',
                     'Stroke-Smokes', 'NoStroke-Smokes',
                     'Stroke-Never','NoStroke-Neverd',
                     'Stroke-Unknown','NoStroke-Unknown'];

smokingData = [
    {
        backgroundColor: ['rgba(255, 255, 0, 0.7)', 'rgba(255, 255, 0, 0.3)'],
        data: [smokingData.formerlyStroke, smokingData.formerlyNoStroke]
    },
    {
      backgroundColor: ['rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.3)'],      
      data: [smokingData.smokesStroke, smokingData.smokesNoStroke]
    },
    {
        backgroundColor: ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.3)'],
        data: [smokingData.neverStroke, smokingData.neverNoStroke]
    },
    {
      backgroundColor: ['rgba(0, 0, 255, 0.7)', 'rgba(0, 0, 255, 0.3)'],
      data: [smokingData.unknownStroke, smokingData.unknownNoStroke]
    }
];


var predictLabel = ['Stroke','NoStroke' ];
var predictData = [
    {
      backgroundColor: ['rgba(0, 140, 225, 0.7)', 'rgba(0, 140, 225, 0.3)'],      
      data: [50, 50]
    }
]

var genderChart = DrawPieChart('gender_chart','Gender',genderLabel,genderData);
var marriedChart = DrawPieChart('ever_married_chart','Ever Married',MarriedLabel,marriedData);
var residenceChart = DrawPieChart('residence_type_chart','Residence Type',residenceLabel,residenceData);
var workChart = DrawPieChart('work_type_chart','Work Type',workLabel,workData);
var smokingChart = DrawPieChart('smoking_status_chart','Smoking Status',smokingLabel,smokingData);
var predictChart = DrawPieChart('predict_chart','Prevalence',predictLabel,predictData);
//畫圓餅圖

function DrawPieChart(elementStr,title,label,data,){
    return new Chart(document.getElementById(elementStr).getContext('2d'), {
        type: 'pie',
        data: {
            labels: label,
            datasets: data
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                      generateLabels: function(chart) {
                        // Get the default label list
                        const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                        const labelsOriginal = original.call(this, chart);
            
                        // Build an array of colors used in the datasets of the chart
                        var datasetColors = chart.data.datasets.map(function(e) {
                          return e.backgroundColor;
                        });
                        datasetColors = datasetColors.flat();
            
                        // Modify the color and hide state of each label
                        labelsOriginal.forEach(label => {
                          // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                          label.datasetIndex = (label.index - label.index % 2) / 2;
            
                          // The hidden state must match the dataset's hidden state
                          label.hidden = !chart.isDatasetVisible(label.datasetIndex);
            
                          // Change the color to match the dataset
                          label.fillStyle = datasetColors[label.index];
                        });
            
                        return labelsOriginal;
                      }
                    },
                    onClick: function(mouseEvent, legendItem, legend) {
                      // toggle the visibility of the dataset from what it currently is
                      legend.chart.getDatasetMeta(
                        legendItem.datasetIndex
                      ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
                      legend.chart.update();
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
                            return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 26
                    }
                }
            }
        }
    });
}

function GetData(url){
    var t;
    $.ajax({
        async: false,
        url: url,
        method: 'get',
        success: function (data) {
            t = JSON.parse(data);
        }
    });
    return t;
}

function GetPieData(){
    genderData =  GetData('/gender');
    marriedData =  GetData('/married');
    residenceData =  GetData('/residence');
    workData =  GetData('/work');
    smokingData =  GetData('/smoking');
}

function UpdateChart(chart, size, index, color){
  var i;
  for(i=0;i<size;i++){
    chart.data.datasets[i].backgroundColor = ['rgba(0, 0, 0, 0.15)','rgba(0, 0, 0, 0.08)'];
  }
  chart.data.datasets[index].backgroundColor = color;
  chart.update();
}

function UpdateMarriedChart(){
  var flag = $("#ever_married_check").is(':checked');
  var marriedIndex;
  if(flag){
    marriedIndex = 1;
  }else{
    marriedIndex = 0;
  }  
  UpdateChart(marriedChart,2,marriedIndex,['rgba(255, 0, 0, 0.7)','rgba(255, 0, 0, 0.3)']);
}

function Update(){
  UpdateChart(genderChart,2,$("#gender_option").val(),['rgba(0, 255, 0, 0.7)','rgba(0, 255, 0, 0.3)']);
  UpdateMarriedChart();
  UpdateChart(residenceChart,2,$("#residence_type_option").val(),['rgba(0, 0, 255, 0.7)','rgba(0, 0, 255, 0.3)']);
  UpdateChart(workChart,5,$("#work_type_option").val(),['rgba(219, 115, 0, 0.7)','rgba(219, 115, 0, 0.3)']);
  UpdateChart(smokingChart,4,$("#smoking_status_option").val(),['rgba(255, 0, 255, 0.7)','rgba(255, 0, 255, 0.3)']);
  UpdateChartByUserData();
}

// Chart object
var chart_age;
var chart_heart_disease;
var chart_hypertension;
var chart_avg_glucose_level;
var chart_bmi;

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
                //console.log(data);
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

function LoadData() {
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
                color: "#000000"
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
function BuildChartAge(data) {
    
    var data_source = GetAgeData(data);
    //console.log(data_source);
    var options = BuildOptions("Age Distribution", 5, 5);

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }

    return new Chart($("#chart_age"), config);
}

function GetDoughnutData(data, labels) {
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

function BuildChartHeartDisease(data) {
    var labels = ["Healthy have", "Healthy NOT have", "Stroke have", "Stroke NOT have"];
    var title = 'Heart Disease';
    return BuildDoughnutChart($("#chart_heart_disease"), data, labels, title)
}

function BuildChartHypertension(data) {
    console.log(data);
    var labels = ["Healthy have", "Healthy NOT have", "Stroke have", "Stroke NOT have"];
    var title = 'Hypertension';
    return BuildDoughnutChart($("#chart_hypertension"), data, labels, title);
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

    return new Chart($("#chart_avg_glucose_level"), config);
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

function BuildChartBmi(data) {
    const config = GetBmiConfig(data);
    return new Chart($("#chart_bmi"), config);
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
        healthy_colors.push("rgba(0, 0, 0, 0.1)");
    }

    healthy_colors[index] = "#46BFBD";
    // deepcopy
    var stroke_colors = healthy_colors.filter(() => true);
    stroke_colors[index] = "#F7464A";

    chart.data.datasets[0].backgroundColor = healthy_colors;
    chart.data.datasets[1].backgroundColor = stroke_colors;

    chart.update();
}

function UpdateLineChart(chart, index, length)
{
    var healthy_colors = [];
    for (var i = 0; i < length; i++){
        healthy_colors.push("rgba(0, 0, 0, 0.1)");
    }

    healthy_colors[index] = "#46BFBD";
    // deepcopy
    var stroke_colors = healthy_colors.filter(() => true);
    stroke_colors[index] = "#F7464A";
    
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
    var colors = ["#F7464A", "#46BFBD", "#000000", "#666666"];

    if (haveDisease){
        colors[0] = "rgba(0, 0, 0, 0.1)";
        colors[2] = "rgba(0, 0, 0, 0.1)";
    }else{
        colors[1] = "rgba(0, 0, 0, 0.1)";
        colors[3] = "rgba(0, 0, 0, 0.1)";
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

    var age = $("#age_input").val()
    var bmi = $("#bmi_input").val()
    var avg_glucose = $("#glucose_input").val()
    var has_hypertension = $("#hypertension_check").is(':checked')
    var has_heart_disease = $("#heart_disease_check").is(':checked')

    UpdateChartAge(age);
    UpdateChartDisease(chart_heart_disease, has_heart_disease);
    UpdateChartDisease(chart_hypertension, has_hypertension);
    UpdateChartAvgGlucodeLevel(avg_glucose);
    UpdateChartBmi(bmi);
}

// Load Trigger
window.onload = function () {
    LoadData();
};