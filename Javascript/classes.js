class queryBQ {
    dataset;
    constructor(input) {
        this.name = input;
    }
    authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigquery.readonly https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only" })
            .then(function () { console.log("Sign-in successful"); },
                function (err) { console.error("Error signing in", err); });
    }
    loadClient() {
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
    execute() {
        return gapi.client.bigquery.jobs.query({
            "projectId": "modelsales1",
            "resource": {
                "query": "SELECT Cast(MONTH as String) as Month, sum(ActualGrossTotal) as ActualGrossTotal FROM model4.InvoiceSales GROUP BY Month Order by Month"
            }
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                queryBQ.dataset = response;
                console.log("dataset", queryBQ.dataset);
            },
                function (err) { console.error("Execute error", err); });
    }

    startup() {
        this.authenticate().then(this.loadClient).then(this.execute());
    }
}
class chart{
    constructor(dataset, elementID){
        this.dataset = dataset;
        this.elementID = elementID;
        console.log("dataset passed to constructor", dataset)
        console.log("this.dataet", this.dataset)
    }
    drawChart() {
        //set arrays for data to be loaded into
        var dataArray = [];
        var fieldArray = [];
        //load headings
        var field;
        for (field of this.dataset.result.schema.fields) {
          console.log("field headings", field.name);
          fieldArray.push(field.name)
        }
        //load row data	
        var row;
        for (row of this.dataset.result.rows) {
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
        data.addColumn('number','Gross Sales')
        data.addRows(dataArray);
        var chart = new google.visualization.LineChart(document.getElementById(this.elementID));
        chart.draw(data, options);
    }
}
