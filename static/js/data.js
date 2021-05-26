DrawImportanceChart();

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

function DrawImportanceChart()
{
    var data = GetData('/importance');
    var importanceData = [data.age,
                        data.work_type,
                        data.hypertension,
                        data.smoking_status,
                        data.heart_disease,
                        data.avg_glucose_level,
                        data.ever_married,
                        data.residence_type,
                        data.bmi,
                        data.gender]
    new Chart(document.getElementById("importance_chart"), {
      type: 'bar',
      data: {
        labels: ["Age","Work Type","Hypertension","Smoking Status","Heart Disease","Glucose Level","Ever Married","Residence Type","Bmi","Gender"],
        datasets: [{
          label: 'Importance',
          data: importanceData,
          backgroundColor: [
            'rgba(0, 255, 0, 0.5)'
          ]
        }]
      },
      options: {
        responsive: false,
        plugins:{
            title: {
                display: true,
                text: "Feature Importance",
                font: {
                    size: 26
                }
            }
        },
        scales: {
          xAxes: [{
            ticks: {
              maxRotation: 90,
              minRotation: 80
            },
              gridLines: {
              offsetGridLines: true 
            }
          },
          {
            position: "top",
            ticks: {
              maxRotation: 90,
              minRotation: 80
            },
            gridLines: {
              offsetGridLines: true 
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
}