// Refer to https://observablehq.com/@d3/brushable-scatterplot-matrix
// let species = 'Class'
// d3.csv('./data/Iris.csv', d3.autoType) // https://github.com/d3/d3-dsv#autoType
//   .then(function(data) {


//     let columns = data.columns.filter(d => d !== species)

//     let scatterPlotSvgWidth = 800
//     let scatterPlotPadding = 20
//     let scatterPlotSize = (scatterPlotSvgWidth - (columns.length + 1) * scatterPlotPadding) / columns.length + scatterPlotPadding

//     let x = columns.map(c => d3.scaleLinear()
//         .domain(d3.extent(data, d => d[c]))
//         .rangeRound([scatterPlotPadding / 2, scatterPlotSize - scatterPlotPadding / 2]))

//     let y = x.map(x => x.copy().range([scatterPlotSize - scatterPlotPadding / 2,scatterPlotPadding / 2]))

//     let z = d3.scaleOrdinal()
//         .domain(data.map(d => d[species]))
//         .range(d3.schemeCategory10)

//     // handle xAixis
//     let xAxis = (g)=>{
//       const axis = d3.axisBottom()
//           .ticks(6)
//           .tickSize(scatterPlotSize * columns.length);
//       return g.selectAll("g").data(x).join("g")
//           .attr("transform", (d, i) => `translate(${i * scatterPlotSize},0)`)
//           .each(function(d) { return d3.select(this).call(axis.scale(d)); })
//           .call(g => g.select(".domain").remove())
//           .call(g => {
//             g.selectAll(".tick line").attr("stroke", "#ddd")
//               .attr('y1', scatterPlotSize * columns.length)
//           });
//     }

//     // handle yAixis
//     let yAxis = (g)=>{
//       const axis = d3.axisLeft()
//           .ticks(6)
//           .tickSize(-scatterPlotSize * columns.length);
//       return g.selectAll("g").data(y).join("g")
//           .attr("transform", (d, i) => `translate(0,${i * scatterPlotSize})`)
//           .each(function(d) { return d3.select(this).call(axis.scale(d)); })
//           .call(g => g.select(".domain").remove())
//           .call(g => {
//             g.selectAll(".tick line").attr("stroke", "#ddd")
//               .attr('x2', 0)
//           });
//     }

//     const svg = d3.select("#scatterplot-canvas")
//                 .attr("viewBox", [-scatterPlotPadding, 0, scatterPlotSvgWidth, scatterPlotSvgWidth]);


//     svg.append("style")
//         .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

//     let g_xAxis = svg.append("g")
//         .attr('class', 'xAxis')
//         .call(xAxis);

//     let g_yAxis = svg.append("g")
//         .attr('class', 'yAxis')
//         .call(yAxis);

//     const cell = svg.append("g")
//       .attr('class', 'gCell')
//       .selectAll("g")
//       .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
//       .join("g")
//         .attr("transform", ([i, j]) => `translate(${i * scatterPlotSize},${j * scatterPlotSize})`);

//     // show rect border
//     cell.append("rect")
//         .attr("fill", "none")
//         .attr("stroke", "#aaa")
//         .attr("x", scatterPlotPadding / 2 + 0.5)
//         .attr("y", scatterPlotPadding / 2 + 0.5)
//         .attr("width", scatterPlotSize - scatterPlotPadding)
//         .attr("height", scatterPlotSize - scatterPlotPadding);

//     let t_duration = 1000

//     // draw circles in each cell
//     cell.each(function([i, j]) {
//       d3.select(this).selectAll("circle")
//         .data(data)
//         .join("circle")
//         .attr('cx', scatterPlotSize/2)
//         .attr('cy', scatterPlotSize/2)
//         .transition().duration(t_duration)
//           .attr("cx", d => x[i](d[columns[i]]))
//           .attr("cy", d => y[j](d[columns[j]]))
//     });

//     // animation to draw grid lines
//     g_xAxis
//         .transition().duration(t_duration + 50)
//         .on('end', function() { // https://github.com/d3/d3-transition/blob/v1.2.0/README.md#control-flow
//           d3.select(this).selectAll('.tick line')
//             .transition().duration(t_duration * 2)
//             .attr('y1', 0)
//         })
//     g_yAxis
//         .transition().duration(t_duration+ 50)
//         .on('end', function() {
//           d3.select(this).selectAll('.tick line')
//             .transition().duration(t_duration * 2)
//             .attr('x2', scatterPlotSize * columns.length)
//         })

//     const circle = cell.selectAll("circle")
//         .attr("r", 3.5)
//         .attr("fill-opacity", 0.7)
//         .attr("fill", d => z(d[species]));

