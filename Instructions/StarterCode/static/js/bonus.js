
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

function buildCharts(sample) {  
    d3.json("samples.json").then((data) => {
        // extract_data
        var samples=data.samples;
        var result_arrays=samples.filter(item=>item.id==sample); //-> note that this results in an object within an array [{...}]
        var result=result_arrays[0];
        var sample_values=result.sample_values;;
        var otu_ids=result.otu_ids;
        var otu_ids2=otu_ids.map(otu_id=>`OTU ${otu_id}`);
        var otu_labels=result.otu_labels;
        var metadata=data.metadata;   
        var metadata_array=metadata.filter(id=>id.id==sample) //-> note that this results in an object within an array i.e [{...}]
        var wfreq=metadata_array[0].wfreq

        // console.log(result);
        // console.log(sample_values.slice(0,10))
        // console.log(otu_ids2.slice(0,10))
        // console.log(otu_labels.slice(0,10))
        console.log(wfreq)

        // -----------build bar chart----------------
        //  Create the Traces

        var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids2.slice(0,10).reverse(),
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: 'h'
        };
    
        // Create the data array for the plot
        var bar_data = [trace1];
    
        // Plot the chart to a div tag with id "bar"
        Plotly.newPlot("bar", bar_data);

        // -----------build bubble chart----------------
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: 'Earth',
            }
          };
          
          var bubble_data = [trace2];
          
          var layout = {
            showlegend: false,
            x_axis:{title: 'OTU ID'}
          };
          
          Plotly.newPlot('bubble', bubble_data, layout);

          // -----------build gauge chart----------------
        var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            // ids:['0-1', '1-2','2-3']
            title: { text: "Belly Button Washing Frequency<br>Scrubs per week" },
            labels: ['0-1', '1-2','2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]},
                bar: { color: "darkblue" },
                steps:[
                    {range:[0,1], color: "white",},
                    {range:[1,2], color: "white"},
                    {range:[2,3], color: "white"},
                    {range:[3,4], color: "white"},
                    {range:[4,5], color: "white"},
                    {range:[5,6], color: "white"},
                    {range:[6,7], color: "white"},
                    {range:[7,8], color: "white"},
                    {range:[8,9], color: "white"},
                ]
            }
        };
        
        var gauge_data=[trace3]

        
        var layout = { 
            width: 550, 
            height: 400, 
            margin: { t: 150, b: 0 },
        };
        Plotly.newPlot('gauge', gauge_data, layout);


    })
}


function demographic(sample) {
    d3.json("samples.json").then((data) => {   
        var metadata=data.metadata;   
        var metadata_array=metadata.filter(id=>id.id==sample) //-> note that this results in an object within an array i.e [{...}]
        var result_meta=metadata_array[0]
        // using d3, append Demographic info using metadata variable
        var demo_box=d3.select('#sample-metadata')
        // use Object.entries in filteredmetadata to extract key & value of the object which can then be added into Demographic Info Table
        demo_box.html("")
        Object.entries(result_meta).forEach(([key,value])=>{
            var row=demo_box.append('h6')
            row.text(`${key} : ${value}`)
        })
    })
}

function update(new_sample){
    var dropdown = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var new_sample = dropdown.property("value");
    buildCharts(new_sample)
    demographic(new_sample)
    console.log(new_sample)
}

function init() {
    // initialise the function by updating the dropdown box with id numbers
    d3.json("samples.json").then((data) => {   
        var metadata=data.metadata;   
        var id=metadata.map(sample=>sample.id);
        console.log(metadata)
        console.log(id)

        // using D3, select the dropdown box in html file
        var dropdown=d3.select('#selDataset')
        // append dropdown box using all IDs available in id array
        id.forEach(data =>{
            dropdown.append("option")
            .text(data)
        })
        // once done, call buildChart and demographic function based on the first id number that appears in the dropdown box
        buildCharts(id[0])
        demographic(id[0])
    })
}

// initialise the website
init()

// On change to the DOM, call update()
d3.selectAll("#selDataset").on("change", update);

