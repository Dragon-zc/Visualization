// Refer to https://observablehq.com/@d3/brushable-scatterplot-matrix
let species = 'Class'
d3.csv('./data/Iris.csv', d3.autoType) // https://github.com/d3/d3-dsv#autoType
  .then(function(data) {


    let columns = data.columns.filter(d => d !== species)

    let scatterPlotSvgWidth = 800
    let scatterPlotPadding = 20
    let scatterPlotSize = (scatterPlotSvgWidth - (columns.length + 1) * scatterPlotPadding) / columns.length + scatterPlotPadding

    let x = columns.map(c => d3.scaleLinear()
        .domain(d3.extent(data, d => d[c]))
        .rangeRound([scatterPlotPadding / 2, scatterPlotSize - scatterPlotPadding / 2]))

    let y = x.map(x => x.copy().range([scatterPlotSize - scatterPlotPadding / 2,scatterPlotPadding / 2]))

    let z = d3.scaleOrdinal()
        .domain(data.map(d => d[species]))
        .range(d3.schemeCategory10)

    // handle xAixis
    let xAxis = (g)=>{
      const axis = d3.axisBottom()
          .ticks(6)
          .tickSize(scatterPlotSize * columns.length);
      return g.selectAll("g").data(x).join("g")
          .attr("transform", (d, i) => `translate(${i * scatterPlotSize},0)`)
          .each(function(d) { return d3.select(this).call(axis.scale(d)); })
          .call(g => g.select(".domain").remove())
          .call(g => {
            g.selectAll(".tick line").attr("stroke", "#ddd")
              .attr('y1', scatterPlotSize * columns.length)
          });
    }

    // handle yAixis
    let yAxis = (g)=>{
      const axis = d3.axisLeft()
          .ticks(6)
          .tickSize(-scatterPlotSize * columns.length);
      return g.selectAll("g").data(y).join("g")
          .attr("transform", (d, i) => `translate(0,${i * scatterPlotSize})`)
          .each(function(d) { return d3.select(this).call(axis.scale(d)); })
          .call(g => g.select(".domain").remove())
          .call(g => {
            g.selectAll(".tick line").attr("stroke", "#ddd")
              .attr('x2', 0)
          });
    }

    const svg = d3.select("#scatterplot-canvas")
                .attr("viewBox", [-scatterPlotPadding, 0, scatterPlotSvgWidth, scatterPlotSvgWidth]);


    svg.append("style")
        .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    let g_xAxis = svg.append("g")
        .attr('class', 'xAxis')
        .call(xAxis);

    let g_yAxis = svg.append("g")
        .attr('class', 'yAxis')
        .call(yAxis);

    const cell = svg.append("g")
      .attr('class', 'gCell')
      .selectAll("g")
      .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
      .join("g")
        .attr("transform", ([i, j]) => `translate(${i * scatterPlotSize},${j * scatterPlotSize})`);

    // show rect border
    cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("x", scatterPlotPadding / 2 + 0.5)
        .attr("y", scatterPlotPadding / 2 + 0.5)
        .attr("width", scatterPlotSize - scatterPlotPadding)
        .attr("height", scatterPlotSize - scatterPlotPadding);

    let t_duration = 1000

    // draw circles in each cell
    cell.each(function([i, j]) {
      d3.select(this).selectAll("circle")
        .data(data)
        .join("circle")
        .attr('cx', scatterPlotSize/2)
        .attr('cy', scatterPlotSize/2)
        .transition().duration(t_duration)
          .attr("cx", d => x[i](d[columns[i]]))
          .attr("cy", d => y[j](d[columns[j]]))
    });

    // animation to draw grid lines
    g_xAxis
        .transition().duration(t_duration + 50)
        .on('end', function() { // https://github.com/d3/d3-transition/blob/v1.2.0/README.md#control-flow
          d3.select(this).selectAll('.tick line')
            .transition().duration(t_duration * 2)
            .attr('y1', 0)
        })
    g_yAxis
        .transition().duration(t_duration+ 50)
        .on('end', function() {
          d3.select(this).selectAll('.tick line')
            .transition().duration(t_duration * 2)
            .attr('x2', scatterPlotSize * columns.length)
        })

    const circle = cell.selectAll("circle")
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .attr("fill", d => z(d[species]));

    // brush
    cell.call(brush, circle);

    svg.append("g")
        .style("font", "bold 10px sans-serif")
        .style("pointer-events", "none")
      .selectAll("text")
      .data(columns)
      .join("text")
        .attr("transform", (d, i) => `translate(${i * scatterPlotSize},${i * scatterPlotSize})`)
        .attr("x", scatterPlotPadding)
        .attr("y", scatterPlotPadding)
        .attr("dy", ".71em")
        .text(d => d);

    function brush(cell, circle) {
      const brush = d3.brush()
          .extent([[scatterPlotPadding / 2, scatterPlotPadding / 2], [scatterPlotSize - scatterPlotPadding / 2, scatterPlotSize - scatterPlotPadding / 2]])
          .on("start", brushstarted)
          .on("brush", brushed)
          .on("end", brushended);

      cell.call(brush);

      let brushCell;

      // Clear the previously-active brush, if any.
      function brushstarted() {
        console.log("brushstarted", brushCell === this);
        if (brushCell !== this) {
          d3.select(brushCell).call(brush.move, null);
          brushCell = this;
        }
      }

      // Highlight the selected circles.
      function brushed([i, j]) {
        if (d3.event.selection === null) return;
        d3.select("#barchart-canvas").selectAll("rect").remove()
        d3.select("#barchart-canvas").selectAll("g").remove()
        d3.select("#barchart-canvas").selectAll("text").remove()
        const [[x0, y0], [x1, y1]] = d3.event.selection; 
        circle.classed("hidden", d => {
          return x0 > x[i](d[columns[i]])
              || x1 < x[i](d[columns[i]])
              || y0 > y[j](d[columns[j]])
              || y1 < y[j](d[columns[j]]);
        });
      }

      // If the brush is empty, select all circles.
      function brushended([i,j]) {
        if (d3.event.selection !== null) {
            const [[x0, y0], [x1, y1]] = d3.event.selection;
            dataPicked=[]
            data.forEach(
                function(d){
                if(x0 <= x[i](d[columns[i]])
                && x1 >= x[i](d[columns[i]])
                && y0 <= y[j](d[columns[j]])
                && y1 >= y[j](d[columns[j]])){
                    dataPicked.push(d["Sepal Length"])
                    // console.log(d)
                }  
            })
            const svgbarchart = d3.select("#barchart-canvas")
            barchart(svgbarchart,dataPicked)
            return;
        }
        d3.select("#barchart-canvas").selectAll("rect").remove()
        d3.select("#barchart-canvas").selectAll("g").remove()
        d3.select("#barchart-canvas").selectAll("text").remove()
        circle.classed("hidden", false);
      }
    }
})
function barchart(svg,data){

    let svgwidth = svg.style("width")
    let svgheight = svg.style("height")
    
    svgwidth = svgwidth.replace("px","")
    svgheight = svgheight.replace("px","")
    
    svgheight = parseInt(svgheight)
    svgwidth = parseInt(svgwidth)
   
    if(svgheight < svgwidth)
        svgwidth = svgheight

    console.log("svgwidth:",svgwidth)

    let padding = parseInt(svgwidth*0.125)

    let width = svgwidth - padding*2
    let height = svgwidth - padding*2

    data.sort()

    let dataRange = d3.extent(data) 

    svg
      .attr("preserveAspectRatio","xMidyMid")
      .attr("viewBox", [0, 0, 1000, 1000]);

    xAScale = 0.2

    xIntMin = parseInt(dataRange[0])

    let num = (data[data.length-1] - xIntMin) / xAScale

    xRange = [xIntMin,xIntMin+xAScale*(num+1)]
    

    x = parseInt(dataRange[0])
    
    xAixsValue=[]

    for(let i =0;x<=xRange[1];i++,x=x+xAScale){
        xAixsValue[i]= x

    }

    let mark = parseInt(width/(xRange[1]-xRange[0])/10)
    console.log("mark:",mark)
    width = mark*(xRange[1]-xRange[0])*10
    console.log("width:",width)

    
    xRangeSize = [0,width]
    
    let xScale = d3.scaleLinear()
                   .domain(xRange)
                    .rangeRound(xRangeSize)
    let xAxis = d3.axisBottom(xScale)
                    .tickValues(xAixsValue)
                   .tickSize(-2)
    let gR = svg.append("g")
            .attr("class","rect")
            .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
    let gX = svg.append("g")
                .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
                .attr("class","xaxis")
    let gY = svg.append("g")
                .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
                .attr("class","yaxis")
    xAxis(gX)
    

    dataY = []
    dataY.length = xAixsValue.length
    for(let i=0;i<dataY.length;i++){
        dataY[i]=0
    }
    let xAxisValue = xIntMin

    data.forEach(
        function(d){
            dataY[parseInt((d-xAxisValue)/xAScale)]=dataY[parseInt((d-xAxisValue)/xAScale)]+1
                
        }
    )
    // console.log(data)
    // console.log(dataY)
    // console.log(dataY.length)
    dataMerged = []
    for(let i=0; i<dataY.length; i++){
        dataMerged[i]=[xRange[0]+i*xAScale, dataY[i]]
    }
    
    yIntRange = [0,d3.extent(dataY) [1]]

    yRangeSize = [0,-width]
    ytick = yIntRange[1] - yIntRange[0]
    
    let yScale = d3.scaleLinear()
                    .domain(yIntRange)
                    .rangeRound(yRangeSize)
    let yAxis = d3.axisLeft(yScale)
                    .ticks(ytick)
                    .tickSize(-2)
    yAxis(gY)
    console.log(dataMerged)

    var rect=gR.selectAll("rect")
        .data(dataMerged)
        .join("rect")
        .attr("fill","steelblue")
        .attr("x",d => 1+(d[0]-xRange[0])*mark*10)
        .attr("y",d => yScale(d[1]))
        .attr("width",d=>10*mark*xAScale-2)
        .attr("height", d=> -yScale(d[1]))
    xtext=svg.append("text")
              .text("scale")
              .attr("class","xtext")
              .attr("x",padding+width+20)
              .attr("y",padding+width+20)

    ytext=svg.append("text")
            .text("quantity")
            .attr("x",padding-20)
            .attr("y",padding-20)
    ytext.attr("transform","rotate(90,"+(padding-30).toString()+","+(padding-30).toString()+")")

}