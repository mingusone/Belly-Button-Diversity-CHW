function buildMetadata(sample) {
  d3.json("/metadata/"+sample).then((data) => {
    var meta_data = Object.entries(data);
    sample_box = d3.select("#sample-metadata");

    //Clear the old stuff
    sample_box.html("");


    //Select the sample box and populate it with the data
    sample_box.data(meta_data).selectAll("p")
      .data(meta_data)
      .enter()
      .append("p")
      .text(function(d){
        //the data is an array, d, of Key and Value
        return d[0] + ": " + d[1];
        })
      .exit()
  });
};

function buildCharts(sample) {

  //Pie Chart
  d3.json("/samples/"+sample).then(function(d){
    console.log(d["otu_ids"])
    var data = [{
      values: d["sample_values"].slice(0,10),
      labels: d["otu_ids"].slice(0,10),
      type: 'pie'
    }];

    var layout = {
    };

    Plotly.newPlot('pie', data, layout);

    //Bubble Chart

    //We need to redo colors here real quick cause it's being all funky
    let colors = d["otu_ids"].map(function(id){
      return id.toString(16);
    })
    //When we do colors: d["otu_ids"]
    //it comes out all redish.
    //I'm not sure how the array of numbers being fed into plotly
    //is interpreted but when I turn the numbers into a hexdecimal
    //number, it comes out way prettier. So I'm going with that. 



    var trace1 = {
      x: d["otu_ids"],
      y: d["sample_values"],
      mode: 'markers',
      text: d["otu_labels"],
      marker: {
        color: colors,
        size: d["sample_values"]
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Belly Buttons',
      showlegend: false
    };

    Plotly.newPlot('bubble', data, layout);


  });
   


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
