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
            t = data;
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
}