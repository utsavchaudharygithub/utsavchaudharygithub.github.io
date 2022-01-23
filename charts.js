function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');
 // Use the list of sample names to populate the select options
  d3.json('samples.json').then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append('option').text(sample).property('value', sample);
    });
     // Use the first sample from the list to build the initial plots
    var initialSample = sampleNames[0];
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    // Create a variable that holds the samples array. 
    // Use d3 to select the panel with id of `#sample-metadata`var PANEL = d3.select('#sample-metadata');
    var metadata = data.metadata;
     // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var pairs = Object.entries(resultArray[0]);
     
  // Use `.html("") to clear any existing metadata
    PANEL.html('');
      //var pairs = Object.entries(resultArray[0]);
    var results = pairs.forEach(function (pair) {
      PANEL.append('h6').text(pair[0] + ': ' + pair[1]);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  d3.json('samples.json').then(function ({ samples, metadata }) {
    var data = samples.filter((obj) => obj.id == sample)[0];
    console.log(data);
    // data for bar chart
    var otuIDS = data.otu_ids.map((row) => `OTU ID: ${row}`);
    var sampleValues = data.sample_values.slice(0, 10);
    var sampleLabels = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );
    // data for bubble chart
    var otuID = data.otu_ids;
    var sampleValue = data.sample_values;
    var sampleLabel = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );
    // data for gauge
    var metData = metadata.filter((obj) => obj.id == sample)[0];
    var washFreq = metData.wfreq;
    // data for bar chart
    var bardata = [
      {
        x: sampleValues,
        y: otuIDS,
        type: 'bar',
        orientation: 'h',
        text: sampleLabels,
        hoverinfo: 'text',
      },
    ];

    // data for bubble chart
    var bubbledata = [
      {
        x: otuID,
        y: sampleValue,
        mode: 'markers',
        text: sampleLabel,
        marker: {
          size: sampleValue,
          color: otuID,
        },
      },
    ];
    // data for gauge chart
    var gaugedata = [
      {
        // domain: washFreq,
        value: washFreq,
        title: {
          text: 'Belly Button Washing Frequency<br>Scrubs per Week',
        },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10] },
        },
      },
    ];
    // layout for bar chart
    var barlayout = {
      margin: {
        t: 70,
        l: 150,
      },
      title: {
        text: 'Top 10 Bacterial Species (OTUs)',
      },
    };
    // layout for bubble chart
    var bubblelayout = {
      xaxis: { title: 'OTU ID' },
    };
    // Create the layout for the gauge chart.
    var gaugelayout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot('bar', bardata, barlayout);
    Plotly.newPlot('bubble', bubbledata, bubblelayout);
    Plotly.newPlot('gauge', gaugedata, gaugelayout);
  });
}