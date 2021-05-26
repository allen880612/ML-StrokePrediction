/**
 * Load Data from Flask by JQury.ajax & Build Chart
 */

function BuildChart(api, data) {
    // console.log("Ajax call LoadData: " + api);
    switch (api) {
        case "/t_test":
            BuildChartT_Test(data);
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

function LoadData() {
    GetDataByAjax("/t_test");
}


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

function GetSortedData(data){
    var value_key_list = []
    for (var key in data) {
        value_key_list.push([data[key], key]);
    }
    return value_key_list.sort().reverse();
}

function GetT_TestData(data) {
    var data_source = {};
    var keys = []
    var values = [];
    var value_key_list = GetSortedData(data);

    for (var i=0; i<value_key_list.length; i++) {
        keys.push(value_key_list[i][1]);
        values.push(value_key_list[i][0]);
        console.log(value_key_list[i][1], value_key_list[i][0]);
    }

    data_source.labels = keys
    data_source.datasets = [];
    data_source.datasets.push({
        label: "log(pValue)",
        backgroundColor: "#46BFBD",
        data: values
    });

    return data_source;
}


// Age bar chart
function BuildChartT_Test(data) {
    // console.log("BuildChartT-Test");

    var data_source = GetT_TestData(data);
    var options = BuildOptions("Student's T-Test Result", 5, 5);

    var config = {
        type: 'bar',
        data: data_source,
        options: options
    }
    new Chart($("#t_test_chart"), config)
}
   

// Load Trigger
window.onload = function () {
    LoadData();
}