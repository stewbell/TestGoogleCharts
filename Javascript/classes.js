

function authenticate() {
    authInst = gapi.auth2.getAuthInstance();
    loginStatus = authInst.isSignedIn.get();
    if (loginStatus) {
        console.log("Already Signed In !!");
        return (authInst)
    } else {
        console.log("Not Logged in.... Logging in now");

        authInst.signIn({ scope: "https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigquery.readonly https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only" })
            .then(function () {
                console.log("Sign-in successful");
                return (authInst)
            },
                function (err) { console.error("Error signing in", err); });
    }


}
function loadClient() {
    // gapi.client.setApiKey("zzc4j4lYfadFzAKH7ilZw4Th");
    return gapi.client.load("https://bigquery.googleapis.com/$discovery/rest?version=v2")
    /*
        .then(function () {
            console.log("GAPI client loaded for API");
           // queryBQ.execute();
        },
            function (err) { console.error("Error loading GAPI client for API", err); });
      */
}


class dataTables {
    constructor() {
        //console.log("constructor")
        this.dataArray = [];
        // var dataTable = new google.visualization.DataTable();
    }
    loadBaseData(dataset) {
        //load base BQ tables
        //var data = new google.visualization.DataTable();
       
        var fieldArray = [];
      

        //load headings
        var field;

        //for (field of dataset.result.schema.fields) {
        //    console.log("field headings", field.name);
        //    fieldArray.push(field.name)
        //}

        //data.addColumn('string', 'Month');
        //data.addColumn('string', 'Product');
        //data.addColumn('string', 'Outlet Type');
        //data.addColumn('string', 'Distributor');
        //CountryFeatures
        //ProductFeatures
        //data.addColumn('number', 'Forecast Baseline');
        //data.addColumn('number', 'Forecast Total');


        //load row data
        var arrayProcTimmer = new timmer("From BQ to array format 1mill recs")
        var row;
        for (row of dataset.result.rows) {
            var rowArray = [];
            rowArray.push(row.f[0].v);
            rowArray.push(row.f[1].v);
            rowArray.push(row.f[2].v);
            rowArray.push(row.f[3].v);
            rowArray.push(parseFloat(row.f[6].v));
            rowArray.push(parseFloat(row.f[7].v));

            this.dataArray.push(rowArray)
        }
        arrayProcTimmer.lapTime("Complete")

        return(this)
//        var options = {
//            title: 'Company Performance',
//            //curveType: 'function',
//            legend: { position: 'bottom' }
//        };
//            data.addRows(dataArray);
        //var chart = new google.visualization.LineChart(document.getElementById(this.elementID));
        //chart.draw(data, options);
    }
    AggByProduct() {
        var procTime = new timmer('Aggregate Array');
        var row;
        var sumArray =[];
        for (row of this.dataArray){
            var key = [row[0],row[1]].join('$$');
            sumArray[key] = (sumArray[key] === 
                undefined) ? [row[4], row[5]] : [sumArray[key][0] + row[4], sumArray[key][1] + row[5]];
        }
        procTime.lapTime('Summarise');
        var tempDataset = [];
        for (key in sumArray){
            var a = key.split('$$')
            var b = sumArray[key];
            var c = [a,b].flat();           
            tempDataset.push(c);
        }
        procTime.lapTime('Flatten');
        var newDataset = new dataTables();
        newDataset.dataArray = tempDataset;
       
        return (newDataset);  
    }
}
class timmer {
    constructor(label){
        this.label=label
        var d = new Date();
        this.startTime = d.getTime();
        console.log(`${this.label} - Started`);
    }
    lapTime(lapComment){
        var dd = new Date();
        var lapTimeMS =  dd.getTime() - this.startTime;
        console.log(`${this.label} - ${lapComment} - ${lapTimeMS}ms`)
    }
}



    /*
    class chart {
        constructor(elementID) {
            var _dataset;
            this.elementID = elementID;
        }
        drawChart(dataset) {
            //set arrays for data to be loaded into
    
            var dataArray = [];
            var fieldArray = [];
            this._dataset = dataset;
    
            //load headings
            var field;
    
            for (field of dataset.result.schema.fields) {
                console.log("field headings", field.name);
                fieldArray.push(field.name)
            }
            //load row data
            var row;
            for (row of dataset.result.rows) {
                var rowArray = [];
                rowArray.push(row.f[0]);
                rowArray.push(parseInt(row.f[1].v));
                dataArray.push(rowArray)
            }
            console.log("Chart Array", dataArray)
    
            var options = {
                title: 'Company Performance',
                //curveType: 'function',
                legend: { position: 'bottom' }
            };
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Month');
            data.addColumn('number', 'Gross Sales')
            data.addRows(dataArray);
            var chart = new google.visualization.LineChart(document.getElementById(this.elementID));
            chart.draw(data, options);
        }
    
}
*/