//     // brush
//     cell.call(brush, circle);

//     svg.append("g")
//         .style("font", "bold 10px sans-serif")
//         .style("pointer-events", "none")
//       .selectAll("text")
//       .data(columns)
//       .join("text")
//         .attr("transform", (d, i) => `translate(${i * scatterPlotSize},${i * scatterPlotSize})`)
//         .attr("x", scatterPlotPadding)
//         .attr("y", scatterPlotPadding)
//         .attr("dy", ".71em")
//         .text(d => d);

//     function brush(cell, circle) {
//       const brush = d3.brush()
//           .extent([[scatterPlotPadding / 2, scatterPlotPadding / 2], [scatterPlotSize - scatterPlotPadding / 2, scatterPlotSize - scatterPlotPadding / 2]])
//           .on("start", brushstarted)
//           .on("brush", brushed)
//           .on("end", brushended);

//       cell.call(brush);

//       let brushCell;

//       // Clear the previously-active brush, if any.
//       function brushstarted() {
//         console.log("brushstarted", brushCell === this);
//         if (brushCell !== this) {
//           d3.select(brushCell).call(brush.move, null);
//           brushCell = this;
//         }
//       }

//       // Highlight the selected circles.
//       function brushed([i, j]) {
//         if (d3.event.selection === null) return;
//         d3.select("#barchart-canvas").selectAll("rect").remove()
//         d3.select("#barchart-canvas").selectAll("g").remove()
//         d3.select("#barchart-canvas").selectAll("text").remove()
//         const [[x0, y0], [x1, y1]] = d3.event.selection; 
//         circle.classed("hidden", d => {
//           return x0 > x[i](d[columns[i]])
//               || x1 < x[i](d[columns[i]])
//               || y0 > y[j](d[columns[j]])
//               || y1 < y[j](d[columns[j]]);
//         });
//       }

//       // If the brush is empty, select all circles.
//       function brushended([i,j]) {
//         if (d3.event.selection !== null) {
//             const [[x0, y0], [x1, y1]] = d3.event.selection;
//             dataPicked=[]
//             data.forEach(
//                 function(d){
//                 if(x0 <= x[i](d[columns[i]])
//                 && x1 >= x[i](d[columns[i]])
//                 && y0 <= y[j](d[columns[j]])
//                 && y1 >= y[j](d[columns[j]])){
//                     dataPicked.push(d["Sepal Length"])
//                     // console.log(d)
//                 }  
//             })
//             const svgbarchart = d3.select("#barchart-canvas")
//             barchart(svgbarchart,dataPicked)
//             return;
//         }
//         d3.select("#barchart-canvas").selectAll("rect").remove()
//         d3.select("#barchart-canvas").selectAll("g").remove()
//         d3.select("#barchart-canvas").selectAll("text").remove()
//         circle.classed("hidden", false);
//       }
//     }
// })
// function barchart(svg,data){

//     let svgwidth = svg.style("width")
//     let svgheight = svg.style("height")
    
//     svgwidth = svgwidth.replace("px","")
//     svgheight = svgheight.replace("px","")
    
//     svgheight = parseInt(svgheight)
//     svgwidth = parseInt(svgwidth)
   
//     if(svgheight < svgwidth)
//         svgwidth = svgheight

//     console.log("svgwidth:",svgwidth)

//     let padding = parseInt(svgwidth*0.125)

//     let width = svgwidth - padding*2
//     let height = svgwidth - padding*2

//     data.sort()

//     let dataRange = d3.extent(data) 

//     svg
//       .attr("preserveAspectRatio","xMidyMid")
//       .attr("viewBox", [0, 0, 1000, 1000]);

//     xAScale = 0.2

//     xIntMin = parseInt(dataRange[0])

//     let num = (data[data.length-1] - xIntMin) / xAScale

//     xRange = [xIntMin,xIntMin+xAScale*(num+1)]
    

//     x = parseInt(dataRange[0])
    
//     xAixsValue=[]

//     for(let i =0;x<=xRange[1];i++,x=x+xAScale){
//         xAixsValue[i]= x

//     }

//     let mark = parseInt(width/(xRange[1]-xRange[0])/10)
//     console.log("mark:",mark)
//     width = mark*(xRange[1]-xRange[0])*10
//     console.log("width:",width)

    
//     xRangeSize = [0,width]
    
