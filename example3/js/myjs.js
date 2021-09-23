fileName = "./data/population.csv"
function getDataColumn(data) {
    if(data === null || data === undefined)
        return data;
    let keys = Object.keys(data[0])
    let columnsLength = keys.length
    let result = []
    for(let i = 0; i < columnsLength; i++) { 
        result.push([])

    }
    for(let j = 0; j < data.length; j++){
        for(let i = 0; i < columnsLength; i++) { 
            result[i].push(data[j][keys[i]])
        }
    }
    return result
}
function marginLeaved(length,ratio) {


    Padding = parseInt(length * ratio)
    MarginLeaved = parseInt(length - Padding*2)
    return [MarginLeaved,Padding]
}
function noRemainder(length,ticks) {
    return parseInt(length/ticks)*ticks
}
function delayedExecution(domPre,domNow) {
    if(domPre !== domNow){
        setTimeout(function () {console.log("0")}, 10000);
    }
    else   
        console.log("1")
}

d3.csv(fileName,d3.autoType)
.then(function(data){
    
    div = d3.select(".svg-div")

    divWidth = div.style("width")
    divHeight = div.style("height")
    svg = div.append("svg")
    svg.attr("class","bar-chart-svg")
    // svg.attr("viewBox","0 0 2000 1000")
    var keyframes = []
    var element = document.getElementsByClassName("bar-chart-svg")
    var clone = element[0].cloneNode(true)
    keyframes.push(clone)

    svg.style("width",divWidth) 
    svg.style("height",divHeight) 
    svgWidth = svg.style("width").replace("px", "")
    svgHeight = svg.style("height").replace("px", "")

    var dataColumnFormat = getDataColumn(data)
    var dataColumn = data.columns

    yMinMax = d3.extent(dataColumnFormat[1])
    xRatio = 0.05
    yRatio = 0.05

    var [xWidth,xPadding] = marginLeaved(svgWidth,xRatio)
    var [yWidth,yPadding] = marginLeaved(svgHeight,yRatio)

    xWidth = noRemainder(xWidth,data.length)
    yWidth = noRemainder(yWidth,yMinMax[1])

    let xScale = d3.scaleBand()
    xScale.domain(dataColumnFormat[0])
    xScale.range([0,xWidth])
    let xAxis = d3.axisBottom(xScale)
        .tickValues(dataColumnFormat[0])
        .tickSize(0)
    let gxAxis = svg.append("g")
    gxAxis.attr("class","g-xaxis")
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    gxAxis.attr("transform", "translate(" + (xPadding).toString() + "," + (yPadding+yWidth).toString() + ")")
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }


    let yScale = d3.scaleLinear()
    yScale.domain([0,yMinMax[1]])
    yScale.range([0,-yWidth])
    let yAxis = d3.axisLeft(yScale)
    yAxis.ticks(yMinMax[1])
    yAxis.tickSize(0)
    let gyAxis = svg.append("g")
    gyAxis.attr("class","g-yaxis")
    gyAxis.attr("transform", "translate(" + (xPadding).toString() + "," + (yPadding+yWidth).toString() + ")")
    
    let gRect = svg.append("g")
    gRect.attr("class","g-rect")
    gRect.attr("transform", "translate(" + (xPadding).toString() + "," + (yPadding+yWidth).toString() + ")")
    let rect = gRect.selectAll("rect")
                    .data(data)
                    .join("rect")
    let time = 1000
    xAxis(gxAxis)
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
   

    yAxis(gyAxis)
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    

    // setTimeout(function(){xAxis(gxAxis)},time)
    // setTimeout(function(){yAxis(gyAxis)},time*2)
    rect.attr("width",xWidth/data.length/2)
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    rect.attr("height", d=> -yScale(d[dataColumn[1]]))
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    rect.attr("fill","steelblue")
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    rect.attr("x",d=>xWidth/data.length/4+xScale(d[dataColumn[0]]))
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    rect.attr("y",d=>yScale(d[dataColumn[1]]))
    clone = element[0].cloneNode(true)
    if(!clone.isEqualNode(keyframes[keyframes.length-1])){
        keyframes.push(clone)
    }
    
    // setTimeout(function(){rect.attr("width",xWidth/data.length/2);},time*3)
    // setTimeout(function(){rect.attr("height", d=> -yScale(d[dataColumn[1]]));},time*4)
    // setTimeout(function(){rect.attr("x",d=>xWidth/data.length/4+xScale(d[dataColumn[0]]));},time*5)
    // setTimeout(function(){rect.attr("y",d=>yScale(d[dataColumn[1]]));},time*6)

    console.log(keyframes)
    var divElement = document.getElementsByClassName("keyframes-div")
    var interval = 0
    var ite = 0
    interval = setInterval(function() {
        d3.select(".keyframes-div").selectAll("svg").remove()
        divElement[0].insertBefore(keyframes[ite],divElement[0].childNodes[0])
        ite++
        if(ite>=keyframes.length)
            clearInterval(interval)
    }, 1000)


    
    
})