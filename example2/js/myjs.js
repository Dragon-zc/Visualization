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
    // files[3] will contain fileNameFour

    function dataProcess(d){
        if(d==="null")
            return 0;
        if(typeof(d)==="string"){
            if(d.indexOf('k')!==-1){
                d = d.replaceAll("k","")
                d = parseInt(parseFloat(d)*1000)
            }
            else if(d.indexOf('M')!==-1){
                d = d.replaceAll("M","")
                d = parseInt(parseFloat(d)*1000000)
            }
            else if(d.indexOf('B')!==-1){
                d = d.replaceAll("B","")
                d = parseInt(parseFloat(d)*1000000000)
            }
        }
        return d
    }
    function dataProcessAll(files,yearStarted,yearNum){
        let dataTotal=[]
        for(let i = 0;i < files[0].length;i++) {
            let dataYearMerge = []
            for(let j = 0;j<=yearNum;j++) {
                files[0][i][(yearStarted+j).toString()]=dataProcess(files[0][i][(yearStarted+j).toString()])
                if(dataMaxFileOne<files[0][i][(yearStarted+j).toString()])
                    dataMaxFileOne=files[0][i][(yearStarted+j).toString()]
                files[1][i][(yearStarted+j).toString()]=dataProcess(files[1][i][(yearStarted+j).toString()])
                if(dataMaxFileTwo<files[1][i][(yearStarted+j).toString()])
                    dataMaxFileTwo=files[1][i][(yearStarted+j).toString()]
                files[2][i][(yearStarted+j).toString()]=dataProcess(files[2][i][(yearStarted+j).toString()])
                if(dataMaxFileThree<files[2][i][(yearStarted+j).toString()])
                    dataMaxFileThree=files[2][i][(yearStarted+j).toString()]
                let dataMerge = [files[0][i][(yearStarted+j).toString()],files[1][i][(yearStarted+j).toString()],files[2][i][(yearStarted+j).toString()],files[3][i]["class"]]
                dataYearMerge.push(dataMerge)
            }
            dataTotal.push(dataYearMerge)
        }
        return dataTotal
    }
   
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
    let dataMaxFileTwo = 0
    let dataMaxFileThree = 0

    let yearStarted = 1800
    let yearNum = 200
    let dataTotal = dataProcessAll(files,yearStarted,yearNum)

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
                            .domain([0,xAxisMax])
                            .rangeRound([0,coordinateWidth])

    let xAxis = d3.axisBottom(xDomainRange)
                    .tickValues(xScale)
                    .tickSize(-coordinateHeight)

    xAxis(gxAxis)

    yAxisMax = (dataMaxFileTwo%yTicks)===0? dataMaxFileTwo:((parseInt(dataMaxFileTwo/yTicks)+1)*yTicks)

    let yScale = []
    for(let i=0;i<=yTicks;i++) {
        yScale.push(i*yAxisMax/yTicks)
    }

    gyAxis = d3.select(".yaxis-g")
                .attr("transform", "translate("+(paddingWidth).toString()+","+(coordinateHeight+paddingHeight).toString()+")")

    let yDomainRange = d3.scaleLinear()
                            .domain([0,yAxisMax])
                            .rangeRound([0,-coordinateHeight])

    let yAxis = d3.axisLeft(yDomainRange)
                    .tickValues(yScale)
                    .tickSize(-coordinateWidth)
    
    yAxis(gyAxis)

    d3.selectAll(".tick line").style("stroke", "#ddd")

    

    // let zSizeMap = d3.scaleLog()
    //                     .base(2)
    //                     .domain([2,2**27])
    //                     .rangeRound([0,30])
    let zSizeMap = d3.scaleLinear()
                        .domain([0,dataMaxFileThree])
                        .rangeRound([4,100])
    gcircle = d3.select(".circle-g")
                .attr("transform", "translate("+(paddingWidth).toString()+","+(coordinateHeight+paddingHeight).toString()+")")

    let circleDomainRange = d3.scaleLinear()
                                .domain()
    let colors = d3.scaleOrdinal()
                    .domain([1,2,3,4])
                    .range(d3.schemeCategory10)
    
    

    let iter = 0

    function circleDraw(gcircle){
            gcircle.selectAll("circle")
                .data(dataTotal)
                .join(
                    enter => enter.append("circle")
                                    .attr("cx",d=>xDomainRange(d[iter][0]))
                                    .attr("cy",d=>yDomainRange(d[iter][1]))
                                    .attr("r",d=>zSizeMap(d[iter][2]))
                                    .style("fill",d=>colors(d[iter][3])),
                    update => update
                                    .transition()
                                    .duration(50)
                                    .attr("cx",d=>xDomainRange(d[iter][0]))
                                    .attr("cy",d=>yDomainRange(d[iter][1]))
                                    .attr("r",d=>zSizeMap(d[iter][2]))
                                    .style("fill",d=>colors(d[iter][3]))
                )
                .style("fill-opacity",0.5)
            iter = iter + 1
            if(iter>yearNum)
                clearInterval(interval)
    }   
    let interval=setInterval(function(){circleDraw(gcircle)},100)
    
    

    console.log("dataTotal:",dataTotal)
    console.log("yAxisMax:",yAxisMax)
    console.log("yScale",yScale)
    
    console.log("xAxisMax:", xAxisMax)
    console.log("dataMaxFileOne:",dataMaxFileOne)
    console.log("dataMaxFileTwo:",dataMaxFileTwo)
    console.log("dataMaxFileThree:",dataMaxFileThree)
    console.log("coordinateWidthEvery:",coordinateWidthEvery)

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