//     let xScale = d3.scaleLinear()
//                    .domain(xRange)
//                     .rangeRound(xRangeSize)
//     let xAxis = d3.axisBottom(xScale)
//                     .tickValues(xAixsValue)
//                    .tickSize(-2)
//     let gR = svg.append("g")
//             .attr("class","rect")
//             .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
//     let gX = svg.append("g")
//                 .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
//                 .attr("class","xaxis")
//     let gY = svg.append("g")
//                 .attr("transform", "translate("+(padding).toString()+","+(width+padding).toString()+")")
//                 .attr("class","yaxis")
//     xAxis(gX)
    

//     dataY = []
//     dataY.length = xAixsValue.length
//     for(let i=0;i<dataY.length;i++){
//         dataY[i]=0
//     }
//     let xAxisValue = xIntMin

//     data.forEach(
//         function(d){
//             dataY[parseInt((d-xAxisValue)/xAScale)]=dataY[parseInt((d-xAxisValue)/xAScale)]+1
                
//         }
//     )
//     // console.log(data)
//     // console.log(dataY)
//     // console.log(dataY.length)
//     dataMerged = []
//     for(let i=0; i<dataY.length; i++){
//         dataMerged[i]=[xRange[0]+i*xAScale, dataY[i]]
//     }
    
//     yIntRange = [0,d3.extent(dataY) [1]]

//     yRangeSize = [0,-width]
//     ytick = yIntRange[1] - yIntRange[0]
    
//     let yScale = d3.scaleLinear()
//                     .domain(yIntRange)
//                     .rangeRound(yRangeSize)
//     let yAxis = d3.axisLeft(yScale)
//                     .ticks(ytick)
//                     .tickSize(-2)
//     yAxis(gY)
//     console.log(dataMerged)

//     var rect=gR.selectAll("rect")
//         .data(dataMerged)
//         .join("rect")
//         .attr("fill","steelblue")
//         .attr("x",d => 1+(d[0]-xRange[0])*mark*10)
//         .attr("y",d => yScale(d[1]))
//         .attr("width",d=>10*mark*xAScale-2)
//         .attr("height", d=> -yScale(d[1]))
//     xtext=svg.append("text")
//               .text("scale")
//               .attr("class","xtext")
//               .attr("x",padding+width+20)
//               .attr("y",padding+width+20)

//     ytext=svg.append("text")
//             .text("quantity")
//             .attr("x",padding-20)
//             .attr("y",padding-20)
//     ytext.attr("transform","rotate(90,"+(padding-30).toString()+","+(padding-30).toString()+")")

