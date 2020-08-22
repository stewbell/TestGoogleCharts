function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigquery.readonly https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only" })
        .then(function () { console.log("Sign-in successful"); },
            function (err) { console.error("Error signing in", err); });
}
function loadClient() {
    // gapi.client.setApiKey("zzc4j4lYfadFzAKH7ilZw4Th");
    return gapi.client.load("https://bigquery.googleapis.com/$discovery/rest?version=v2")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.bigquery.jobs.query({
        "projectId": "modelsales1",
        "resource": {
            "query": "SELECT MONTH, sum(ActualGrossTotal) FROM model4.InvoiceSales GROUP BY MONTH LIMIT 1000"
        }
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
            return response
            //console.log("values",response.result.schema.fields[0].name);
            //var x;
            /*
            for (x of response.result.schema.fields){
                 console.log("field headings",x.name);
            }
            /*
            var row, col;
            for (row of response.result.rows){
              for (col of row.f){
                console.log("values",col.v)
              
            }
           
        }
   */

        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "15273187460-elptddbevnsgd3f0fvo39cdn13h48ugs.apps.googleusercontent.com" });
});