// }
fileNameOne="income_per_person.csv"
fileNameTwo="life_expectancy_years.csv"
fileNameThree="population_total.csv"
fileNameFour="class.csv"
Promise.all([
    d3.csv("./data/"+fileNameOne,d3.autoType),
    d3.csv("./data/"+fileNameTwo,d3.autoType),
    d3.csv("./data/"+fileNameThree,d3.autoType),
    d3.csv("./data/"+fileNameFour,d3.autoType)
]).then(function(files) {
    // files[0] will contain fileNameOne
    // files[1] will contain fileNameTwo
    // files[2] will contain fileNameThree
    svg = d3.select(".picture-scatterplot-svg")
    let svgwidth = svg.style("width")
    let svgheight = svg.style("height")
    svgwidth = svgwidth.replace("px","")
    svgheight = svgheight.replace("px","")
    svgheight = parseInt(svgheight)
    svgwidth = parseInt(svgwidth)

    let paddingWidth = parseInt(svgwidth*0.1)
    let paddingHeight = parseInt(svgheight*0.1)
    let coordinateWidth = parseInt(svgwidth*0.8)
    let coordinateHeight = parseInt(svgheight*0.8)

    let species = "country"
    let columnsFileOne = files[0].columns.filter(d => d !== species)
    let columnsFileTwo = files[1].columns.filter(d => d !== species)
    let columnsFileThree = files[2].columns.filter(d => d !== species)
    let columnsFileFour = files[3].columns.filter(d => d !== species)

    let dataMaxFileOne = 0

    for(let i = 0;i < columnsFileOne.length;i++){
        for(let j = 0;j < files[0].length;j++){
            let temp = files[0][j][columnsFileOne[i]]
            if(typeof(temp) === "string"){
                temp = temp.replaceAll("k","")
                temp = parseInt(parseFloat(temp)*1000)
            }
            if(dataMaxFileOne<temp)
                dataMaxFileOne=temp
        }
    }

    // let xScaleMin = 500
    // let xScaleTemp = xScaleMin
    // let xScale = [0,xScaleMin]
    // while(xScaleTemp<dataMaxFileOne){
    //     xScaleTemp = xScaleTemp*2
    //     xScale.push(xScaleTemp)
    // }

    xTicks = 10
    yTicks = 10
    coordinateWidthEvery = parseInt(coordinateWidth/xTicks)
    coordinateWidth = coordinateWidthEvery*(xTicks)

    coordinateHeightEvery = parseInt(coordinateHeight/yTicks)
    coordinateHeight = coordinateHeightEvery*yTicks

    xAxisMax = (dataMaxFileOne%xTicks)===0? dataMaxFileOne:((parseInt(dataMaxFileOne/xTicks)+1)*xTicks)

    let xScale = []
    for(let i=0;i<=xTicks;i++) {
        xScale.push(i*xAxisMax/xTicks)
    }

    gxAxis = d3.select(".xaxis-g")
                .attr("transform", "translate("+(paddingWidth).toString()+","+(coordinateHeight+paddingHeight).toString()+")")

    // let xDomainRange = d3.scalePoint()
    //                         .domain(xScale)
    //                         .rangeRound([0,coordinateWidth])

    // let xDomainRange = d3.scaleLog()
    //                         .base(2)
    //                         .domain([1,xScale[xScale.length-1]])
    //                         .rangeRound([0,coordinateWidth])

    let xDomainRange = d3.scaleLinear()
                            .domain([0,dataMaxFileOne])
                            .rangeRound([0,coordinateWidth])

    let xAxis = d3.axisBottom(xDomainRange)
                    .tickValues(xScale)
                    .tickSize(-coordinateHeight)

    xAxis(gxAxis)

    
    gyAxis = d3.select(".yaxis-g")
                .attr("transform", "translate("+(paddingWidth).toString()+","+(coordinateHeight+paddingHeight).toString()+")")

    let yDomainRange = d3.scaleLinear()
                            .domain([0,100])
                            .rangeRound([0,-coordinateHeight])

    let yAxis = d3.axisLeft(yDomainRange)
                    .tickValues([0,10,20,30,40,50,60,70,80,90,100])
                    .tickSize(-coordinateWidth)
    
    yAxis(gyAxis)

    d3.selectAll(".tick line").style("stroke", "#ddd")

    

    // let dataMaxFileTwo = 0

    // for(let i = 0;i < columnsFileTwo.length;i++){
    //     for(let j = 0;j < files[2].length;j++){
    //         let temp = files[2][j][columnsFileTwo[i]]
    //         if(typeof(temp) === "string"){
    //             if(temp.indexOf('k')!==-1){
    //                 temp = temp.replaceAll("k","")
    //                 temp = parseInt(parseFloat(temp)*1000)
    //             }
    //             if(temp.indexOf('M')!==-1){
    //                 temp = temp.replaceAll("M","")
    //                 temp = parseInt(parseFloat(temp)*1000000)
    //             }
                
    //         }
    //         if(dataMaxFileTwo<temp)
    //             dataMaxFileTwo=temp
    //     }
    // }
    let dataMaxFileThree = 0

    for(let i = 0;i < columnsFileThree.length;i++){
        for(let j = 0;j < files[2].length;j++){
            let temp = files[2][j][columnsFileThree[i]]
            if(typeof(temp) === "string"){
                if(temp.indexOf('k')!==-1){
                    temp = temp.replaceAll("k","")
                    temp = parseInt(parseFloat(temp)*1000)
                }
                else if(temp.indexOf('M')!==-1){
                    temp = temp.replaceAll("M","")
                    temp = parseInt(parseFloat(temp)*1000000)
                }
                else if(temp.indexOf('B')!==-1){
                    temp = temp.replaceAll("B","")
                    temp = parseInt(parseFloat(temp)*1000000000)
                }
            }
            if(dataMaxFileThree<temp)
                dataMaxFileThree=temp
        }
    }

    // let zSizeMap = d3.scaleLog()
    //                     .base(2)
    //                     .domain([2,2**27])
    //                     .rangeRound([0,30])
    let zSizeMap = d3.scaleLinear()
                        .domain([0,1650000000])
                        .rangeRound([2,100])
    gcircle = d3.select(".circle-g")
                .attr("transform", "translate("+(paddingWidth).toString()+","+(coordinateHeight+paddingHeight).toString()+")")

    let circleDomainRange = d3.scaleLinear()
                                .domain()



    // let dataMergeTotal = []
    
    // for(let i = 0;i < files[0].length;i++){
    //     let dataMerge=[]
    //     for(let j=0;j<200;j++){
    //         year = (1800+j).toString()
    //         dataMerge.push([files[0][i][year],files[1][i][year],files[2][i][year]])
    //     }
    //     dataMergeTotal.push(dataMerge)
    // }
    // gcircle.selectAll("circle")
    //         .data(dataMergeTotal)
    //         .join("circle")
    //         .attr("cx",function(d){
    //                 if(d[0][0]==="null")
    //                     return xDomainRange(0)
    //                 else if(typeof(d[0][0])==="string"){
    //                     let temp = d[0][0]
    //                     temp = temp.replaceAll("k","")
    //                     temp = parseInt(parseFloat(temp)*1000)
    //                     return xDomainRange(temp)
    //                 }
    //                 return xDomainRange(d[0][0])
    //             })
    //         .attr("cy",function(d){
    //                 if(d[0][1]==="null")
    //                     return yDomainRange(0)
    //                 else
    //                     return yDomainRange(d[0][1])
    //             })
    //         .attr("r",function(d){
    //                 if(d[0][2]==="null")
    //                     return zSizeMap(1)
    //                 else if(typeof(d[0][2])==="string"){
    //                     let temp = d[0][2]
    //                     if(temp.indexOf('k')!==-1){
    //                         temp = temp.replaceAll("k","")
    //                         temp = parseInt(parseFloat(temp)*1000)
    //                     }
    //                     else if(temp.indexOf('M')!==-1){
    //                         temp = temp.replaceAll("M","")
    //                         temp = parseInt(parseFloat(temp)*1000000)
    //                     }
    //                     else if(temp.indexOf('B')!==-1){
    //                         temp = temp.replaceAll("B","")
    //                         temp = parseInt(parseFloat(temp)*1000000000)
    //                     }   
    //                     return zSizeMap(temp)
    //                 }
    //                     return zSizeMap(d[0][2])
                        
    //             })
    //         .style("fill-opacity",0.5)
    //         .style("fill","red")

    // console.log(":", )
    let colors = d3.scaleOrdinal()
                    .domain([1,2,3,4])
                    .range(d3.schemeCategory10)

    for(let i=0;i<30;i++){
        let year = (1800+i).toString()
        let dataMerge=[]
        for(let j=0;j<files[0].length;j++){

            dataMerge.push([files[0][j][year],files[1][j][year],files[2][j][year],files[3][j]["class"]])

        }
        gcircle.selectAll("circle")
                .data(dataMerge)
                .join("circle")
                .style("fill-opacity",0.5)
                .style("fill",d=>colors(d[3]))
                .transition()
                .duration(10000)
                .attr("cx",function(d){
                    if(d[0]==="null")
                        return xDomainRange(0)
                    else if(typeof(d[0])==="string"){
                        let temp = d[0]
                        temp = temp.replaceAll("k","")
                        temp = parseInt(parseFloat(temp)*1000)
                        return xDomainRange(temp)
                    }
                    return xDomainRange(d[0])
                })
                .attr("cy",function(d){
                    if(d[1]==="null")
                        return yDomainRange(0)
                    else
                        return yDomainRange(d[1])
                })
                .attr("r",function(d){
                    if(d[2]==="null")
                        return zSizeMap(1)
                    else if(typeof(d[2])==="string"){
                        let temp = d[2]
                        if(temp.indexOf('k')!==-1){
                            temp = temp.replaceAll("k","")
                            temp = parseInt(parseFloat(temp)*1000)
                        }
                        else if(temp.indexOf('M')!==-1){
                            temp = temp.replaceAll("M","")
                            temp = parseInt(parseFloat(temp)*1000000)
                        }
                        else if(temp.indexOf('B')!==-1){
                            temp = temp.replaceAll("B","")
                            temp = parseInt(parseFloat(temp)*1000000000)
                        }   
                        return zSizeMap(temp)
                    }
                        return zSizeMap(d[2])
                        
                })
        console.log("dataMerge:", dataMerge)
    }

    console.log("xAxisMax:", xAxisMax)
    console.log("dataMaxFileThree:",dataMaxFileThree)
    console.log("coordinateWidthEvery:",coordinateWidthEvery)
    // console.log("xScale:",xScale)
    console.log("dataMaxFileOne:",dataMaxFileOne)
    console.log("columnsFileOne:",columnsFileOne)
    console.log("columnsFileTwo:",columnsFileTwo)
    console.log("columnsFileThree:",columnsFileThree)
    console.log("columnsFileFour:",columnsFileFour)
    console.log("coordinateWidth:",coordinateWidth)
    console.log("coordinateHeight:",coordinateHeight)
    console.log("paddingWidth:",paddingWidth)   
    console.log("paddingHeight:",paddingHeight)
    console.log("svgwidth:",svgwidth)
    console.log("svgheight:",svgheight)
    console.log("file1:",files[0])
    console.log("file2:",files[1])
    console.log("file3:",files[2])    

}).catch(function(err) {
    console.log("error")
    // handle error here
})