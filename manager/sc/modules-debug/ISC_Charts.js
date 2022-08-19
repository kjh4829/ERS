
/*

  SmartClient Ajax RIA system
  Version v9.0p_2013-08-08/PowerEdition Deployment (2013-08-08)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_Charts){isc.module_Charts=1;isc._moduleStart=isc._Charts_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Charts load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;

if (window.isc && isc.version != "v9.0p_2013-08-08/PowerEdition Deployment") {
    isc.logWarn("SmartClient module version mismatch detected: This application is loading the core module from "
        + "SmartClient version '" + isc.version + "' and additional modules from 'v9.0p_2013-08-08/PowerEdition Deployment'. Mixing resources from different "
        + "SmartClient packages is not supported and may lead to unpredictable behavior. If you are deploying resources "
        + "from a single package you may need to clear your browser cache, or restart your browser."
        + (isc.Browser.isSGWT ? " SmartGWT developers may also need to clear the gwt-unitCache and run a GWT Compile." : ""));
}
isc.ClassFactory.defineInterface("Chart").addInterfaceMethods({
valueProperty:"_value",
metricFacetId:"metric",
stacked:false,
isStacked:function(context){
    return(context||this).stacked;
},
chartType:"Column",
threeD:true,
animateValuesOnShow:true,
labelValues:false,
setupChart:function(){
    if(this.facets!=null&&!isc.isAn.Array(this.facets)){
        this.facets=[this.facets];
    }
    var inlinedFacet=this.inlinedFacet=this.facets.find("inlinedValues",true);
    if(inlinedFacet)inlinedFacet.id=inlinedFacet.id||"inlined";
    this.metricFacet=null;
    for(var i=0;i<this.facets.length;i++){
        var facet=this.facets[i];
        if(facet.id==this.metricFacetId)this.metricFacet=facet;
        this.deriveFacetValues(facet);
        facet.valueIds=facet.values.getProperty("id");
    }
    if(!this.data)return;
},
getFacetData:function(){
    if(this.facetData&&this.data==this._lastFacetData)return this.facetData;
    var data=this.data;
    if(!isc.isAn.Array(data))return data;
    var facetData=[];
    for(var i=0;i<data.length;i++){
        var record=data[i],
            inFacets=true;
        for(var j=0;j<this.facets.length;j++){
            var facet=this.facets[j];
            if(facet==this.inlinedFacet||facet.autoDerived)continue;
            if(!facet.valueIds.contains(record[facet.id],null,this._comparator)){
                inFacets=false;
                break;
            }
        }
        if(inFacets)facetData.add(record);
    }
    this._lastFacetData=data;
    return(this.facetData=facetData);
},
_comparator:Array.DATETIME_VALUES,
deriveFacetValues:function(facet){
    if(facet.values&&!facet.autoDerived)return;
    var comparator=this._comparator,
        facetId=facet.id,
        facetValues=[];
    for(var i=0;i<this.data.getLength();i++){
        var facetValueId=this.data.get(i)[facetId];
        if(facetValues.findIndex("id",facetValueId,comparator)==-1){
            facetValues.add({id:facetValueId,title:facetValueId});
        }
    }
    facet.autoDerived=true;
    facet.values=facetValues;
},
getFacet:function(facetId){
    return this.facets.find("id",facetId);
},
getFacetValue:function(facetId,facetValueId){
    var facet=this.getFacet(facetId);
    if(facet)return facet.values.find("id",facetValueId,this._comparator);
},
isMultiFacet:function(){
    var numFacets=(this.facets&&this.facets.length)||0;
    return(numFacets>(this.metricFacet!=null?2:1));
},
getValue:function(facetValues,multiple){
    var data=this.getFacetData();
    if(data==null)return null;
    facetValues=facetValues||{};
    if(multiple==null)multiple=this.multiCellData;
    var record=this.getDataRecord(facetValues,multiple);
    if(!record)return null;
    return this.getValueFromRecord(record,facetValues,multiple);
},
getValueFromRecord:function(record,facetValues,multiple){
    if(record==null)return null;
    if(!this.metricFacet){
        if(!this.inlinedFacet||(facetValues&&facetValues[this.inlinedFacet.id]!=null)){
            var property=this.inlinedFacet?facetValues[this.inlinedFacet.id]:this.valueProperty;
            return multiple?record.getProperty(property).map(parseFloat):parseFloat(record[property]);
        }
        var records=isc.isAn.Array(record)?record:[record],
            values=[],
            inlinedValues=this.inlinedFacet.valueIds;
        for(var i=0;i<records.length;i++){
            for(var j=0;j<inlinedValues.length;j++){
                values.add(parseFloat(records[i][inlinedValues[j]]));
            }
        }
        if(!multiple&&values.length<2)return values[0];
        else return values;
    }else{
        if(!this.inlinedFacet||this.metricFacetId!=this.inlinedFacet.id){
            this.logWarn("the metric facet must be an inlined facet");
            return null;
        }
        var metricId=facetValues[this.metricFacet.id];
        if(!metricId)metricId=this.getDefaultMetric();
        return multiple?record.getProperty(metricId).map(parseFloat):parseFloat(record[metricId]);
    }
},
getDataRecord:function(facetValues,multiple){
    var data=this.getFacetData();
    if(!isc.isAn.Array(data))return data;
    if(multiple==null)multiple=this.multiCellData;
    if(!this.inlinedFacet){
        return(multiple?
            data.findAll(facetValues,null,this._comparator):
            data.find(facetValues,null,this._comparator));
    }
    var criteria=isc.addProperties({},facetValues);
    delete criteria[this.inlinedFacet.id];
    return(multiple?
        data.findAll(criteria,null,this._comparator):
        data.find(criteria,null,this._comparator));
},
getDataSeries:function(facetId,otherFacetValues){
    var facet=isc.isAn.Object(facetId)?facetId:this.facets.find("id",facetId);
    if(otherFacetValues==null){
        otherFacetValues={};
    }if(!isc.isAn.Object(otherFacetValues)){
        var otherFacetValueId=otherFacetValues;
        var otherFacet=(facet==this.facets[0]?this.facets[1]:this.facets[0]);
        otherFacetValues={};
        otherFacetValues[otherFacet.id]=otherFacetValueId;
    }else{
        otherFacetValues=isc.addProperties({},otherFacetValues);
    }
    var series=[];
    for(var i=0;i<facet.values.length;i++){
        var facetValue=facet.values[i];
        otherFacetValues[facet.id]=facetValue.id;
        var record=this.getDataRecord(otherFacetValues),
            value=this.getValueFromRecord(record,otherFacetValues);
        series.add({
            facetValueId:facetValue.id,
            title:facetValue.title||facetValue.id,
            value:value,
            record:record
        })
    }
    return series;
},
getDefaultMetric:function(){
    return this.metricFacet?this.metricFacet.values.first().id:this.valueProperty;
},
getMinValue:function(metricId,recalc,context,considerPartialSums){
    return this.getMaxValue(metricId,recalc,context,considerPartialSums,false);
},
getMaxValue:function(metricId,recalc,context,considerPartialSums,wantMax){
    context=context||this;
    if(wantMax==null)wantMax=true;
    if(!metricId)metricId=this.getDefaultMetric();
    var cache;
    if(wantMax){
        cache=context.cachedMaxValues=context.cachedMaxValues||{};
    }else{
        cache=context.cachedMinValues=context.cachedMinValues||{};
    }
    if(!recalc&&cache[metricId]!=null)return cache[metricId];
    var isExtraAxisChart=(context!=this);
    if(this.isMultiFacet()&&this.chartType!="Scatter"&&(!isExtraAxisChart||context.isMultiFacet())){
        var stackFacet=this.facets[1],
            otherFacet=this.facets[0],
            otherFacetValues={};
        if(this.metricFacet)otherFacetValues[this.metricFacet.id]=metricId;
        var max;
        for(var i=0;i<otherFacet.values.length;i++){
            otherFacetValues[otherFacet.id]=otherFacet.values[i].id;
            var series=this.getDataSeries(stackFacet,otherFacetValues),
                values=series.getProperty("value"),
                seriesValue;
            if(this.isStacked(context)){
                if(considerPartialSums){
                    var sum=null;
                    for(var j=0,numValues=values.length;j<numValues;++j){
                        var value=values[j];
                        if(isc.isA.Number(value)){
                            if(sum==null){
                                seriesValue=sum=value;
                            }else{
                                sum+=value;
                                seriesValue=(wantMax?Math.max(seriesValue,sum):Math.min(seriesValue,sum));
                            }
                        }
                    }
                    if(seriesValue==null)seriesValue=0;
                }else{
                    seriesValue=values.sum();
                }
            }else{
                seriesValue=(wantMax?values.max():values.min());
            }
            if(i==0){
                max=seriesValue;
            }else{
                max=wantMax?Math.max(max,seriesValue):Math.min(max,seriesValue);
            }
        }
        return(cache[metricId]=max);
    }else{
        var facetValues=null;
        if(this.chartType!="Scatter"&&isExtraAxisChart&&this.isMultiFacet()){
            facetValues={};
            facetValues[this.facets[1].id]=context._fixedFacetValue.id;
        }
        if(this.metricFacet){
            facetValues=facetValues||{};
            facetValues[this.metricFacet.id]=metricId;
        }
        var values=this.getValue(facetValues,true);
        if(values==null)return;
        return(cache[metricId]=(wantMax?values.max():values.min()));
    }
},
setData:function(){}
});
isc.A=isc.Chart;
isc.A.allChartTypes=[]
;

isc.A=isc.Chart;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._mean=function isc_c_Chart__mean(array){
    return array.sum()/array.length;
}
,isc.A._variance=function isc_c_Chart__variance(array,population,knownMean){
    var n=array.length,
        mean=knownMean!=null?knownMean:isc.Chart._mean(array),
        sumSq=0;
    for(var i=n;i--;){
        var t=array[i];
        sumSq+=t*t;
    }
    return(sumSq-n*mean*mean)/(population?n:(n-1));
}
,isc.A._standardDeviation=function isc_c_Chart__standardDeviation(array,population,knownMean){
    return Math.sqrt(array._variance(population,knownMean));
}
,isc.A._range=function isc_c_Chart__range(array){
    var n=array.length;
    if(n==0){
        return null;
    }else{
        var min=array[n-1],max=array[n-1];
        for(var i=n-1;i--;){
            var t=array[i];
            min=Math.min(t,min);
            max=Math.max(t,max);
        }
        return max-min;
    }
}
);
isc.B._maxIndex=isc.C+4;

if(isc.Flashlet){
isc.ClassFactory.defineClass("FusionChart","Flashlet","Chart");
isc.A=isc.FusionChart;
isc.A.allChartTypes=["Area","Bar","Column","Pie","Doughnut","Line","Radar"];
isc.A.singleSeriesChartTypes=["Area","Bar","Column","Pie","Doughnut","Line"];
isc.A.singleOnlyChartTypes=["Doughnut","Pie"];
isc.A.multiSeriesChartTypes=["Area","Bar","Column","Line","Radar"];
isc.A.multiOnlyChartTypes=["Radar"];
isc.A.stackedChartTypes=["Area","Bar","Column"];
isc.A.threeDChartTypes=["Column","Bar","Pie"];
isc.A.needsDimension=["Column","Bar","Pie","Doughnut","Area"]
;

isc.A=isc.FusionChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.overflow="hidden";
isc.A.redrawOnResize=true;
isc.A.chartsBaseURL=isc.Page.getIsomorphicDir()+"../FusionCharts/Charts/";
isc.A.fusionVersion="3.0";
isc.A.dataColors=[
        "CCCCFF",
        "CCCC99",
        "FFCCCC",
        "FFFF99",
        "CCFF99",
        "FFCC99",
        "FF0000",
        "00FF00",
        "0000FF",
        "FF00FF",
        "FFFF00",
        "00FFFF",
        "000000"
];
isc.A.codeBase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0";
isc.A.pluginsPage="http://www.macromedia.com/go/getflashplayer";
isc.A.params={};
isc.B.push(isc.A.getDataColor=function isc_FusionChart_getDataColor(index){
    return this.dataColors[index]||"FFFFFF";
}
,isc.A.initWidget=function isc_FusionChart_initWidget(){
    this.Super("initWidget",arguments);
    this.setupChart();
    this.setChartProperties();
    this._generateCategoriesXML();
    this.setData();
}
,isc.A.setSrc=function isc_FusionChart_setSrc(){
    if(this.chartURL){
        this.src=this.chartURL;
        return;
    }
    var stacked=this.stacked&&isc.FusionChart.stackedChartTypes.contains(this.chartType);
    var stackedWord,prefix,
        needsDimension=isc.FusionChart.needsDimension.contains(this.chartType);
    if(this.fusionVersion=="2.3"){
        prefix="FC_2_3_";
        stackedWord="Stckd";
        if(this.chartType=="Area"&&this._usingMultiFacet){
            stackedWord="Stkcd";
            needsDimension=!stacked;
        }
    }else{
        prefix="";
        stackedWord="Stacked";
        if(this.chartType=="Area"&&this._usingMultiFacet&&!stacked){
            needsDimension=false;
        }
    }
    var buffer=isc.SB.create();
    buffer.append(
        this.chartsBaseURL,
        prefix,
        isc.FusionChart.multiOnlyChartTypes.contains(this.chartType)||
            (!this._usingMultiFacet&&
             isc.FusionChart.singleSeriesChartTypes.contains(this.chartType))?"":
            stacked?stackedWord:"MS",
        this.chartType
    );
    if(needsDimension){
        buffer.append(this.threeD&&
                      isc.FusionChart.threeDChartTypes.contains(this.chartType)&&
                      !(this.fusionVersion=="2.3"&&this.chartType=="Bar")?
                      "3D":"2D");
    }
    buffer.append(".swf")
    this.src=buffer.toString();
    this.logInfo("src set to: "+this.src);
}
,isc.A.getInnerHTML=function isc_FusionChart_getInnerHTML(){
    this.setSrc();
    var allParams=isc.SB.concat(
        '&chartWidth=',this.getInnerWidth(),
        '&chartHeight=',this.getInnerHeight(),
        '&dataXML=',encodeURIComponent(this.getChartXML())
    );
    this.params.FlashVars=allParams;
    return this.Super("getInnerHTML",arguments);
}
,isc.A.getChartXML=function isc_FusionChart_getChartXML(){
    var chartXML=isc.SB.concat(
        '<graph ',this._chartPropertiesXML,'>',
            this._chartCategoriesXML,
            this._chartDataXML,
        '</graph>');
    if(this.logIsDebugEnabled()){
        this.logWarn("chartXML: "+chartXML);
    }
    return chartXML;
}
,isc.A.setChartProperties=function isc_FusionChart_setChartProperties(props){
    if(!props)props=this.chartProperties;
    else this.chartProperties=props;
    props=isc.addProperties({
        caption:this.title,
        subCaption:this.subTitle,
        yAxisName:this.valueTitle,
        xAxisName:this.facets[0].title,
        animation:this.animateValuesOnShow,
        showValues:this.labelValues
    },this.chartProperties);
    var buffer=isc.SB.create();
    for(var attr in props){
        if(props[attr]===true){
            buffer.append(attr,'="1" ');
        }else if(props[attr]===false){
            buffer.append(attr,'="0" ');
        }else if(attr.endsWith("olor")&&props[attr].startsWith("#")){
            buffer.append(attr,'="',props[attr].substring(1),'" ');
        }else{
            buffer.append(attr,'="',props[attr],'" ');
        }
    }
    this._chartPropertiesXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A._generateCategoriesXML=function isc_FusionChart__generateCategoriesXML(categories){
    if(!categories)categories=this.facets[0].values;
    var buffer=isc.SB.create();
    buffer.append('<categories>');
    for(var i=0;i<categories.length;i++){
        if(categories[i].vLine){
            this._writeVLineXML(categories[i],buffer);
            continue;
        }
        buffer.append('<category name="',
                      isc.makeXMLSafe(categories[i].title||categories[i].id),
                      '"');
        if(categories[i].longTitle){
            buffer.append(' hoverText="',isc.makeXMLSafe(categories[i].longTitle),'"');
        }
        if(categories[i].showTitle===false)buffer.append(' showName="0"');
        buffer.append('/>');
    }
    buffer.append('</categories>');
    this._chartCategoriesXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A._writeVLineXML=function isc_FusionChart__writeVLineXML(vLine,buffer){
    buffer.append('<vLine');
    for(var attr in vLine){
        if(attr=="vLine")continue;
        buffer.append(' ',attr,'="',isc.makeXMLSafe(vLine[attr]),'"');
    }
    buffer.append('/>');
}
,isc.A.setFacets=function isc_FusionChart_setFacets(facets){
    this.facets=facets;
    this.setupChart();
    this._generateCategoriesXML();
}
,isc.A.setData=function isc_FusionChart_setData(data,seriesNum){
    var data=this.data=data||this.data;
    if(data==null||(isc.isAn.Array(data)&&data.length==0)){
        return this._chartDataXML="";
    }
    var buffer=isc.SB.create();
    var firstFacet=this.facets.first(),
        firstFacetValues=firstFacet.values,
        facetValues={};
    this._usingMultiFacet=this.isMultiFacet();
    if(this.isMultiFacet()&&
        isc.FusionChart.singleOnlyChartTypes.contains(this.chartType))
    {
        this.logWarn("'"+this.chartType+"' charts support one facet only;"+
                     " showing only first value for second facet");
        this._usingMultiFacet=false;
        facetValues[this.facets[1].id]=this.facets[1].values[0].id;
    }
    if(this._usingMultiFacet){
        var secondFacet=this.facets[1],
            secondFacetValues=secondFacet.values;
        var setValue='<set value="',
            quoteClose='"',
            close='/>';
        for(var i=0;i<secondFacetValues.length;i++){
            buffer.append('<dataset seriesname="',isc.makeXMLSafe(secondFacetValues[i].title),
                            '" color="',this.getDataColor(i),'">');
            for(var j=0;j<firstFacetValues.length;j++){
                if(firstFacetValues[j].vLine)continue;
                facetValues[secondFacet.id]=secondFacetValues[i].id||
                                                secondFacetValues[i].name;
                facetValues[firstFacet.id]=firstFacetValues[j].id||
                                                firstFacetValues[j].name;
                var theValue=this.getValue(facetValues);
                buffer.append(setValue,theValue,quoteClose);
                var link=this.getLink(facetValues,theValue);
                if(link)buffer.append(' link="'+link+'"');
                buffer.append(close);
            }
            buffer.append("</dataset>");
        }
    }else{
        for(var i=0;i<firstFacetValues.length;i++){
            if(firstFacetValues[i].vLine){
                this._writeVLineXML(firstFacetValues[j],buffer);
                continue;
            }
            facetValues[firstFacet.id]=firstFacetValues[i].id||
                                            firstFacetValues[i].name;
            var theValue=this.getValue(facetValues);
            buffer.append('<set value="',theValue,'"');
            var link=this.getLink(facetValues,theValue);
            if(link){
                buffer.append(' link="'+link+'"');
            }
            buffer.append(' name="',
                    isc.makeXMLSafe(firstFacetValues[i].title||firstFacetValues[i].id),
            '"');
            buffer.append(' color="',this.getDataColor(i),'"');
            if(firstFacetValues[i].longTitle){
                buffer.append(' hoverText="',isc.makeXMLSafe(firstFacetValues[i].longTitle),'"');
            }
            if(firstFacetValues[i].showTitle===false)buffer.append(' showName="0"');
            buffer.append('/>');
        }
    }
    this._chartDataXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A.getLink=function isc_FusionChart_getLink(facetValues,value){
}
,isc.A.setChartType=function isc_FusionChart_setChartType(chartType){
    if(!isc.FusionChart.allChartTypes.contains(chartType)){
        this.logWarn("'"+chartType+"' is not a recognized chart type");
    }else{
        chartType=this.chartType=chartType||this.chartType;
        this.setData();
        if(this.isDrawn())this.markForRedraw();
    }
}
,isc.A.setFusionVersion=function isc_FusionChart_setFusionVersion(version){
    this.fusionVersion=version;
    this.setSrc();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A.setStacked=function isc_FusionChart_setStacked(isStacked){
    this.stacked=isStacked;
    if(isStacked&&!isc.FusionChart.stackedChartTypes.contains(this.chartType)){
        this.logWarn("'"+this.chartType+"' charts do not support stacking");
    }else{
        if(this.isDrawn())this.markForRedraw();
    }
}
,isc.A.setThreeD=function isc_FusionChart_setThreeD(isThreeD){
    if(isThreeD&&!isc.FusionChart.threeDChartTypes.contains(this.chartType)){
        this.logWarn("'"+this.chartType+"' charts do not support 3D effects");
    }else{
        this.threeD=isThreeD;
        if(this.isDrawn())this.markForRedraw();
    }
}
);
isc.B._maxIndex=isc.C+15;

}
if(isc.DrawPane){
isc.ClassFactory.defineClass("_PieSeriesSector","DrawSector");
isc.A=isc._PieSeriesSector.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.destroy=function isc__PieSeriesSector_destroy(){
    var fillGradient=this.fillGradient;
    if(isc.isA.String(fillGradient)){
        if(this.drawPane&&this.drawPane.gradients){
            fillGradient=this.drawPane.gradients[fillGradient];
            if(fillGradient._temporary)delete this.drawPane.gradients[fillGradient];
        }
    }
    if(isc.isAn.Object(fillGradient)&&fillGradient._temporary){
        var svgDef=fillGradient._svgDef;
        if(svgDef!=undefined){
            if(svgDef.parentNode)svgDef.parentNode.removeChild(svgDef);
            delete fillGradient._svgDef;
        }
    }
    this.Super("destroy",arguments);
}
);
isc.B._maxIndex=isc.C+1;

isc.ClassFactory.defineClass("FacetChart","DrawPane","Chart");
isc.addGlobal("BarChart",isc.FacetChart);
isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.defaultHeight=300;
isc.A.defaultWidth=400;
isc.A.overflow="hidden";
isc.A.xGutter=30;
isc.A.yGutter=80;
isc.A.padding=5;
isc.A.styleName="scChart";
isc.A.chartType="Column";
isc.A.stacked=null;
isc.A.connected=true;
isc.A.title="Chart";
isc.A.showTitle=true;
isc.A.titleProperties={
        fontSize:14
    };
isc.A.valueAxisLabelProperties={
        fontSize:11
    };
isc.A.dataAxisLabelProperties={
        fontSize:11
    };
isc.A.axisLabelMargin=5;
isc.A.pixelsPerGradation=28;
isc.A.gradationLabelProperties={
        fontFamily:"Tahoma",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#444444"
    };
isc.A.gradationLineProperties={
        lineWidth:1,
        lineColor:"#BBBBBB"
    };
isc.A.gradationZeroLineProperties={
        lineWidth:2,
        lineColor:"#999999"
    };
isc.A.bandedBackground=true;
isc.A.backgroundBandProperties={
        lineOpacity:0,
        fillColor:"#F7F7F7"
    };
isc.A.showRadarGradationLabels=true;
isc.A.radarGradationLabelOffset=2;
isc.A.expectedValueLineProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.standardDeviationLineProperties={
        lineWidth:2,
        lineColor:"#999999"
    };
isc.A.useSymmetricStandardDeviations=true;
isc.A.standardDeviations=[-1,1];
isc.A.standardDeviationBandProperties=[];
isc.A.regressionLineProperties={
        lineWidth:1,
        lineColor:"#0000EE"
    };
isc.A.regressionLineType="line";
isc.A.regressionPolynomialDegree=3;
isc.A.dataPointSize=5;
isc.A.dataPointProperties={
        fillColor:"#FFFFFF",
        lineWidth:1
    };
isc.A.pointShapes=[
        "Oval","Square","Diamond","Triangle"
    ];
isc.A.logScale=false;
isc.A.useLogGradations=false;
isc.A.logBase=10;
isc.A.logGradations=[1,2,4,6,8];
isc.A.showChartRect=false;
isc.A.chartRectProperties={
        rounding:0.02,lineWidth:1,lineColor:"#111111",
        backgroundColor:"#CCCCCC",
        fillGradient:{
            x1:'0%',
            y1:'100%',
            x2:'100%',
            y2:'0%',
            colorStops:[{
                color:"#FFFFFF",
                offset:0.0
            },{
                color:"#FFFFFF",
                offset:0.5
            },{
                color:"#CCCCCC",
                offset:0.9
            },{
                color:"#C2c2c2",
                offset:1.0
            }]
        },
        shadow:{blur:8,color:"#555555",offset:[2,2]}
    };
isc.A.chartRectMargin=5;
isc.A.dataMargin=10;
isc.A.rotateLabels="auto";
isc.A.dataLabelProperties={
        fontFamily:"Tahoma",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#444444"
    };
isc.A.decimalPrecision=2;
isc.A.zoomChartDefaults={
        canZoom:false,
        padding:0,
        showTitle:false,
        showValueAxisLabel:false,
        showDataAxisLabel:false,
        axisLabelMargin:0,
        showDataPoints:false,
        showChartRect:false,
        chartRectMargin:0,
        dataMargin:0,
        rotateLabels:"never",
        showLegend:false,
        legendMargin:0,
        legendPadding:0,
        _showYGradations:false,
        bandedBackground:false,
        pixelsPerGradation:40,
        showInlineLabels:true,
        useAutoGradients:false
    };
isc.A._showYGradations=true;
isc.A._requireZeroGradation=true;
isc.A.zoomSelectionChartDefaults={
        canZoom:false,
        padding:0,
        showTitle:false,
        showValueAxisLabel:false,
        showDataAxisLabel:false,
        axisLabelMargin:0,
        showDataPoints:false,
        showChartRect:false,
        chartRectMargin:0,
        dataMargin:0,
        rotateLabels:"never",
        showLegend:false,
        legendMargin:0,
        legendPadding:0,
        _showYGradations:false,
        bandedBackground:false,
        pixelsPerGradation:40,
        showInlineLabels:true,
        useAutoGradients:false
    };
isc.A.zoomShowSelection=true;
isc.A.zoomChartSliderDefaults={};
isc.A.zoomChartHeight=100;
isc.A.colorMutePercent=0;
isc.A.zoomMutePercent=-35;
isc.A.showInlineLabels=false;
isc.A.showGradationsOverData=false;
isc.A.legendMargin=10;
isc.A.legendPadding=5;
isc.A.legendSwatchSize=16;
isc.A.legendSwatchProperties={
        lineWidth:1,
        lineColor:"#000000"
    };
isc.A.legendTextPadding=5;
isc.A.legendItemPadding=5;
isc.A.legendRowPadding=5;
isc.A.showLegendRect=false;
isc.A.legendRectProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.legendLabelProperties={
        fontFamily:"Arial",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#333333"
    };
isc.A.showShadows=true;
isc.A.shadowProperties={fillColor:"#333333",lineWidth:1.1};
isc.A.barMargin=4;
isc.A.minBarThickness=4;
isc.A.maxBarThickness=150;
isc.A.clusterMarginRatio=4;
isc.A.barProperties={
        fillColor:"#FFCCCC",
        lineWidth:1,
        opacity:0.5,
        lineColor:"#333333"
    };
isc.A.dataLineProperties={
        lineWidth:3,
        lineColor:"#333333",
        shadow:{blur:5,color:"#333333",offset:[2,3]}
    };
isc.A.dataOutlineProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.dataShapeProperties={
        lineWidth:0,
        lineOpacity:0,
        lineColor:"#333333",
        fillOpacity:0.5
    };
isc.A.valueLineProperties={
        lineWidth:1,
        lineColor:"#BBBBBB"
    };
isc.A.discontinuousLines=false;
isc.A.singlePointMarkerSize=4;
isc.A.maxDataPointSize=14;
isc.A.minDataPointSize=3;
isc.A.minKnobSize=isc.Browser.isTouch?10:6;
isc.A.radarBackgroundProperties={
        lineWidth:1
    };
isc.A.radialLabelOffset=5;
isc.A.pieSliceProperties={lineOpacity:0,lineWidth:0.1};
isc.A.pieBorderProperties={lineColor:"#333333",lineWidth:1};
isc.A.pieRingBorderProperties={lineColor:"#333333",lineWidth:1};
isc.A.showDoughnut=null;
isc.A.doughnutRatio=0.2;
isc.A.doughnutHoleProperties={lineWidth:0,fillColor:"white"};
isc.A.pieLabelLineProperties={lineColor:"#111111",lineWidth:2};
isc.A.pieLabelAngleStart=20;
isc.A.pieLabelLineExtent=7;
isc.A.errorBarWidth=6;
isc.A.errorLineProperties={
        lineWidth:1
    };
isc.A.errorBarColorMutePercent=-60;
isc.A.canDrag=false;
isc.A.cursor="auto";
isc.A.hoverLabelProperties={
        fontFamily:"Arial",
        fontSize:12,
        fontWeight:"bold",
        fontStyle:" normal",
        lineColor:"#333333"
    };
isc.A.hoverRectProperties={
        rounding:0.3,
        lineWidth:1,
        lineColor:"#333333",
        fillColor:"#ffffff",
        fillOpacity:0.85,
        shadow:{blur:8,color:"#555555",offset:[2,2]}
    };
isc.A.hoverLabelOffset=25;
isc.A.brightenPercent=30;
isc.A.valueAxisMargin=10;
isc.A.gradationTickMarkLength=5;
isc.A.tickMarkToValueAxisMargin=7;
isc.A.extraAxisMetrics=[];
isc.A.extraAxisSettings=[]
;
isc.B.push(isc.A.isStacked=function isc_FacetChart_isStacked(context){
        context=context||this;
        return context.stacked!=null?context.stacked:context.chartType!="Line";
    }
,isc.A.isFilled=function isc_FacetChart_isFilled(context){
        context=context||this;
        return context.filled!=null?
            context.filled:
            (context.isMultiFacet()&&this.isStacked(context))||context.chartType=="Area";
    }
,isc.A.setShowScatterLines=function isc_FacetChart_setShowScatterLines(showScatterLines,context){
        context=context||this;
        if(context.chartType!="Scatter"){
            this.logWarn("showScatterLines property works only for charts of type Scatter");
        }else{
            context.showScatterLines=showScatterLines;
            if(this.data)this._redrawFacetChart(false);
        }
    }
,isc.A.setDataLineType=function isc_FacetChart_setDataLineType(dataLineType,context){
        context=context||this;
        if(context.chartType!="Scatter"&&context.chartType!="Line"){
            this.logWarn("dataLineType property works only for charts of type Scatter and Line");
        }else{
            context.dataLineType=dataLineType;
            if(this.data)this._redrawFacetChart(false);
        }
    }
,isc.A._getDataLineType=function isc_FacetChart__getDataLineType(context){
        context=context||this;
        var chartType=context.chartType;
        if(context.dataLineType=="smooth"&&!(chartType=="Area"||chartType=="Radar")){
            return"smooth";
        }else{
            return"straight";
        }
    }
,isc.A._canRotateLabels=function isc_FacetChart__canRotateLabels(){
        return(
            this.rotateLabels=="always"||(this.rotateLabels=="auto"&&
            !(isc.isA.Boolean(this.autoRotateLabels)&&this.autoRotateLabels==false)));
    }
,isc.A._getRequireZeroGradation=function isc_FacetChart__getRequireZeroGradation(context){
        context=context||this;
        return context._requireZeroGradation&&!context.logScale;
    }
,isc.A.shouldShowDoughnut=function isc_FacetChart_shouldShowDoughnut(){
        return this.showDoughnut||(this.chartType=="Doughnut"&&this.showDoughnut!==false);
    }
,isc.A._getCanMoveAxes=function isc_FacetChart__getCanMoveAxes(){
        return this._hasExtraAxes()&&
            (this.canMoveAxes!=null?this.canMoveAxes:this._getExtraAxisSettings().all.length>1);
    }
);
isc.B._maxIndex=isc.C+9;

isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.redrawOnResize=true;
isc.A.allContentAndChildren=true;
isc.A._$fakeData=[0.7,1.0,0.9,0.4,0.8,0.5,0.8];
isc.A._$extraAxisDataColorAndGradientDefaults={
    getDataColor:function(index){
        var chart=this._chart;
        return chart.getDataColor.apply(chart,
                (this._hasOwnDataColors?[index,this]:[index+this._dataColorOffset,chart]));
    },
    getDataGradient:function(index,create,drawingType){
        var chart=this._chart;
        return chart.getDataGradient.apply(chart,
                (this._hasOwnDataGradients?[index,this]:[index+this._dataGradientOffset,create,drawingType,chart]));
    }
};
isc.A._$brightBlue="#0000ff";
isc.A.angleMargin=5;
isc.A._inlineLabelXOffset=5;
isc.A._inlineLabelYOffset=2;
isc.A._facetIds=null;
isc.A.interactivePoints=true;
isc.A.useAutoGradients=true;
isc.A.dataColors=[
    "#df5545",
    "#7ae02d",
    "#4d89f9",
    "#2de0e0",
    "#e0e02d",
    "#e02de0",
    "#FF9933",
    "#99FF33",
    "#9933FF",
    "#639966",
    "#63CCCC",
    "#6366FF",
    "#800080",
    "#999999",
    "#FF00FF",
    "#FFCC00",
    "#00FF00",
    "#00CCFF",
    "#996366",
    "#C0C0C0",
    "#000000",
    "#996100",
    "#636300",
    "#006300",
    "#006366",
    "#000080",
    "#636399",
    "#636363",
    "#800000",
    "#FF6600",
    "#808000",
    "#8000FF",
    "#008080",
    "#666699",
    "#808080",
    "#FF99CC",
    "#FFCC99",
    "#FFFF99",
    "#CCFFCC",
    "#CCFFFF",
    "#99CCFF",
    "#CC99FF",
    "#FFFFFF"
];
isc.A.rotateProps={rotation:90};
isc.A._zoomChartMargin=4;
isc.B.push(isc.A.getChartTop=function isc_FacetChart_getChartTop(){
    return this._titleRect.height+this.chartRectMargin;
}
,isc.A.getChartHeight=function isc_FacetChart_getChartHeight(recalc){
    return this.getInnerContentHeight()
        -this.getChartTop()
        -this.chartRectMargin
        -Math.max(this.getXLabelsHeight(recalc),this._getValueAxisLabelsHeight(recalc))
        -(this._legendRect?this.legendMargin+this._legendRect.height:0)
        -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0);
}
,isc.A._getAvailableHeight=function isc_FacetChart__getAvailableHeight(){
    return this.getInnerContentHeight()
        -this.getChartTop()
        -this.chartRectMargin
        -(this._legendRect?this.legendMargin+this._legendRect.height:0)
        -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0)
        -this.getAxisLabelSpace(false);
}
,isc.A.getChartLeft=function isc_FacetChart_getChartLeft(){
    var chartLeft=this.getYLabelsWidth()+this.chartRectMargin;
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings();
        var leftSettings=settings.left,
            numLeft=leftSettings.length;
        chartLeft+=leftSettings.getProperty("_totalValueAxisWidth").sum();
        chartLeft+=numLeft*this.valueAxisMargin;
    }
    return chartLeft;
}
,isc.A.getChartWidth=function isc_FacetChart_getChartWidth(recalc){
    var chartWidth=this.getInnerContentWidth()-this.getChartLeft()-this.chartRectMargin;
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings(),
            rightSettings=settings.right,
            numRight=rightSettings.length;
        if(this._hasSideValueAxisLabels()){
            chartWidth-=this.getValueAxisLabelHeight(rightSettings[0]);
        }
        chartWidth-=rightSettings.getProperty("_totalValueAxisWidth").sum();
        chartWidth-=Math.max(0,numRight-1)*this.valueAxisMargin;
    }
    return chartWidth;
}
,isc.A._getAvailableWidth=function isc_FacetChart__getAvailableWidth(){
    var availableWidth=this.getInnerContentWidth()-2*this.chartRectMargin-this.getAxisLabelSpace(false);
    if(this.chartType=="Column"||this.chartType=="Bar"||
        this.chartType=="Line"||this.chartType=="Area")
    {
        availableWidth-=2*this.dataMargin;
    }
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings(),
            countLeft=settings.left.length,
            countRight=settings.right.length;
        availableWidth-=(countLeft+Math.max(0,countRight-1))*this.valueAxisMargin;
        for(var i=settings.all.length;i--;){
            availableWidth-=this._getValueAxisExtraWidth(settings.all[i]);
        }
    }
    return availableWidth;
}
,isc.A._getValueAxisExtraWidth=function isc_FacetChart__getValueAxisExtraWidth(context){
    if(context==this||!this._showYGradations){
        return 0;
    }else{
        var valueAxisLineWidth=((this._shouldShowValueAxisLine(context)&&
                this._getValueAxisLineProperties(context).lineWidth)||0),
            extraWidth=valueAxisLineWidth+
                this.gradationTickMarkLength+this.tickMarkToValueAxisMargin;
        return extraWidth;
    }
}
,isc.A.getDataAxisLength=function isc_FacetChart_getDataAxisLength(recalc){
    if(this.chartType=="Radar")return this.getChartHeight(recalc)/2;
    if(this.hasYGradations()){
        var height=this.getChartHeight(recalc);
        return height;
    }else{
        return this.getChartWidth();
    }
}
,isc.A._drawChartRect=function isc_FacetChart__drawChartRect(){
    var top=this.getChartTop(),
        height=this.getChartHeight(),
        left=this.getChartLeft(),
        width=this.getChartWidth();
    var rect=this._chartRect={
        top:top,
        left:left,
        width:width,
        height:height
    };
    if(this.showChartRect){
        this.drawRect(left,top,width,height,this.chartRectProperties);
    }
}
,isc.A.getChartRect=function isc_FacetChart_getChartRect(){
    if(this._chartRect==null)this.logWarn("getChartRect(): chart rect not available yet");
    return this._chartRect;
}
,isc.A.getChartRectLineWidth=function isc_FacetChart_getChartRectLineWidth(){
    var rectProps=this.chartRectProperties;
    var rectLineWidth=rectProps.lineWidth;
    if(rectProps.lineOpacity==0)rectLineWidth=0;
    if(!this.showChartRect)rectLineWidth=0;
    return rectLineWidth;
}
,isc.A.getStackFacet=function isc_FacetChart_getStackFacet(){
    return this._getFacets()[1];
}
,isc.A.isPieChart=function isc_FacetChart_isPieChart(chartType){
    chartType=chartType||this.chartType;
    return chartType=="Pie"||chartType=="Doughnut";
}
,isc.A.hasYAxisLabels=function isc_FacetChart_hasYAxisLabels(){
    return this.chartType!="Radar"&&!this.isPieChart();
}
,isc.A.setStacked=function isc_FacetChart_setStacked(newValue,context){
    context=context||this;
    context.stacked=newValue;
    if(this.data)this._redrawFacetChart(false);
}
,isc.A.setFilled=function isc_FacetChart_setFilled(newValue,context){
    context=context||this;
    context.filled=newValue;
    if(this.data)this._redrawFacetChart(false);
}
,isc.A.swapFacets=function isc_FacetChart_swapFacets(){
    var facets=this._getFacets();
    if(facets){
        facets.reverse();
        this.setData(this._getData());
    }
}
,isc.A.setChartType=function isc_FacetChart_setChartType(chartType,context){
    context=context||this;
    if(!isc.FacetChart.allChartTypes.contains(chartType)){
        this.logWarn("'"+chartType+"' is not a recognized chart type");
    }else{
        var wipeOrderedData=(
                this.reversePieFacets&&
                this.isMultiFacet()&&
                (this.isPieChart(context.chartType)||this.isPieChart(chartType))),
            wipeZoomChart=(
                this._getCanZoom(context.chartType)!=this._getCanZoom(chartType));
        context.chartType=chartType;
        if(this.data){
            this._redrawFacetChart(wipeOrderedData,wipeZoomChart);
        }
    }
}
,isc.A.showContextMenu=function isc_FacetChart_showContextMenu(){
    var self=this,
        contextMenuItems=null;
    if(this._getCanMoveAxes()){
        var x=this.getOffsetX()-this.getLeftPadding(),
            y=this.getOffsetY()-this.getTopPadding(),
            chartRect=this._chartRect;
        if(chartRect!=null){
            var settings=this._getExtraAxisSettings(),
                numExtraAxes=settings.all.length,
                minIndex=-settings.left.length,
                maxIndex=settings.right.length;
            for(var j=0;j<numExtraAxes;++j){
                var context=settings.all[j],
                    left=this._getValueAxisLeft(context),
                    right=left+context._totalValueAxisWidth;
                if(left<=x&&x<=right&&y>=chartRect.top&&
                    context._valueAxisLabel!=null&&y<=context._valueAxisLabel.getBoundingBox()[3])
                {
                    var submenu=[],
                        contextIndex=this._getValueAxisIndex(context);
                    for(var i=minIndex;i<=maxIndex;++i){
                        if(i==0){
                            continue;
                        }
                        var c=(i<0?settings.left[-i-1]:settings.right[i-1]);
                        if(context==c){
                            continue;
                        }
                        var swapContextIndex=this._getValueAxisIndex(c);
                        var title;
                        if(c.valueTitle!=null){
                            title=c.valueTitle;
                        }else{
                            var metricFacetValue=this.metricFacet.values.find("id",c._metric);
                            title=metricFacetValue.title||metricFacetValue.id;
                        }
                        submenu.push({
                            title:title,
                            click:"target.changeValueAxisPositions(["+
                                contextIndex+","+swapContextIndex+","+swapContextIndex+","+contextIndex+"])"
                        });
                    }
                    if(!submenu.isEmpty()){
                        contextMenuItems=[{
                            title:"Swap Metric Axes",
                            submenu:submenu
                        }];
                        break;
                    }
                }
            }
        }
    }
    if(contextMenuItems!=null){
    }else if(this._hasExtraAxes()){
        return true;
    }else if(this.chartType=="Scatter"){
        var none=!(this.showRegressionLine!=null&&this.showRegressionLine),
            straightLine=(!none&&this.regressionLineType=="line"),
            polynomialCurve=(!none&&this.regressionLineType=="polynomial");
        contextMenuItems=[{
            title:isc.FacetChart.regressionLinesContextMenuItemTitle,
            submenu:[{
                title:isc.FacetChart.hideRegressionLinesContextMenuItemTitle,
                click:"target.setShowRegressionLine(false)",
                checked:none
            },{
                title:isc.FacetChart.linearRegressionLinesContextMenuItemTitle,
                click:"target.setRegressionLineType(\"line\"); target.setShowRegressionLine(true)",
                checked:straightLine
            },{
                title:isc.FacetChart.polynomialRegressionLinesContextMenuItemTitle,
                click:"target.setRegressionLineType(\"polynomial\"); target.setShowRegressionLine(true)",
                checked:polynomialCurve
            },{
                title:isc.FacetChart.polynomialDegreeRegressionLinesContextMenuItemTitle,
                click:function(){
                    var callback=function(value){
                        var cancelled=(value==null);
                        if(cancelled)return;
                        var badInput=isc.isA.emptyString(value),
                            degree;
                        if(!badInput){
                            degree=parseInt(value,10);
                            badInput=(
                                !isc.isA.Number(degree)||
                                value!=degree.toString(10)||
                                !self._isDegreeValid(degree));
                        }
                        if(badInput){
                            isc.warn(isc.FacetChart.invalidPolynomialDegreeMessage);
                        }else if(degree!=self.regressionPolynomialDegree){
                            self.setRegressionPolynomialDegree(degree);
                            self.setRegressionLineType("polynomial");
                            self.setShowRegressionLine(true);
                        }
                    };
                    isc.askForValue(isc.FacetChart.polynomialDegreePrompt,callback,{
                            defaultValue:self.regressionPolynomialDegree
                        });
                }
            }]
        }];
    }else{
        contextMenuItems=[{
            title:"Chart Type",
            submenu:isc.FacetChart.allChartTypes.map(function(chartType){
                return{
                    title:chartType,
                    click:"target.setChartType('"+chartType+"')",
                    checked:self.chartType==chartType
                };
            })
        },{
            title:"Fill",
            submenu:[{
                title:"Filled",
                click:"target.setFilled(true)",
                checked:this.filled!=null&&this.filled
            },{
                title:"Unfilled",
                click:"target.setFilled(false)",
                checked:this.filled!=null&&!this.filled
            },{
                title:"Auto",
                click:"target.setFilled(null)",
                checked:this.filled==null
            }]
        }];
        if(this._getFacets().length>1){
            contextMenuItems.add({
                title:"Stack",
                submenu:[{
                    title:"Stacked",
                    click:"target.setStacked(true)",
                    checked:this.stacked!=null&&this.stacked
                },{
                    title:"Unstacked",
                    click:"target.setStacked(false)",
                    checked:this.stacked!=null&&!this.stacked
                },{
                    title:"Auto",
                    click:"target.setStacked(null)",
                    checked:this.stacked==null
                }]
            });
            contextMenuItems.add({
                title:"Swap Facets",
                click:"target.swapFacets()"
            });
        }
    }
    if(this._contextMenu!=null){
        this._contextMenu.destroy();
    }
    var contextMenu=this._contextMenu=this.getMenuConstructor().create({
        data:contextMenuItems
    });
    return contextMenu.showContextMenu(this);
}
,isc.A.initWidget=function isc_FacetChart_initWidget(){
    this.errorBarColorMutePercent=this._getColorMutePercent(
            this.errorBarColorMutePercent,
            isc.FacetChart.getInstanceProperty("errorBarColorMutePercent"));
    this.colorMutePercent=this._getColorMutePercent(
            this.colorMutePercent,
            isc.FacetChart.getInstanceProperty("colorMutePercent"));
    if(this._getCanZoom()){
        this.allowContentAndChildren=true;
    }
    this.Super("initWidget",arguments);
    this.origDataGradients=this.dataGradients;
    this.dataGradients=isc.addProperties({},this.origDataGradients);
    this.isVML=this.drawingType=="vml";
    this.hasShadows=!this.isVML;
    if(this.facets&&this.facets.length>2&&this.chartType!="Scatter"&&
        !((this.chartType=="Line"||this.chartType=="Area")&&(this.highErrorMetric!=null||this.lowErrorMetric!=null))&&
        !(this.extraAxisMetrics!=null&&isc.isAn.Array(this.extraAxisMetrics)&&!this.extraAxisMetrics.isEmpty()))
    {
        this.logWarn("The FacetChart \""+this.getID()+"\" has "+this.facets.length+" "+
                "facets, but it is not a scatter plot and it does not have any extraAxisMetrics.  "+
                "This is probably an error as the chart cannot utilize more than two facets.");
    }
    this._zoomChartNeedsRedraw=true;
    if(this._parentChart==null){
        this.setData(this._getData());
    }else{
        this._initExtraAxes();
    }
    this._setZoomChartProperties();
    var dummyRangeSlider=this.createAutoChild("zoomChartSlider",{
        _constructor:"RangeSlider",
        autoDraw:"false",
        minValue:0,maxValue:1,
        startValue:0,endValue:1
    });
    this._zoomChartSliderScrollbarHeight=dummyRangeSlider.scrollbar.getHeight();
    dummyRangeSlider.destroy();
    this._origWidth=this.getWidth();
    this._origHeight=this.getHeight();
}
,isc.A.draw=function isc_FacetChart_draw(){
    if(isc._traceMarkers)arguments.__this=this;
    if(!this.readyToDraw())return this;
    this.Super("draw",arguments);
    this.drawChart();
    return this;
}
,isc.A.resized=function isc_FacetChart_resized(deltaX,deltaY,reason){
    this.Super("resized",arguments);
    if(this._getCanZoom()){
        var width=this.getWidth(),
            height=this.getHeight();
        if(width!=this._origWidth){
            this._origWidth=width;
            this._zoomChartNeedsRedraw=true;
        }
        if(height!=this._origHeight){
            this._origHeight=height;
            if(this._zoomChartCreated){
                var top=this._getZoomChartTop();
                this.zoomChart.setTop(top);
                this.zoomChartSlider.setTop(top);
                if(this.zoomShowSelection){
                    this._zoomSelectionViewCanvas.setTop(top);
                }
            }
        }
    }
    if(this._parentChart==null&&reason!="init"){
        this._redrawFacetChart(false);
    }
}
,isc.A.setFacets=function isc_FacetChart_setFacets(facets){
    this.facets=facets;
    var data=this._getData();
    if(data&&data.length>0)this.setupChart();
}
,isc.A.setData=function isc_FacetChart_setData(data){
    if(!data)return;
    if(data!=null&&!isc.isAn.Array(data))data=[data];
    this._zoomChartNeedsRedraw=true;
    this.data=data;
    if(!this.data||(isc.isAn.Array(this.data)&&this.data.length==0)){
        if(this.isDrawn())this.destroyItems();
        return;
    }
    this.setupChart();
    this.orderedData=null;
    delete this._dataIsSorted;
    delete this._statCache;
    delete this._zoomValueRange;
    if(this.zoomChart!=null){
        delete this.zoomChart._zoomValueRange;
    }
    if(this.zoomSelectionChart!=null){
        delete this.zoomSelectionChart._zoomValueRange;
    }
    var maxValue=this.getMaxValue(null,true);
    this.logInfo("setData: maxValue: "+maxValue);
    this._initExtraAxes();
    if(this._getCanZoom()){
        if(this.zoomChart)this.zoomChart._initExtraAxes();
        if(this.zoomSelectionChart)this.zoomSelectionChart._initExtraAxes();
    }
    this._redrawFacetChart(false);
}
,isc.A._redrawFacetChart=function isc_FacetChart__redrawFacetChart(wipeOrderedData,wipeZoomChart){
    if(!isc.Browser.isIE||this.isDrawn()){
        this._destroyItems();
    }
    if(!this.isDrawn())return;
    if(wipeOrderedData){
        this.orderedData=null;
        delete this._dataIsSorted;
    }
    delete this.cachedMaxValues;
    delete this.cachedMinValues;
    delete this.gradations;
    delete this._oneGradationLabel;
    delete this._secondGradations;
    delete this._gradationsWidth;
    delete this._gradationsHeight;
    delete this._dataLabels;
    delete this._zoomDataBounds;
    this._zoomChartNeedsRedraw=true;
    if(wipeZoomChart){
        this._setZoomChartProperties();
        delete this._zoomValueRange;
        delete this._zoomChartCreated;
        if(this._redrawZoomChartTimerEvent!=null){
            isc.Timer.clear(this._redrawZoomChartTimerEvent);
            delete this._redrawZoomChartTimerEvent;
        }
        if(this._redrawZoomSelectionChartTimerEvent!=null){
            isc.Timer.clear(this._redrawZoomSelectionChartTimerEvent);
            delete this._redrawZoomSelectionChartTimerEvent;
        }
        if(this.zoomSelectionChart!=null){
            this.zoomSelectionChart.destroy();
            delete this.zoomSelectionChart;
        }
        if(this._zoomSelectionViewCanvas!=null){
            this._zoomSelectionViewCanvas.destroy();
            delete this._zoomSelectionViewCanvas;
        }
        if(this.zoomChart!=null){
            this.zoomChart.destroy();
            delete this.zoomChart;
        }
        if(this.zoomChartSlider!=null){
            this.ignore(this.zoomChartSlider,"changed");
            this.ignore(this.zoomChartSlider,"resized");
            this.zoomChartSlider.destroy();
            delete this.zoomChartSlider;
        }
    }else{
        if(this.zoomChart!=null){
            this.zoomChart.setChartType(this.chartType);
            this.zoomChart.setStacked(this.stacked);
            this.zoomChart.setFilled(this.filled);
        }
        if(this.zoomSelectionChart!=null){
            this.zoomSelectionChart.setChartType(this.chartType);
            this.zoomSelectionChart.setStacked(this.stacked);
            this.zoomSelectionChart.setFilled(this.filled);
        }
    }
    delete this._valueAxisLabelsHeight;
    delete this._legendRect;
    delete this._showDataValues;
    delete this._showValueOnHover;
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all;
        for(var i=0;i<settings.length;++i){
            var context=settings[i];
            delete context.cachedMaxValues;
            delete context.cachedMinValues;
            delete context.gradations;
            delete context._zoomDataBounds;
            delete context._showDataValues;
            delete context._showValueOnHover;
        }
    }
    this.xLabelsHeight=this.yLabelsWidth=null;
    this.drawChart();
}
,isc.A.drawChart=function isc_FacetChart_drawChart(){
    this.drawTitle();
    if(this.shouldShowLegend())this.drawLegend();
    var data=this._getData();
    if(!isc.isAn.Array(data)||data.length==0)return;
    var hasYGradations=this.hasYGradations(),
        hasXGradations=this.hasXGradations();
    var vertical,
        rotateLabels,secondRotateLabels,
        labelDataPairs,secondLabelDataPairs,
        gradations,secondGradations,
        logScale,secondLogScale;
    this._usingNewLayoutAlgorithm=this.chartType!="Radar"&&!this.isPieChart();
    if(this._usingNewLayoutAlgorithm){
        delete this.xLabelsHeight;
        delete this.yLabelsWidth;
        delete this.gradations;
        delete this._secondGradations;
        delete this._dataLabels;
        var availableWidth=this._getAvailableWidth(),
            availableHeight=this._getAvailableHeight(),
            numValueAxes=this._getNumValueAxes(),
            numAxes=1+numValueAxes,
            settings=(numAxes>2?this._getExtraAxisSettings().all:null),
            axes=this._axes=new Array(numAxes),
            horizontalAxis=axes[0]=this._createAxis(false,this),
            hasExtraAxes=this._hasExtraAxes(),
            hasSideValueAxisLabels=hasExtraAxes&&this._hasSideValueAxisLabels(),
            valueAxisLabelWidths=hasExtraAxes&&new Array(numAxes-1),
            valueAxisExtraWidths=hasExtraAxes&&new Array(numAxes-1);
        labelDataPairs=new Array(numValueAxes);
        for(var j=numAxes;--j;){
            var context=(j==1?this:settings[j-2]),
                minAxisWidth;
            if(hasExtraAxes){
                var extraWidth=valueAxisExtraWidths[j-1]=this._getValueAxisExtraWidth(context);
                if(!hasSideValueAxisLabels&&this.shouldShowValueAxisLabel(context)){
                    var valueAxisLabelWidth=valueAxisLabelWidths[j-1]=this.measureLabel(
                            context.valueTitle,context.valueAxisLabelProperties).width;
                    minAxisWidth=Math.max(0,valueAxisLabelWidth-extraWidth);
                }else{
                    valueAxisLabelWidths[j-1]=0;
                }
            }
            axes[j]=this._createAxis(true,context,minAxisWidth);
        }
        var info=this._calculateAxisLayout(axes,horizontalAxis,availableWidth,availableHeight);
        var axisMeasures=info.axisMeasures,
            axisWidths=info.axisWidths,
            axisHeights=info.axisHeights;
        var horizontalAxisMeasure=axisMeasures[0],
            horizontalAxisWidth=axisWidths[0],
            horizontalAxisHeight=axisHeights[0];
        if(this.chartType=="Scatter"||hasYGradations){
            rotateLabels=false;
            secondRotateLabels=horizontalAxis.rotateLabels(horizontalAxisMeasure);
        }else{
            rotateLabels=horizontalAxis.rotateLabels(horizontalAxisMeasure);
            secondRotateLabels=false;
        }
        var yLabelsWidth;
        if(this.chartType=="Scatter"){
            var verticalAxis=axes[1],
                verticalAxisMeasure=axisMeasures[1],
                verticalAxisWidth=axisWidths[1],
                verticalAxisHeights=axisHeights[1];
            vertical=true;
            yLabelsWidth=verticalAxisWidth;
            var valueLabelDataPairs=labelDataPairs[0]=verticalAxis.getLabelDataPairs(
                verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure);
            gradations=valueLabelDataPairs.getProperty("dataValue");
            logScale=verticalAxis.logScale(verticalAxisMeasure);
            secondLabelDataPairs=horizontalAxis.getLabelDataPairs(
                horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
            secondGradations=secondLabelDataPairs.getProperty("dataValue");
            secondLogScale=horizontalAxis.logScale(horizontalAxisMeasure);
        }else if(hasXGradations){
            var verticalAxis=axes[1],
                verticalAxisMeasure=axisMeasures[1],
                verticalAxisWidth=axisWidths[1],
                verticalAxisHeight=axisHeights[1];
            vertical=false;
            yLabelsWidth=verticalAxisWidth;
            var valueLabelDataPairs=labelDataPairs[0]=horizontalAxis.getLabelDataPairs(
                horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
            gradations=valueLabelDataPairs.getProperty("dataValue");
            logScale=horizontalAxis.logScale(horizontalAxisMeasure);
            secondLabelDataPairs=verticalAxis.getLabelDataPairs(
                verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure);
            secondLogScale=verticalAxis.logScale(verticalAxisMeasure);
            if(verticalAxis.useGradations(verticalAxisMeasure)){
                secondGradations=secondLabelDataPairs.getProperty("dataValue");
            }
        }else{
            vertical=true;
            var mainValueAxis=axes[1],
                mainValueAxisMeasure=axisMeasures[1],
                mainValueAxisWidth=axisWidths[1],
                mainValueAxisHeight=axisHeights[1];
            var mainValueLabelDataPairs=labelDataPairs[0]=mainValueAxis.getLabelDataPairs(
                mainValueAxisWidth,mainValueAxisHeight,mainValueAxisMeasure);
            gradations=mainValueLabelDataPairs.getProperty("dataValue");
            yLabelsWidth=mainValueAxisWidth;
            logScale=mainValueAxis.logScale(mainValueAxisMeasure);
            this._gradationsWidth=this.measureLabels(
                mainValueLabelDataPairs.getProperty("label"),"width",this.gradationLabelProperties);
            this._totalValueAxisWidth=mainValueAxisWidth;
            secondLabelDataPairs=horizontalAxis.getLabelDataPairs(
                horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
            secondLogScale=horizontalAxis.logScale(horizontalAxisMeasure);
            if(horizontalAxis.useGradations(horizontalAxisMeasure)){
                secondGradations=secondLabelDataPairs.getProperty("dataValue");
            }
            for(var j=2;j<numAxes;++j){
                var valueAxis=axes[j],
                    context=settings[j-2],
                    valueAxisMeasure=axisMeasures[j],
                    valueAxisWidth=axisWidths[j],
                    valueAxisHeight=axisHeights[j];
                var pairs=labelDataPairs[j-1]=valueAxis.getLabelDataPairs(
                    valueAxisWidth,valueAxisHeight,valueAxisMeasure);
                context.gradations=pairs.getProperty("dataValue");
                context._gradationsWidth=this.measureLabels(
                    pairs.getProperty("label"),"width",context.gradationLabelProperties);
                context._totalValueAxisWidth=valueAxisWidth+valueAxisExtraWidths[j-1];
            }
        }
        this.xLabelsHeight=horizontalAxisHeight+this.getAxisLabelSpace(false);
        this.yLabelsWidth=yLabelsWidth+this.getAxisLabelSpace(true);
        if(gradations!=null)this.gradations=gradations;
        if(secondGradations!=null)this._secondGradations=secondGradations;
        if(this.chartType=="Scatter"){
            this._dataLabels=this._secondGradations;
        }else{
            this._dataLabels=secondLabelDataPairs.getProperty("label");
        }
    }else{
        this.measureDataLabels();
        this._calculateAllGradations();
        this.measureGradationLabels(true);
    }
    this._drawChartRect();
    this.drawGradationLabels(vertical,labelDataPairs,rotateLabels);
    var showGradationsOverData=this.showGradationsOverData;
    this._drawAllGradations(vertical,gradations,false,showGradationsOverData);
    if(secondGradations!=null){
        this._drawAllGradations(!vertical,secondGradations,showGradationsOverData);
    }
    if(this.chartBackgroundDrawn){
        this.chartBackgroundDrawn();
    }
    this.drawData(secondGradations,secondLogScale,secondLabelDataPairs,
        (secondRotateLabels!=null?secondRotateLabels:this._canRotateLabels()));
    if(showGradationsOverData){
        this.drawGradations(vertical,gradations,true,false);
        if(secondGradations!=null){
            this.drawGradations(!vertical,secondGradations,true,false);
        }
    }
    this.drawDataAxisLabel();
    this._drawAllValueAxisLabels();
    if(this.chartDrawn){
        this.chartDrawn();
    }
    if(this._zoomChartNeedsRedraw&&this._getCanZoom()){
        if(!this._zoomChartCreated){
            this._createZoomChartAndSlider();
        }
        var _this=this;
        if(this._redrawZoomChartTimerEvent==null){
            this._redrawZoomChartTimerEvent=isc.Timer.setTimeout(function(){
                delete _this._redrawZoomChartTimerEvent;
                if(_this._zoomChartCreated){
                    var left=_this._getZoomChartLeft(),
                        top=_this._getZoomChartTop(),
                        chartWidth=_this.getChartWidth();
                    _this.zoomChart.setRect(left,top,chartWidth);
                    _this.zoomChartSlider.setRect(left,top,chartWidth);
                    if(!_this.zoomChart.isDrawn()){
                        _this.zoomChart.draw();
                    }else{
                        _this.zoomChart._redrawFacetChart(false);
                    }
                    if(_this.zoomShowSelection){
                        if(_this._redrawZoomSelectionChartTimerEvent==null){
                            _this._redrawZoomSelectionChartTimerEvent=isc.Timer.setTimeout(function(){
                                delete _this._redrawZoomSelectionChartTimerEvent;
                                if(_this._zoomChartCreated){
                                    var top=_this._getZoomChartTop(),
                                        chartWidth=_this.getChartWidth();
                                    _this._zoomSelectionViewCanvas.setTop(top);
                                    _this.zoomSelectionChart.setWidth(chartWidth);
                                    if(!_this.zoomSelectionChart.isDrawn()){
                                        _this.zoomSelectionChart.draw();
                                    }else{
                                        _this.zoomSelectionChart._redrawFacetChart(false);
                                    }
                                }
                                _this._zoomChartNeedsRedraw=false;
                            },0);
                        }
                    }else{
                        _this._zoomChartNeedsRedraw=false;
                    }
                }else{
                    _this._zoomChartNeedsRedraw=false;
                }
            },0);
        }
    }
}
,isc.A.hasXGradations=function isc_FacetChart_hasXGradations(chartType){
    return(chartType||this.chartType)=="Bar";
}
,isc.A.hasYGradations=function isc_FacetChart_hasYGradations(chartType){
    return(chartType||this.chartType)!="Bar";
}
,isc.A.measureDataLabels=function isc_FacetChart_measureDataLabels(){
    if(this.hasYGradations()){
        this.getXLabelsHeight(true);
    }else{
        this.getYLabelsWidth(true);
    }
}
,isc.A.erase=function isc_FacetChart_erase(destroy,willRedraw){
    this._cleanHoverItems();
    if(this.knobs!=null){
        this.knobs.map("destroy");
    }
    this._mutedDataGradients=null;
    this.Super("erase",arguments);
    this.dataGradients=isc.addProperties({},this.origDataGradients);
}
,isc.A.destroyItems=function isc_FacetChart_destroyItems(){
    this._destroyZoomChartAndSlider();
    this._destroyItems();
}
,isc.A._destroyItems=function isc_FacetChart__destroyItems(){
    this.Super("destroyItems",arguments);
}
,isc.A.getMultiMaxValue=function isc_FacetChart_getMultiMaxValue(context){
    context=context||this;
    var highErrorMetric=this._getHighErrorMetric();
    var considerPartialSums=true;
    if(context==this){
        if(this.chartType=="Scatter"&&this.getYAxisMetric()!=null){
            return this.getMaxValue(this.getYAxisMetric());
        }else if(!this._getMetricFacet()||!highErrorMetric){
            return this.getMaxValue(null,null,null,considerPartialSums);
        }else{
            return Math.max(this.getMaxValue(),this.getMaxValue(highErrorMetric));
        }
    }else{
        return this.getMaxValue(context._metric,null,context,considerPartialSums);
    }
}
,isc.A.getMultiMinValue=function isc_FacetChart_getMultiMinValue(context){
    context=context||this;
    var lowErrorMetric=this._getLowErrorMetric();
    var considerPartialSums=true;
    if(context==this){
        if(this.chartType=="Scatter"&&this.getYAxisMetric()!=null){
            return this.getMinValue(this.getYAxisMetric());
        }else if(!this._getMetricFacet()||!lowErrorMetric){
            return this.getMinValue(null,null,null,considerPartialSums);
        }else{
            return Math.min(this.getMinValue(),this.getMinValue(lowErrorMetric));
        }
    }else{
        return this.getMinValue(context._metric,null,context,considerPartialSums);
    }
}
,isc.A.getMagnitude=function isc_FacetChart_getMagnitude(number,base,context){
    context=context||this;
    if(number==0)return 0;
    if(base==null)base=context.logBase;
    var logValue=this.logValue(number,base,context);
    return Math.ceil(logValue);
}
,isc.A.getGradations=function isc_FacetChart_getGradations(context){
    return this._getGradations(null,null,null,null,null,context);
}
,isc.A._getGradations=function isc_FacetChart__getGradations(maxValue,minValue,recalc,primary,axisLength,context){
    context=context||this;
    primary=(primary!==false);
    if(maxValue==null||!isc.isA.Number(maxValue)){
        maxValue=this.getMultiMaxValue(context);
    }
    if(minValue==null||!isc.isA.Number(minValue)){
        minValue=0;
    }
    var useLog=primary&&this.shouldUseLogGradations(context);
    if(useLog){
        return this.getLogGradations(maxValue,this.getMultiMinValue(context),recalc,context);
    }
    if(!recalc&&context.gradations)return context.gradations;
    var axisLength=axisLength||this.getDataAxisLength(true);
    var idealGradations=Math.round(axisLength/this.pixelsPerGradation);
    if(primary){
        minValue=this.getMultiMinValue(context);
        if(minValue>0)minValue=0;
    }
    if(primary&&!this._hasExtraAxes()){
        var highErrorMetric=this._getHighErrorMetric(),
            lowErrorMetric=this._getLowErrorMetric();
        if(lowErrorMetric!=null){
            maxValue=Math.max(maxValue,this.getMaxValue(lowErrorMetric));
            minValue=Math.min(minValue,this.getMinValue(lowErrorMetric));
        }
        if(highErrorMetric!=null){
            maxValue=Math.max(maxValue,this.getMaxValue(highErrorMetric));
            minValue=Math.min(minValue,this.getMinValue(highErrorMetric));
        }
    }
    var valueRange=maxValue-minValue;
    var magnitude=this.getMagnitude(valueRange,10,context);
    var high=Math.pow(10,magnitude-1),low=Math.pow(10,(magnitude-2));
    var possibleIncrements=[
        low,
        2*low,
        5*low,
        10*low,
        2*high,
        5*high
    ];
    var bestIncrement,
        closest=Number.MAX_VALUE;
    for(var i=0;i<possibleIncrements.length;i++){
        var increment=possibleIncrements[i],
            gradations=Math.ceil(valueRange/increment),
            difference=Math.abs(idealGradations-gradations);
        if(gradations<idealGradations&&difference<closest){
            bestIncrement=increment;
            closest=difference;
        }
    }
    var increment=bestIncrement,
        base=Math.floor(minValue/increment)*increment,
        numGradations=(Math.ceil(maxValue/increment)-Math.floor(minValue/increment)+1),
        oneGradationLabel=(numGradations==1),
        gradations=[],
        gradation;
    if(oneGradationLabel){
        numGradations=2;
    }
    for(var i=0;i<numGradations;i++){
        if(context.logScale&&useLog&&i==0){
            continue;
        }
        gradation=base+(i*increment);
        gradations.add(gradation);
    }
    var pixelsPerIncrement=axisLength/numGradations;
    if(primary){
        context.scale=pixelsPerIncrement/increment;
        context.gradations=gradations;
        context._oneGradationLabel=oneGradationLabel;
    }
    if(this.logIsDebugEnabled("chartScale")&&context==this){
        this.logDebug("chose increment: "+increment+". "+numGradations+
                     " gradations (ideal "+idealGradations+"): "+gradations,"chartScale");
    }
    return gradations;
}
,isc.A._calculateAllGradations=function isc_FacetChart__calculateAllGradations(axisLength){
    var recalc=true,
        primary=true;
    this._getGradations(null,null,recalc,primary,axisLength,this);
    var settings=this._getExtraAxisSettings();
    if(settings!=null){
        settings=settings.all;
        for(var i=0,numExtraAxes=settings.length;i<numExtraAxes;++i){
            var metricSettings=settings[i];
            this._getGradations(null,null,recalc,primary,axisLength,metricSettings);
        }
    }
}
,isc.A.logValue=function isc_FacetChart_logValue(number,base,context){
    if(base==null)base=(context||this).logBase;
    return Math.log(number)/Math.log(base);
}
,isc.A.shouldUseLogGradations=function isc_FacetChart_shouldUseLogGradations(context){
    context=context||this;
    if(context.logScale==false)return false;
    if(context.useLogGradations!=null)return context.useLogGradations;
    return context.logBase==10;
}
,isc.A.getLogGradations=function isc_FacetChart_getLogGradations(maxValue,minValue,recalc,context){
    context=context||this;
    if(!recalc&&context.gradations)return context.gradations;
    if(minValue<0)this.logWarn("logarithmic scaling is not supported with negative values");
    var maxMagnitude=this.getMagnitude(maxValue,null,context),
        minMagnitude=this.getMagnitude(minValue,null,context);
    if(context==this){
        this.logDebug("magnitude of max,min: "+[maxMagnitude,minMagnitude],"chartScale");
    }
    if((Math.pow(context.logBase,minMagnitude-1)*context.logGradations.first())>minValue){
        minMagnitude--;
    }
    var gradations=[];
    for(var i=minMagnitude-1;i<maxMagnitude;i++){
        var base=Math.pow(context.logBase,i),
            exponent=Math.pow(context.logBase,Math.abs(i)+1);
        for(var j=0,len=context.logGradations.length;j<len;j++){
            var gradation=base*context.logGradations[j];
            if(gradation<1){
                gradation=Math.floor(gradation*exponent)/exponent;
            }
            gradations.add(gradation);
        }
    }
    gradations.add(Math.pow(context.logBase,maxMagnitude));
    if(context==this){
        this.logDebug("log gradations: "+gradations,"chartScale");
    }
    return(context.gradations=gradations);
}
);
isc.evalBoundary;isc.B.push(isc.A.getMaxGradation=function isc_FacetChart_getMaxGradation(context){
    context=context||this;
    return context.gradations.last();
}
,isc.A._getMinGradation=function isc_FacetChart__getMinGradation(context){
    context=context||this;
    var minGradation=context.gradations.first();
    return minGradation;
}
,isc.A.measureGradationLabels=function isc_FacetChart_measureGradationLabels(){
    if(this.isPieChart()||this.chartType=="Radar"){
        this._gradationsWidth=this._gradationsHeight=0;
        return;
    }
    var vertical=this.hasYGradations(),
        props=this.gradationLabelProperties,
        gradations=this.gradations.duplicate();
    for(var i=0;i<gradations.length;i++){
        gradations[i]=this.formatAxisValue(gradations[i],!vertical);
    }
    if(vertical){
        this._gradationsWidth=this.measureLabels(gradations,"width",props);
    }else{
        if(this._canRotateLabels()){
            this._gradationsHeight=this.measureLabels(gradations,"width",props);
        }else{
            this._gradationsHeight=this.measureLabel("Xy",props).height;
        }
    }
}
,isc.A.getGradationsWidth=function isc_FacetChart_getGradationsWidth(){
    if(this._gradationsWidth==null)this.logWarn("Gradation width not available");
    return this._gradationsWidth;
}
,isc.A.getGradationsHeight=function isc_FacetChart_getGradationsHeight(){
    if(this._gradationsHeight==null)this.logWarn("Gradation height not available");
    return this._gradationsHeight;
}
,isc.A.drawGradationLabels=function isc_FacetChart_drawGradationLabels(vertical,labelDataPairs,rotateLabels){
    if(this.isPieChart()||this.chartType=="Radar")return;
    var vertical=(vertical==null?this.hasYGradations():vertical===true);
    if(vertical&&!this._showYGradations){
        return;
    }
    rotateLabels=(!vertical&&(rotateLabels==null?
        this._canRotateLabels():rotateLabels===true));
    var hasExtraAxes=this._hasExtraAxes(),
        settings=this._getExtraAxisSettings(),
        numValueAxes=this._getNumValueAxes(),
        verticalAxisLabelSpace;
    if(vertical){
        verticalAxisLabelSpace=this.getAxisLabelSpace(true);
    }
    for(var j=0;j<numValueAxes;++j){
        var context=(j==0?this:settings.all[j-1]),
            props=isc.addProperties({
                    _verticalAlignMiddle:true
                },context.gradationLabelProperties),
            gradations=context.gradations,
            oneGradationLabel=context._oneGradationLabel,
            labelHeight=this.measureLabel("Xy",props).height,
            pairs=labelDataPairs&&labelDataPairs[j],
            flag=(pairs==null),
            len=(flag?(oneGradationLabel?1:gradations.getLength()):pairs.getLength());
        if(vertical){
            var left;
            if(hasExtraAxes){
                left=this._getValueAxisGradationLabelLeft(context);
            }else{
                left=verticalAxisLabelSpace;
            }
            for(var i=0;i<len;i++){
                var top=this.getYCoord(flag?gradations[i]:pairs[i].dataValue,context),
                    stringValue=flag?context.formatAxisValue(gradations[i],!vertical):pairs[i].label;
                this.drawLabel(left,top-(labelHeight/2),stringValue,props);
            }
        }else{
            if(this.chartType=="Scatter"){
                gradations=this.getSecondGradations();
            }
            var chartBottom=this.getChartTop()+this.getChartHeight();
            for(var i=0;i<len;i++){
                var gradation=flag?gradations[i]:pairs[i].dataValue,
                    left=this.getValueCoord(gradation,false),
                    top=chartBottom+this.chartRectMargin,
                    stringValue=flag?this.formatAxisValue(gradation,!vertical):pairs[i].label;
                if(rotateLabels){
                    this.drawLabel(left+this.getRotatedCenteringOffset(labelHeight),
                                   top,stringValue,props,true,true);
                }else{
                    var dims=this.measureLabel(stringValue,props);
                    this.drawLabel(left-(dims.width/2),
                                   top,stringValue,props);
                }
            }
        }
    }
}
,isc.A.getGradationLineWidth=function isc_FacetChart_getGradationLineWidth(){
    return this.gradationLineProperties.lineWidth;
}
,isc.A.drawGradations=function isc_FacetChart_drawGradations(vertical,gradations,dontDrawBackground,dontDrawForeground){
    this.logDebug("drawing gradations","chartDraw");
    gradations=gradations||this.gradations;
    if(this.isPieChart())return;
    if(this.chartType=="Radar")return this.drawRadarGradations(gradations);
    vertical=(vertical==null?this.hasYGradations():vertical===true);
    if(vertical&&!this._showYGradations){
        return;
    }
    dontDrawBackground=dontDrawBackground||!(this.bandedBackground&&vertical);
    var drawForeground=!dontDrawForeground,
        drawBackground=!dontDrawBackground;
    if(dontDrawForeground&&dontDrawBackground){
        return;
    }
    var rect=this.getChartRect(),
        availableSpace=vertical?rect.height:rect.width;
    var rectLineWidth=this.getChartRectLineWidth();
    var i=0,last=gradations.length;
    if(rectLineWidth!=0){
        i=1;
        last-=1;
    }
    var lowValue,highValue;
    if(!vertical){
        if(this.hasXGradations()){
            lowValue=this._getMinGradation();
            highValue=this.getMaxGradation();
        }else if(this.chartType=="Scatter"){
            var xMetric=this.getXAxisMetric();
            lowValue=Math.min(0,this.getMinValue(xMetric));
            highValue=this.getMaxValue(xMetric);
        }else{
            var range=this._getZoomValueRange();
            lowValue=range[0].dataValue;
            highValue=range[1].dataValue;
            if(!(range[0].index<range[1].index)||lowValue==highValue){
                return;
            }
        }
    }
    for(;i<last;i++){
        if(drawForeground){
            if(vertical){
                var left=rect.left+rectLineWidth,
                    endLeft=rect.left+rect.width-rectLineWidth,
                    top=this.getYCoord(gradations[i]),
                    isZeroLine=(gradations[i]==0);
                isc.DrawLine.create(
                    isZeroLine?this.gradationZeroLineProperties:this.gradationLineProperties,
                    {
                        drawPane:this,
                        startLeft:left,
                        startTop:top,
                        endLeft:endLeft,
                        endTop:top,
                        autoDraw:true
                    });
            }else{
                var left=this._getXCoord(gradations[i],lowValue,highValue,false);
                isc.DrawLine.create(this.gradationLineProperties,{
                    drawPane:this,
                    startLeft:left,
                    startTop:rect.top+rectLineWidth,
                    endLeft:left,
                    endTop:rect.top+rect.height-(2*rectLineWidth),
                    autoDraw:true
                });
            }
        }
        if(drawBackground&&(i%2==1)&&i!=(gradations.length-1)){
            var nextTop=this.getYCoord(gradations[i+1]),
                height=top-nextTop,
                lineWidth=this.gradationLineProperties.lineWidth;
            isc.DrawRect.create(this.backgroundBandProperties,{
                drawPane:this,
                left:left,
                top:nextTop+lineWidth,
                width:endLeft-rect.left-rectLineWidth*2,
                height:height-(lineWidth*2),
                autoDraw:true
            });
        }
    }
}
,isc.A._drawAllGradations=function isc_FacetChart__drawAllGradations(vertical,gradations,dontDrawBackground,dontDrawForeground){
    this.drawGradations(vertical,gradations,dontDrawBackground,dontDrawForeground);
    var hasExtraAxes=this._hasExtraAxes();
    if(hasExtraAxes){
        var settings=this._getExtraAxisSettings().all;
        for(var j=settings.length;j--;){
            var context=settings[j],
                gradations=context.gradations,
                left=this._getValueAxisGradationLineLeft(context),
                endLeft=left+this.gradationTickMarkLength;
            for(var i=gradations.length;i--;){
                var top=this.getYCoord(gradations[i],context),
                    isZeroLine=(gradations[i]==0);
                isc.DrawLine.create(
                    isZeroLine?context.gradationZeroLineProperties:context.gradationLineProperties,
                    {
                        drawPane:this,
                        startLeft:left,
                        startTop:top,
                        endLeft:endLeft,
                        endTop:top,
                        autoDraw:true
                    });
            }
            this._drawValueAxisLine(context);
        }
    }
}
,isc.A.getValueRatio=function isc_FacetChart_getValueRatio(value,lowValue,highValue,logScale,context){
    context=context||this;
    logScale=logScale!=null?logScale:context.logScale;
    if(highValue==null||lowValue==null){
        var gradations=context.gradations;
        if(!gradations.length)return 0;
        lowValue=gradations.first();
        highValue=gradations.last();
    }
    if(!logScale){
        var range=highValue-lowValue;
        return(value-lowValue)/range;
    }else{
        if(value==0)return 0;
        var highLog=this.logValue(highValue,context.logBase,context),
            lowLog=lowValue==0?0:this.logValue(lowValue,context.logBase,context),
            logRange=highLog-lowLog;
        return(this.logValue(value,context.logBase,context)-lowLog)/logRange
    }
}
,isc.A.getYCoord=function isc_FacetChart_getYCoord(value,context){
    context=context||this;
    var chartType=context.chartType;
    if(chartType=="Radar"||this.isPieChart(chartType)){
        return null;
    }else if(chartType!="Scatter"&&!this.hasYGradations(chartType)){
        if(value==null||!isc.isAn.Object(value)){
            return null;
        }else{
            value=this._completeCriteria(value,context);
            var drawnValue=this.getDrawnValue(value,false);
            return(drawnValue!=null?drawnValue.y:null);
        }
    }else{
        return this.getValueCoord(value,null,context);
    }
}
,isc.A._completeCriteria=function isc_FacetChart__completeCriteria(criteria,context){
    context=context||this;
    var dataLabelFacet=this.getDataLabelFacet(),
        dataFacetValue=this.getFacetValue(dataLabelFacet.id,criteria[dataLabelFacet.id]),
        legendFacet,
        ret={};
    if(dataFacetValue==null){
        return null;
    }else{
        ret[dataLabelFacet.id]=dataFacetValue.id;
    }
    if(this.isMultiFacet()){
        legendFacet=this.getLegendFacet();
        var chartType=context.chartType,
            clustered=(chartType=="Bar"||chartType=="Column")&&!this.isStacked(context),
            required=context.isMultiFacet()&&clustered&&(legendFacet.values.length>1);
        if(required){
            var legendFacetValue=this.getFacetValue(legendFacet.id,criteria[legendFacet.id]);
            if(legendFacetValue==null){
                return null;
            }else{
                ret[legendFacet.id]=legendFacetValue.id;
            }
        }else{
            ret[legendFacet.id]=legendFacet.values[0].id;
        }
    }
    var valueFacet=(this.inlinedFacet!=null&&
        this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
        ?this.inlinedFacet:null);
    if(valueFacet!=null){
        var required=(valueFacet.values.length>1);
        if(required){
            var valueFacetValue=this.getFacetValue(valueFacet.id,criteria[valueFacet.id]);
            if(valueFacetValue==null){
                return null;
            }else{
                ret[valueFacet.id]=valueFacet.values[0].id;
            }
        }else{
            ret[valueFacet.id]=valueFacet.values[0].id;
        }
    }
    return ret;
}
,isc.A.getValueCoord=function isc_FacetChart_getValueCoord(value,vertical,context){
    if(vertical==null)vertical=true;
    var valueRatio=this.getValueRatio(value,null,null,null,context);
    var chartBase,chartLength;
    if(vertical){
        chartBase=this.getChartTop();
        chartLength=this.getChartHeight();
        return chartBase+chartLength-Math.round(valueRatio*chartLength);
    }else{
        chartBase=this.getChartLeft();
        chartLength=this.getChartWidth();
        return chartBase+Math.round(valueRatio*chartLength);
    }
}
,isc.A.getXCoord=function isc_FacetChart_getXCoord(value,context){
    context=context||this;
    var chartType=context.chartType;
    if(chartType=="Radar"||this.isPieChart(chartType)){
        return null;
    }else if(chartType!="Scatter"&&!this.hasXGradations(chartType)){
        if(value==null||!isc.isAn.Object(value)){
            return null;
        }else{
            value=this._completeCriteria(value,context);
            var drawnValue=this.getDrawnValue(value,false);
            return(drawnValue!=null?drawnValue.x:null);
        }
    }else{
        return this._getXCoord(value,null,null,null,context);
    }
}
,isc.A._getXCoord=function isc_FacetChart__getXCoord(value,lowValue,highValue,logScale,context){
    context=context||this;
    var chartType=context.chartType;
    if((highValue==null||lowValue==null)&&chartType=="Scatter"){
        var xMetric=this.getXAxisMetric();
        lowValue=Math.min(0,this.getMinValue(xMetric));
        highValue=this.getMaxValue(xMetric);
    }
    var valueRatio=this.getValueRatio(value,lowValue,highValue,logScale,context),
        rect=this.getChartRect();
    return rect.left+Math.round(valueRatio*rect.width);
}
,isc.A.getDataLabels=function isc_FacetChart_getDataLabels(){
    if(this._dataLabels)return this._dataLabels;
    if(this.chartType=="Scatter")return(this._dataLabels=this.getSecondGradations());
    var orderedData=this.getOrderedData();
    return(this._dataLabels=orderedData.getProperty("title"));
}
,isc.A.getDataLabelHeight=function isc_FacetChart_getDataLabelHeight(){
    return this.measureLabel("Xy",this.dataLabelProperties).height;
}
,isc.A.getXLabelsHeight=function isc_FacetChart_getXLabelsHeight(recalc){
    if(!recalc&&this.xLabelsHeight!=null)return this.xLabelsHeight;
    if(this.chartType=="Radar"||this.isPieChart()||this.showInlineLabels){
        return(this.xLabelsHeight=0);
    }
    if(this.hasXGradations()){
        return this.getGradationsHeight()+this.getValueAxisLabelHeight();
    }
    if(this._canRotateLabels()){
        this.xLabelsHeight=this.measureDataLabels();
    }else{
        this.xLabelsHeight=this.getDataLabelHeight();
    }
    this.xLabelsHeight+=this.getDataAxisLabelHeight();
    return this.xLabelsHeight;
}
,isc.A.getYLabelsWidth=function isc_FacetChart_getYLabelsWidth(recalc){
    if(!recalc&&this.yLabelsWidth!=null)return this.yLabelsWidth;
    if(this.hasYGradations()){
        var gradationsWidth=this.getGradationsWidth();
        if(this._hasSideValueAxisLabels()){
            return gradationsWidth+this.getValueAxisLabelHeight();
        }else{
            return this._totalValueAxisWidth;
        }
    }else{
        return(this.yLabelsWidth=this.measureDataLabels()+this.getDataAxisLabelHeight());
    }
}
,isc.A.measureDataLabels=function isc_FacetChart_measureDataLabels(attribute,props){
    return this.measureLabels(null,attribute,props);
}
,isc.A.measureLabels=function isc_FacetChart_measureLabels(titles,attribute,props){
    titles=titles||this.getDataLabels();
    attribute=attribute||"width";
    props=props||this.dataLabelProperties;
    var max=0;
    for(var i=0;i<titles.length;i++){
        var size=this.measureLabel(titles[i],props)[attribute];
        max=Math.max(max,size);
    }
    return max;
}
,isc.A._getGradationLabelHeight=function isc_FacetChart__getGradationLabelHeight(context){
    context=context||this;
    return this.measureLabel("Xy",context.gradationLabelProperties).height;
}
,isc.A._hasExtraAxes=function isc_FacetChart__hasExtraAxes(){
    return this._extraAxisMetrics!=null;
}
,isc.A._getExtraAxisMetrics=function isc_FacetChart__getExtraAxisMetrics(){
    return this._extraAxisMetrics;
}
,isc.A._getExtraAxisSettings=function isc_FacetChart__getExtraAxisSettings(){
    return this._extraAxisSettings;
}
,isc.A._getFixedFacetValue=function isc_FacetChart__getFixedFacetValue(metricSettings){
    var legendFacet=this.getLegendFacet(),
        facetId=legendFacet&&legendFacet.id,
        fixedFacetValue=metricSettings.fixedFacetValue,
        ret;
    if(legendFacet==null){
        ret=null;
    }else if(isc.isA.String(fixedFacetValue)||isc.isA.Number(fixedFacetValue)){
        ret=this.getFacetValue(facetId,fixedFacetValue);
    }else if(isc.isA.Object(fixedFacetValue)){
        var facetValue=this.getFacetValue(facetId,fixedFacetValue.id);
        ret=(facetValue==fixedFacetValue?facetValue:null);
    }else{
        ret=null;
    }
    return(metricSettings._fixedFacetValue=ret);
}
,isc.A._getValueAxisGradationLabelLeft=function isc_FacetChart__getValueAxisGradationLabelLeft(context){
    var settings=this._getExtraAxisSettings(),
        left=this._getValueAxisLeft(context);
    if(context==this){
        left+=this._totalValueAxisWidth-this._gradationsWidth;
    }else{
        var showAxisLine=this._shouldShowValueAxisLine(context),
            axisLineWidth=(showAxisLine&&this._getValueAxisLineProperties(context).lineWidth)||0;
        if(settings.right.indexOf(context)!=-1){
            left+=axisLineWidth+this.gradationTickMarkLength+this.tickMarkToValueAxisMargin;
        }else{
            left+=context._totalValueAxisWidth-context._gradationsWidth-axisLineWidth
                    -this.gradationTickMarkLength-this.tickMarkToValueAxisMargin;
        }
    }
    return left;
}
,isc.A._getValueAxisGradationLineLeft=function isc_FacetChart__getValueAxisGradationLineLeft(context){
    var settings=this._getExtraAxisSettings(),
        left=this._getValueAxisLeft(context),
        showAxisLine=this._shouldShowValueAxisLine(context),
        axisLineWidth=(showAxisLine&&this._getValueAxisLineProperties(context).lineWidth)||0;
    if(settings.left.indexOf(context)!=-1){
        left+=context._totalValueAxisWidth-axisLineWidth-this.gradationTickMarkLength;
    }else{
        left+=axisLineWidth;
    }
    return left;
}
,isc.A._getValueAxisLineLeft=function isc_FacetChart__getValueAxisLineLeft(context){
    var lineWidth=this._getValueAxisLineProperties(context).lineWidth||0,
        halfLineWidth=Math.floor(lineWidth/2),
        left=this._getValueAxisLeft(context),
        settings=this._getExtraAxisSettings();
    if(settings.left.indexOf(context)!=-1){
        left+=context._totalValueAxisWidth+(halfLineWidth-lineWidth);
    }else{
        left+=halfLineWidth;
    }
    return left;
}
,isc.A._getValueAxisLeft=function isc_FacetChart__getValueAxisLeft(context){
    var settings=this._getExtraAxisSettings();
    var ret;
    if(context==this){
        ret=this.getChartLeft()-this.chartRectMargin-this._totalValueAxisWidth;
    }else{
        var left=settings.left,
            right=settings.right,
            leftIndex=left.findIndex(context),
            rightIndex=right.findIndex(context),
            space=this.valueAxisMargin;
        if(rightIndex==-1){
            ret=(left.length-1-leftIndex)*space;
            for(var i=left.length;--i>leftIndex;){
                ret+=left[i]._totalValueAxisWidth;
            }
        }else if(leftIndex==-1){
            ret=this.getChartLeft()+this.getChartWidth()+this.chartRectMargin+rightIndex*space;
            for(var i=0;i<rightIndex;++i){
                ret+=right[i]._totalValueAxisWidth;
            }
        }
    }
    return ret;
}
,isc.A._drawValueAxisLine=function isc_FacetChart__drawValueAxisLine(context){
    var showAxisLine=this._shouldShowValueAxisLine(context);
    if(showAxisLine){
        var top=this.getChartTop(),
            height=this.getChartHeight(),
            left=this._getValueAxisLineLeft(context),
            lineProps=this._getValueAxisLineProperties(context);
        isc.DrawLine.create(lineProps,{
            autoDraw:true,
            drawPane:this,
            startLeft:left,
            startTop:top,
            endLeft:left,
            endTop:top+height
        });
    }
}
,isc.A._getNumValueAxes=function isc_FacetChart__getNumValueAxes(){
    return 1+(this._hasExtraAxes()?this._getExtraAxisSettings().all.length:0);
}
,isc.A._hasSideValueAxisLabels=function isc_FacetChart__hasSideValueAxisLabels(){
    if(!this._hasExtraAxes()||(this.hasYGradations()&&!this._showYGradations)){
        return true;
    }else{
        var settings=this._getExtraAxisSettings();
        return(settings.left.length==0&&settings.right.length==1);
    }
}
,isc.A._getValueAxisLabelsHeight=function isc_FacetChart__getValueAxisLabelsHeight(recalc){
    if(!recalc&&this._valueAxisLabelsHeight!=null){
        return this._valueAxisLabelsHeight;
    }
    var height=0;
    if(!this._hasSideValueAxisLabels()){
        var settings=this._getExtraAxisSettings(),
            numAxes=this._getNumValueAxes();
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings.all[j-1]);
            if(this.shouldShowValueAxisLabel(context)){
                var labelHeight=this.measureLabel(context.valueTitle,context.valueAxisLabelProperties).height;
                height=Math.max(height,labelHeight);
            }
        }
    }
    return(this._valueAxisLabelsHeight=height);
}
,isc.A._shouldShowValueAxisLine=function isc_FacetChart__shouldShowValueAxisLine(context){
    if(context==this){
        return false;
    }
    var settings=this._getExtraAxisSettings(),
        showAxisLine=context.showAxisLine;
    return(settings.right.length==0||context!=settings.right[0])&&
        (showAxisLine!=null?showAxisLine:this.showChartRect);
}
,isc.A._getValueAxisLineProperties=function isc_FacetChart__getValueAxisLineProperties(metricSettings){
    if(metricSettings.axisLineProperties!=null){
        return metricSettings.axisLineProperties;
    }else{
        var ret={};
        if(isc.isAn.Object(this.chartRectProperties)){
            var props=this.chartRectProperties;
            if(props.lineCap!=null)ret.lineCap=props.lineCap;
            if(props.lineColor!=null)ret.lineColor=props.lineColor;
            if(props.lineOpacity!=null)ret.lineOpacity=props.lineOpacity;
            if(props.linePattern!=null)ret.linePattern=props.linePattern;
            if(props.lineWidth!=null)ret.lineWidth=props.lineWidth;
        }
        return ret;
    }
}
,isc.A._createExtraAxisLegendSwatch=function isc_FacetChart__createExtraAxisLegendSwatch(context,series,left,top,swatchSize){
    var width=swatchSize,height=swatchSize,
        chartType=context.chartType,
        drawItems=[];
    if(chartType=="Column"){
        var barMargin=2;
        var minBarThickness=3,maxBarThickness=5;
        var fakeData=this._$fakeData;
        var dataColor=this._getDataColor(series,context),
            dataGradient=this._getDataGradient(series,null,null,context);
        var maxNumBars=Math.floor((width+barMargin)/(minBarThickness+barMargin)),
            minNumBars=Math.floor((width+barMargin)/(maxBarThickness+barMargin)),
            numBars,barThickness,extra;
        for(numBars=maxNumBars;numBars>=minNumBars;--numBars){
            barThickness=Math.min((width+barMargin)/numBars)-barMargin;
            extra=width+barMargin-numBars*(barThickness+barMargin);
            if(extra%2==0)break;
        }
        var offset=left+Math.max(extra/2);
        for(var i=0;i<numBars;++i){
            var barHeight=Math.round(fakeData[i%fakeData.length]*height);
            var barProps=isc.addProperties({},this.barProperties,{
                drawPane:this,
                width:barThickness,
                height:barHeight,
                left:offset,
                top:top+height-barHeight
            });
            if(!this.useAutoGradients){
                barProps.fillColor=dataColor;
            }else{
                barProps.fillGradient=dataGradient;
            }
            drawItems.push(isc.DrawRect.create(barProps));
            offset+=barThickness+barMargin;
        }
    }else if(chartType=="Area"||(chartType=="Line"&&context.filled)){
        var minSpacing=1,maxSpacing=3;
        var fakeData=this._$fakeData;
        var dataColor=this._getDataColor(series,context),
            dataGradient=this._getDataGradient(series,null,null,context);
        var maxNumPoints=Math.floor((width+1)/(minSpacing+1)),
            minNumPoints=Math.floor((width+1)/(maxSpacing+1)),
            numPoints,spacing,extra;
        for(numPoints=maxNumPoints;numPoints>=minNumPoints;--numPoints){
            spacing=Math.min((width+1)/numPoints)-1;
            extra=width+1-numPoints*(spacing+1);
            if(extra%2==0)break;
        }
        var points=[];
        var x=left+Math.max(extra/2);
        for(var i=0;i<numPoints;++i){
            var value=fakeData[i%fakeData.length];
            points.push([x,top+Math.round(height*(1-value))]);
            x+=spacing+1;
        }
        var fullShapePoints=points.duplicate();
        fullShapePoints.add([points.last()[0],top+height]);
        fullShapePoints.add([points.first()[0],top+height]);
        drawItems.addList([
            this.drawDataLineSegment(
                points,0,points.length,{lineColor:dataColor},context,false),
            this.drawDataShape(fullShapePoints,{
                lineColor:dataColor,
                fillColor:!this.useAutoGradients?dataColor:null,
                fillGradient:this.useAutoGradients?dataGradient:null
            })
        ]);
    }else if(chartType=="Line"){
        var y=top+Math.round(height/2),
            leftPoint=[left,y],
            centerPoint=[left+Math.round(width/2),y],
            rightPoint=[left+width,y],
            pointSize=Math.min(context.dataPointSize,swatchSize);
        drawItems.push(this.drawDataLineSegment(
            [leftPoint,rightPoint],0,2,{
                lineColor:this._getDataColor(series,context),
                shadow:null
            },context,false));
        if(context.showDataPoints){
            drawItems.push(this.drawDataPoint(centerPoint,series,pointSize,null,null,context,false));
        }
    }
    return isc.DrawGroup.create(this.legendSwatchProperties,{
        drawPane:this,
        autoDraw:true,
        drawItems:drawItems,
        left:left,
        top:top,
        width:width,
        height:height
    });
}
,isc.A._getMetricSettingsDefaults=function isc_FacetChart__getMetricSettingsDefaults(){
    var defaults={
        multiFacet:this.isMultiFacet(),
        chartType:"Line"
    };
    var properties=[
        "gradationLabelProperties","gradationLineProperties","gradationZeroLineProperties",
        "showDataPoints","dataPointSize","logScale","useLogGradations","logBase",
        "logGradations","decimalPrecision","showShadows","shadowProperties","dataLineProperties",
        "dataOutlineProperties","dataShapeProperties","valueLineProperties",
        "valueAxisLabelProperties","dataPointProperties","formatAxisValue","formatDataValue"];
    for(var i=0,numProperties=properties.length;i<numProperties;++i){
        var property=properties[i];
        defaults[property]=isc.FacetChart.getInstanceProperty(property);
    }
    return defaults;
}
,isc.A._initExtraAxes=function isc_FacetChart__initExtraAxes(){
    var metrics=this.extraAxisMetrics,
        settings=this.extraAxisSettings;
    if(!(metrics!=null&&isc.isAn.Array(metrics)&&!metrics.isEmpty())){
        this._extraAxisMetrics=null;
        this._extraAxisSettings=null;
        return;
    }
    if(settings==null||!isc.isAn.Array(settings)){
        settings=[];
    }
    this._extraAxisMetrics=metrics;
    this._extraAxisSettings={left:[],right:[],all:settings};
    var includeBarChart=this.chartType=="Column",
        includeAreaChart=this.chartType=="Area"||(this.chartType=="Line"&&this.filled);
    if(includeBarChart){
        this._extraAxisSettings.barChart=this;
    }else if(includeAreaChart){
        this._extraAxisSettings.areaChart=this;
    }
    var dataColorOffset,dataGradientOffset;
    if(!this.isMultiFacet()){
        dataColorOffset=dataGradientOffset=(this.chartType=="Column"?this.getDataLabelFacet().values.length:1);
    }else{
        dataColorOffset=dataGradientOffset=this.getLegendFacet().values.length;
    }
    var len=metrics.length,
        offset=0,
        defaultProperties=len>0&&this._getMetricSettingsDefaults(),
        inlinedFacet=this._getInlinedFacet();
    for(var i=0;i<len;++i){
        var j=i-offset,
            metric=metrics[j],
            skip=!(isc.isA.String(metric)&&
                    (inlinedFacet?this.getFacetValue(inlinedFacet.id,metric)!=null
                    :(metric==this.valueProperty)));
        if(!skip){
            var metricSettings=settings[j]=isc.addDefaults(settings[j]||{},defaultProperties);
            var chartType=metricSettings.chartType;
            if(chartType==null){
                chartType=metricSettings.chartType=(i==0&&!includeBarChart?"Column":"Line");
            }
            if(chartType=="Radar"||this.isPieChart(chartType)){
                skip=true;
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "has a non-rectangular chart type, which is not allowed.  Skipping this extra value axis.");
            }else if(!this.hasYGradations(chartType)){
                skip=true;
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "has a chart type which does not use a vertical value axis and thus is not supported as an extra value axis.  "+
                    "Skipping this extra value axis.");
            }else if(includeBarChart&&chartType=="Column"){
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "is a column chart, but there is already a column chart declared on another value axis.  "+
                    "Continuing by converting this metric value axis' chart to a line chart.");
                chartType=metricSettings.chartType="Line";
                if(filled&&includeAreaChart){
                    filled=metricSettings.filled=false;
                }
            }else if(includeAreaChart&&(chartType=="Area"||(chartType=="Line"&&filled))){
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "is an area chart, but there is already an area chart declared on another value axis.  "+
                    "Continuing by converting this metric value axis' chart to a line chart.");
                chartType=metricSettings.chartType="Line";
                if(filled){
                    filled=metricSettings.filled=false;
                }
            }
        }
        if(skip){
            metrics.removeAt(j);
            settings.removeAt(j);
            ++offset;
            continue;
        }
        metricSettings._metric=metric;
        var singleFacet=!(this.isMultiFacet()&&metricSettings.multiFacet),
            fixedFacetValue=singleFacet?this._getFixedFacetValue(metricSettings):null,
            filled=metricSettings.filled;
        singleFacet&=(!this.isMultiFacet()||fixedFacetValue!=null);
        metricSettings._multiFacet=!singleFacet;
        includeBarChart=chartType=="Column";
        includeAreaChart=chartType=="Area"||(chartType=="Line"&&filled);
        if(includeBarChart){
            this._extraAxisSettings.barChart=metricSettings;
        }else if(includeAreaChart){
            this._extraAxisSettings.areaChart=metricSettings;
        }
        this._extraAxisSettings[(j%4<2)?"right":"left"].push(metricSettings);
        var defaults=this._$extraAxisDataColorAndGradientDefaults,
            hasOwnDataColors=isc.isAn.Array(metricSettings.dataColors)||
                    (isc.isA.Function(metricSettings.getDataColor)&&metricSettings.getDataColor!=defaults.getDataColor),
            hasOwnDataGradients=isc.isAn.Array(metricSettings.dataGradients)||
                    (isc.isA.Function(metricSettings.getDataGradient)&&metricSettings.getDataGradient!=defaults.getDataGradient);
        isc.addDefaults(metricSettings,defaults);
        isc.addProperties(metricSettings,{
            _chart:this,
            _hasOwnDataColors:hasOwnDataColors,
            _hasOwnDataGradients:hasOwnDataGradients,
            _dataColorOffset:dataColorOffset,
            _dataGradientOffset:dataGradientOffset,
            isMultiFacet:function(){
                return this._multiFacet;
            },
            getXCoord:function(value){
                var chart=this._chart;
                return chart.getXCoord.apply(chart,[value,this]);
            },
            getYCoord:function(value){
                var chart=this._chart;
                return chart.getYCoord.apply(chart,[value,this]);
            },
            getGradations:function(){
                var chart=this._chart;
                return chart.getGradations.apply(chart,[this]);
            },
            setChartType:function(chartType){
                var chart=this._chart;
                return chart.setChartType.apply(chart,[chartType,this]);
            },
            setStacked:function(newValue){
                var chart=this._chart;
                return chart.setStacked.apply(chart,[newValue,this]);
            },
            setFilled:function(newValue){
                var chart=this._chart;
                return chart.setFilled.apply(chart,[newValue,this]);
            }
        });
        if(!hasOwnDataColors){
            if(singleFacet){
                dataColorOffset+=(chartType=="Column"?this.getDataLabelFacet().values.length:1);
            }else{
                dataColorOffset+=this.getLegendFacet().values.length;
            }
        }
        if(!hasOwnDataGradients){
            if(singleFacet){
                dataGradientOffset+=(chartType=="Column"?this.getDataLabelFacet().values.length:1);
            }else{
                dataGradientOffset+=this.getLegendFacet().values.length;
            }
        }
    }
}
,isc.A._getValueAxisIndex=function isc_FacetChart__getValueAxisIndex(context){
    if(context==this){
        return 0;
    }else{
        var settings=this._getExtraAxisSettings(),
            index=settings.left.indexOf(context);
        if(index!=-1){
            index=-(1+index);
        }else{
            index=settings.right.indexOf(context);
            index=1+index;
        }
        return index;
    }
}
,isc.A.changeValueAxisPositions=function isc_FacetChart_changeValueAxisPositions(indexMap){
    if(!this._hasExtraAxes()){
        return;
    }
    var settings=this._getExtraAxisSettings();
    var evenIndexOf=isc.FacetChart._evenIndexOf,
        oddIndexOf=isc.FacetChart._oddIndexOf,
        valid=isc.isA.Array(indexMap)&&indexMap.length%2==0,
        minIndex=-settings.left.length,
        maxIndex=settings.right.length,
        minValue,maxValue;
    for(var i=0,len=indexMap.length;i<len;i+=2){
        var key=indexMap[i],value=indexMap[i+1];
        valid=isc.isA.Number(key)&&isc.isA.Number(value)
            &&Math.round(key)==key&&Math.round(value)==value
            &&key!=0&&value!=0
            &&minIndex<=key&&key<=maxIndex
            &&evenIndexOf(indexMap,key,i+2)==-1
            &&oddIndexOf(indexMap,value,i+3)==-1;
        minValue=i!=0?Math.min(minValue,value):value;
        maxValue=i!=0?Math.max(maxValue,value):value;
    }
    var newMinIndex,newMaxIndex;
    if(valid){
        newMinIndex=Math.min(minIndex,minValue);
        newMaxIndex=Math.max(maxIndex,maxValue);
        while(newMinIndex<=newMaxIndex&&!(oddIndexOf(indexMap,newMinIndex)!=-1||evenIndexOf(indexMap,newMinIndex)==-1)){
            ++newMinIndex;
        }
        while(newMaxIndex>newMinIndex&&!(oddIndexOf(indexMap,newMaxIndex)!=-1||evenIndexOf(indexMap,newMaxIndex)==-1)){
            --newMaxIndex;
        }
        valid=(maxIndex-minIndex==newMaxIndex-newMinIndex)&&newMinIndex<=0&&0<=newMaxIndex;
    }
    if(!valid){
        this.logWarn("An invalid indexMap argument was passed to FacetChart.changeValueAxisPositions().");
        return;
    }
    var newPositions=[],
        newLeft=[],
        newRight=[];
    for(var i=minIndex;i<=maxIndex;++i){
        if(i==0){
            continue;
        }
        var j=evenIndexOf(indexMap,i),
            key=j!=-1?indexMap[j]:i,
            value=j!=-1?indexMap[j+1]:i,
            keyContext;
        if(key>0){
            keyContext=settings.right[key-1];
        }else if(key<0){
            keyContext=settings.left[-key-1];
        }
        if(value>0){
            newRight[value-1]=keyContext;
        }else{
            newLeft[-value-1]=keyContext;
        }
    }
    settings.left=newLeft;
    settings.right=newRight;
    this._redrawFacetChart(false);
}
,isc.A._hoverValueAxisLabel=function isc_FacetChart__hoverValueAxisLabel(context){
    if(context!=this._hoverValueAxis){
        this._unhoverValueAxisLabel();
        var valueAxisLabel=context._valueAxisLabel;
        context._origValueAxisLabelLineColor=valueAxisLabel.lineColor;
        valueAxisLabel.lineColor=this._$brightBlue;
        valueAxisLabel.erase();
        valueAxisLabel.draw();
        this._hoverValueAxis=context;
    }
}
,isc.A._unhoverValueAxisLabel=function isc_FacetChart__unhoverValueAxisLabel(){
    var context=this._hoverValueAxis;
    if(context!=null){
        var valueAxisLabel=context._valueAxisLabel;
        valueAxisLabel.lineColor=context._origValueAxisLabelLineColor;
        valueAxisLabel.erase();
        valueAxisLabel.draw();
        delete this._hoverValueAxis;
    }
}
,isc.A.getChartCenter=function isc_FacetChart_getChartCenter(rect){
    rect=rect||this.getChartRect();
    return[
               Math.round(rect.left+(rect.width/2)),
               Math.round(rect.top+(rect.height/2))
           ]
}
,isc.A.getChartRadius=function isc_FacetChart_getChartRadius(rect){
    rect=rect||this.getChartRect();
    var offset=this.radialLabelOffset,
        rectLineWidth=this.getChartRectLineWidth();
    if(this.isPieChart()&&this.isStacked())offset+=this.pieLabelLineExtent;
    var hLabelSpace=2*(this.measureDataLabels()+offset),
        vLabelSpace=2*(this.getDataLabelHeight()+offset),
        longAxis=Math.min(rect.width-hLabelSpace,rect.height-vLabelSpace),
        maxRadius=this.maxRadius=Math.round((longAxis-(2*rectLineWidth))/2);
    return maxRadius;
}
);
isc.evalBoundary;isc.B.push(isc.A.drawRadarGradations=function isc_FacetChart_drawRadarGradations(gradations){
    var rect=this.getChartRect(),
        gradations=gradations||this.gradations,
        maxRadius=this.getChartRadius(rect);
    isc.DrawOval.create(this.radarBackgroundProperties,{
        drawPane:this,
        autoDraw:true,
        centerPoint:this.getChartCenter(),
        radius:maxRadius
    });
    var center=this.getChartCenter(),
        showLabels=this.showRadarGradationLabels;
    for(var i=0;i<gradations.length;i++){
        var radius=this.getValueRatio(gradations[i])*maxRadius;
        if(radius!=0){
            isc.DrawOval.create(
                gradations[i]==0?this.gradationZeroLineProperties:this.gradationLineProperties,
                {
                    drawPane:this,
                    autoDraw:true,
                    centerPoint:center,
                    radius:radius
                });
        }
        if(showLabels){
            var offset=this.radarGradationLabelOffset;
            this.drawLabel(center[0]+offset,
                           center[1]-radius-(this.getDataLabelHeight()/2)+offset,
                           this.formatAxisValue(gradations[i],true),
                           this.gradationLabelProperties);
        }
    }
}
,isc.A.drawRadarData=function isc_FacetChart_drawRadarData(rect,maxValue,data){
    rect=rect||this.getChartRect();
    data=data||this.getOrderedData();
    maxValue=maxValue||this.getMaxGradation();
    var firstFacet=this.getDataLabelFacet();
    if(this._getMultiCellData()){
        this.drawRadarSet(firstFacet);
        return;
    }
    var center=this.getChartCenter();
    var anglePerValue=Math.round(360/firstFacet.values.length);
    for(var i=0;i<data.length;i++){
        var angle=anglePerValue*i,
            outerPoint=isc.GraphMath.polar2screen(angle,this.maxRadius,center,true);
        this.drawValueLine(center,outerPoint);
        this.drawRadialLabel(center,this.maxRadius,angle,data[i].title);
    }
    return this.drawLines();
}
,isc.A.drawRadarSet=function isc_FacetChart_drawRadarSet(facet){
    var segmentAngle=Math.round(360/facet.values.length);
    var center=this.getChartCenter();
    for(var i=0;i<facet.values.length;i++){
        var facetValue=facet.values[i];
        var angle=(i*segmentAngle);
        var outerPoint=isc.GraphMath.polar2screen(angle,this.maxRadius,center,true);
        this.drawValueLine(center,outerPoint);
        var title=facet.values[i].title||facet.values[i].id;
        var labelAngle=angle+Math.round(segmentAngle/2);
        this.drawRadialLabel(center,this.maxRadius,labelAngle,title);
        var facetValues={};
        facetValues[facet.id]=facetValue.id;
        var records=this.getDataRecord(facetValues);
        if(records==null)return;
        this.drawPointsAcrossAngle(records,
                                   angle+this.angleMargin,
                                   angle+segmentAngle-this.angleMargin);
    }
}
,isc.A.drawPointsAcrossAngle=function isc_FacetChart_drawPointsAcrossAngle(records,startAngle,endAngle){
    var angleIncrement=Math.round((endAngle-startAngle)/records.length),
        center=this.getChartCenter(),
        maxRadiusValue=this.getMaxValue(),
        radiusMetric,sizeMetric,maxSizeValue;
    var metricFacet=this._getMetricFacet();
    if(metricFacet){
        sizeMetric=metricFacet.values[1].id;
        radiusMetric=metricFacet.values[0].id;
        maxSizeValue=this.getMaxValue(sizeMetric);
    }
    for(var i=0;i<records.length;i++){
        var record=records[i];
        var radiusValue,
            size=this.dataPointSize;
        if(metricFacet){
            radiusValue=parseFloat(record[radiusMetric]);
            var sizeValue=parseFloat(record[sizeMetric]);
            size=Math.max(this.minDataPointSize,
                            Math.ceil((sizeValue/maxSizeValue)*this.maxDataPointSize));
        }else{
            radiusValue=record[this.getDefaultMetric()];
        }
        var distance=Math.round((radiusValue/maxRadiusValue)*this.maxRadius);
        var point=isc.GraphMath.polar2screen(startAngle+(i*angleIncrement),
                                               distance,center,true);
        this.drawDataPoint(point,0,size,record,radiusValue);
    }
}
,isc.A.drawRadialLabel=function isc_FacetChart_drawRadialLabel(center,radius,angle,label){
    var coords=this._getRadialLabelCoordinates(center,radius,angle,label,this.dataLabelProperties);
    this.drawLabel(coords[0],coords[1],label,this.dataLabelProperties);
}
,isc.A._getRadialLabelCoordinates=function isc_FacetChart__getRadialLabelCoordinates(center,radius,angle,label,labelProperties){
    var labelOrigin=isc.GraphMath.polar2screen(angle,
                                                 radius+this.radialLabelOffset,
                                                 center,true);
    var labelDims=this.measureLabel(label,labelProperties);
    if(angle>=360)angle-=360;
    if(angle>180&&angle<=360){
        labelOrigin[0]-=labelDims.width;
    }
    if((angle>=0&&angle<90)||(angle>270&&angle<=360)){
        labelOrigin[1]-=labelDims.height;
    }
    var fromTop=isc.GraphMath.angleDifference(0,angle),
        fromBottom=isc.GraphMath.angleDifference(angle,180),
        fromRight=isc.GraphMath.angleDifference(90,angle),
        fromLeft=isc.GraphMath.angleDifference(angle,270),
        vDelta=Math.min(Math.abs(fromTop),Math.abs(fromBottom)),
        hDelta=Math.min(Math.abs(fromLeft),Math.abs(fromRight));
    if(vDelta<=20){
        var angleOffset=Math.abs(fromTop)==vDelta?fromTop:fromBottom,
            direction=angleOffset==vDelta?1:-1,
            maxOffset=direction*(labelDims.width/2),
            ratio=1-(vDelta/20),
            offset=Math.round(ratio*maxOffset);
        labelOrigin[0]-=Math.round(ratio*maxOffset);
    }else if(hDelta<=20){
        var angleOffset=Math.abs(fromLeft)==hDelta?fromLeft:fromRight,
            direction=angleOffset==hDelta?1:-1,
            maxOffset=direction*(labelDims.height/2),
            ratio=1-(hDelta/20),
            offset=Math.round(ratio*maxOffset);
        labelOrigin[1]-=offset;
    }
    return[labelOrigin[0],labelOrigin[1]];
}
,isc.A.formatAxisValue=function isc_FacetChart_formatAxisValue(value,forHorizontalAxis){
    var pow10=Math.pow(10,this.decimalPrecision);
    var roundedValue=Math.round(value*pow10)/pow10;
    return isc.Format.toUSString(roundedValue);
}
,isc.A.formatDataValue=function isc_FacetChart_formatDataValue(value){
    var pow10=Math.pow(10,this.decimalPrecision);
    var roundedValue=Math.round(value*pow10)/pow10;
    return isc.Format.toUSString(roundedValue);
}
,isc.A.getOrderedData=function isc_FacetChart_getOrderedData(recalc){
    if(this.orderedData&&!recalc)return this.orderedData;
    if(this.chartType=="Scatter"){
        var legendFacet=this.getLegendFacet(),
            orderedData;
        if(legendFacet!=null){
            orderedData=new Array(legendFacet.values.length);
            for(var j=0;j<legendFacet.values.length;++j){
                var legendFacetValue=legendFacet.values[j],
                    criteria={};
                criteria[legendFacet.id]=legendFacetValue.id;
                var records=this.getDataRecord(criteria,true),
                    seriesNode=orderedData[j]={
                        facetValueId:legendFacetValue.id,
                        title:legendFacetValue.title||legendFacetValue.id
                    },
                    items=seriesNode.series=new Array(records.length);
                for(var i=records.length;i--;){
                    items[i]={
                        record:records[i]
                    };
                }
            }
        }else{
            var records=this.getDataRecord({},true);
            orderedData=new Array(records.length);
            for(var i=records.length;i--;){
                orderedData[i]={record:records[i]};
            }
        }
        this.orderedData=orderedData;
        return orderedData;
    }
    var orderedData=this.orderedData=[],
        multiCellData=this._getMultiCellData(),
        firstFacet=this.getDataLabelFacet()||this.getLegendFacet(),
        firstFacetValues=firstFacet.values,
        facetValues={};
    if(this.isMultiFacet()){
        var secondFacet=this.getLegendFacet(),
            secondFacetValues=secondFacet.values;
        for(var i=0;i<firstFacetValues.length;i++){
            var criteria={};
            criteria[firstFacet.id]=firstFacetValues[i].id;
            var seriesNode={
                title:firstFacetValues[i].title||firstFacetValues[i].id,
                facetValueId:firstFacetValues[i].id,
                series:[]
            }
            orderedData.add(seriesNode);
            for(var j=0;j<secondFacetValues.length;j++){
                var facetValue=secondFacetValues[j];
                var item={
                    facetValueId:secondFacetValues[j].id,
                    title:secondFacetValues[j].title||secondFacetValues[j].id
                };
                seriesNode.series.add(item);
                criteria[secondFacet.id]=secondFacetValues[j].id;
                item.record=this.getDataRecord(criteria,multiCellData);
                item.value=this.getValueFromRecord(item.record,criteria,multiCellData);
            }
        }
    }else{
        var criteria={};
        for(var i=0;i<firstFacetValues.length;i++){
            var facetValue=firstFacetValues[i];
            var item={
                title:facetValue.title||facetValue.id,
                facetValueId:facetValue.id
            };
            orderedData.add(item);
            criteria[firstFacet.id]=firstFacetValues[i].id;
            item.record=this.getDataRecord(criteria,multiCellData);
            item.value=this.getValueFromRecord(item.record,criteria,multiCellData);
        }
    }
    return orderedData;
}
,isc.A.drawData=function isc_FacetChart_drawData(gradations,logScale,labelDataPairs,rotateLabels){
    this.logDebug("drawing data","chartDraw");
    this._cleanHoverItems();
    if(!this.showStatisticsOverData&&this.chartType!="Scatter"){
        this._drawStatistics();
    }
    var hasExtraAxes=this._hasExtraAxes(),
        numValueAxes=this._getNumValueAxes(),
        numAxes=1+numValueAxes,
        settings=hasExtraAxes&&this._getExtraAxisSettings(),
        barChart=hasExtraAxes&&settings.barChart,
        areaChart=hasExtraAxes&&settings.areaChart;
    settings=settings.all;
    var barChartIndex=(barChart?settings.indexOf(barChart):-1),
        areaChartIndex=(areaChart?settings.indexOf(areaChart):-1);
    var offset=0;
    for(var j=0;j<numValueAxes;++j){
        var context;
        if(barChart&&j==0){
            --offset;
            context=barChart;
        }else if(areaChart&&j==(barChart?1:0)){
            --offset;
            context=areaChart;
        }else if(!(this==barChart||this==areaChart)&&
                j==(barChart?1:0)+(areaChart?1:0))
        {
            --offset;
            context=this;
        }else{
            var k=j+offset;
            if(k==barChartIndex||k==areaChartIndex){
                ++offset;
                ++k;
            }
            if(k==barChartIndex||k==areaChartIndex){
                ++offset;
                ++k;
            }
            context=settings[k];
        }
        if(context.chartType=="Column"||context.chartType=="Bar"){
            this.drawBars(
                (context==this?labelDataPairs:null),rotateLabels,null,null,null,context);
        }else if(context.chartType=="Line"||context.chartType=="Area"){
            this.drawLines(
                (context==this?gradations:null),
                (context==this?logScale:null),
                (context==this?labelDataPairs:null),
                rotateLabels,null,null,null,context);
        }else if(context.chartType=="Radar"){
            this.drawRadarData();
        }else if(this.isPieChart(context.chartType)){
            this.drawPieData();
        }else if(context.chartType=="Scatter"){
            this.drawScatterData(rotateLabels);
        }else{
            this.logWarn("chart type: '"+context.chartType+"' not supported");
        }
    }
    var data=this.getOrderedData();
    for(var j=0;j<numValueAxes;++j){
        var context=(j==0?this:settings[j-1]);
        this._drawDataValueLabels(data,context);
    }
    if(this.showStatisticsOverData){
        this._drawStatistics();
    }
}
,isc.A.drawLines=function isc_FacetChart_drawLines(gradations,logScale,labelDataPairs,rotateLabels,rect,maxValue,data,context){
    context=context||this;
    rect=rect||this.getChartRect();
    data=data||this.getOrderedData();
    var range=this._getZoomValueRange();
    var lowValue=range[0].dataValue,highValue=range[1].dataValue;
    var start=range[0].index,end=range[1].index,len=end-start+1;
    var discrete=(this._hasDiscreteDataValues()||gradations==null||len==1);
    var isRadar=context.chartType=="Radar";
    var center,anglePerValue,offset,spacing;
    if(isRadar){
        center=this.getChartCenter();
        anglePerValue=Math.round(360/this.getDataLabelFacet().values.length);
    }else{
        var startMargin=this._hasExtraAxes()?(this._extraAxisStartMargin||0):this.dataMargin,
            dataSpace=(rect.width-2*startMargin);
        offset=rect.left+startMargin;
        spacing=len>1?dataSpace/(len-1):0;
    }
    var multiFacet=this.isMultiFacet(),
        stacked=context.isMultiFacet()&&this.isStacked(context),
        filled=this.isFilled(context);
    var dataSeriesLength=context.isMultiFacet()?data[0].series.length:1;
    var isExtraAxisChart=(context!=this),
        extraAxisMetric;
    if(isExtraAxisChart){
        extraAxisMetric=context._metric;
    }
    var hasBasePoints=filled&&stacked&&!(isRadar||len<2),
        leftBasePoint0,rightBasePoint0,
        leftBasePoint,rightBasePoint,
        badPoint=[NaN,NaN],
        lastShapePoints,
        plotValues,
        inc,
        k=start,
        xs=[];
    for(var i=0;i<dataSeriesLength;++i){
        var values,records,seriesIndex=null;
        if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
            var series=data.getProperty("series").getProperty(i);
            records=series.getProperty("record");
            values=isExtraAxisChart?records.getProperty(extraAxisMetric):series.getProperty("value");
            seriesIndex=i;
        }else{
            if(isExtraAxisChart){
                if(this.isMultiFacet()){
                    var fixedFacetValue=this._getFixedFacetValue(context);
                    seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                    var series=data.getProperty("series").getProperty(seriesIndex);
                    records=series.getProperty("record");
                }else{
                    records=data.getProperty("record");
                }
            }
            values=(isExtraAxisChart?records.getProperty(extraAxisMetric):data.getProperty("value"));
        }
        if(stacked){
            plotValues=this.addValues(values,plotValues);
        }else{
            plotValues=values;
        }
        var reverse=(i%2!=0);
        inc=reverse?-1:1;
        var points=[],
            shapePoints=filled&&[],
            leftBadValue=false,
            rightBadValue=false;
        for(var j=0;j<len;++j,k+=inc){
            var value=plotValues[k],
                badValue=!isc.isA.Number(values[k]),
                point;
            if(isRadar){
                if(badValue){
                    point=badPoint;
                }else{
                    var valueRatio=this.getValueRatio(value),
                        distance=Math.round(valueRatio*this.maxRadius),
                        angle=anglePerValue*(k-start);
                    point=isc.GraphMath.polar2screen(angle,distance,center,true);
                }
            }else{
                if(badValue)value=0;
                var x;
                if(i==0){
                    x=xs[k]=(
                        discrete?Math.round(offset+(k-start)*spacing):
                            this._getXCoord(data[k].title,lowValue,highValue,logScale,context));
                    if((!stacked||hasBasePoints)&&(k==start||k==end)){
                        var rect=this.getChartRect(),
                            y=rect.top+rect.height;
                        if(k==start){
                            leftBasePoint=leftBasePoint0=[x,y];
                        }else{
                            rightBasePoint=rightBasePoint0=[x,y];
                        }
                    }
                }else{
                    x=xs[k];
                }
                point=(badValue?badPoint:[x,this.getYCoord(value,context)]);
            }
            points.push(point);
            if(badValue){
                if(hasBasePoints){
                    if(k==start){
                        leftBadValue=true
                    }else if(k==end){
                        rightBadValue=true;
                    }
                }
            }else{
                if(filled){
                    shapePoints.push(point);
                    if(hasBasePoints){
                        if(k==start){
                            leftBasePoint=point;
                        }else if(k==end){
                            rightBasePoint=point;
                        }
                    }
                }
                var drawnValue=this._getDrawnValue(context,k,seriesIndex);
                drawnValue.drawnX=point[0];
                drawnValue.drawnY=point[1];
                drawnValue.value=values[k];
            }
        }
        if(isRadar&&this.connected){
            if(!isNaN(points.last()[1])){
                points.add(points[0]);
            }
            if(filled&&shapePoints.length>0){
                shapePoints.add(shapePoints[0]);
            }
        }
        k-=inc;
        var color=this._getDataColor(i,context);
        var lineProps={lineColor:color};
        this.drawDataLine(points,lineProps,context);
        if(filled){
            if(lastShapePoints==null||!stacked){
                if(isRadar||len<2){
                    lastShapePoints=[];
                }else{
                    if(inc==1){
                        lastShapePoints=[rightBasePoint0,leftBasePoint0];
                    }else{
                        lastShapePoints=[leftBasePoint0,rightBasePoint0];
                    }
                }
            }
            var fullShapePoints=shapePoints.concat(lastShapePoints);
            lastShapePoints=shapePoints;
            if(hasBasePoints){
                if(leftBadValue){
                    if(inc==1)lastShapePoints.unshift(leftBasePoint);
                    else lastShapePoints.push(leftBasePoint);
                }
                if(rightBadValue){
                    if(inc==1)lastShapePoints.push(rightBasePoint);
                    else lastShapePoints.unshift(rightBasePoint);
                }
            }
            var useGradients=this.useAutoGradients&&(!multiFacet||!this.isVML);
            if(!fullShapePoints.isEmpty()){
                if(!multiFacet||context.chartType=="Area"||context.chartType=="Line"){
                    this.drawDataShape(fullShapePoints,{
                        lineColor:color,
                        fillColor:!useGradients?color:null,
                        fillGradient:useGradients?this._getDataGradient(i,null,null,context):null
                    });
                }else if(context.chartType=="Radar"){
                    var shape=this._getDataShape(fullShapePoints,{
                        lineColor:color,
                        fillColor:!useGradients?color:null,
                        fillGradient:null
                    },this.connected);
                    if(useGradients){
                        shape.fillGradient=this.getRadarShapeGradient(
                                color,shape,center,i==0);
                    }
                    shape.draw();
                }
            }
        }
        if(multiFacet&&this._getLowErrorMetric()!=null&&!this._hasExtraAxes()){
            this.drawErrorBars(points,records,i,maxValue,rect,start,end,reverse);
        }
        if(context.showDataPoints){
            if(records==null){
                records=data.getProperty("record");
            }
            this.drawPoints(points,records,i,plotValues,start,end,reverse,context);
        }
        if(i==0&&!isRadar&&context==this){
            if(labelDataPairs==null){
                this.drawDataLabels(xs,data.getProperty("title"),true,rotateLabels);
            }else{
                var dataValues=labelDataPairs.getProperty("dataValue");
                var numDataValues=dataValues.length;
                var labelXs=[],labels=[];
                if(discrete){
                    for(var l=0;l<numDataValues;++l){
                        var dataValue=dataValues[l],
                            m=data.findNextIndex(start,"title",dataValue,end);
                        if(m!=-1){
                            labelXs.push(Math.round(offset+(m-start)*spacing));
                            labels.push(labelDataPairs[l].label);
                        }
                    }
                }else{
                    for(var l=0;l<numDataValues;++l){
                        var dataValue=dataValues[l];
                        if(!(dataValue<lowValue||dataValue>highValue)){
                            labelXs.push(this._getXCoord(dataValue,lowValue,highValue,logScale,context));
                            labels.push(labelDataPairs[l].label);
                        }
                    }
                }
                this.drawDataLabels(labelXs,labels,true,rotateLabels);
            }
        }
    }
}
,isc.A.getBasePoints=function isc_FacetChart_getBasePoints(points){
    var rect=this.getChartRect(),
        y=rect.top+rect.height,
        basePoints=[[points[0][0],y],[points[points.length-1][0],y]];
    return basePoints;
}
,isc.A.addValues=function isc_FacetChart_addValues(values1,values2){
    if(values2==null)return values1;
    if(values1==null)return values2;
    var totals=new Array(values1.length);
    for(var i=values1.length;i--;){
        var v1=values1[i],
            v2=values2[i];
        totals[i]=(isc.isA.Number(v1)?v1:0)+(isc.isA.Number(v2)?v2:0);
    }
    return totals;
}
,isc.A.drawPoints=function isc_FacetChart_drawPoints(points,records,series,values,start,end,reverse,context){
    context=context||this;
    if(start==null||end==null){
        start=0;
        end=records.length-1;
    }
    reverse=(reverse===true);
    if(!values)values=[];
    if(this.pointSizeMetric){
        var maxPointSizeValue=this.getMaxValue(this.pointSizeMetric);
    }
    var pointSize=context.dataPointSize
    for(var i=0,len=end-start+1;i<len;i++){
        var j=reverse?len-i-1:i,
            record=records[start+i];
        if(this.pointSizeMetric){
            var maxPointSizeValue=this._getMaxPointSizeValue(false);
            var pointSizeValue=record[this.pointSizeMetric];
            pointSize=Math.max(this.minDataPointSize,
                                 Math.ceil((pointSizeValue/maxPointSizeValue)*this.maxDataPointSize));
        }
        var value=values[start+i];
        if(isc.isA.Number(value)){
            this.drawDataPoint(points[j],series,pointSize,record,value,context);
        }
    }
}
,isc.A.drawErrorBars=function isc_FacetChart_drawErrorBars(points,records,series,maxValue,rect,start,end,reverse){
    var highErrorMetric=this._getHighErrorMetric(),
        lowErrorMetric=this._getLowErrorMetric();
    if(start==null||end==null){
        start=0;
        end=records.length-1;
    }
    reverse=(reverse===true);
    var round=!this.supportsFractionalCoordinates(),
        top=rect.top,
        bottom=top+rect.height,
        color=isc.DrawPane._mutergb(this.errorBarColorMutePercent,this.getDataColor(series)),
        errorLineProperties=isc.addDefaults({
                    drawPane:this,
                    autoDraw:true,
                    lineColor:color,
                    lineWidth:1
                },this.errorLineProperties);
    for(var i=0,len=end-start+1;i<len;++i){
        var point=points[reverse?len-i-1:i],
            x=point[0],
            y=point[1],
            record=records[start+i],
            highValue=record[highErrorMetric],
            lowValue=record[lowErrorMetric];
        if(!isc.isA.Number(highValue))highValue=null;
        if(!isc.isA.Number(lowValue))lowValue=null;
        var highY=highValue!=null&&this.getYCoord(highValue),
            lowY=lowValue!=null&&this.getYCoord(lowValue);
        if(highValue==null&&lowValue==null){
            continue;
        }
        isc.DrawLine.create(errorLineProperties,{
            startLeft:x,
            startTop:(highValue!=null?highY:y),
            endLeft:x,
            endTop:(lowValue!=null?lowY:y)
        });
        var errorBarLeft=x-this.errorBarWidth/2,
            errorBarRight=x+this.errorBarWidth/2;
        if(round){
            errorBarLeft=Math.round(errorBarLeft);
            errorBarRight=Math.round(errorBarRight);
        }
        if(highValue!=null){
            isc.DrawLine.create(errorLineProperties,{
                startLeft:errorBarLeft,
                startTop:highY,
                endLeft:errorBarRight,
                endTop:highY
            });
        }
        if(lowValue!=null){
            isc.DrawLine.create(errorLineProperties,{
                startLeft:errorBarLeft,
                startTop:lowY,
                endLeft:errorBarRight,
                endTop:lowY
            });
        }
    }
}
,isc.A.drawDataLabels=function isc_FacetChart_drawDataLabels(coords,titles,vertical,rotateXLabels){
    for(var i=0;i<coords.length;i++){
        this.drawDataLabel(coords[i],titles[i],vertical,rotateXLabels);
    }
}
,isc.A.getRotatedCenteringOffset=function isc_FacetChart_getRotatedCenteringOffset(labelHeight){
    if(this.drawingType=="vml"){
        return-Math.floor(labelHeight/2);
    }else{
        return Math.floor(labelHeight/2);
    }
}
,isc.A.drawDataLabel=function isc_FacetChart_drawDataLabel(coord,title,vertical,rotateXLabels){
    rotateXLabels=(rotateXLabels==null?this._canRotateLabels():rotateXLabels===true);
    if(vertical==null)vertical=true;
    var labelHeight=this.getDataLabelHeight();
    if(vertical){
        var labelDims=this.measureLabel(title,this.dataLabelProperties),
            labelTop,labelLeft,
            dontFixVMLRotation,
            drawLabel=true;
        if(!this.showInlineLabels){
            labelTop=this.getChartTop()+this.getChartHeight()+this.chartRectMargin;
            labelLeft=coord;
            if(rotateXLabels){
                labelLeft+=this.getRotatedCenteringOffset(labelHeight);
                drawLabel=labelLeft+labelHeight<=this.getWidth();
            }else{
                labelLeft-=labelDims.width/2;
                drawLabel=labelLeft+labelDims.width<=this.getInnerContentWidth();
            }
            dontFixVMLRotation=true;
        }else{
            rotateXLabels=false;
            labelTop=this.getChartTop()+this.getChartHeight()
                -this._inlineLabelYOffset-labelDims.height;
            labelLeft=coord+this._inlineLabelXOffset;
            drawLabel=labelLeft+labelDims.width<this.getChartLeft()+this.getChartWidth();
        }
        drawLabel=drawLabel&&0<=labelLeft;
        if(drawLabel){
            this.drawLabel(labelLeft,labelTop,title,this.dataLabelProperties,rotateXLabels,dontFixVMLRotation);
        }
    }else{
        var labelHeight=this.getDataLabelHeight();
        this.drawLabel(this.getAxisLabelSpace(true),
                       coord-Math.round(labelHeight/2),title,this.dataLabelProperties);
    }
}
,isc.A._calculateBarLayout=function isc_FacetChart__calculateBarLayout(context,data,dataLength,axisLength,axisOffset,ret){
    var stacked=context.isMultiFacet()&&this.isStacked(context);
    var clustered=context.isMultiFacet()&&!this.isStacked(context);
    var startMargin=this.dataMargin;
    var segmentCount=context.isMultiFacet()?data[0].series.length:1;
    var barsPerCluster=segmentCount;
    var numClusters=dataLength;
    var totalBars=clustered?numClusters*barsPerCluster:dataLength;
    var availableSpace=axisLength-(2*startMargin);
    var clusterMargin=!clustered?this.barMargin:
            Math.min(50,Math.round(this.barMargin*this.clusterMarginRatio));
    var totalMargin=(totalBars*this.barMargin)+
            (clustered?numClusters*clusterMargin:0);
    var availableBarSpace=Math.max(0,availableSpace-totalMargin);
    var barThickness=Math.floor(availableBarSpace/totalBars);
    if(barThickness<this.minBarThickness){
        barThickness=this.minBarThickness;
    }else if(barThickness>this.maxBarThickness){
        barThickness=this.maxBarThickness;
    }
    var clusterSize=clustered?((barThickness+this.barMargin)*barsPerCluster-this.barMargin)
                                :barThickness;
    var clusterGap=dataLength<2?0:
                       Math.round((availableSpace-(dataLength*clusterSize))/(dataLength-1));
    var clusterBarMargin;
    if(clustered){
        var clusterMarginRatio=Math.max(0,this.clusterMarginRatio);
        if(barsPerCluster>1&&dataLength>1){
            var m=-dataLength*(barsPerCluster-1)/(dataLength-1),
                b=(availableSpace-dataLength*barThickness*barsPerCluster)/(dataLength-1);
            clusterBarMargin=Math.max(0,b/(clusterMarginRatio-m));
            if(Math.abs(Math.floor(clusterBarMargin)*(clusterMarginRatio-m)-b)<
                Math.abs(Math.ceil(clusterBarMargin)*(clusterMarginRatio-m)-b))
            {
                clusterBarMargin=Math.floor(clusterBarMargin);
            }else{
                clusterBarMargin=Math.ceil(clusterBarMargin);
            }
        }else if(barsPerCluster<=1){
            clusterBarMargin=0;
        }else{
            clusterBarMargin=this.barMargin;
        }
        clusterSize=(barThickness+clusterBarMargin)*barsPerCluster-clusterBarMargin;
        clusterGap=dataLength<2?0:
                    Math.round((availableSpace-(dataLength*clusterSize))/(dataLength-1));
    }
    var barOffset=clusterSize+clusterGap;
    var extraSpace=availableSpace-(clusterSize*dataLength)
                                    -(clusterGap*(dataLength-1));
    startMargin+=Math.round(extraSpace/2);
    if(this.logIsDebugEnabled("chartDraw")&&context==this){
        this.logDebug("availableSpace: "+availableSpace+
                     ", availableBarSpace: "+availableBarSpace+
                     ", bars per cluster: "+barsPerCluster+
                     ", final gap between clusters/bars: "+clusterGap+
                     ", final within-cluster bar margin: "+clusterBarMargin+
                     ", barThickness: "+barThickness+
                     ", extraSpace: "+barThickness,"chartDraw");
    }
    clusterMargin=stacked?0:clusterMargin;
    var startOffset=axisOffset+startMargin;
    ret=ret||{};
    ret.barThickness=barThickness;
    ret.clusterSize=clusterSize;
    ret.clusterBarMargin=clusterBarMargin;
    ret.barOffset=barOffset;
    ret.clusterGap=clusterGap;
    ret.startOffset=startOffset;
    ret.startMargin=startMargin;
    return ret;
}
,isc.A._getBarBaseValue=function isc_FacetChart__getBarBaseValue(context){
    var minGradation=this._getMinGradation(context)||0,
        maxGradation=this.getMaxGradation(context)||0;
    return(minGradation<=0&&maxGradation>=0?0:
        (Math.abs(minGradation)<=Math.abs(maxGradation)?minGradation:maxGradation));
}
,isc.A.drawBars=function isc_FacetChart_drawBars(labelDataPairs,rotateLabels,rect,maxValue,data,context){
    context=context||this;
    rotateLabels=(rotateLabels===true);
    rect=rect||this.getChartRect();
    data=data||this.getOrderedData();
    maxValue=maxValue||this.getMaxGradation(context);
    var range=this._getZoomValueRange(),
        start=range[0].index,end=range[1].index,dataLength=end-start+1;
    var stacked=context.isMultiFacet()&&this.isStacked(context);
    var clustered=context.isMultiFacet()&&!this.isStacked(context);
    var vertical=(context.chartType=="Column");
    var layout=this._calculateBarLayout(
            context,data,dataLength,
            (vertical?rect.width:rect.height),
            (vertical?rect.left:rect.top)),
        barThickness=layout.barThickness,
        clusterSize=layout.clusterSize,
        clusterBarMargin=layout.clusterBarMargin,
        barOffset=layout.barOffset,
        startOffset=layout.startOffset,
        startMargin=layout.startMargin;
    var baseValue=this._getBarBaseValue(context);
    if(this._hasExtraAxes()){
        var halfCluster=clusterSize/2;
        this._extraAxisStartMargin=startMargin+halfCluster;
    }
    var isExtraAxisChart=(context!=this),
        extraAxisMetric;
    if(isExtraAxisChart){
        extraAxisMetric=context._metric;
    }
    if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
        for(var i=start;i<=end;i++){
            var runningTotal=0,
                firstBar=true;
            for(var j=0;j<data[i].series.length;j++){
                var barStart=startOffset+((i-start)*barOffset);
                if(clustered)barStart+=(j*(barThickness+clusterBarMargin));
                var currBar=data[i].series[j],
                    currBarValue=(isExtraAxisChart?currBar.record[extraAxisMetric]:currBar.value),
                    badValue=!isc.isA.Number(currBarValue),
                    barBase=this.getValueCoord(
                        (firstBar||clustered?baseValue:runningTotal),vertical,context),
                    barLength=(badValue?0:this.getValueCoord(runningTotal+currBarValue,vertical,context)-barBase),
                    item=null;
                if(!badValue){
                    firstBar=false;
                    if(stacked)runningTotal+=currBarValue;
                    var barProps=isc.shallowClone(this.barProperties);
                    if(!this.useAutoGradients){
                        barProps.fillColor=this._getDataColor(j,context);
                    }else{
                        barProps.fillGradient=this._getDataGradient(j,null,null,context);
                    }
                    item=this.drawBar(vertical,barStart,barBase,barThickness,barLength,barProps);
                }
                currBar=this._getDrawnValue(context,i,j);
                if(vertical){
                    currBar.drawnX=barStart+barThickness/2;
                    currBar.drawnY=barBase+barLength;
                }else{
                    currBar.drawnY=barStart+barThickness/2;
                    currBar.drawnX=barBase+barLength;
                }
                currBar.barThickness=barThickness;
                currBar.drawItemId=item&&item.ID;
                currBar.value=currBarValue;
            }
            if(context==this){
                var usePairs=(labelDataPairs!=null),
                    pairIndex=usePairs&&labelDataPairs.findIndex("dataValue",data[i].title);
                if(!usePairs||pairIndex!=-1){
                    var barStart=startOffset+((i-start)*barOffset),
                        labelOffset=barStart+Math.floor(clusterSize/2),
                        label=(usePairs?labelDataPairs[pairIndex].label:data[i].title);
                    this.drawDataLabel(labelOffset,label,vertical,rotateLabels);
                }
            }
        }
    }else{
        var records,seriesIndex=null;
        if(isExtraAxisChart){
            if(this.isMultiFacet()){
                var fixedFacetValue=this._getFixedFacetValue(context);
                seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                records=data.getProperty("series").getProperty(seriesIndex).getProperty("record");
            }else{
                records=data.getProperty("record");
            }
        }
        var barBase=this.getValueCoord(baseValue,vertical,context);
        for(var i=start;i<=end;i++){
            var barStart=((i-start)*barOffset)+startOffset,
                value=(isExtraAxisChart?records[i][extraAxisMetric]:data[i].value),
                badValue=!isc.isA.Number(value),
                barLength=(badValue?0:this.getValueCoord(value,vertical,context)-barBase),
                item=null;
            if(!badValue){
                var barProps=isc.shallowClone(this.barProperties);
                if(!this.useAutoGradients){
                    barProps.fillColor=this._getDataColor(i,context);
                }else{
                    barProps.fillGradient=this._getDataGradient(i,null,null,context);
                }
                item=this.drawBar(vertical,barStart,barBase,barThickness,barLength,barProps);
            }
            var currBar=this._getDrawnValue(context,i,seriesIndex);
            if(vertical){
                currBar.drawnX=barStart+barThickness/2;
                currBar.drawnY=barBase+barLength;
            }else{
                currBar.drawnY=barStart+barThickness/2;
                currBar.drawnX=barBase+barLength;
            }
            currBar.barThickness=barThickness;
            currBar.drawItemId=item&&item.ID;
            if(context==this){
                var usePairs=(labelDataPairs!=null),
                    pairIndex=usePairs&&labelDataPairs.findIndex("dataValue",data[i].title);
                if(!usePairs||pairIndex!=-1){
                    var labelOffset=Math.round(barStart+(barThickness/2)),
                        label=(usePairs?labelDataPairs[pairIndex].label:data[i].title);
                    this.drawDataLabel(labelOffset,label,vertical,rotateLabels);
                }
            }
        }
    }
}
,isc.A._getShowDataValues=function isc_FacetChart__getShowDataValues(context){
    context=context||this;
    var showDataValues=context.chartType!="Scatter"&&context.showDataValues
            &&!(!context._showDataValues&&context._showValueOnHover);
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings(),
            numAxes=1+settings.all.length;
        for(var j=0;showDataValues&&j<numAxes;++j){
            var c=(j==0?this:settings.all[j-1]);
            if(c==context){
                break;
            }else{
                showDataValues=!(c.showDataValues&&!(!c._showDataValues&&c._showValueOnHover));
            }
        }
    }
    return showDataValues;
}
,isc.A._getShowValueOnHover=function isc_FacetChart__getShowValueOnHover(context){
    context=context||this;
    return context.chartType!="Scatter"&&
            !this._getShowDataValues(context)&&
            (context.showValueOnHover||
            (context.showValueOnHover!==false&&
            context.showDataValues&&
            !(context._showDataValues&&!context._showValueOnHover)));
}
,isc.A._getShowValueOnHoverContext=function isc_FacetChart__getShowValueOnHoverContext(){
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all,
            numAxes=1+settings.length;
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings[j-1]);
            if(this._getShowValueOnHover(context)){
                return context;
            }
        }
    }else if(this._getShowValueOnHover()){
        return this;
    }
    return null;
}
,isc.A._drawDataValueLabels=function isc_FacetChart__drawDataValueLabels(data,context){
    context=context||this;
    if(this._getShowDataValues(context)){
        var cache={},
            isExtraAxisChart=(context!=this),
            contextIsMultiFacet=context.isMultiFacet(),
            extraAxisMetric,
            records,
            seriesIndex;
        if(isExtraAxisChart){
            extraAxisMetric=context._metric;
            if(!contextIsMultiFacet){
                if(this.isMultiFacet()){
                    var fixedFacetValue=this._getFixedFacetValue(context);
                    seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                    records=data.getProperty("series").getProperty(seriesIndex).getProperty("record");
                }else{
                    records=data.getProperty("record");
                }
            }
        }
        switch(context.chartType){
            case"Area":
            case"Line":
                if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
                    var maxWidth=0;
                    for(var i=0;i<data.length;i++){
                        var prevWidth=maxWidth;
                        maxWidth=0;
                        for(var j=0;j<data[i].series.length;j++){
                            var dataObj=data[i].series[j],
                                value=isExtraAxisChart?dataObj.record[extraAxisMetric]:dataObj.value;
                            if(!isc.isA.Number(value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,value);
                            maxWidth=Math.max(maxWidth,labelSize.width);
                            if(prevWidth>0){
                                var dx=this._getDrawnValue(context,i,j).drawnX
                                    -this._getDrawnValue(context,i-1,0).drawnX
                                    -prevWidth;
                                if(dx<20){
                                    context._showValueOnHover=true;
                                    delete context._showDataValues;
                                    return;
                                }
                            }
                            for(var k=j+1;k<data[i].series.length;k++){
                                var dataObj=data[i].series[k],
                                    value=isExtraAxisChart?dataObj.record[extraAxisMetric]:dataObj.value;
                                if(!isc.isA.Number(value))continue;
                                var dy=Math.abs(this._getDrawnValue(context,i,k).drawnY
                                        -this._getDrawnValue(context,i,j).drawnY);
                                dy-=labelSize.height;
                                if(dy<5){
                                    context._showValueOnHover=true;
                                    delete context._showDataValues;
                                    return;
                                }
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                var drawnValue=this._getDrawnValue(context,i,j);
                                this._drawDataValueLabelForPoint(drawnValue.drawnX,
                                    drawnValue.drawnY,label);
                            }
                        }
                    }
                }else{
                    var k=!contextIsMultiFacet?seriesIndex:null;
                    for(var j=1;j<data.length;j++){
                        var value=isExtraAxisChart?records[j][extraAxisMetric]:data[j].value;
                        if(!isc.isA.Number(value))continue;
                        var labelSize=this._getHoverLabel(cache,j-1,null,context,
                                isExtraAxisChart?records[j-1][extraAxisMetric]:data[j-1].value);
                        var dx=this._getDrawnValue(context,j,k).drawnX
                            -this._getDrawnValue(context,j-1,k).drawnX
                            -labelSize.width;
                        if(dx<20){
                            context._showValueOnHover=true;
                            delete context._showDataValues;
                            return;
                        }
                    }
                    this._getHoverLabel(cache,data.length-1,null,context,
                                        isExtraAxisChart?records[data.length-1][extraAxisMetric]
                                        :data[data.length-1].value);
                    for(var j=0;j<data.length;j++){
                        var label=this._getHoverLabel(cache,j);
                        if(label!=null){
                            var drawnValue=this._getDrawnValue(context,j,k);
                            this._drawDataValueLabelForPoint(drawnValue.drawnX,drawnValue.drawnY,label);
                        }
                    }
                }
                break;
            case"Radar":
                if(this.isMultiFacet()){
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            if(!isc.isA.Number(data[i].series[j].value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,data[i].series[j].value);
                            var labelDiag=Math.sqrt(labelSize.width*labelSize.width+labelSize.height*labelSize.height);
                            for(var i2=i;i2<data.length;i2++){
                                for(var j2=(i2==i)?j+1:0;j2<data[i2].series.length;j2++){
                                    if(!isc.isA.Number(data[i2].series[j2].value))continue;
                                    var labelSize2=this._getHoverLabel(cache,i2,j2,context,data[i2].series[j2].value);
                                    var labelDiag2=Math.sqrt(labelSize2.width*labelSize2.width+labelSize2.height*labelSize2.height);
                                    var dx=data[i].series[j].drawnX-data[i2].series[j2].drawnX;
                                    var dy=data[i].series[j].drawnY-data[i2].series[j2].drawnY;
                                    var distance=Math.sqrt(dx*dx+dy*dy);
                                    distance-=(labelDiag+labelDiag2)/2;
                                    if(distance<=0){
                                        this._showValueOnHover=true;
                                        delete this._showDataValues;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                this._drawDataValueLabelForPoint(data[i].series[j].drawnX,
                                    data[i].series[j].drawnY,label);
                            }
                        }
                    }
                }else{
                    for(var j=0;j<data.length;j++){
                        if(!isc.isA.Number(data[j].value))continue;
                        var labelSize=this._getHoverLabel(cache,j,null,context,data[j].value);
                        var labelDiag=Math.sqrt(labelSize.width*labelSize.width+labelSize.height*labelSize.height);
                        for(var j2=j+1;j2<data.length;j2++){
                            if(!isc.isA.Number(data[j2].value))continue;
                            var labelSize2=this._getHoverLabel(cache,j2,null,context,data[j2].value);
                            var labelDiag2=Math.sqrt(labelSize2.width*labelSize2.width+labelSize2.height*labelSize2.height);
                            var dx=data[j].drawnX-data[j2].drawnX;
                            var dy=data[j].drawnY-data[j2].drawnY;
                            var distance=Math.sqrt(dx*dx+dy*dy);
                            distance-=(labelDiag+labelDiag2)/2;
                            if(distance<=0){
                                this._showValueOnHover=true;
                                delete this._showDataValues;
                                return;
                            }
                        }
                    }
                    for(var j=0;j<data.length;j++){
                        var label=this._getHoverLabel(cache,j);
                        if(label!=null){
                            this._drawDataValueLabelForPoint(data[j].drawnX,data[j].drawnY,label);
                        }
                    }
                }
                break;
            case"Bar":
            case"Column":
                if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var dataObj=data[i].series[j],
                                value=isExtraAxisChart?dataObj.record[extraAxisMetric]:dataObj.value;
                            if(!isc.isA.Number(value))continue;
                            var rect=window[this._getDrawnValue(context,i,j).drawItemId];
                            var labelSize=this._getHoverLabel(cache,i,j,context,value);
                            var dy=rect.height-labelSize.height;
                            var dx=rect.width-labelSize.width;
                            if(dy<5||dx<10){
                                context._showValueOnHover=true;
                                delete context._showDataValues;
                                return;
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                var bar=this._getDrawnValue(context,i,j);
                                this._drawDataValueLabelForBar(bar.drawnX,bar.drawnY,label,context.chartType);
                            }
                        }
                    }
                }else{
                    var k=!contextIsMultiFacet?seriesIndex:null;
                    for(var j=0;j<data.length;j++){
                        var value=isExtraAxisChart?records[j][extraAxisMetric]:data[j].value;
                        if(!isc.isA.Number(value))continue;
                        var label=this._getHoverLabel(cache,j,null,context,value),
                            bar=this._getDrawnValue(context,j,k);
                        this._drawDataValueLabelForBar(bar.drawnX,bar.drawnY,label,context.chartType);
                    }
                }
                break;
            case"Doughnut":
            case"Pie":
                var radiusStep=data[0].radiusStep;
                if(radiusStep<40){
                    this._showValueOnHover=true;
                    delete this._showDataValues;
                    return;
                }
                if(this.isMultiFacet()){
                    var labelPos=radiusStep*2/3;
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var s=data[i].series[j];
                            if(!isc.isA.Number(s.value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,s.value);
                            var rad=s.pieRadius-Math.max(labelPos,labelSize.width+15);
                            var angle=s.endAngle-s.startAngle;
                            if(angle<60){
                                var labelMaxSize=2*rad*Math.tan(angle*Math.PI/180);
                                if(labelSize.width>labelMaxSize){
                                    this._showValueOnHover=true;
                                    delete this._showDataValues;
                                    return;
                                }
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var s=data[i].series[j];
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                var rad=s.pieRadius-Math.max(labelPos,label.width+15);
                                this._drawDataValueLabelForPie(s.pieX,s.pieY,s.startAngle,s.endAngle,label,rad);
                            }
                        }
                    }
                }else{
                    var doughnutSize=(this.doughnutSize==null?0:this.doughnutSize);
                    for(var j=0;j<data.length;j++){
                        var s=data[j];
                        if(!isc.isA.Number(s.value))continue;
                        var rad=s.pieRadius/2-doughnutSize,
                            angle=s.endAngle-s.startAngle,
                            labelSize=this._getHoverLabel(cache,j,null,context,s.value);
                        if(angle<60){
                            var labelMaxSize=2*rad*Math.tan(angle*Math.PI/180);
                            if(labelSize.width>labelMaxSize){
                                this._showValueOnHover=true;
                                delete this._showDataValues;
                                return;
                            }
                        }
                    }
                    for(var j=0;j<data.length;j++){
                        var label=this._getHoverLabel(cache,j);
                        if(label!=null){
                            var s=data[j];
                            this._drawDataValueLabelForPie(s.pieX,s.pieY,s.startAngle,s.endAngle,label,data[j].pieRadius/2);
                        }
                    }
                }
                break;
        }
    }
}
);
isc.evalBoundary;isc.B.push(isc.A._drawDataValueLabelForBar=function isc_FacetChart__drawDataValueLabelForBar(left,top,label,chartType){
    if((chartType||this.chartType)=="Column"){
        left-=label.width/2;
        top-=label.height;
    }else{
        top-=label.height/2;
        left+=4;
    }
    if(left<0){
        left=0;
    }else if((left+label.width)>this.getWidth()){
        left=this.getWidth()-label.width-4;
    }
    if(top<0){
        top=0;
    }else if((top+label.height)>this.getHeight()){
        top=this.getHeight()-label.height-4;
    }
    this.drawLabel(left,top,label.text,this.hoverLabelProperties);
}
,isc.A._drawDataValueLabelForPoint=function isc_FacetChart__drawDataValueLabelForPoint(drawnX,drawnY,label){
    var left=drawnX-label.width/2;
    var top=drawnY-label.height-4;
    if(left<0){
        left=0;
    }else if((left+label.width)>this.getWidth()){
        left=this.getWidth()-label.width-4;
    }
    if(top<0){
        top=0;
    }else if((top+label.height)>this.getHeight()){
        top=this.getHeight()-label.height-4;
    }
    this.drawLabel(left,top,label.text,this.hoverLabelProperties);
}
,isc.A._drawDataValueLabelForPie=function isc_FacetChart__drawDataValueLabelForPie(left,top,startAngle,endAngle,label,prevRadius){
    var angle=(startAngle+endAngle)/2+90;
    if(angle<0){
        angle+=360;
    }
    var radialCoords=this._getRadialLabelCoordinates([left,top],prevRadius||this.maxRadius,
        angle,label.value,this.hoverLabelProperties);
    left=radialCoords[0];
    top=radialCoords[1];
    if(left<0){
        left=0;
    }else if((left+label.width)>this.getWidth()){
        left=this.getWidth()-label.width-4;
    }
    if(top<0){
        top=0;
    }else if((top+label.height)>this.getHeight()){
        top=this.getHeight()-label.height-4;
    }
    this.drawLabel(left,top,label.text,this.hoverLabelProperties);
}
,isc.A.drawBar=function isc_FacetChart_drawBar(vertical,start,base,thickness,length,props){
    if(!vertical){
        return this.drawBar(!vertical,base,start,length,thickness,props);
    }
    return this.drawRect(start,length>0?base:base+length,
                                thickness,Math.abs(length),props);
}
,isc.A.drawRect=function isc_FacetChart_drawRect(left,top,width,height,props){
    var rect=isc.DrawRect.create(props,{
            autoDraw:true,
            drawPane:this,
            left:left,
            top:top,
            width:width,
            height:height
    });
    return rect;
}
,isc.A.drawDataSeriesLine=function isc_FacetChart_drawDataSeriesLine(points,seriesNum){
    this.drawDataLine(points,{lineColor:this._getDataColor(seriesNum)},this);
}
,isc.A._getDataShape=function isc_FacetChart__getDataShape(points,props,connected){
    var drawItemClass=(connected?"DrawPolygon":"DrawPath");
    var defaultProps=this.dataShapeProperties;
    if(!this.hasShadows)defaultProps.shadow=null;
    var shape=isc[drawItemClass].create(defaultProps,props,{
            drawPane:this,
            points:points,
            autoDraw:false
    });
    return shape;
}
,isc.A.drawDataShape=function isc_FacetChart_drawDataShape(points,props,connected){
    var shape=this._getDataShape(points,props,connected);
    shape.draw();
    return shape;
}
,isc.A.drawDataLine=function isc_FacetChart_drawDataLine(points,props,context){
    var smooth=(this._getDataLineType(context)=="smooth");
    if(!this.discontinuousLines){
        var cleanPoints=[];
        for(var i=0;i<points.length;i++){
            if(!isNaN(points[i][1])){
                cleanPoints.add(points[i]);
            }
        }
        this.drawDataLineSegment(cleanPoints,0,cleanPoints.length,props,context,smooth);
    }
    var lineStart=null;
    for(var i=0;i<points.length;i++){
        var point=points[i];
        if(isNaN(point[1])){
            if(lineStart!=null){
                this.drawDataLineSegment(points,lineStart,i,props,context,smooth);
                lineStart=null;
            }
        }else if(lineStart==null){
            lineStart=i;
        }
    }
    if(lineStart!=null){
        this.drawDataLineSegment(points,lineStart,points.length,props,context,smooth);
    }
}
,isc.A.drawDataLineSegment=function isc_FacetChart_drawDataLineSegment(points,startIndex,endIndex,props,context,smooth){
    context=context||this;
    var defaultProps=this.isFilled(context)?context.dataOutlineProperties:context.dataLineProperties;
    if(!this.hasShadows)defaultProps.shadow=null;
    var numPoints=endIndex-startIndex;
    if(numPoints==1){
        isc.DrawTriangle.create(defaultProps,props,{
            drawPane:this,
            points:this.getTriangleOnPoint(points[startIndex],this.singlePointMarkerSize),
            autoDraw:true,
            fillColor:(props&&props.lineColor)||defaultProps.lineColor
        });
    }else if(numPoints>0&&(!smooth||numPoints==2)){
        var dpConfig={
            drawPane:this,
            points:points.slice(startIndex,endIndex),
            autoDraw:true
        };
        if(context.chartType=="Line"||
            (context.chartType=="Area"&&!this.isFilled(context)))
        {
            dpConfig.svgFilter="isc_ds1";
        }
        return isc.DrawPath.create(defaultProps,props,dpConfig);
    }else{
        var tension=0,
            s=(1-tension)/6;
        var drawCurve;
        for(var i=startIndex;i<endIndex-1;++i){
            var pn1=points[Math.max(i-1,startIndex)],
                p0=points[i],
                p1=points[i+1],
                p2=points[Math.min(i+2,endIndex-1)];
            var alpha0=s*(p1[0]-pn1[0]),
                alpha1=s*(p2[0]-p0[0]),
                beta0=s*(p1[1]-pn1[1]),
                beta1=s*(p2[1]-p0[1]);
            drawCurve=isc.DrawCurve.create(defaultProps,props,{
                drawPane:this,
                autoDraw:true,
                startPoint:p0,
                controlPoint1:[p0[0]+alpha0,p0[1]+beta0],
                endPoint:p1,
                controlPoint2:[p1[0]-alpha1,p1[1]-beta1]
            });
        }
        return drawCurve;
    }
}
,isc.A.drawValueLine=function isc_FacetChart_drawValueLine(startPoint,endPoint,props){
    var lineProps={drawPane:this,autoDraw:true};
    if(startPoint!=null){
        lineProps.startLeft=startPoint[0];
        lineProps.startTop=startPoint[1];
    }
    if(endPoint!=null){
        lineProps.endLeft=endPoint[0];
        lineProps.endTop=endPoint[1];
    }
    isc.DrawLine.create(this.valueLineProperties,props,lineProps);
}
,isc.A.drawPieData=function isc_FacetChart_drawPieData(){
    var rect=this.getChartRect(),
        centerPoint=this.getChartCenter(),
        radius=Math.min(rect.width,rect.height)/2-(this.getChartRectLineWidth()*2),
        data=this.getOrderedData(),
        doughnutSize=(this.shouldShowDoughnut()?(radius*this.doughnutRatio):0);
    var labelHeight=20;
    if(this.isMultiFacet()){
        var numSeries=data.length;
        if(this.stacked){
            radius=this.getChartRadius();
        }
        var totalRingsRadius=radius-doughnutSize,
            radiusStep=totalRingsRadius/numSeries,
            anglePerSeries=360/numSeries;
        data[0].radiusStep=radiusStep;
        var piesPerRow=Math.ceil(Math.sqrt((rect.width/rect.height)*numSeries)),
            numRows=Math.ceil(numSeries/piesPerRow),
            lastRowPies=numSeries%piesPerRow==0?piesPerRow:numSeries%piesPerRow;
        if(lastRowPies<piesPerRow&&(numRows-1)<=(piesPerRow-1-lastRowPies)){
            piesPerRow-=1;
            lastRowPies+=(numRows-1);
        }
        var pieSpace=Math.min(rect.width/piesPerRow,rect.height/numRows),
            pieRadius=(pieSpace-labelHeight)/2,
            rowOffset=(rect.width-(piesPerRow*pieSpace))/2,
            lastRowOffset=(rect.width-(lastRowPies*pieSpace))/2;
        for(var i=0;i<numSeries;i++){
            var series=data[i].series,
                seriesTitle=data[i].title,
                values=new Array(series.length),
                total=0;
            for(var j=series.length;j--;){
                var value=series[j].value;
                if(!isc.isA.Number(value))value=0;
                values[j]=value;
                total+=value;
            }
            if(this.stacked){
                var seriesRadius=radius-(radiusStep*i);
                this.drawPieSeries(values,total,centerPoint,seriesRadius,i,(i!=0));
                var labelAngle=this.pieLabelAngleStart+(anglePerSeries*i);
                this.drawRadialLabel(centerPoint,radius+this.pieLabelLineExtent,
                                     labelAngle,seriesTitle);
                var innerPoint=isc.GraphMath.polar2screen(labelAngle,
                                                            seriesRadius-(radiusStep/2),
                                                            centerPoint,true),
                    outerPoint=isc.GraphMath.polar2screen(labelAngle,radius+this.pieLabelLineExtent,
                                                            centerPoint,true);
                this.drawValueLine(innerPoint,outerPoint,this.pieLabelLineProperties);
            }else{
                var currentRow=Math.floor(i/piesPerRow);
                var top=rect.top+(currentRow*pieSpace);
                var left=rect.left+((i%piesPerRow)*pieSpace);
                if(currentRow==numRows-1)left+=lastRowOffset;
                else left+=rowOffset;
                var pieCenter=[left+(labelHeight/2)+pieRadius,
                                 top+labelHeight+pieRadius];
                this.drawPieSeries(values,total,pieCenter,pieRadius,i);
                if(this.shouldShowDoughnut()){
                    isc.DrawOval.create({
                        shadow:this.hasShadows?{blur:5,color:"#333333",offset:[0,0]}:null
                    },this.doughnutHoleProperties,{
                        drawPane:this,
                        autoDraw:true,
                        centerPoint:pieCenter,
                        radius:pieRadius*this.doughnutRatio
                    });
                }
                var labelSize=this.measureLabel(seriesTitle,this.dataLabelProperties);
                this.drawLabel(left+(pieSpace/2)-(labelSize.width/2),
                               top+(labelHeight/2)-(labelSize.height/2),
                               seriesTitle,this.dataLabelProperties);
            }
        }
    }else{
        var values=new Array(data.length),
            total=0;
        for(var j=data.length;j--;){
            var value=data[j].value;
            if(!isc.isA.Number(value))value=0;
            values[j]=value;
            total+=value;
        }
        this.drawPieSeries(values,total,centerPoint,radius,0,false);
    }
    if(this.shouldShowDoughnut()&&(!this.isMultiFacet()||this.stacked)){
        isc.DrawOval.create({
            shadow:this.hasShadows?{blur:5,color:"#333333",offset:[0,0]}:null
        },this.doughnutHoleProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:doughnutSize
        });
    }
}
,isc.A.drawPieSeries=function isc_FacetChart_drawPieSeries(values,total,centerPoint,radius,dataIndex,innerRing){
    if(this.showShadows&&this.hasShadows&&!innerRing){
        isc.DrawOval.create({
            shadow:{blur:8,color:"#111111",offset:[2,2]}
        },this.pieBorderProperties,this.shadowProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius-1
        });
    }
    if(this._showValueOnHover||this._showDataValues){
        isc.DrawOval.create({
            fillColor:"#ffffff"
        },this.pieBorderProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius-1
        });
    }
    var startAngle=0;
    var orderedData=this.getOrderedData();
    for(var i=0;i<values.length;i++){
        var value=values[i],
            sectorAngle=(total!=0?360*value/total:0),
            sectorStartAngle=Math.floor(startAngle),
            sectorEndAngle=Math.ceil(startAngle+sectorAngle);
        var series=(orderedData[dataIndex].series==null?orderedData[i]:orderedData[dataIndex].series[i]);
        series.pieX=centerPoint[0];
        series.pieY=centerPoint[1];
        series.startAngle=sectorStartAngle;
        series.endAngle=sectorEndAngle;
        series.pieRadius=radius;
        if(value==0){
            continue;
        }
        var sectorConfig={
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius,
            startAngle:sectorStartAngle,
            endAngle:sectorEndAngle,
            fillColor:!this.useAutoGradients?this._getDataColor(i):null,
            fillGradient:this.useAutoGradients?this._getPieSeriesGradient(i,centerPoint,radius):null
        };
        if(this.useAutoGradients&&this.drawingType!="svg"){
            sectorConfig.svgFillGradient=this._getPieSeriesGradient(i,centerPoint,radius,false,"svg");
        }
        var sector=isc._PieSeriesSector.create(this.pieSliceProperties,sectorConfig);
        series.drawItemId=sector.ID;
        startAngle+=sectorAngle;
    }
    if(innerRing){
        isc.DrawOval.create(innerRing?this.pieRingBorderProperties:this.pieBorderProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius
        });
    }
}
,isc.A.getYAxisMetric=function isc_FacetChart_getYAxisMetric(){
    return this.yAxisMetric||this.metricFacet.values[0].id;
}
,isc.A.getXAxisMetric=function isc_FacetChart_getXAxisMetric(){
    return this.xAxisMetric||this.metricFacet.values[1].id;
}
,isc.A.getSecondGradations=function isc_FacetChart_getSecondGradations(){
    if(this._secondGradations)return this._secondGradations;
    var xMetric=this.getXAxisMetric(),
        lowErrorMetric=this._getLowErrorMetric(),
        highErrorMetric=this._getHighErrorMetric(),
        xMax=this.getMaxValue(xMetric),
        xMin=this.getMinValue(xMetric);
    if(lowErrorMetric!=null){
        xMax=Math.max(xMax,this.getMaxValue(lowErrorMetric));
        xMin=Math.min(xMin,this.getMinValue(lowErrorMetric));
    }
    if(highErrorMetric!=null){
        xMax=Math.max(xMax,this.getMaxValue(highErrorMetric));
        xMin=Math.min(xMin,this.getMinValue(highErrorMetric));
    }
    var availableWidth=Math.max(150,
                                  this.getInnerContentWidth()-(2*this.chartRectMargin)-300);
    this._secondGradations=this._getGradations(xMax,xMin,true,false,availableWidth);
    return this._secondGradations;
}
,isc.A.drawScatterData=function isc_FacetChart_drawScatterData(rotateXLabels){
    var xMetric=this.getXAxisMetric(),
        xMin=Math.min(0,this.getMinValue(xMetric)),
        xMax=this.getMaxValue(xMetric),
        yMin=0,
        yMax=this.getGradations().last(),
        lowErrorMetric=this._getLowErrorMetric(),
        highErrorMetric=this._getHighErrorMetric();
    if(lowErrorMetric!=null){
        yMin=Math.min(yMin,this.getMinValue(lowErrorMetric));
        yMax=Math.max(yMax,this.getMaxValue(lowErrorMetric));
    }
    if(highErrorMetric!=null){
        yMin=Math.min(yMax,this.getMinValue(highErrorMetric));
        yMax=Math.max(yMax,this.getMaxValue(highErrorMetric));
    }
    var hGradations=this.getSecondGradations();
    this.drawGradations(false,hGradations);
    if(!this.showStatisticsOverData){
        this._drawStatistics();
    }
    for(var i=0;i<hGradations.length;i++){
        var left=this._getXCoord(hGradations[i],xMin,xMax,false);
        this.drawDataLabel(left,this.formatAxisValue(hGradations[i],true),true,rotateXLabels);
    }
    var data=this.getOrderedData(),
        legendFacet=this.getLegendFacet();
    if(legendFacet==null){
        this.drawScatterSeries(data,0,xMin,xMax,yMin,yMax);
    }else{
        for(var i=0;i<legendFacet.values.length;i++){
            this.drawScatterSeries(data[i].series,i,xMin,xMax,yMin,yMax);
        }
    }
}
,isc.A.drawScatterSeries=function isc_FacetChart_drawScatterSeries(series,seriesNum,xMin,xMax,yMin,yMax){
    var rect=this.getChartRect(),
        xMetric=this.getXAxisMetric(),
        yMetric=this.getYAxisMetric(),
        points=[],
        yValues=[];
    for(var i=0;i<series.length;i++){
        var record=series[i].record,
            xValue=record[xMetric],
            yValue=record[yMetric],
            xOffset=this._getXCoord(xValue,xMin,xMax,false),
            yOffset=this.getYCoord(yValue);
        series[i].drawnX=xOffset;
        series[i].drawnY=yOffset;
        points.add([xOffset,yOffset]);
        yValues.add(yValue);
    }
    if(this.showScatterLines){
        this.drawDataSeriesLine(points,seriesNum);
    }
    this.drawPoints(points,series,seriesNum,yValues);
    if(this._getLowErrorMetric()!=null){
        this.drawErrorBars(points,series,seriesNum,yMax,rect);
    }
}
,isc.A._getProbabilityMetric=function isc_FacetChart__getProbabilityMetric(){
    var pm=this.probabilityMetric,mf=this.metricFacet;
    return(pm!=null&&mf!=null&&mf.values.findIndex("id",pm)!=-1?pm:null);
}
,isc.A._getStatCache=function isc_FacetChart__getStatCache(criteria){
    if(criteria==null){
        criteria=this.getDefaultMetric();
    }
    if(isc.isA.String(criteria)&&this.metricFacet!=null&&this.metricFacet.values.findIndex("id",criteria)!=-1){
        var metric=criteria;
        criteria={};
        criteria[this.metricFacet.id]=metric;
    }else{
        criteria={};
    }
    var facetIds=this._facetIds||(this._facetIds=this._getFacets().getProperty("id"));
    var sb=isc.StringBuffer.newInstance();
    for(var i=0,len=facetIds.length;i<len;++i){
        var facetId=facetIds[i];
        if(criteria[facetId]!=null){
            sb.append(facetId,"=",criteria[facetId].toString(),";");
        }
    }
    var cache=this._statCache||(this._statCache={}),
        key=sb.toString();
    if(cache[key]==null){
        cache[key]={
            criteria:criteria
        };
    }
    return cache[key];
}
,isc.A._getDataArray=function isc_FacetChart__getDataArray(criteria,cache){
    return(cache.data||(cache.data=this.getValue(cache.criteria,true)));
}
,isc.A._getProbabilities=function isc_FacetChart__getProbabilities(criteria,cache,probMetric){
    if(cache.probabilities!=null){
        return cache.probabilities;
    }
    criteria=cache.criteria;
    var c=isc.addProperties({},criteria);
    c[this.metricFacet.id]=probMetric;
    var probabilities=this.getValue(c,true);
    var n=probabilities.length,
    sum=0;
    for(var i=n;i--;){
        var p=probabilities[i];
        if(!(isc.isA.Number(p)&&p>=0)){
            probabilities[i]=0;
        }else{
            sum+=p;
        }
    }
    if(sum!=1){
        if(sum==0){
            var uniformProbability=1/n;
            for(var i=n;i--;){
                probabilities[i]=uniformProbability;
            }
        }else{
            for(var i=n;i--;){
                probabilities[i]/=sum;
            }
        }
    }
    return(cache.probabilities=probabilities);
}
,isc.A._getSortedDataIndex=function isc_FacetChart__getSortedDataIndex(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.sortedDataIndex!=null){
        return cache.sortedDataIndex;
    }else{
        var data=this._getDataArray(criteria,cache),
            index=new Array(data.length);
        for(var i=data.length;i--;){
            index[i]=i;
        }
        index.sort(function(i,j){
            return data[i]-data[j];
        });
        return(cache.sortedDataIndex=index);
    }
}
,isc.A.getNumDataPoints=function isc_FacetChart_getNumDataPoints(criteria){
    var cache=this._getStatCache(criteria),
        data=this._getDataArray(criteria,cache);
    return data.length;
}
,isc.A.getMean=function isc_FacetChart_getMean(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.mean!=null){
        return cache.mean;
    }
    var data=this._getDataArray(criteria,cache),
        probMetric=this._getProbabilityMetric(),
        mean;
    if(probMetric==null){
        mean=isc.Chart._mean(data);
    }else{
        var probabilities=this._getProbabilities(criteria,cache,probMetric);
        mean=0;
        for(var i=data.length;i--;){
            mean+=data[i]*probabilities[i];
        }
    }
    return(cache.mean=mean);
}
,isc.A._numberSortOrder=function isc_FacetChart__numberSortOrder(a,b){return a-b;}
,isc.A.getMedian=function isc_FacetChart_getMedian(criteria){
    return this.getPercentile(criteria,50);
}
,isc.A.getPercentile=function isc_FacetChart_getPercentile(criteria,percentile){
    if(!isc.isA.Number(percentile)){
        return null;
    }
    percentile=Math.max(0,Math.min(100,percentile));
    var statCacheKey="percentile("+percentile+")";
    percentile/=100;
    var cache=this._getStatCache(criteria);
    if(cache[statCacheKey]!=null){
        return cache[statCacheKey];
    }
    var data=this._getDataArray(criteria,cache),
        probMetric=this._getProbabilityMetric(),
        len=data.length;
    var i,j,valuei,valuej;
    if(probMetric==null){
        var sortedData=cache.sortedData||(cache.sortedData=data.sort(this._numberSortOrder));
        i=Math.floor(percentile*(len-1));
        j=Math.ceil(percentile*(len-1));
        valuei=sortedData[i];
        valuej=sortedData[j];
    }else{
        var index=this._getSortedDataIndex(criteria),
            probabilities=this._getProbabilities(criteria,cache,probMetric),
            sum=0;
        for(j=0;j<len&&sum<percentile;++j){
            sum+=probabilities[index[j]];
        }
        --j;
        valuej=data[index[j]];
        for(i=j;i<len&&probabilities[index[i]]==0;){
            ++i;
        }
        if(i==len)--i;
        for(sum=1-sum;i>=0&&sum<1-percentile;--i){
            sum+=probabilities[index[i]];
        }
        ++i;
        valuei=data[index[i]];
    }
    return(cache[statCacheKey]=(valuei+valuej)/2);
}
,isc.A.getRange=function isc_FacetChart_getRange(criteria){
    var max=this.getMax(criteria),
        min=this.getMin(criteria);
    return(max==null||min==null?null:max-min);
}
,isc.A.getStdDev=function isc_FacetChart_getStdDev(criteria,population){
    return Math.sqrt(this.getVariance(criteria,population));
}
,isc.A.getVariance=function isc_FacetChart_getVariance(criteria,population){
    var cache=this._getStatCache(criteria),
        thisStat=(population?"population":"sample")+"Variance",
        otherStat=(!population?"population":"sample")+"Variance";
    if(cache[thisStat]!=null){
        return cache[thisStat];
    }else if(cache[otherStat]!=null){
        var n=cache.data.length;
        return(cache[thisStat]=cache[otherStat]*(population?(n-1)/n:n/(n-1)));
    }
    var data=this._getDataArray(criteria,cache),
        probMetric=this._getProbabilityMetric(),
        mean=this.getMean(criteria),
        n=data.length,
        variance;
    if(probMetric==null){
        variance=isc.Chart._variance(data,population,mean);
    }else{
        var probabilities=this._getProbabilities(criteria,cache,probMetric);
        var meanSq=0;
        for(var i=data.length;i--;){
            var t=data[i];
            meanSq+=t*t*probabilities[i];
        }
        variance=meanSq-mean*mean;
        if(!population){
            variance*=n/(n-1);
        }
    }
    return(cache[thisStat]=variance);
}
,isc.A.getMax=function isc_FacetChart_getMax(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.max!=null){
        return cache.max;
    }else if(cache.sortedData!=null){
        return(cache.max=cache.sortedData.last());
    }else{
        var data=this._getDataArray(criteria,cache);
        return(cache.max=data.max());
    }
}
,isc.A.getMin=function isc_FacetChart_getMin(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.min!=null){
        return cache.min;
    }else if(cache.sortedData!=null){
        return(cache.min=cache.sortedData.first());
    }else{
        var data=this._getDataArray(criteria,cache);
        return(cache.min=data.min());
    }
}
,isc.A.setRegressionLineType=function isc_FacetChart_setRegressionLineType(regressionLineType){
    var valid=(regressionLineType=="line"||regressionLineType=="polynomial");
    if(valid){
        var changed=(regressionLineType!=this.regressionLineType);
        this.regressionLineType=regressionLineType;
        if(changed&&this.showRegressionLine&&this.regressionPolynomialDegree!=1){
            this._redrawFacetChart(false);
        }
    }
}
,isc.A.setShowRegressionLine=function isc_FacetChart_setShowRegressionLine(showRegressionLine){
    var changed=(showRegressionLine!=this.showRegressionLine);
    this.showRegressionLine=showRegressionLine;
    if(changed){
        this._redrawFacetChart(false);
    }
}
,isc.A.setRegressionPolynomialDegree=function isc_FacetChart_setRegressionPolynomialDegree(regressionPolynomialDegree){
    var valid=this._isDegreeValid(regressionPolynomialDegree);
    if(valid){
        var changed=(regressionPolynomialDegree!=this.regressionPolynomialDegree);
        this.regressionPolynomialDegree=regressionPolynomialDegree;
        if(changed&&this.showRegressionLine&&this.regressionLineType=="polynomial"){
            this._redrawFacetChart(false);
        }
    }
}
,isc.A._isDegreeValid=function isc_FacetChart__isDegreeValid(degree){
    return(isc.isA.Number(degree)&&degree>0&&degree==Math.round(degree));
}
);
isc.evalBoundary;isc.B.push(isc.A.getSimpleLinearRegressionFunction=function isc_FacetChart_getSimpleLinearRegressionFunction(xMetric,yMetric){
    return this.getPolynomialRegressionFunction(
            1,xMetric,yMetric,"FacetChart.getSimpleLinearRegressionFunction()");
}
,isc.A._validatePolynomialDegree=function isc_FacetChart__validatePolynomialDegree(degree){
    return isc.isA.Number(degree)&&degree>0&&Math.round(degree)===degree;
}
,isc.A.getPolynomialRegressionFunction=function isc_FacetChart_getPolynomialRegressionFunction(degree,xMetric,yMetric,callee){
    callee=isc.isA.String(callee)?callee:"FacetChart.getPolynomialRegressionFunction()";
    if(!this._validatePolynomialDegree(degree)){
        if(degree!=null){
            this.logWarn("Invalid degree argument passed to "+callee+".  "+
                "The degree must be a positive integer.");
        }
        degree=this.regressionPolynomialDegree;
        if(!this._validatePolynomialDegree(degree)){
            this.logWarn("The regressionPolynomialDegree property of the FacetChart is invalid.  "+
                "The degree must be a positive integer.");
            return null;
        }
    }
    var metricFacetId=this.metricFacet.id,
        xfv,yfv;
    if(!(isc.isA.String(xMetric)&&(xfv=this.getFacetValue(metricFacetId,xMetric)))){
        if(xMetric!=null){
            this.logWarn("Invalid xMetric argument passed to "+callee+".  "+
                "The xMetric must be the String ID of a metric facet value.");
        }
        xMetric=this.getXAxisMetric();
        if(!(isc.isA.String(xMetric)&&(xfv=this.getFacetValue(metricFacetId,xMetric)))){
            this.logWarn("Could not find an x-axis metric defined for the FacetChart.");
            return null;
        }
    }
    if(!(isc.isA.String(yMetric)&&(yfv=this.getFacetValue(metricFacetId,yMetric)))){
        if(yMetric!=null){
            this.logWarn("Invalid yMetric argument passed to "+callee+".  "+
                "The yMetric must be the String ID of a metric facet value.");
        }
        yMetric=this.getYAxisMetric();
        if(!(isc.isA.String(yMetric)&&(yfv=this.getFacetValue(metricFacetId,yMetric)))){
            this.logWarn("Could not find a y-axis metric defined for the FacetChart.");
            return null;
        }
    }
    var xCriteria={},yCriteria={};
    xCriteria[metricFacetId]=xfv.id;
    yCriteria[metricFacetId]=yfv.id;
    return isc.FacetChart._calculateBestFitPolynomial(degree,
            this.getValue(xCriteria,true),
            this.getValue(yCriteria,true));
}
,isc.A._drawStatistics=function isc_FacetChart__drawStatistics(criteria,vertical){
    if(this.isPieChart()){
        return;
    }
    if(this.isMultiFacet()&&this.isStacked()){
        return;
    }
    var radar=this.chartType=="Radar";
    var m;
    if(criteria&&this.metricFacet&&
        criteria[this.metricFacet.id]&&
        this.metricFacet.findIndex("id",criteria[this.metricFacet.id])!=-1)
    {
        m=criteria[this.metricFacet.id];
    }else{
        m=this.getDefaultMetric();
    }
    if(vertical==null){
        if(this.chartType=="Scatter"){
            if(m==this.getXAxisMetric())vertical=false;
            else if(m==this.getYAxisMetric())vertical=true;
        }else if(radar){
            if(m==this.valueProperty)vertical=false;
        }else if(this.hasXGradations()){
            if(m==this.valueProperty)vertical=false;
        }else if(this.hasYGradations()){
            if(m==this.valueProperty)vertical=true;
        }
    }
    if(vertical==null){
        return;
    }
    var chartRect=this.getChartRect();
    var top=chartRect.top,
        left=chartRect.left,
        width=chartRect.width,
        height=chartRect.height,
        bottom=top+height,
        right=left+width;
    var center,maxRadius;
    if(radar){
        center=this.getChartCenter();
        maxRadius=this.getChartRadius();
    }
    var xMin,xMax;
    if(this.chartType=="Scatter"){
        var xMetric=this.getXAxisMetric();
        xMin=Math.min(0,this.getMinValue(xMetric));
        xMax=this.getMaxValue(xMetric);
    }
    if(radar&&vertical){
        return;
    }
    var showExpectedValueLine=this.showExpectedValueLine,
        showStandardDeviationLines=this.showStandardDeviationLines&&isc.isAn.Array(this.standardDeviations),
        meanValue=this.getMean(criteria),
        stdDevValue=this.getStdDev(criteria);
    if(showStandardDeviationLines){
        var stdDevs=this.standardDeviations,
            numStdDevs=stdDevs.length,
            symmetric=this.useSymmetricStandardDeviations,
            bandPropsList=this.standardDeviationBandProperties;
        if(symmetric){
            stdDevs=stdDevs.map(Math.abs);
            var hasZero=(stdDevs.first()===0),
                offset=hasZero?1:0,
                bandPropsListLen=numStdDevs-offset,
                fullStdDevsLen=2*(numStdDevs-offset)+offset,
                fullStdDevs=new Array(fullStdDevsLen),
                fullBandPropsListLen=2*bandPropsListLen-1,
                fullBandPropsList=new Array(fullBandPropsListLen);
            for(var i=numStdDevs-offset;i--;){
                var j=i+offset;
                fullStdDevs[j]=-(fullStdDevs[fullStdDevsLen-1-j]=stdDevs[numStdDevs-1-i]);
                fullBandPropsList[i]=fullBandPropsList[fullBandPropsListLen-1-i]=bandPropsList[bandPropsListLen-1-i];
            }
            if(hasZero){
                fullStdDevs[numStdDevs]=0;
            }
            numStdDevs=fullStdDevsLen;
            stdDevs=fullStdDevs;
            bandPropsList=fullBandPropsList;
        }
        if(this.bandedStandardDeviations&&!radar&&numStdDevs>1){
            var prevValue,
                value=meanValue+stdDevValue*stdDevs[0],
                prevCoord,
                coord;
            if(vertical){
                coord=this.getYCoord(value);
                coord=Math.max(top,Math.min(bottom,coord));
            }else{
                coord=this._getXCoord(value,xMin,xMax);
                coord=Math.max(left,Math.min(right,coord));
            }
            for(var i=1;i<numStdDevs;++i){
                prevValue=value;
                value=meanValue+stdDevValue*stdDevs[i];
                prevCoord=coord;
                var t=top,l=left,w=width,h=height;
                if(vertical){
                    coord=this.getYCoord(value);
                    coord=Math.max(top,Math.min(bottom,coord));
                    t=prevCoord;
                    h=coord-t;
                }else{
                    coord=this._getXCoord(value,xMin,xMax);
                    coord=Math.max(left,Math.min(right,coord));
                    l=prevCoord;
                    w=coord-l;
                }
                var bandProps=bandPropsList[i-1];
                if(bandProps==null){
                    continue;
                }
                this.addDrawItem(isc.DrawRect.create(bandProps,{
                    autoDraw:true,
                    top:t,
                    left:l,
                    width:w,
                    height:h
                }));
            }
        }
        for(var i=0;i<numStdDevs;++i){
            var stdDev=stdDevs[i],value=meanValue+stdDevValue*stdDev;
            if(stdDev==0&&showExpectedValueLine){
                continue;
            }
            if(radar&&!vertical){
                var ratio=this.getValueRatio(value);
                if(!(ratio<0||ratio>1)){
                    this.addDrawItem(isc.DrawOval.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        centerPoint:center,
                        radius:ratio*maxRadius
                    }));
                }
            }else if(vertical){
                var y=this.getYCoord(value);
                if(!(y<top||y>bottom)){
                    this.addDrawItem(isc.DrawLine.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        startLeft:left,
                        startTop:y,
                        endLeft:right,
                        endTop:y
                    }));
                }
            }else{
                var x=this._getXCoord(value,xMin,xMax);
                if(!(y<left||y>right)){
                    this.addDrawItem(isc.DrawLine.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        startLeft:x,
                        startTop:top,
                        endLeft:x,
                        endTop:bottom
                    }));
                }
            }
        }
    }
    if(showExpectedValueLine){
        if(radar&&!vertical){
            var ratio=this.getValueRatio(meanValue);
            if(!(ratio<0||ratio>1)){
                this.addDrawItem(isc.DrawOval.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    centerPoint:center,
                    radius:ratio*maxRadius
                }));
            }
        }else if(vertical){
            var y=this.getYCoord(meanValue);
            if(!(y<top||y>bottom)){
                this.addDrawItem(isc.DrawLine.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    startLeft:left,
                    startTop:y,
                    endLeft:right,
                    endTop:y
                }));
            }
        }else{
            var x=this._getXCoord(meanValue,xMin,xMax);
            if(!(x<left||x>right)){
                this.addDrawItem(isc.DrawLine.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    startLeft:x,
                    startTop:top,
                    endLeft:x,
                    endTop:bottom
                }));
            }
        }
    }
    this._drawRegressionCurves();
}
,isc.A._drawRegressionCurves=function isc_FacetChart__drawRegressionCurves(){
    if(this.chartType!="Scatter"){
        return;
    }else if(this.showRegressionLine){
        if(this.regressionLineType=="line"){
            var line=this.getSimpleLinearRegressionFunction();
            if(line!=null){
                this._drawPolynomial(line,1,this.regressionLineProperties);
            }
        }else if(this.regressionLineType=="polynomial"){
            var degree=this.regressionPolynomialDegree,
                polynomial=this.getPolynomialRegressionFunction(degree);
            if(polynomial!=null){
                this._drawPolynomial(polynomial,degree,this.regressionLineProperties);
            }
        }
    }
}
,isc.A._drawPolynomial=function isc_FacetChart__drawPolynomial(polynomial,degree,lineProps){
    var chartRect=this.getChartRect(),
        secondGradations=this.getSecondGradations(),
        xMin=secondGradations.first(),
        xMax=secondGradations.last(),
        xRange=xMax-xMin,
        gradations=this.getGradations(),
        yMin=gradations.first(),
        yMax=gradations.last(),
        n;
    if(degree==1){
        n=2;
    }else{
        n=Math.ceil(chartRect.width/5);
    }
    var points=new Array(n);
    for(var i=n;i--;){
        var x=xMin+i*xRange/(n-1),
            xCoord=this._getXCoord(x,xMin,xMax),
            yCoord=this.getYCoord(polynomial(x));
        points[i]=[xCoord,yCoord];
    }
    var round=!this.supportsFractionalCoordinates(),
        drawPaths=isc.FacetChart._clipDrawPathToRect(points,chartRect,round),
        numDrawPaths=drawPaths.length;
    if(degree==1){
        var startPoint=drawPaths[0][0],
            endPoint=drawPaths[0][1];
        this.addDrawItem(isc.DrawLine.create(lineProps,{
            autoDraw:true,
            startLeft:startPoint[0],
            startTop:startPoint[1],
            endLeft:endPoint[0],
            endTop:endPoint[1]
        }));
    }else{
        for(var i=0;i<numDrawPaths;++i){
            this.addDrawItem(isc.DrawPath.create(lineProps,{
                autoDraw:true,
                points:drawPaths[i]
            }));
        }
    }
}
,isc.A.drawDataPoint=function isc_FacetChart_drawDataPoint(point,series,size,record,value,context,interactivePoints){
    context=context||this;
    interactivePoints=interactivePoints!=null?interactivePoints:this.interactivePoints;
    if(isNaN(point[1]))return;
    var color=this._getDataColor(series,context),
        shape=this.pointShapes[series%this.pointShapes.length];
    size=size||context.dataPointSize;
    var shape=this["draw"+shape+"Point"](context,color,point,size);
    if(interactivePoints){
        size+=2;
        if(size<this.minKnobSize)size=this.minKnobSize;
        var knob=isc.DrawKnob.create({
            autoDraw:false,
            drawPane:this,
            _context:context,
            knobShape:shape,
            dataRecord:record,
            dataValue:value,
            x:this.getLeftPadding()+point[0],
            y:this.getTopPadding()+point[1],
            width:size,
            height:size,
            overflow:"hidden",
            border:this.showKnobs?"1px solid black":"none",
            cursor:"crosshair",
            canHover:true,
            hover:function(){
                var context=this._context;
                if(context.pointHover){
                    return context.pointHover(this.dataValue,this.dataRecord,
                            this.knobShape,this);
                }
            },
            getHoverHTML:function(){
                if(context.getPointHoverHTML){
                    return context.getPointHoverHTML(this.dataValue,this.dataRecord,
                            this.knobShape,this);
                }else return null;
            },
            click:function(){
                if(context.pointClick){
                    return context.pointClick(this.dataValue,this.dataRecord,
                            this.knobShape,this);
                }
            }
        });
        this.addChild(knob);
        this.knobs=this.knobs||[];
        this.knobs.add(knob);
        return knob;
    }else{
        return shape;
    }
}
,isc.A.drawOvalPoint=function isc_FacetChart_drawOvalPoint(context,color,point,size){
    context=context||this;
    return isc.DrawOval.create({
        lineColor:color
    },context.dataPointProperties,{
        drawPane:this,
        autoDraw:true,
        centerPoint:point,
        radius:Math.round(size/2)
    });
}
,isc.A.drawSquarePoint=function isc_FacetChart_drawSquarePoint(context,color,point,size,rotation){
    context=context||this;
    return isc.DrawRect.create({
        lineColor:color
    },context.dataPointProperties,{
        drawPane:this,
        autoDraw:true,
        left:point[0]-Math.round(size/2),
        top:point[1]-Math.round(size/2),
        width:size,height:size,
        rotation:rotation
    });
}
,isc.A.drawDiamondPoint=function isc_FacetChart_drawDiamondPoint(context,color,point,size){
    return this.drawSquarePoint(context,color,point,size,45);
}
,isc.A.drawTrianglePoint=function isc_FacetChart_drawTrianglePoint(context,color,point,size,rotation){
    context=context||this;
    var points=this.getTriangleOnPoint(point,size);
    return isc.DrawTriangle.create({
        lineColor:color
    },context.dataPointProperties,{
        drawPane:this,
        autoDraw:true,
        points:points
    });
}
,isc.A.getTriangleOnPoint=function isc_FacetChart_getTriangleOnPoint(point,size){
    var points=[];
    var delta=Math.round(size/2);
    points.push([point[0]-delta,point[1]+delta]);
    points.push([point[0]+delta,point[1]+delta]);
    points.push([point[0],point[1]-delta]);
    return points;
}
,isc.A.prepareForDragging=function isc_FacetChart_prepareForDragging(){
    this.Super("prepareForDragging",arguments);
    var rect=this._chartRect;
    if(rect!=null){
        this.hoopSelectorRect=[
            this.getPageLeft()+rect.left,
            this.getPageTop()+rect.top,
            rect.width,rect.height
        ];
    }
}
,isc.A.updateHoopSelection=function isc_FacetChart_updateHoopSelection(){
}
,isc.A.drawTitle=function isc_FacetChart_drawTitle(){
    if(!this.showTitle){
        this._titleRect={left:0,top:0,width:0,height:0}
        return;
    }
    var dims=this._titleRect=this.measureLabel(this.title||" ",this.titleProperties);
    var left=Math.floor((this.getInnerContentWidth()/2)-(dims.width/2));
    this._titleElement=this.drawLabel(left,0,this.title||" ",this.titleProperties);
}
,isc.A.setTitle=function isc_FacetChart_setTitle(newTitle){
    this.title=newTitle;
    this._redrawFacetChart(false);
}
,isc.A.setShowTitle=function isc_FacetChart_setShowTitle(newSetting){
    this.showTitle=newSetting;
    this._redrawFacetChart(false);
}
,isc.A.shouldShowDataAxisLabel=function isc_FacetChart_shouldShowDataAxisLabel(){
    var dataLabelFacet=this.getDataLabelFacet();
    return!this.isPieChart()&&this.chartType!="Radar"&&
              dataLabelFacet!=null&&dataLabelFacet.title!=null&&
              (this.showDataAxisLabel!==false);
}
,isc.A.shouldShowValueAxisLabel=function isc_FacetChart_shouldShowValueAxisLabel(context){
    context=context||this;
    return(context!=this||(!this.isPieChart()&&this.chartType!="Radar"))&&
        context.valueTitle!=null&&(context.showValueAxisLabel!==false)&&
        (!this.hasYGradations(context.chartType)||this._showYGradations);
}
,isc.A.getDataAxisLabelHeight=function isc_FacetChart_getDataAxisLabelHeight(){
    if(!this.shouldShowDataAxisLabel())return 0;
    var dataLabelFacet=this.getDataLabelFacet();
    if(!dataLabelFacet)return 0;
    var labelDims=this.measureLabel(dataLabelFacet.title,this.dataAxisLabelProperties);
    return labelDims.height+this.axisLabelMargin;
}
,isc.A.getValueAxisLabelHeight=function isc_FacetChart_getValueAxisLabelHeight(context){
    context=context||this;
    if(!this.shouldShowValueAxisLabel(context))return 0;
    var labelDims=this.measureLabel(context.valueTitle,context.valueAxisLabelProperties);
    return labelDims.height+this.axisLabelMargin;
}
,isc.A.getAxisLabelSpace=function isc_FacetChart_getAxisLabelSpace(yAxis){
    if(yAxis&&this.hasYGradations()){
        return this.getValueAxisLabelHeight();
    }else{
        return this.getDataAxisLabelHeight();
    }
}
,isc.A.drawDataAxisLabel=function isc_FacetChart_drawDataAxisLabel(){
    if(!this.shouldShowDataAxisLabel())return;
    this.drawAxisLabel(this.getDataLabelFacet().title,this.dataAxisLabelProperties,
                       !this.hasYGradations(),false);
}
,isc.A.drawValueAxisLabel=function isc_FacetChart_drawValueAxisLabel(){
    if(!this.shouldShowValueAxisLabel())return;
    this.drawAxisLabel(this.valueTitle,this.valueAxisLabelProperties,this.hasYGradations(),false);
}
,isc.A._drawAllValueAxisLabels=function isc_FacetChart__drawAllValueAxisLabels(){
    if(!this._hasExtraAxes()){
        this.drawValueAxisLabel();
    }else{
        var settings=this._getExtraAxisSettings();
        if(this._hasSideValueAxisLabels()){
            this.drawValueAxisLabel();
            var context=settings.right[0];
            if(!this.shouldShowValueAxisLabel(context))return;
            context._valueAxisLabel=this.drawAxisLabel(context.valueTitle,context.valueAxisLabelProperties,true,true);
        }else{
            var top=this.getChartTop()+this.getChartHeight()+this.chartRectMargin,
                numAxes=this._getNumValueAxes();
            for(var j=0;j<numAxes;++j){
                var context=(j==0?this:settings.all[j-1]);
                if(!this.shouldShowValueAxisLabel(context)){
                    continue;
                }
                var label=context.valueTitle,
                    props=context.valueAxisLabelProperties,
                    labelDims=this.measureLabel(label,props);
                var left=this._getValueAxisLeft(context),
                    width=context._totalValueAxisWidth;
                context._valueAxisLabel=isc.DrawLabel.create(props,{
                    autoDraw:true,
                    drawPane:this,
                    left:left+Math.round((width-labelDims.width)/2),
                    top:top,
                    height:labelDims.height,
                    contents:label
                });
            }
        }
    }
}
,isc.A.drawAxisLabel=function isc_FacetChart_drawAxisLabel(label,props,yAxis,extraAxis){
    var labelDims=this.measureLabel(label,props),
        chartRect=this.getChartRect();
    if(yAxis){
        var centeringOffset=(labelDims.width/2)*(this.isVML?-1:1);
        isc.DrawLabel.create(props,{
            autoDraw:true,drawPane:this,
            left:(extraAxis?this.getInnerContentWidth()-labelDims.height:0),
            top:chartRect.top+Math.round(chartRect.height/2+centeringOffset),
            height:labelDims.height,
            rotation:270,
            contents:label
        });
    }else{
        isc.DrawLabel.create(props,{
            autoDraw:true,drawPane:this,
            left:chartRect.left+Math.round(chartRect.width/2-labelDims.width/2),
            top:chartRect.top+chartRect.height+this.getXLabelsHeight()-labelDims.height,
            contents:label
        });
    }
}
,isc.A.shouldShowLegend=function isc_FacetChart_shouldShowLegend(){
    if(this.showLegend!==false&&
        (this.isMultiFacet()||
         this.isPieChart()||
         (this.chartType=="Scatter"&&this._getFacets().length>1)||
         (this._hasExtraAxes())))this.drawLegend();
}
,isc.A.getLegendFacet=function isc_FacetChart_getLegendFacet(){
    var facets=this._getFacets(),
        isPie=this.isPieChart();
    if(this.chartType=="Scatter"){
        return facets[1];
    }else if(this.isMultiFacet()){
        return(this.reversePieFacets&&isPie?facets[0]:facets[1]);
    }else if(isPie){
        return facets[0];
    }else{
        return null;
    }
}
,isc.A.getDataLabelFacet=function isc_FacetChart_getDataLabelFacet(){
    var facets=this._getFacets();
    if(this.chartType=="Scatter"){
        return null;
    }else if(this.isPieChart()){
        if(!this.isMultiFacet()){
            return null;
        }else if(this.reversePieFacets){
            return facets[1];
        }
    }
    return facets[0];
}
,isc.A._getInlinedFacet=function isc_FacetChart__getInlinedFacet(){
    return(this._parentChart||this).inlinedFacet;
}
,isc.A.drawLegend=function isc_FacetChart_drawLegend(){
    this.logDebug("drawing legend","chartDraw");
    var swatchSize=this.legendSwatchSize;
    var legendPadding=this.legendPadding;
    var legendItemPadding=this.legendItemPadding;
    var legendTextPadding=this.legendTextPadding;
    var legendRowPadding=this.legendRowPadding;
    var hasExtraAxes=this._hasExtraAxes();
    var facet=this.getLegendFacet(),
        numLegendFacetValues=facet&&facet.values&&facet.values.getLength();
    var facetTitles=[];
    if(hasExtraAxes){
        var primaryMetricFacetValue=this.inlinedFacet&&this.inlinedFacet.values[0],
            primaryMetricTitle=primaryMetricFacetValue!=null?
                    (primaryMetricFacetValue.title||primaryMetricFacetValue.id):this.valueTitle;
        if(this.isMultiFacet()){
            for(var k=0;k<numLegendFacetValues;++k){
                var facetValue=facet.values[k];
                facetTitles.add({
                    title:primaryMetricTitle+" ("+(facetValue.title||facetValue.id)+")",
                    context:this,
                    series:k
                });
            }
        }else{
            facetTitles.add({
                title:primaryMetricTitle,
                context:this,
                series:0
            });
        }
        var settings=this._getExtraAxisSettings().all;
        for(var j=0,numExtraAxes=settings.length;j<numExtraAxes;++j){
            var metricSettings=settings[j];
            var metricFacetValue=this.getFacetValue(this.inlinedFacet.id,metricSettings._metric),
                metricTitle=(metricFacetValue.title||metricFacetValue.id);
            if(metricSettings.isMultiFacet()){
                for(var k=0;k<numLegendFacetValues;++k){
                    var facetValue=facet.values[k];
                    facetTitles.add({
                        title:metricTitle+" ("+(facetValue.title||facetValue.id)+")",
                        context:metricSettings,
                        series:k
                    });
                }
            }else{
                var title=metricTitle;
                if(this.isMultiFacet()){
                    var fixedFacetValue=this._getFixedFacetValue(metricSettings);
                    title=title+" ("+(fixedFacetValue.title||fixedFacetValue.id)+")";
                }
                facetTitles.add({
                    title:title,
                    context:metricSettings,
                    series:0
                });
            }
        }
    }else{
        if(!facet.values)return;
        for(var i=0;i<numLegendFacetValues;i++){
            var facetValue=facet.values[i];
            facetTitles.add({title:facetValue.title||facetValue.id});
        }
    }
    var availWidth=this.getInnerWidth();
    var currLeft=legendPadding;
    var numRows=1;
    for(var i=0;i<facetTitles.length;i++){
        var labelDims=this.measureLabel(facetTitles[i].title,this.legendLabelProperties);
        var currSize=swatchSize+legendTextPadding+labelDims.width;
        if(currLeft+currSize+legendPadding>availWidth){
            numRows++;
            currLeft=legendPadding;
        }
        if(i!=facetTitles.length-1){
            currSize+=legendItemPadding;
        }
        facetTitles[i].width=labelDims.width;
        facetTitles[i].height=labelDims.height;
        facetTitles[i].rowNum=numRows;
        facetTitles[i].left=currLeft;
        currLeft+=currSize;
    }
    currLeft+=legendPadding;
    var left,height,top,width;
    if(numRows>1){
        width=availWidth;
    }else{
        width=currLeft;
    }
    height=(numRows*swatchSize)+(legendPadding*2)+((numRows-1)*legendRowPadding);
    top=this.getInnerContentHeight()
            -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0)
            -height;
    if(width==availWidth)left=0;
    else left=Math.floor((availWidth/2)-(width/2));
    this._legendRect={
        left:left,
        top:top,
        width:width,
        height:height
    };
    if(this.showLegendRect){
        this.drawRect(left,top,width,height,this.legendRectProperties);
    }
    var legendLabelProperties=isc.addProperties({
        _verticalAlignMiddle:true
    },this.legendLabelProperties);
    for(i=0;i<facetTitles.length;i++){
        var labelWidth=facetTitles[i].width;
        var currLeft=left+facetTitles[i].left;
        var currRowNum=facetTitles[i].rowNum;
        var currTop=top+((swatchSize+legendRowPadding)*(currRowNum-1))
            +legendPadding;
        if(hasExtraAxes){
            this._createExtraAxisLegendSwatch(facetTitles[i].context,facetTitles[i].series,currLeft,currTop,swatchSize);
        }else{
            this.drawRect(currLeft,currTop,swatchSize,swatchSize,
                    isc.addProperties({fillColor:this._getDataColor(i)},
                            this.legendSwatchProperties));
        }
        currLeft+=swatchSize+legendTextPadding;
        this.drawLabel(currLeft,currTop+Math.round((swatchSize-this.getDataLabelHeight())/2),
                       facetTitles[i].title,legendLabelProperties);
    }
}
,isc.A.getDataColor=function isc_FacetChart_getDataColor(index,context){
    context=context||this;
    var color=context.dataColors[index%context.dataColors.length];
    return(!isc.startsWith(color,"#"))?"#"+color:color;
}
,isc.A.getDataGradient=function isc_FacetChart_getDataGradient(index,create,drawingType,context){
    context=context||this;
    create=create!==false;
    drawingType=drawingType==undefined?this.drawingType:drawingType;
    var color=context.getDataColor(index);
    var id=context.chartType+color.replace("#","-");
    var gradient;
    if(!create||!context.dataGradients[id]){
        switch(this.chartType){
            case"Bar":
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'0%',
                y2:'100%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"-#0A0A0A"),
                    offset:0.0
                },{
                    color:color,
                    offset:0.2
                },{
                    color:this.getClass().mixrgb(color,"+#333333"),
                    offset:0.4
                },{
                    color:color,
                    offset:0.7
                },{
                    color:this.getClass().mixrgb(color,"-#111111"),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Column":
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'100%',
                y2:'0%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"-#0A0A0A"),
                    offset:0.0
                },{
                    color:color,
                    offset:0.2
                },{
                    color:this.getClass().mixrgb(color,"+#333333"),
                    offset:0.4
                },{
                    color:color,
                    offset:0.7
                },{
                    color:this.getClass().mixrgb(color,"-#111111"),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Area":
            case"Line":
            gradient={
                id:id,
                x1:0,x2:0,
                y1:"0%",y2:"100%",
                colorStops:[
                     {color:this.getClass().mixrgb(color,"+#555555"),offset:0.0},
                     {color:this.getClass().mixrgb(color,"+#222222"),offset:0.3},
                     {color:this.getClass().mixrgb(color,"-#333333"),offset:1.0}
                ]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Doughnut":
            case"Pie":
            gradient={
                id:id,
                colorStops:[{
                    color:color,
                    offset:0.0
                },{
                    color:color,
                    offset:drawingType=="vml"?0.8:0.9
                },{
                    color:this.getClass().mixrgb(color,"-#222222"),
                    offset:drawingType=="vml"?0.9:0.95
                },{
                    color:this.getClass().mixrgb(color,"-#666666"),
                    offset:1.0
                }]
            };
            if(drawingType!="svg"){
                isc.addProperties(gradient,{
                    cx:0,
                    cy:0,
                    r:'72%',
                    fx:0,
                    fy:0
                });
            }
            if(create)this.createRadialGradient(id,gradient);
            break;
            default:
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'0%',
                y2:'100%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"+"+(drawingType=="vml"?"#111111":"#222222")),
                    offset:0.0
                },{
                    color:color,
                    offset:0.4
                },{
                    color:color,
                    offset:0.6
                },{
                    color:this.getClass().mixrgb(color,"-"+(drawingType=="vml"?"#111111":"#1A1A1A1A")),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
        }
    }
    if(gradient&&create)context.dataGradients[id]=gradient;
    return(create?id:gradient);
}
,isc.A._getPieSeriesGradient=function isc_FacetChart__getPieSeriesGradient(index,centerPoint,radius,create,drawingType){
    create=create!==false;
    drawingType=drawingType==undefined?this.drawingType:drawingType;
    if(drawingType!="svg")return this._getDataGradient(index,create,drawingType);
    if(this._nextSVGDefID==undefined)this._nextSVGDefID=1;
    var id="radialGradient"+(this._nextSVGDefID++);
    var radialGradient={
        id:id,
        _baseGradient:this._getDataGradient(index,create,drawingType),
        cx:centerPoint[0],
        cy:centerPoint[1],
        r:radius,
        _temporary:true
    };
    if(create){
        this.createRadialGradient(id,radialGradient);
        return id;
    }else{
        this.gradients[id]=radialGradient;
        return radialGradient;
    }
}
,isc.A.getRadarShapeGradient=function isc_FacetChart_getRadarShapeGradient(color,shape,centerPoint,isFirst){
    var shapePoints=shape.points,
        innerColor=this.getClass().mixrgb(color,"+#444444"),
        outerColor=this.getClass().mixrgb(color,"-#444444");
    var maxRadius=0.01,
        minRadius=Number.MAX_VALUE;
    for(var i=shapePoints.length;i--;){
        var distance=isc.GraphMath.straightDistance(shapePoints[i],centerPoint);
        maxRadius=Math.max(distance,maxRadius);
        minRadius=Math.min(distance,minRadius);
    }
    if(isFirst)minRadius=0;
    var ratio=minRadius/maxRadius;
    var shapeCenter=shape.getCenter(),
        x=-shapeCenter[0]+centerPoint[0],
        y=-shapeCenter[1]+centerPoint[1];
    return{
        cx:x,
        cy:y,
        r:maxRadius,
        fx:x,
        fy:y,
        colorStops:[
            {color:innerColor,offset:0},
            {color:innerColor,offset:ratio},
            {color:outerColor,offset:1.0}
        ]
    };
}
,isc.A._getColorMutePercent=function isc_FacetChart__getColorMutePercent(colorMutePercent,defaultColorMutePercent){
    if(isc.isA.String(colorMutePercent)){
        var percentage=colorMutePercent.endsWith("%");
        colorMutePercent=parseFloat(colorMutePercent);
    }
    if(isc.isA.Number(colorMutePercent)){
        colorMutePercent=Math.min(colorMutePercent,100);
        colorMutePercent=-Math.min(-colorMutePercent,100);
    }else{
        colorMutePercent=defaultColorMutePercent;
    }
    return colorMutePercent;
}
,isc.A._getDataColor=function isc_FacetChart__getDataColor(index,context){
    context=context||this;
    return isc.DrawPane._mutergb(this.colorMutePercent,context.getDataColor(index));
}
,isc.A._getDataGradient=function isc_FacetChart__getDataGradient(index,create,drawingType,context){
    context=context||this;
    var cache=this._mutedDataGradients;
    if(cache==null){
        cache=this._mutedDataGradients={};
    }
    var chartType=context.chartType,
        cacheKey=chartType+"_"+index+"_"+(context._dataColorOffset||0)+"_"+(context._dataGradientOffset||0);
    if(cache[cacheKey]==null){
        var mutergb=isc.DrawPane._mutergb,
            colorMutePercent=this.colorMutePercent;
        var gradient=context.getDataGradient(index,create,drawingType);
        if(isc.isA.String(gradient)){
            gradient=this.gradients[gradient];
        }
        gradient=isc.clone(gradient);
        gradient.startColor=gradient.startColor&&mutergb(colorMutePercent,gradient.startColor);
        gradient.endColor=gradient.endColor&&mutergb(colorMutePercent,gradient.endColor);
        var numColorStops=isc.isAn.Array(gradient.colorStops)?gradient.colorStops.length:0;
        for(var i=0;i<numColorStops;++i){
            var colorStop=gradient.colorStops[i];
            colorStop.color=colorStop.color&&mutergb(colorMutePercent,colorStop.color);
        }
        var id=this.getID()+"_"+chartType+"_data_gradient_"+index;
        if(typeof(gradient.direction)==="number"){
            gradient=this.createSimpleGradient(id,gradient);
        }else if(typeof(gradient.x1)==="number"){
            gradient=this.createLinearGradient(id,gradient);
        }else{
            gradient=this.createRadialGradient(id,gradient);
        }
        cache[cacheKey]=gradient;
    }
    return cache[cacheKey];
}
,isc.A._getBackgroundColor=function isc_FacetChart__getBackgroundColor(){
    return this.backgroundColor||"#ffffff";
}
,isc.A.drawLabel=function isc_FacetChart_drawLabel(left,top,text,props,rotate,dontFixVMLRotation){
    var noRotateProps=(rotate?this.rotateProps:null);
    var lbl=isc.DrawLabel.create(props,noRotateProps,{
        autoDraw:true,
        drawPane:this,
        left:left+(!dontFixVMLRotation&&this.isVML&&rotate&&props.fontSize?props.fontSize+this.padding:0),
        top:top,
        contents:text
    });
    return lbl;
}
,isc.A.getNearestDrawnValue=function isc_FacetChart_getNearestDrawnValue(x,y,metric){
    if(!this._canGetNearestDrawnValue(x,y)||this.chartType=="Scatter"){
        return null;
    }
    var context=this;
    if(this._hasExtraAxes()){
        var i=this._getExtraAxisMetrics().indexOf(metric);
        if(i!=-1){
            context=this._getExtraAxisSettings().all[i];
        }
    }
    if(x==null)x=this.getOffsetX()-this.getLeftPadding();
    if(y==null)y=this.getOffsetY()-this.getTopPadding();
    var res=this._getNearestDrawnValue(x,y,context,true);
    if(res!=null){
        delete res.drawItemId;
        delete res.text;
    }
    return res;
}
,isc.A.getNearestDrawnValues=function isc_FacetChart_getNearestDrawnValues(x,y){
    if(!this._canGetNearestDrawnValue(x,y)){
        return null;
    }
    if(x==null)x=this.getOffsetX()-this.getLeftPadding();
    if(y==null)y=this.getOffsetY()-this.getTopPadding();
    if(this.chartType=="Scatter"){
        return this._getScatterNearestDrawnValues(x,y);
    }else{
        var dataLabelFacet=this.getDataLabelFacet(),
            legendFacet=this.getLegendFacet(),
            valueFacet=(this.inlinedFacet!=null&&
                this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
                ?this.inlinedFacet:null),
            hasExtraAxes=this._hasExtraAxes(),
            settings=hasExtraAxes&&this._getExtraAxisSettings().all,
            len=(valueFacet!=null?valueFacet.values.length:1),
            res=new Array(len);
        for(var i=0;i<len;++i){
            var context;
            if(i==0){
                context=this;
            }else if(hasExtraAxes){
                var metric=valueFacet.values[i].id;
                for(var k=0;k<settings.length;++k){
                    if(metric==settings[k]._metric){
                        context=settings[k];
                        break;
                    }
                }
            }else{
                context=null;
            }
            res[i]=context&&this._getNearestDrawnValue(x,y,context,true);
            if(res[i]!=null){
                delete res[i].drawItemId;
                delete res[i].text;
            }
        }
        return res;
    }
}
,isc.A._canGetNearestDrawnValue=function isc_FacetChart__canGetNearestDrawnValue(x,y){
    if(x!=null&&y==null){
        isc.logWarn("Both coordinates should be passed in method getNearestDrawnValue or no "+
            "coordinates at all to use getOffset methods.");
        return false;
    }else if(!this.isDrawn()){
        isc.logWarn("Chart should be drawn before requesting nearestDrawnValue.");
        return false;
    }else if(this.chartType!="Scatter"&&this.getOrderedData().length==0){
        return false;
    }else if(this.chartType=="Scatter"&&this._getData().length==0){
        return false;
    }else{
        return true;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A._getScatterNearestDrawnValues=function isc_FacetChart__getScatterNearestDrawnValues(x,y){
    var hypot=isc.Math._hypot,
        data=this.getOrderedData(),
        legendFacet=this.getLegendFacet(),
        nearestDrawnValue=null,
        bestJ=null,
        minDistance=null;
    for(var j=legendFacet?legendFacet.values.length:1;j--;){
        var series=(legendFacet?data[j].series:data);
        for(var i=series.length;i--;){
            var distance=hypot(x-series[i].drawnX,y-series[i].drawnY);
            if(minDistance==null||distance<minDistance){
                nearestDrawnValue=series[i];
                if(legendFacet)bestJ=j;
                minDistance=distance;
            }
        }
    }
    if(nearestDrawnValue==null){
        return null;
    }else{
        var metricFacet=this.metricFacet,
            len=metricFacet.values.length,
            res=new Array(len),
            xAxisMetric=this.getXAxisMetric(),
            yAxisMetric=this.getYAxisMetric(),
            xIndex=metricFacet.values.findIndex("id",xAxisMetric),
            yIndex=metricFacet.values.findIndex("id",yAxisMetric),
            facetValues={};
        if(legendFacet!=null){
            facetValues[legendFacet.id]=data[bestJ].facetValueId;
        }
        for(var i=len;i--;){
            if(i==xIndex){
                res[i]={
                    x:Math.round(nearestDrawnValue.drawnX),
                    y:null,
                    value:nearestDrawnValue.record[xAxisMetric],
                    facetValues:facetValues,
                    record:nearestDrawnValue.record
                };
            }else if(i==yIndex){
                res[i]={
                    x:null,
                    y:Math.round(nearestDrawnValue.drawnY),
                    value:nearestDrawnValue.record[yAxisMetric],
                    facetValues:facetValues,
                    record:nearestDrawnValue.record
                };
            }else{
                res[i]=null;
            }
        }
        return res;
    }
}
,isc.A._getNearestDrawnValue=function isc_FacetChart__getNearestDrawnValue(x,y,context,byDistanceOnly){
    context=context||this;
    var hypot=isc.Math._hypot,
        d=this.getOrderedData(),
        range=this._getZoomValueRange(),
        start=range[0].index,
        end=1+range[1].index,
        dataLabelFacet=this.getDataLabelFacet(),
        dataLabelFacetId=dataLabelFacet&&dataLabelFacet.id,
        legendFacet=this.getLegendFacet(),
        legendFacetId=legendFacet&&legendFacet.id,
        valueFacet=(this.inlinedFacet!=null&&
            this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
            ?this.inlinedFacet:null);
    var isExtraAxis=(context!=this),
        contextIsMultiFacet=context.isMultiFacet(),
        extraAxisMetric,
        seriesIndex;
    if(isExtraAxis){
        extraAxisMetric=context._metric;
        if(this.isMultiFacet()&&!context.isMultiFacet()){
            var fixedFacetValue=this._getFixedFacetValue(context);
            seriesIndex=legendFacet.values.findIndex("id",fixedFacetValue.id);
        }
    }
    switch(context.chartType){
        case"Bar":
            var series=null,
                facetValues={};
            if(this.isMultiFacet()){
                var clustered=contextIsMultiFacet&&!this.isStacked(context),
                    data=null;
                if(clustered){
                    for(var i=0,bestDiff=null;i<d.length;++i){
                        var di=d[i];
                        for(var j=0;j<di.series.length;++j){
                            var s=di.series[j];
                            if(isc.isA.Number(s.value)){
                                var diff=s.drawnY&&Math.abs(s.drawnY-y);
                                if(bestDiff==null||diff<bestDiff){
                                    data=di;
                                    series=s;
                                    bestDiff=diff;
                                }else{
                                    j=di.series.length;
                                    i=d.length;
                                }
                            }
                        }
                    }
                }else{
                    for(var i=0,bestDiff=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[i].series.length;s==null&&j--;){
                            if(isc.isA.Number(d[i].series[j].value))s=d[i].series[j];
                        }
                        if(s!=null){
                            var diff=Math.abs(s.drawnY-y);
                            if(bestDiff==null||diff<bestDiff){
                                data=d[i];
                                bestDiff=diff;
                            }else{
                                break;
                            }
                        }
                    }
                    if(data!=null){
                        series=data.series[0];
                        var bestDiff=null,
                            withinBar=false,
                            prevDrawnX=null;
                        for(var j=0;j<data.series.length;++j){
                            var s=data.series[j];
                            if(isc.isA.Number(s.value)){
                                var drawnX=(prevDrawnX!=null?(prevDrawnX+s.drawnX)/2:s.drawnX),
                                    diff=Math.abs(drawnX-x),
                                    flag=(
                                        prevDrawnX!=null&&
                                        ((prevDrawnX<=x&&x<=s.drawnX)||
                                        (s.drawnX<=x&&x<=prevDrawnX)));
                                if(prevDrawnX==null||
                                        (withinBar?
                                            (flag&&diff<bestDiff):
                                            (flag||diff<bestDiff)))
                                {
                                    series=s;
                                    bestDiff=diff;
                                }else{
                                    break;
                                }
                                withinBar=withinBar||flag;
                                prevDrawnX=s.drawnX;
                            }
                        }
                    }
                }
                facetValues[dataLabelFacetId]=data&&data.facetValueId;
                facetValues[legendFacetId]=series&&series.facetValueId;
            }else{
                for(var i=0,bestDiff=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        var diff=Math.abs(s.drawnY-y);
                        if(bestDiff==null||diff<bestDiff){
                            series=s;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                facetValues[dataLabelFacetId]=series&&series.facetValueId;
            }
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return(series&&{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                barThickness:series.barThickness,
                value:series.value,
                text:this.formatDataValue(series.value),
                facetValues:facetValues,
                record:series.record,
                drawItemId:series.drawItemId
            });
        case"Column":
            var case1=this.isMultiFacet()&&(!isExtraAxis||contextIsMultiFacet),
                case2=!case1&&isExtraAxis&&this.isMultiFacet(),
                case3=!case1&&!case2,
                series=null,value,facetValues={},record;
            if(case1){
                var clustered=contextIsMultiFacet&&!this.isStacked(context),
                    bestI=null,
                    bestJ=null;
                if(clustered){
                    for(var i=start,bestDiff=null;i<end;++i){
                        var di=d[i];
                        for(var j=0;j<di.series.length;++j){
                            var dv=this._getDrawnValue(context,i,j);
                            if(isc.isA.Number(dv.value)){
                                var diff=Math.abs(dv.drawnX-x);
                                if(bestDiff==null||diff<bestDiff){
                                    bestI=i;
                                    bestJ=j;
                                    bestDiff=diff;
                                }else{
                                    j=di.series.length;
                                    i=end;
                                }
                            }
                        }
                    }
                }else{
                    for(var i=start,bestDiff=null;i<end;++i){
                        var dv=null;
                        for(var j=d[start].series.length;dv==null&&j--;){
                            var temp=this._getDrawnValue(context,i,j);
                            if(isc.isA.Number(temp.value))dv=temp;
                        }
                        if(dv!=null){
                            var diff=Math.abs(dv.drawnX-x);
                            if(bestDiff==null||diff<bestDiff){
                                bestI=i;
                                bestDiff=diff;
                            }else{
                                break;
                            }
                        }
                    }
                    if(bestI!=null){
                        var bestDiff=null,
                            withinColumn=false,
                            prevDrawnY=null;
                        for(var j=0;j<d[bestI].series.length;++j){
                            var dv=this._getDrawnValue(context,bestI,j);
                            if(isc.isA.Number(dv.value)){
                                var drawnY=(prevDrawnY!=null?(prevDrawnY+dv.drawnY)/2:dv.drawnY),
                                    diff=Math.abs(drawnY-y),
                                    flag=(
                                        prevDrawnY!=null&&
                                        ((prevDrawnY<=y&&y<=dv.drawnY)||
                                        (dv.drawnY<=y&&y<=prevDrawnY)));
                                if(prevDrawnY==null||
                                        (withinColumn?
                                            (flag&&diff<bestDiff):
                                            (flag||diff<bestDiff)))
                                {
                                    bestJ=j;
                                    bestDiff=diff;
                                }else{
                                    break;
                                }
                                withinColumn=withinColumn||flag;
                                prevDrawnY=dv.drawnY;
                            }
                        }
                    }
                }
                if(bestI!=null&&bestJ!=null){
                    series=this._getDrawnValue(context,bestI,bestJ);
                    var obj=d[bestI].series[bestJ];
                    record=obj.record;
                    value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    facetValues[legendFacetId]=obj.facetValueId;
                    if(valueFacet!=null){
                        facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                    }
                }
            }else{
                var bestI=null,
                    bestJ=(case2?seriesIndex:null);
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=this._getDrawnValue(context,i,bestJ);
                    if(isc.isA.Number(dv.value)){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                if(bestI!=null){
                    series=this._getDrawnValue(context,bestI,bestJ);
                    var obj=(case2?d[bestI].series[bestJ]:d[bestI]);
                    record=obj.record;
                    value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    if(case2){
                        facetValues[legendFacetId]=obj.facetValueId;
                    }
                    if(valueFacet!=null){
                        facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                    }
                }
            }
            return(series&&{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                barThickness:series.barThickness,
                value:value,
                text:context.formatDataValue(value),
                facetValues:facetValues,
                record:record,
                drawItemId:series.drawItemId
            });
        case"Area":
        case"Line":
            var case1=this.isMultiFacet()&&(!isExtraAxis||contextIsMultiFacet),
                case2=!case1&&isExtraAxis&&this.isMultiFacet(),
                case3=!case1&&!case2,
                bestI=null,bestJ=null,series=null;
            if(byDistanceOnly){
                for(var i=end-1,minDistance=null;i>=start;--i){
                    for(var j=(case1?d[i].series.length:1);j--;){
                        var k=(case1?j:(case2?seriesIndex:null)),
                            drawnValue=this._getDrawnValue(context,i,k);
                        if(isc.isA.Number(drawnValue.value)){
                            var distance=hypot(x-drawnValue.drawnX,y-drawnValue.drawnY);
                            if(minDistance==null||distance<minDistance){
                                minDistance=distance;
                                bestI=i;
                                bestJ=k;
                                series=drawnValue;
                            }
                        }
                    }
                }
            }else if(case1){
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=null;
                    for(var j=d[start].series.length;dv==null&&j--;){
                        var temp=this._getDrawnValue(context,i,j);
                        if(isc.isA.Number(temp.value))dv=temp;
                    }
                    if(dv!=null){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                if(bestI!=null){
                    for(var j=0,foundBelow=false,bestDiff=null;j<d[bestI].series.length;++j){
                        var s=this._getDrawnValue(context,bestI,j);
                        if(isc.isA.Number(s.value)){
                            var drawnY=s.drawnY,
                                diff=Math.abs(drawnY-y);
                            if(!foundBelow&&drawnY>=y){
                                foundBelow=true;
                                bestDiff=diff;
                                series=s;
                                bestJ=j;
                            }else if((!foundBelow||drawnY>=y)&&(series==null||bestDiff>diff)){
                                bestDiff=diff;
                                series=s;
                                bestJ=j;
                            }
                        }
                    }
                }
            }else{
                bestI=null;
                bestJ=(case2?seriesIndex:null);
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=this._getDrawnValue(context,i,bestJ);
                    if(isc.isA.Number(dv.value)){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                series=(bestI!=null&&this._getDrawnValue(context,bestI,bestJ));
            }
            if(series==null){
                return null;
            }
            var value,
                facetValues={},
                record;
            if(case1){
                var obj=d[bestI].series[bestJ];
                record=obj.record;
                value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                facetValues[legendFacetId]=obj.facetValueId;
                if(valueFacet!=null){
                    facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                }
            }else{
                var obj=(case2?d[bestI].series[bestJ]:d[bestI]);
                record=obj.record;
                value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                if(case2){
                    facetValues[legendFacetId]=obj.facetValueId;
                }
                if(valueFacet!=null){
                    facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                }
            }
            return{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                value:value,
                text:context.formatDataValue(value),
                facetValues:facetValues,
                record:record
            };
        case"Radar":
            var data=null,facetValues={};
            if(this.isMultiFacet()){
                var bestI=null,
                    bestJ=null;
                for(var i=0,distance=null;i<d.length;++i){
                    for(var j=0;j<d[i].series.length;++j){
                        var s=d[i].series[j];
                        if(isc.isA.Number(s.value)){
                            var dist=hypot(s.drawnX-x,s.drawnY-y);
                            if(distance==null||dist<distance){
                                distance=dist;
                                data=s;
                                bestI=i;
                                bestJ=j;
                            }
                        }
                    }
                }
                if(data!=null){
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    facetValues[legendFacetId]=data.facetValueId;
                }
            }else{
                for(var i=0,distance=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        var dist=hypot(s.drawnX-x,s.drawnY-y);
                        if(distance==null||dist<distance){
                            distance=dist;
                            data=d[i];
                        }
                    }
                }
                facetValues[dataLabelFacetId]=data&&data.facetValueId;
            }
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return(data&&{
                x:Math.round(data.drawnX),
                y:Math.round(data.drawnY),
                value:data.value,
                text:this.formatDataValue(data.value),
                facetValues:facetValues,
                record:data.record
            });
        case"Doughnut":
        case"Pie":
            var isMultiFacet=this.isMultiFacet(),
                facetValues={},
                series=null
            if(!isMultiFacet){
                for(var i=0,angleInDegrees=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        if(angleInDegrees==null){
                            var deltaY=y-s.pieY,
                                deltaX=x-s.pieX;
                            angleInDegrees=Math.atan2(deltaY,deltaX)*180/Math.PI;
                            if(angleInDegrees<0)angleInDegrees+=360;
                        }
                        if(angleInDegrees>s.startAngle&&angleInDegrees<s.endAngle){
                            series=s;
                        }
                    }
                }
            }else{
                var seriesIndex=null;
                if(this.stacked){
                    for(var i=0,distance=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[0].series.length;s==null&&j--;){
                            var temp=d[i].series[j];
                            if(isc.isA.Number(temp.value))s=temp;
                        }
                        if(s!=null){
                            if(distance==null){
                                distance=hypot(s.pieX-x,s.pieY-y);
                            }
                            if(distance<s.pieRadius&&(seriesIndex==null||
                                    s.pieRadius<d[seriesIndex].series[0].pieRadius))
                            {
                                seriesIndex=i;
                            }
                        }
                    }
                }else{
                    for(var i=0,distance=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[0].series.length;s==null&&j--;){
                            var temp=d[i].series[j];
                            if(isc.isA.Number(temp.value))s=temp;
                        }
                        if(s!=null){
                            var dist=hypot(s.pieX-x,s.pieY-y);
                            if(distance==null||dist<distance){
                                distance=dist;
                                seriesIndex=i;
                            }
                        }
                    }
                }
                if(seriesIndex!=null){
                    var data=d[seriesIndex],
                        deltaY=y-data.series[0].pieY;
                        deltaX=x-data.series[0].pieX;
                        angleInDegrees=Math.atan2(deltaY,deltaX)*180/Math.PI;
                    if(angleInDegrees<0)angleInDegrees+=360;
                    for(var i=0;i<data.series.length;++i){
                        var s=data.series[i];
                        if(isc.isA.Number(s.value)){
                            if(angleInDegrees>=s.startAngle&&angleInDegrees<s.endAngle){
                                series=s;
                            }
                        }
                    }
                    facetValues[dataLabelFacetId]=d[seriesIndex].facetValueId;
                }
            }
            if(series==null){
                return null;
            }
            facetValues[legendFacetId]=series.facetValueId;
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return{
                x:Math.round(series.pieX),
                y:Math.round(series.pieY),
                value:series.value,
                text:this.formatDataValue(series.value),
                facetValues:facetValues,
                record:series.record,
                startAngle:series.startAngle,
                endAngle:series.endAngle,
                radius:series.pieRadius,
                drawItemId:series.drawItemId
            };
        default:
            return null;
    }
}
,isc.A.getDrawnValue=function isc_FacetChart_getDrawnValue(facetValues,logWarnings){
    if(!this.isDrawn()){
        if(logWarnings)isc.logWarn("Chart should be drawn before requesting nearestDrawnValue.");
        return null;
    }
    if(!facetValues){
        if(logWarnings)isc.logWarn("FacetValues should be passed to get drawn value.");
        return null;
    }
    if(this.chartType=="Scatter"){
        return null;
    }
    var d=this.getOrderedData();
    var isMultiFacet=this.isMultiFacet();
    if(d.length==0)return null;
    var dataLabelFacet=this.getDataLabelFacet(),
        dataLabelFacetId=dataLabelFacet&&dataLabelFacet.id,
        legendFacet=this.getLegendFacet(),
        legendFacetId=legendFacet&&legendFacet.id,
        valueFacet=(this.inlinedFacet!=null&&
            this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
            ?this.inlinedFacet:null),
        valueFacetId=valueFacet&&valueFacet.id,
        numKeys=(dataLabelFacet?1:0)+(legendFacet?1:0)+(valueFacet?1:0);
    var keys=isc.getKeys(facetValues);
    if(numKeys!=keys.length-(keys.contains(isc.gwtRef)?1:0)){
        return null;
    }
    if((dataLabelFacet&&!keys.contains(dataLabelFacetId))||
        (legendFacet&&!keys.contains(legendFacetId))||
        (valueFacet&&!keys.contains(valueFacetId)))
    {
        return null;
    }
    var res=null,
        firstFacetId=(dataLabelFacet?dataLabelFacetId:legendFacetId);
    for(var i=d.length;i--;){
        if(d[i].facetValueId==facetValues[firstFacetId]){
            if(!isMultiFacet){
                res=d[i];
                i=0;
            }else{
                for(var j=d[i].series.length;j--;){
                    if(d[i].series[j].facetValueId==facetValues[legendFacetId]){
                        res=d[i].series[j];
                        i=j=0;
                    }
                }
            }
        }
    }
    if(res==null)return null;
    var metric=facetValues[valueFacetId];
    if(valueFacet&&!valueFacet.values.find("id",metric)){
        return null;
    }
    var result={
        x:res.pieX|res.drawnX,
        y:res.pieY|res.drawnY,
        value:(valueFacet?res.record[metric]:res.value),
        facetValues:facetValues,
        record:res.record
    };
    if(res.startAngle!=null)result.startAngle=res.startAngle;
    if(res.endAngle!=null)result.endAngle=res.endAngle;
    if(res.barThickness!=null)result.barThickness=res.barThickness;
    return result;
}
,isc.A._getDrawnValue=function isc_FacetChart__getDrawnValue(context,i,j){
    var data=this.getOrderedData(),
        legendFacet=this.getLegendFacet(),
        isZoomChart=this._isZoomChart(),
        isZoomSelectionChart=this._isZoomSelectionChart(),
        isMainChart=!(isZoomChart||isZoomSelectionChart);
    if(context.chartType=="Scatter"){
        return(legendFacet?data[i].series[j]:data[i]);
    }
    var isMultiFacet=this.isMultiFacet(),
        isExtraAxisChart=(context!=this),
        extraAxisIndex;
    if(isExtraAxisChart){
        extraAxisIndex=this._getExtraAxisSettings().all.indexOf(context);
        if(isMultiFacet&&!context.isMultiFacet()){
            var fixedFacetValue=this._getFixedFacetValue(context);
            j=legendFacet.values.findIndex("id",fixedFacetValue.id);
        }
    }
    var obj=isMultiFacet?data[i].series[j]:data[i];
    if(isExtraAxisChart){
        obj=((obj.drawn||(obj.drawn=[]))[extraAxisIndex]||(obj.drawn[extraAxisIndex]={}));
    }
    if(isMainChart){
        return obj;
    }else if(isZoomChart){
        return(obj.zoom||(obj.zoom={}));
    }else{
        return(obj.zoomSelection||(obj.zoomSelection={}));
    }
}
,isc.A.mouseOut=function isc_FacetChart_mouseOut(){
    this._unhoverValueAxisLabel();
    return true;
}
,isc.A.mouseMove=function isc_FacetChart_mouseMove(){
    var rect=this.getChartRect();
    if(rect==null){
        return;
    }
    var x=this.getOffsetX()-this.getLeftPadding(),
        y=this.getOffsetY()-this.getTopPadding();
    if(x>rect.left&&x<(rect.left+rect.width)&&
        y>rect.top&&y<(rect.top+rect.height))
    {
        var context=this._getShowValueOnHoverContext();
        if(context!=null){
            if(this._hoverLabel==null){
                this._hoverRect=isc.DrawRect.create(this.hoverRectProperties,{
                    autoDraw:true,
                    drawPane:this,
                    height:20,
                    width:24,
                    top:-100
                });
                if(context.showDataPoints!=true&&
                   (context.chartType=="Line"||context.chartType=="Area"||context.chartType=="Radar"))
                {
                    this._dataPoint=this.drawDataPoint([-100,-100],0,6,null,0);
                }
                this._hoverLabel=isc.DrawLabel.create(this.hoverLabelProperties,{
                    autoDraw:true,
                    drawPane:this,
                    synchTextMove:true,
                    contents:""
                });
                return;
            }
            var nearestValue=this._getNearestDrawnValue(x,y,context,false);
            if(nearestValue!=null&&nearestValue.value==null)nearestValue.value=0;
            if(nearestValue!=null&&this._hoverLabel.contents!==nearestValue.value){
                var size=this.measureHoverLabel(nearestValue.text);
                if(this._hoverRect.drawingVML){
                    this._hoverRect.destroy();
                    this._hoverRect=isc.DrawRect.create({
                        autoDraw:true,
                        drawPane:this,
                        rounding:0.5,
                        lineWidth:1,
                        lineColor:"#333333",
                        fillColor:"#ffffff",
                        fillOpacity:0.5,
                        shadow:{blur:8,color:"#555555",offset:[2,2]},
                        height:size.height+8,
                        width:size.width+8,
                        top:-300
                    });
                    this._hoverLabel.destroy();
                    this._hoverLabel=isc.DrawLabel.create(this.hoverLabelProperties,{
                        autoDraw:true,
                        drawPane:this,
                        synchTextMove:true,
                        contents:nearestValue.text
                    });
                }else{
                    this._hoverLabel.contents=nearestValue.text;
                    this._hoverRect.width=size.width+8;
                    this._hoverRect.height=size.height+8;
                }
                this._hoverLabel.draw();
                var rectLeft=nearestValue.x;
                var rectTop=nearestValue.y;
                if(this._dataPoint&&context.showDataPoints!=true){
                    this._dataPoint.moveTo(rectLeft-3,rectTop-3);
                }
                switch(context.chartType){
                    case"Area":
                    case"Line":
                    case"Radar":
                        if(context.showDataPoints==true){
                            for(var i=0;i<this.knobs.length;i++){
                                if(this.knobs[i].dataValue==nearestValue.value){
                                    var r=this.knobs[i].dataRecord;
                                    var r2=nearestValue.facetValues;
                                    if(r==null||r2==null)break;
                                    var keysToCompare=isc.getKeys(r);
                                    if(keysToCompare.length!=isc.getKeys(r2).length)continue;
                                    var equals=true;
                                    for(var key in r){
                                        if(r[key]!=r2[key]){
                                            equals=false;
                                            break;
                                        }
                                    }
                                    if(equals){
                                        if(this._dataPoint&&this._dataPoint.ID!=this.knobs[i].ID){
                                            this._cleanDataPoint();
                                        }
                                        if(this._dataPoint==null){
                                            this._dataPoint=this.knobs[i];
                                            var color=this._dataPoint.knobShape.fillColor;
                                            this._dataPoint.prevFillColor=color;
                                            color=this._getHighlightedColor(color,this.brightenPercent);
                                            this._dataPoint.knobShape.setFillColor(color);
                                            var color=this._dataPoint.knobShape.lineColor;
                                            this._dataPoint.prevLineColor=color;
                                            color=this._getHighlightedColor(color,this.brightenPercent);
                                            this._dataPoint.knobShape.setLineColor(color);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        rectTop-=this._hoverRect.height+4;
                        rectLeft+=4;
                        break;
                    case"Bar":
                        rectTop-=this._hoverRect.height/2;
                        rectLeft-=this.hoverLabelOffset;
                        break;
                    case"Column":
                        rectTop-=this._hoverRect.height;
                        break;
                    case"Doughnut":
                    case"Pie":
                        var angle=(nearestValue.startAngle+nearestValue.endAngle)/2+90;
                        if(angle<0){
                            angle+=360;
                        }
                        var radialCoords=this._getRadialLabelCoordinates([nearestValue.x,nearestValue.y],this.maxRadius||nearestValue.radius,
                            angle,nearestValue.text,this.hoverLabelProperties);
                        rectLeft=radialCoords[0];
                        rectTop=radialCoords[1];
                }
                if(nearestValue.drawItemId){
                    var drawItem=window[nearestValue.drawItemId];
                    if(this._highlightedItem&&this._highlightedItem.ID!=drawItem.ID){
                        this._cleanHighlightedItem();
                    }
                    if(this._highlightedItem==null){
                        this._highlightedItem=drawItem;
                        if(drawItem.radius){
                            drawItem.setFillOpacity((100-this.brightenPercent)/100);
                        }else{
                            var color=drawItem.lineColor;
                            drawItem.prevLineColor=color;
                            color=this._getHighlightedColor(color,this.brightenPercent);
                            drawItem.setLineWidth(2);
                            drawItem.setLineColor(color);
                        }
                    }
                }
                if(rectLeft<0){
                    rectLeft=0;
                }else if((rectLeft+this._hoverRect.width)>this.getWidth()){
                    rectLeft=this.getWidth()-this._hoverRect.width-8;
                }
                if(rectTop<0){
                    rectTop=0;
                }else if((rectTop+this._hoverRect.height)>this.getHeight()){
                    rectTop=this.getHeight()-this._hoverRect.height-8;
                }
                var dy=4;
                if(isc.Browser.isFirefox)dy+=3;
                this._hoverLabel.moveTo(rectLeft+4,rectTop+dy);
                this._hoverRect.moveTo(rectLeft,rectTop);
            }else if(nearestValue==null){
                this._cleanHoverItems();
            }
        }else{
            this._cleanHoverItems();
        }
    }else if(this._getCanMoveAxes()){
        var settings=this._getExtraAxisSettings(),
            numAxes=1+settings.all.length;
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings.all[j-1]),
                left=this._getValueAxisLeft(context),
                right=left+context._totalValueAxisWidth;
            if(left<=x&&x<=right){
                if(context==this){
                    break;
                }
                var valueAxisLabel=context._valueAxisLabel;
                if(valueAxisLabel!=null){
                    var boundingBox=valueAxisLabel.getBoundingBox();
                    if(x>=boundingBox[0]&&x<=boundingBox[2]&&
                        y>=boundingBox[1]&&y<=boundingBox[3])
                    {
                        this._hoverValueAxisLabel(context);
                        return;
                    }
                }
            }
        }
    }
    if(this._getCanMoveAxes()){
        this._unhoverValueAxisLabel();
    }
}
,isc.A._cleanHoverItems=function isc_FacetChart__cleanHoverItems(){
    if(this._hoverLabel!=null){
        this._hoverLabel.destroy();
        this._hoverRect.destroy();
        this._hoverLabel=null;
        this._hoverRect=null;
        if(this._dataPoint)this._cleanDataPoint();
        if(this._highlightedItem)this._cleanHighlightedItem();
    }
}
,isc.A._cleanDataPoint=function isc_FacetChart__cleanDataPoint(){
    var context=this._getShowValueOnHoverContext();
    if(context.showDataPoints==true){
        this._dataPoint.knobShape.setFillColor(this._dataPoint.prevFillColor);
        this._dataPoint.knobShape.setLineColor(this._dataPoint.prevLineColor);
        delete this._dataPoint.prevFillColor;
        delete this._dataPoint.prevLineColor;
    }else{
        this._dataPoint.moveTo(-100,-100);
        this._dataPoint.destroy();
    }
    delete this._dataPoint;
}
,isc.A._cleanHighlightedItem=function isc_FacetChart__cleanHighlightedItem(){
    this._highlightedItem.setLineColor(this._highlightedItem.prevLineColor);
    this._highlightedItem.setLineWidth(1);
    delete this._highlightedItem.prevLineColor;
    if(this._highlightedItem.radius){
        this._highlightedItem.setFillOpacity(1.0);
    }
    delete this._highlightedItem;
}
,isc.A._getHighlightedColor=function isc_FacetChart__getHighlightedColor(color,percent){
    if(color.charAt(0)=="#"){
        color=color.substring(1,7);
    }
    var r=parseInt(color.substring(0,2),16);
    var g=parseInt(color.substring(2,4),16);
    var b=parseInt(color.substring(4,6),16);
    r=Math.min(255,r+Math.round((r*percent)/100));
    g=Math.min(255,g+Math.round((g*percent)/100));
    b=Math.min(255,b+Math.round((b*percent)/100));
    return"#"+(r>15?"":"0")+r.toString(16)
        +(g>15?"":"0")+g.toString(16)
        +(b>15?"":"0")+b.toString(16);
}
,isc.A._getHoverLabel=function isc_FacetChart__getHoverLabel(baseCache,index1,index2,context,value){
    var cache;
    if(index2!=null){
        cache=(baseCache[index1]||(baseCache[index1]={}))[index2];
    }else{
        cache=baseCache[index1];
    }
    if(cache!=null){
        return cache;
    }else if(value==null){
        return null;
    }else{
        var labelText=context.formatDataValue(value);
        cache=this.measureHoverLabel(labelText);
        cache.text=labelText;
        cache.value=value;
        if(index2!=null){
            baseCache[index1][index2]=cache;
        }else{
            baseCache[index1]=cache;
        }
        return cache;
    }
}
,isc.A.measureHoverLabel=function isc_FacetChart_measureHoverLabel(labelText){
    return this.measureLabel(labelText,this.hoverLabelProperties);
}
,isc.A.destroy=function isc_FacetChart_destroy(){
    if(this._contextMenu!=null){
        this._contextMenu.destroy();
        delete this._contextMenu;
    }
    this._cleanHoverItems();
    this.Super("destroy",arguments);
}
);
isc.evalBoundary;isc.B.push(isc.A._getDataType=function isc_FacetChart__getDataType(){
    if(this.labelCollapseMode=="numeric"){
        return"float";
    }else if(this.labelCollapseMode=="time"){
        return"date";
    }
    var minDataValue=this._getMinDataValue(),
        maxDataValue=this._getMaxDataValue();
    if(isc.isA.Number(minDataValue)&&isc.isA.Number(maxDataValue)){
        return"float";
    }else if(isc.isA.Date(minDataValue)&&isc.isA.Date(maxDataValue)){
        return"date";
    }else if(isc.isA.String(minDataValue)&&isc.isA.String(maxDataValue)){
        return"string";
    }
}
,isc.A._hasDiscreteDataValues=function isc_FacetChart__hasDiscreteDataValues(){
    var discrete=(
        this.chartType=="Bar"||this.chartType=="Column"||
        this.labelCollapseMode=="sample");
    if(!discrete){
        discrete=(this._getDataType()=="string");
        if(!discrete){
            var sorted=this._dataIsSorted;
            if(sorted==null){
                sorted=true;
                var data=this.getOrderedData();
                for(var i=data.length,lastTitle=data[i-1].title;sorted&&i--;){
                    var title=data[i].title;
                    sorted=(title<=lastTitle);
                    lastTitle=title;
                }
                this._dataIsSorted=sorted;
            }
            discrete=!sorted;
        }
    }
    return discrete;
}
,isc.A._getMinDataValue=function isc_FacetChart__getMinDataValue(){
    var data=this.getOrderedData(),
        i=0,len=data.length;
    while(i<len&&data[i].title==null)
        ++i;
    return data[i].title;
}
,isc.A._getMaxDataValue=function isc_FacetChart__getMaxDataValue(){
    var data=this.getOrderedData(),
        len=data.length,
        i=len-1;
    while(i>=0&&data[i].title==null)
        --i;
    return data[i].title;
}
,isc.A._delegateToParentChartMethods=function isc_FacetChart__delegateToParentChartMethods(){
    var obj={};
    var methods=[
        "getFacet",
        "getFacetValue",
        "getOrderedData",
        "getValue",
        "setData",
        "setFacets",
        "getFacetData",
        "deriveFacetValues",
        "isMultiFacet",
        "getValueFromRecord",
        "getDataRecord",
        "getDataSeries",
        "getDefaultMetric",
        "getMinValue",
        "getMaxValue"];
    for(var i=0,len=methods.length;i<len;++i){
        var method=methods[i];
        obj[method]=(function(method){
            return function(){
                var parentChart=this._parentChart;
                return parentChart[method].apply(parentChart,arguments);
            };
        })(method);
    }
    obj.setupChart=function(){};
    return obj;
}
,isc.A._isZoomChart=function isc_FacetChart__isZoomChart(){
    return(this._parentChart!=null&&this._parentChart.zoomChart==this);
}
,isc.A._isZoomSelectionChart=function isc_FacetChart__isZoomSelectionChart(){
    return(this._parentChart!=null&&this._parentChart.zoomSelectionChart==this);
}
,isc.A._getData=function isc_FacetChart__getData(){
    return(this._parentChart||this).data;
}
,isc.A._getFacets=function isc_FacetChart__getFacets(){
    return(this._parentChart||this).facets;
}
,isc.A._getMetricFacet=function isc_FacetChart__getMetricFacet(){
    return(this._parentChart||this).metricFacet;
}
,isc.A._getMultiCellData=function isc_FacetChart__getMultiCellData(){
    return(this._parentChart||this).multiCellData;
}
,isc.A._getHighErrorMetric=function isc_FacetChart__getHighErrorMetric(){
    return(this._parentChart||this).highErrorMetric;
}
,isc.A._getLowErrorMetric=function isc_FacetChart__getLowErrorMetric(){
    return(this._parentChart||this).lowErrorMetric;
}
,isc.A._getZoomChartTop=function isc_FacetChart__getZoomChartTop(){
    return this.getTopPadding()+
        this.getChartTop()+
        this.getChartHeight()+
        this.chartRectMargin+
        this.getXLabelsHeight()+
        (this._legendRect?this.legendMargin+this._legendRect.height:0)+
        this._zoomChartMargin;
}
,isc.A._getZoomChartLeft=function isc_FacetChart__getZoomChartLeft(){
    return this.getLeftPadding()+this.getChartLeft();
}
,isc.A._setZoomChartProperties=function isc_FacetChart__setZoomChartProperties(){
    var zoomChartProps={
        autoDraw:false,
        redrawWithParent:false,
        _constructor:"FacetChart",
        labelCollapseMode:this._getZoomChartLabelCollapseMode(),
        _parentChart:this,
        extraAxisMetrics:this.extraAxisMetrics.duplicate(),
        extraAxisSettings:isc.clone(this.extraAxisSettings)
    };
    this._zoomChartProperties=isc.addProperties({
        colorMutePercent:this.zoomMutePercent
    },this.zoomChartProperties,zoomChartProps);
    this._zoomSelectionChartProperties=isc.addProperties({},this.zoomSelectionChartProperties,zoomChartProps);
    if(this.chartType=="Line"){
        this.zoomChartDefaults.showGradationsOverData=false;
        this.zoomSelectionChartDefaults.showGradationsOverData=false;
        var lineProps={lineWidth:2,lineColor:"#d3d3d3",linePattern:"dash"};
        this.zoomChartDefaults.gradationLineProperties=lineProps;
        this.zoomSelectionChartDefaults.gradationLineProperties=lineProps;
    }else{
        this.zoomChartDefaults.showGradationsOverData=true;
        this.zoomSelectionChartDefaults.showGradationsOverData=true;
        var lineProps={lineWidth:2,lineColor:this._getBackgroundColor()};
        this.zoomChartDefaults.gradationLineProperties=lineProps;
        this.zoomSelectionChartDefaults.gradationLineProperties=lineProps;
    }
}
,isc.A._createZoomChartAndSlider=function isc_FacetChart__createZoomChartAndSlider(){
    if(this._getCanZoom()){
        this._zoomChartNeedsRedraw=true;
        var zoomShowSelection=this.zoomShowSelection,
            left=this._getZoomChartLeft(),
            top=this._getZoomChartTop(),
            chartWidth=this.getChartWidth(),
            range=this._getZoomValueRange(),
            minLambda=range[0].lambda,maxLambda=range[1].lambda;
        var extraProperties=isc.addProperties({
            logScale:this._getZoomLogScale(),
            chartType:this.chartType,
            stacked:this.stacked,
            filled:this.filled,
            connected:this.connected
        },this._delegateToParentChartMethods());
        isc.addProperties(this._zoomChartProperties,{
            autoDraw:false,
            top:top,
            left:left,
            width:chartWidth,
            height:this.zoomChartHeight
        },extraProperties);
        var zoomChart=this.addAutoChild("zoomChart",this._zoomChartProperties);
        this._zoomChartSliderProperties=isc.addProperties({},this.zoomChartSliderProperties,{
            _constructor:"RangeSlider",
            left:left,
            top:top,
            width:chartWidth,
            height:this.zoomChartHeight+this._zoomChartSliderScrollbarHeight,
            showTrack:false,
            labelStartProperties:{},
            labelDragProperties:{},
            labelEndProperties:{},
            startThumbProperties:{backgroundColor:"transparent"},
            endThumbProperties:{backgroundColor:"transparent"},
            minValue:0,
            maxValue:1,
            startValue:minLambda,
            endValue:maxLambda
        });
        var slider=this.addAutoChild("zoomChartSlider",this._zoomChartSliderProperties);
        this.observe(slider,"resized","observer._refreshZoomSelectionChart()");
        this.observe(slider,"changed","observer._zoomChartSliderChanged(arguments[0],arguments[1],arguments[2])");
        slider.labelStart.hide();
        slider.labelDrag.hide();
        slider.labelEnd.hide();
        if(zoomShowSelection){
            var offset=slider.startThumb.getLeft();
            var selectionWidth=slider.endThumb.getRight()-offset+1;
            var zoomSelectionViewCanvas=this._zoomSelectionViewCanvas=isc.Canvas.create({
                redrawWithParent:false,
                backgroundColor:this._getBackgroundColor(),
                padding:0,
                left:left+offset,
                top:top,
                width:selectionWidth,
                height:this.zoomChartHeight,
                overflow:"hidden",
                hideUsingDisplayNone:true
            });
            this.addChild(zoomSelectionViewCanvas);
            isc.addProperties(this._zoomSelectionChartProperties,{
                autoParent:"none",
                left:-offset,
                top:0,
                width:chartWidth,
                height:this.zoomChartHeight
            },extraProperties);
            var zoomSelectionChart=this.addAutoChild("zoomSelectionChart",this._zoomSelectionChartProperties);
            zoomSelectionViewCanvas.addChild(zoomSelectionChart);
            slider.moveAbove(zoomSelectionViewCanvas);
        }
    }
    this._zoomChartCreated=true;
}
,isc.A._zoomChartSliderChanged=function isc_FacetChart__zoomChartSliderChanged(startValue,endValue,isDragging){
    this._refreshZoomSelectionChart();
    if(!isDragging){
        this._setZoomValueRange([{lambda:startValue},{lambda:endValue}],false);
        if(this.zoomChanged){
            var range=this._getZoomValueRange();
            this.zoomChanged(range[0].dataValue,range[1].dataValue);
        }
    }
}
,isc.A._refreshZoomSelectionChart=function isc_FacetChart__refreshZoomSelectionChart(){
    var zoomChartSlider=this.zoomChartSlider,
        zoomShowSelection=this.zoomShowSelection,
        zoomSelectionChart=this.zoomSelectionChart,
        zoomSelectionViewCanvas=this._zoomSelectionViewCanvas;
    if(zoomShowSelection){
        var left=this.zoomChart.getLeft(),
            startThumb=zoomChartSlider.startThumb,
            endThumb=zoomChartSlider.endThumb,
            minX=startThumb.getLeft(),
            diffX=endThumb.getRight()-minX+1,
            maxX=minX+diffX;
        zoomSelectionViewCanvas.setLeft(left+minX);
        zoomSelectionViewCanvas.setWidth(diffX);
        zoomSelectionChart.setLeft(-minX);
    }
}
,isc.A._destroyZoomChartAndSlider=function isc_FacetChart__destroyZoomChartAndSlider(){
    if(this.zoomSelectionChart!=null){
        this.zoomSelectionChart.destroy();
        delete this.zoomSelectionChart;
    }
    if(this._zoomSelectionViewCanvas!=null){
        this._zoomSelectionViewCanvas.destroy();
        delete this._zoomSelectionViewCanvas;
    }
    if(this.zoomChartSlider!=null){
        this.ignore(this.zoomChartSlider,"changed");
        this.ignore(this.zoomChartSlider,"resized");
        this.zoomChartSlider.destroy();
        delete this.zoomChartSlider;
    }
    if(this.zoomChart!=null){
        this.zoomChart.destroy();
        delete this.zoomChart;
    }
    delete this._zoomChartCreated;
}
,isc.A._getCanZoom=function isc_FacetChart__getCanZoom(chartType){
    if(chartType==null)chartType=this.chartType;
    return(chartType!="Radar"&&!this.isPieChart(chartType)&&
            chartType!="Scatter"&&
            this.hasYGradations(chartType)&&this.canZoom);
}
,isc.A._getZoomChartLabelCollapseMode=function isc_FacetChart__getZoomChartLabelCollapseMode(){
    if(this.labelCollapseMode!=null){
        return this.labelCollapseMode;
    }else if(this._getCanZoom()){
        var type=this._getDataType();
        if(type=="float")return"numeric";
        if(type=="date")return"time";
        if(type=="string")return"sample";
    }
}
,isc.A._getZoomLogScale=function isc_FacetChart__getZoomLogScale(context){
    context=context||this;
    if(context.zoomLogScale!=null){
        return context.zoomLogScale;
    }else{
        var zoomBounds=this._getZoomDataBounds(context);
        return(zoomBounds.minValue>0);
    }
}
,isc.A._getZoomStartPosition=function isc_FacetChart__getZoomStartPosition(){
    if(this.zoomStartPosition!=null){
        return this.zoomStartPosition;
    }else{
        if(this._getDataType()=="date"){
           var day=1000*60*60*24,
               now=new Date(),
               lastDate=this._getMaxDataValue();
           if(now.getTime()-lastDate.getTime()<day){
               return"end";
           }
        }
        return"start";
    }
}
,isc.A._getZoomValueRange=function isc_FacetChart__getZoomValueRange(){
    var range;
    if(this._zoomValueRange==null){
        if(this._getCanZoom()){
            range=[{dataValue:this.zoomStartValue},{dataValue:this.zoomEndValue}];
        }else{
            range=[{lambda:0.0},{lambda:1.0}];
        }
        this._setZoomValueRange(range,true);
    }else{
        range=this._zoomValueRange;
    }
    return range;
}
,isc.A._dateComparator=function isc_FacetChart__dateComparator(date1,date2){
    return Date.compareDates(date2,date1);
}
,isc.A._setZoomValueRange=function isc_FacetChart__setZoomValueRange(range,dontRedraw){
    var data=this.getOrderedData(),
        len=data.length,
        min=range[0],max=range[1],
        minLambda=min.lambda,maxLambda=max.lambda,
        minDataValue=this._getMinDataValue(),
        maxDataValue=this._getMaxDataValue(),
        type=this._getDataType(),
        discrete=this._hasDiscreteDataValues(),
        byLambda=(min.lambda!=null&&max.lambda!=null),
        byDataValue=!byLambda;
    if(byDataValue){
        var zoomStartValue=min.dataValue,zoomEndValue=max.dataValue;
        if(zoomStartValue==null&&zoomEndValue==null){
            byLambda=true;
            byDataValue=false;
            var zoomStartPosition=this._getZoomStartPosition();
            if(zoomStartPosition=="start"){
                minLambda=0.0;
                maxLambda=1.0/5.0;
            }else if(zoomStartPosition=="end"){
                minLambda=4.0/5.0;
                maxLambda=1.0;
            }
            min.lambda=minLambda;
            max.lambda=maxLambda;
        }else if(zoomStartValue==null){
            zoomStartValue=minDataValue;
        }else if(zoomEndValue==null){
            zoomEndValue=maxDataValue;
        }
        min.dataValue=zoomStartValue;
        max.dataValue=zoomEndValue;
    }
    var i,j,startDataValue,endDataValue;
    if(discrete){
        if(byLambda){
            i=Math.floor(minLambda*(len-1));
            startDataValue=data[i].title;
            j=Math.ceil(maxLambda*(len-1));
            endDataValue=data[j].title;
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var k;
            for(k=0;k<len;++k){
                if(data[k].title==startDataValue){i=k;break;}
            }
            for(;k<len;++k){
                if(data[k].title==endDataValue){j=k;break;}
            }
            if(i==null&&j!=null){
                this.logWarn(
                        "Could not find data value "+startDataValue+" in the data.  "+
                        "Defaulting to show the data from the beginning of the data set up to zoomEndValue.");
                this._setZoomValueRange([{
                    dataValue:minDataValue
                },{
                    dataValue:endDataValue
                }],dontRedraw);
                return;
            }else if(i!=null&&j==null){
                this.logWarn(
                        "Could not find data value "+endDataValue+" in the data.  "+
                        "Defaulting to show the data from zoomStartValue to the end of the data set.");
                this._setZoomValueRange([{
                    dataValue:startDataValue
                },{
                    dataValue:maxDataValue
                }],dontRedraw);
                return;
            }else if(i==null&&j==null){
                this.logWarn(
                        "Could not find zoomStartValue or zoomEndValue in the data.  Defaulting to show "+
                        "the entire data set.");
                this._setZoomValueRange([{lambda:0.0},{lambda:1.0}],dontRedraw);
                return;
            }else{
                minLambda=len>1?i/(len-1):0;
                maxLambda=len>1?j/(len-1):1;
            }
        }
    }else if(type=="float"){
        if(byLambda){
            startDataValue=(1.0-minLambda)*minDataValue+minLambda*maxDataValue;
            endDataValue=(1.0-maxLambda)*minDataValue+maxLambda*maxDataValue;
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var delta=maxDataValue-minDataValue;
            minLambda=delta>0?(min.dataValue-minDataValue)/delta:0;
            maxLambda=delta>0?(max.dataValue-minDataValue)/delta:1;
        }
        i=isc.FacetChart._binarySearch(data,0,len-1,"title",startDataValue);
        j=isc.FacetChart._binarySearch(data,0,len-1,"title",endDataValue);
        if(i<0)i=-(1+i);
        if(j<0)j=-(2+j);
    }else if(type=="date"){
        var comparator=this._dateComparator,
            minTime=minDataValue.getTime(),
            maxTime=maxDataValue.getTime();
        if(byLambda){
            startDataValue=new Date(Math.floor((1.0-minLambda)*minTime+minLambda*maxTime));
            endDataValue=new Date(Math.ceil((1.0-maxLambda)*minTime+maxLambda*maxTime));
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var startTime=startDataValue.getTime(),
                endTime=endDataValue.getTime(),
                delta=maxTime-minTime;
            minLambda=delta>0?(startTime-minTime)/delta:0;
            maxLambda=delta>0?(endTime-minTime)/delta:1;
        }
        i=isc.FacetChart._binarySearch(data,0,len-1,"title",startDataValue,comparator);
        j=isc.FacetChart._binarySearch(data,0,len-1,"title",endDataValue,comparator);
        if(i<0)i=-(1+i);
        if(j<0)j=-(2+j);
    }
    isc.addProperties(range[0],{
        index:i,
        dataValue:startDataValue,
        lambda:minLambda
    });
    isc.addProperties(range[1],{
        index:j,
        dataValue:endDataValue,
        lambda:maxLambda
    });
    this._zoomValueRange=range;
    delete this._zoomDataBounds;
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all;
        for(var j=settings.length;j--;){
            delete settings[j]._zoomDataBounds;
        }
    }
    if(!dontRedraw){
        this._redrawFacetChart(false);
    }
}
,isc.A._getZoomStartValue=function isc_FacetChart__getZoomStartValue(){
    return this._getZoomValueRange()[0].dataValue;
}
,isc.A._getZoomEndValue=function isc_FacetChart__getZoomEndValue(){
    return this._getZoomValueRange()[1].dataValue;
}
,isc.A._getZoomDataBounds=function isc_FacetChart__getZoomDataBounds(context){
    context=context||this;
    if(context._zoomDataBounds!=null){
        return context._zoomDataBounds;
    }
    var data=this.getOrderedData(),
        len=data.length,
        range=this._getZoomValueRange(),
        start=range[0].index,
        end=1+range[1].index;
    var isExtraAxisChart=(context!=this),
        extraAxisMetric=isExtraAxisChart&&context._metric,
        stacked=context.isMultiFacet()&&this.isStacked(context);
    var minValue,maxValue;
    if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
        var numSeries=data[start].series.length;
        if(stacked){
            for(var i=start;i<end;++i){
                var series=data[i].series,value=0;
                for(var j=0;j<numSeries;++j){
                    var v=(isExtraAxisChart?series[j].record[extraAxisMetric]:series[j].value);
                    if(isc.isA.Number(v)){
                        value+=v;
                        minValue=(minValue==null?value:Math.min(minValue,value));
                        maxValue=(maxValue==null?value:Math.max(maxValue,value));
                    }
                }
            }
        }else{
            for(var i=start;i<end;++i){
                var series=data[i].series;
                for(var j=0;j<numSeries;++j){
                    var value=(isExtraAxisChart?series[j].record[extraAxisMetric]:series[j].value);
                    if(isc.isA.Number(value)){
                        minValue=(minValue==null?value:Math.min(minValue,value));
                        maxValue=(maxValue==null?value:Math.max(maxValue,value));
                    }
                }
            }
        }
    }else if(this.isMultiFacet()){
        var fixedFacetValue=this._getFixedFacetValue(context),
            seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
        for(var i=start;i<end;++i){
            var value=data[i].series[seriesIndex].record[extraAxisMetric];
            if(isc.isA.Number(value)){
                minValue=(minValue==null?value:Math.min(minValue,value));
                maxValue=(maxValue==null?value:Math.max(maxValue,value));
            }
        }
    }else{
        for(var i=start;i<end;++i){
            var value=(isExtraAxisChart?data[i].record[extraAxisMetric]:data[i].value);
            if(isc.isA.Number(value)){
                minValue=(minValue==null?value:Math.min(minValue,value));
                maxValue=(maxValue==null?value:Math.max(maxValue,value));
            }
        }
    }
    return(context._zoomDataBounds={
        minValue:minValue,
        maxValue:maxValue,
        minDataValue:this._getZoomStartValue(),
        maxDataValue:this._getZoomEndValue()
    });
}
,isc.A._getMinLabelGap=function isc_FacetChart__getMinLabelGap(vertical,props){
    if(this.minLabelGap!=null)return this.minLabelGap;
    if(vertical){
        return Math.ceil(this.measureLabel("Xy",props).height/2);
    }else{
        return this.measureLabel("XXXX",props).width;
    }
}
,isc.A._calculateAxisLayout=function isc_FacetChart__calculateAxisLayout(axes,horizontalAxis,availableWidth,availableHeight){
    var numAxes=axes.length,
        location=new Array(numAxes),
        axisMeasureCaches=new Array(numAxes),
        utilityCache=[];
    for(var j=numAxes;j--;){
        location[j]=0;
        axisMeasureCaches[j]=[];
    }
    var utilityFn=function(location,extra){
        return isc.FacetChart._objective(
            axisMeasureCaches,utilityCache,axes,
            horizontalAxis,location,availableWidth,availableHeight,extra);
    };
    var solution=isc.FacetChart._localSearch(axes,utilityFn,location),
        solutionFound=(solution!=null);
    var info={};
    utilityFn(location,info);
    return info;
}
,isc.A._createAxis=function isc_FacetChart__createAxis(vertical,context,minAxisWidth){
    context=context||this;
    minAxisWidth=minAxisWidth||0;
    var labelCollapseMode=this.labelCollapseMode,
        valueGradations=this.chartType=="Scatter"||
                (vertical&&this.hasYGradations())||(!vertical&&this.hasXGradations());
    var axis=null;
    if(valueGradations){
        if(this._showYGradations){
            if((context.chartType!="Scatter"||vertical)&&this.shouldUseLogGradations(context)){
                axis=isc.FacetChart._createLogGradationsAxis(vertical);
            }else{
                var primary=context.chartType!="Scatter"||vertical;
                axis=isc.FacetChart._createLinearGradationsAxis(primary,vertical);
            }
        }else{
            axis=isc.FacetChart._createEmptyAxis(vertical);
        }
    }else{
        if(labelCollapseMode=="numeric"){
            axis=isc.FacetChart._createLabelCollapseModeNumericAxis(vertical);
        }else if(labelCollapseMode=="time"){
            axis=isc.FacetChart._createLabelCollapseModeTimeAxis(vertical);
        }else if(labelCollapseMode=="sample"){
            axis=isc.FacetChart._createLabelCollapseModeSampleAxis(vertical);
        }else{
            axis=isc.FacetChart._createLabelCollapseModeNoneAxis(vertical);
        }
    }
    axis.rotateLabels=function(measure){
        return measure._rotated;
    };
    axis.useGradations=function(measure){
        return measure._useGradations;
    };
    axis.logScale=function(measure){
        return measure._useGradations&&measure._logScale;
    };
    axis.init(this,context,minAxisWidth);
    return axis;
}
);
isc.B._maxIndex=isc.C+237;

isc.A=isc.FacetChart;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._assert=function isc_c_FacetChart__assert(flag){
    if(!flag){
        ;
    }
}
,isc.A._evenIndexOf=function isc_c_FacetChart__evenIndexOf(arr,obj,pos,endPos){
    pos=arr.indexOf(obj,pos,endPos);
    while(!(pos==-1||pos%2==0)){
        pos=arr.indexOf(obj,pos+1,endPos);
    }
    return pos;
}
,isc.A._oddIndexOf=function isc_c_FacetChart__oddIndexOf(arr,obj,pos,endPos){
    pos=arr.indexOf(obj,pos,endPos);
    while(!(pos==-1||pos%2==1)){
        pos=arr.indexOf(obj,pos+1,endPos);
    }
    return pos;
}
,isc.A._calculateOrdinaryLeastSquares=function isc_c_FacetChart__calculateOrdinaryLeastSquares(X,y){
    var XtX=isc.Math._dotAtA(X),
        L=isc.Math._cholesky(XtX);
    if(L==null){
        var Xplus=isc.Math._pseudoInv(X);
        if(Xplus==null){
            return null;
        }else{
            var m=Xplus.length,n=Xplus[0].length,
                b=new Array(m);
            for(var i=m;i--;){
                var Xplusi=Xplus[i],sum=0;
                for(var j=n;j--;){
                    sum+=Xplusi[j]*y[j];
                }
                b[i]=sum;
            }
            return b;
        }
    }
    var Xty=isc.Math._dotAtb(X,y);
    var n=L.length,z=new Array(n);
    for(var i=0;i<n;++i){
        var Li=L[i],
            sum=0;
        for(var j=i;j--;){
            sum+=Li[j]*z[j];
        }
        z[i]=(Xty[i]-sum)/Li[i];
    }
    var beta=new Array(n);
    for(var i=n;i--;){
        var sum=0;
        for(var j=i+1;j<n;++j){
            sum+=L[j][i]*beta[j];
        }
        beta[i]=(z[i]-sum)/L[i][i];
    }
    return beta;
}
,isc.A._generatePolynomial=function isc_c_FacetChart__generatePolynomial(beta){
    var degree=beta.length-1;
    var sb=isc.StringBuffer.newInstance();
    sb.append("return ");
    for(var i=degree;i--;){
        sb.append("(");
    }
    sb.append(beta[degree]);
    for(var i=degree;i--;){
        sb.append("*x+",beta[i],")");
    }
    sb.append(";");
    return new Function("x",sb.toString());
}
,isc.A._calculateBestFitPolynomial=function isc_c_FacetChart__calculateBestFitPolynomial(degree,x,y){
    var m=x.length,n=degree+1,
        M=new Array(m);
    for(var i=m;i--;){
        var Mi=M[i]=new Array(n),
            xval=x[i];
        for(var j=0,powX=1;j<n;++j,powX*=xval){
            Mi[j]=powX;
        }
    }
    var coefficients=isc.FacetChart._calculateOrdinaryLeastSquares(M,y);
    return(coefficients!=null?isc.FacetChart._generatePolynomial(coefficients):null);
}
,isc.A._clipDrawPathToRect=function isc_c_FacetChart__clipDrawPathToRect(points,chartRect,round){
    var n=points.length;
    if(n==0){
        return[];
    }
    var bounds=[chartRect.left,chartRect.top,chartRect.left+chartRect.width,chartRect.top+chartRect.height],
        drawPaths=[],
        path=null,
        prevPoint,point=points[0],
        slope=new Array(2);
    if(bounds[0]<=point[0]&&point[0]<=bounds[2]&&bounds[1]<=point[1]&&point[1]<=bounds[2]){
        path=[point];
    }
    for(var i=1;i<n;++i){
        prevPoint=point;
        point=points[i];
        slope[0]=1/(slope[1]=(point[1]-prevPoint[1])/(point[0]-prevPoint[0]));
        var p0=prevPoint,p1=point;
        for(var m=0;m<4;++m){
            var k=m%2,l=(k+1)%2,s=(m<2?-1:1),bound=bounds[s+1+k];
            var p0WithinBound=!(s*p0[k]>s*bound),
                p1WithinBound=!(s*p1[k]>s*bound);
            if(p0WithinBound^p1WithinBound){
                var newPoint=new Array(2);
                newPoint[k]=bound;
                newPoint[l]=p0[l]+(bound-p0[k])*slope[l];
                if(!p0WithinBound){
                    p0=newPoint;
                }else{
                    p1=newPoint;
                }
            }else if(!(p0WithinBound||p1WithinBound)){
                p0=p1=null;
                break;
            }
        }
        if(p0==null){
        }else{
            if(p0===prevPoint){
            }else{
                if(round){
                    p0[0]=Math.round(p0[0]);
                    p0[1]=Math.round(p0[1]);
                }
                path=[p0];
            }
            if(p1===point){
                path.push(point);
            }else{
                if(round){
                    p1[0]=Math.round(p1[0]);
                    p1[1]=Math.round(p1[1]);
                }
                path.push(p1);
                drawPaths.push(path);
                path=null;
            }
        }
    }
    if(path!=null){
        drawPaths.push(path);
    }
    return drawPaths;
}
,isc.A._bellCurve=function isc_c_FacetChart__bellCurve(mu,sigma,x){
    var z=(x-mu)/sigma;
    return Math.exp(-z*z/2.0);
}
,isc.A._createEmptyAxis=function isc_c_FacetChart__createEmptyAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._context=context;
            this._minParallel=vertical?0:minAxisWidth;
            this._minPerpendicular=vertical?minAxisWidth:0;
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            return[{
                parallel:this._minParallel,
                perpendicular:this._minPerpendicular,
                _rotated:false,
                _useGradations:true,
                _logScale:this._context.logScale
            }];
        },
        utility:function(width,height,measure){return 1;},
        getLabelDataPairs:function(measure){
            var chart=this._chart,
                context=this._context,
                dataBounds=chart._getZoomDataBounds(context),
                minValue=vertical?dataBounds.minValue:dataBounds.minDataValue,
                maxValue=vertical?dataBounds.maxValue:dataBounds.maxDataValue;
            if(minValue==null&&maxValue==null){
                return[];
            }else{
                return[{
                    label:context.formatAxisValue(minValue,!vertical),
                    dataValue:minValue
                },{
                    label:context.formatAxisValue(maxValue,!vertical),
                    dataValue:maxValue
                }];
            }
        }
    };
}
,isc.A._createLinearGradationsAxis=function isc_c_FacetChart__createLinearGradationsAxis(primary,vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._context=context;
            this._minParallel=vertical?0:minAxisWidth;
            this._minPerpendicular=vertical?minAxisWidth:0;
            var minValue,maxValue;
            if(chart.chartType=="Scatter"){
                var metric=primary?chart.getYAxisMetric():chart.getXAxisMetric();
                minValue=Math.min(0,chart.getMinValue(metric));
                maxValue=chart.getMaxValue(metric);
            }else{
                var dataBounds=chart._getZoomDataBounds(context);
                minValue=primary?dataBounds.minValue:dataBounds.minDataValue;
                maxValue=primary?dataBounds.maxValue:dataBounds.maxDataValue;
            }
            this._isEmptyChart=(minValue==null&&maxValue==null);
            if(this._isEmptyChart){
                return;
            }
            if(primary&&!chart._hasExtraAxes()){
                var highErrorMetric=chart._getHighErrorMetric(),
                    lowErrorMetric=chart._getLowErrorMetric();
                if(lowErrorMetric!=null){
                    maxValue=Math.max(maxValue,chart.getMaxValue(lowErrorMetric));
                    minValue=Math.min(minValue,chart.getMinValue(lowErrorMetric));
                }
                if(highErrorMetric!=null){
                    maxValue=Math.max(maxValue,chart.getMaxValue(highErrorMetric));
                    minValue=Math.min(minValue,chart.getMinValue(highErrorMetric));
                }
            }
            this._minValue=minValue;
            this._maxValue=maxValue;
            this._props=context.gradationLabelProperties;
            this._labelHeight=chart._getGradationLabelHeight(context);
            if(primary&&minValue>0&&chart._getRequireZeroGradation(context)){
                minValue=0;
            }
            var valueRange=this._valueRange=maxValue-minValue;
            var magnitude=chart.getMagnitude(valueRange,10,context);
            var high=Math.pow(10,magnitude-1),low=Math.pow(10,(magnitude-2));
            this._possibleIncrements=[
                low,
                2*low,
                5*low,
                10*low,
                2*high,
                5*high
            ];
            this._index=0;
        },
        increaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index<this._possibleIncrements.getLength()-1;
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        measure:function(){
            if(this._isEmptyChart){
                return[{
                    parallel:this._minParallel,
                    perpendicular:this._minPerpendicular,
                    _rotated:false,
                    _gradations:[],
                    _useGradations:true,
                    _logScale:false
                }];
            }
            var chart=this._chart,
                context=this._context,
                showInlineLabels=!primary&&chart.showInlineLabels,
                minValue=this._minValue,
                maxValue=this._maxValue,
                props=this._props,
                minHorizontalLabelGap=chart._getMinLabelGap(false,props),
                minVerticalLabelGap=chart._getMinLabelGap(true,props),
                increment=this._possibleIncrements[this._index],
                labelHeight=this._labelHeight,
                maxLabelWidth=0,
                maxLabelWidthBetweenGradations=0,
                gradations=[],
                gradation;
            var base,ceil;
            if(primary){
                if(minValue<0||!chart._getRequireZeroGradation(context)){
                    base=Math.floor(minValue/increment)*increment;
                }else{
                    base=0;
                }
                ceil=Math.ceil(maxValue/increment)*increment;
            }else{
                base=Math.ceil(minValue/increment)*increment;
                ceil=Math.floor(maxValue/increment)*increment;
            }
            var numGradations=1+Math.round((ceil-base)/increment),
                oneGradationLabel=false;
            if(numGradations==1){
                if(!primary){
                    base=Math.floor(minValue/increment)*increment;
                }
                ceil=Math.ceil(maxValue/increment)*increment;
                if(base==ceil){
                    ceil+=increment;
                    oneGradationLabel=true;
                }
                numGradations=1+Math.round((ceil-base)/increment);
            }
            var scale=(Math.max(ceil,maxValue)-Math.min(base,minValue))/(ceil-base);
            var cutoff=1.5*Math.max(chart._getAvailableWidth(),chart._getAvailableHeight()),
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                parallelLengthIsHeight=(vertical||(tryRotatingLabels&&!showInlineLabels)),
                parallelLengthIsWidth=!(vertical||forceRotateLabels),
                cutoffHeight=!parallelLengthIsHeight,
                cutoffWidth=!parallelLengthIsWidth;
            var prevLabelWidth=0,
                i=0;
            for(;i<numGradations;i++){
                gradation=base+(i*increment);
                gradations.add(gradation);
                if(!(cutoffHeight&&cutoffWidth)&&!(oneGradationLabel&&i>0)){
                    var labelWidth=chart.measureLabel(context.formatAxisValue(gradation,!vertical),props).width;
                    if(!showInlineLabels){
                        var sum=labelWidth+prevLabelWidth;
                        if(sum>maxLabelWidthBetweenGradations){
                            maxLabelWidthBetweenGradations=sum;
                        }
                        if(labelWidth>maxLabelWidth)maxLabelWidth=labelWidth;
                        prevLabelWidth=labelWidth;
                    }else{
                        if(i!=numGradations-1&&labelWidth>maxLabelWidthBetweenGradations){
                            maxLabelWidthBetweenGradations=labelWidth;
                        }
                    }
                    if(!cutoffHeight){
                        cutoffHeight=Math.ceil(
                                scale*
                                Math.max(chart.pixelsPerGradation,labelHeight+minVerticalLabelGap)*
                                (numGradations-1))>cutoff;
                    }
                    if(!cutoffWidth){
                        cutoffWidth=Math.ceil(
                                scale*
                                Math.max(chart.pixelsPerGradation,maxLabelWidthBetweenGradations+minHorizontalLabelGap)*
                                (numGradations-1))>cutoff;
                    }
                }
            }
            if(!showInlineLabels){
                maxLabelWidthBetweenGradations=Math.ceil(maxLabelWidthBetweenGradations/2);
            }
            var ret=[];
            if(parallelLengthIsHeight){
                ret.push({
                    parallel:Math.max(Math.ceil(
                            scale*
                            Math.max(chart.pixelsPerGradation,labelHeight+minVerticalLabelGap)*
                            (numGradations-1)),this._minParallel),
                    perpendicular:Math.max(maxLabelWidth,this._minPerpendicular),
                    _rotated:!vertical&&tryRotatingLabels,
                    _gradations:gradations,
                    _oneGradationLabel:oneGradationLabel,
                    _useGradations:true,
                    _logScale:false
                });
            }
            if(parallelLengthIsWidth){
                ret.push({
                    parallel:Math.max(Math.ceil(
                            scale*
                            Math.max(chart.pixelsPerGradation,maxLabelWidthBetweenGradations+minHorizontalLabelGap)*
                            (numGradations-1)),this._minParallel),
                    perpendicular:Math.max((showInlineLabels?0:labelHeight),this._minPerpendicular),
                    _rotated:false,
                    _gradations:gradations,
                    _oneGradationLabel:oneGradationLabel,
                    _useGradations:true,
                    _logScale:false
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            if(this._isEmptyChart)return 1.0;
            var chart=this._chart,
                axisLength=vertical?height:width,
                valueRange=this._valueRange,
                gradations=measure._gradations,
                gradationsRange=gradations.last()-gradations.first(),
                numGradations=gradations.length,
                pixelsPerGradation=axisLength*valueRange/gradationsRange*(numGradations-1);
            return isc.FacetChart._bellCurve(chart.pixelsPerGradation,3.0,pixelsPerGradation);
        },
        getLabelDataPairs:function(width,height,measure){
            var context=this._context,
                oneGradationLabel=measure._oneGradationLabel;
            return measure._gradations.map(function(gradation,i){
                var label=(!oneGradationLabel||i==0?
                        context.formatAxisValue(gradation,!vertical):"");
                return{label:label,dataValue:gradation};
            });
        }
    };
}
,isc.A._createLogGradationsAxis=function isc_c_FacetChart__createLogGradationsAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._context=context;
            this._minParallel=vertical?0:minAxisWidth;
            this._minPerpendicular=vertical?minAxisWidth:0;
            var minValue,maxValue;
            if(chart.chartType=="Scatter"){
                var metric=(vertical?chart.getYAxisMetric():chart.getXAxisMetric());
                minValue=chart.getMinValue(metric);
                maxValue=chart.getMaxValue(metric);
            }else{
                var dataBounds=chart._getZoomDataBounds(context);
                minValue=dataBounds.minValue;
                maxValue=dataBounds.maxValue;
            }
            this._isEmptyChart=(minValue==null&&maxValue==null);
            var props=this._props=context.gradationLabelProperties;
            this._minHorizontalLabelGap=chart._getMinLabelGap(false,props);
            this._minVerticalLabelGap=chart._getMinLabelGap(true,props);
            this._gradations=chart.getLogGradations(maxValue,minValue,null,context);
            this._labelHeight=chart._getGradationLabelHeight(context);
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            if(this._isEmptyChart){
                return[{
                    parallel:this._minParallel,
                    perpendicular:this._minPerpendicular,
                    _rotated:false,
                    _useGradations:true,
                    _logScale:true
                }];
            }
            var chart=this._chart,
                context=this._context,
                showInlineLabels=chart.showInlineLabels,
                props=this._props,
                gradations=this._gradations,
                numGradations=gradations.getLength(),
                minHorizontalLabelGap=this._minHorizontalLabelGap,
                minVerticalLabelGap=this._minVerticalLabelGap,
                labelHeight=this._labelHeight;
            var minLog=chart.logValue(gradations.first(),null,context),
                maxLog=chart.logValue(gradations.last(),null,context);
            var ret=[],
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels();
            if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                var logGradations=context.logGradations,delta;
                for(var i=0;i<logGradations.getLength();++i){
                    var d=chart.logValue(gradations[i+1],null,context)
                            -chart.logValue(gradations[i],null,context);
                    if(delta==null||d<delta){
                        delta=d;
                    }
                }
                var maxWidth=0;
                for(var i=0;i<numGradations;++i){
                    var labelWidth=chart.measureLabel(context.formatAxisValue(gradations[i],!vertical),props).width;
                    if(labelWidth>maxWidth)maxWidth=labelWidth;
                }
                ret.push({
                    parallel:Math.max(
                        Math.ceil((labelHeight+minVerticalLabelGap)*(maxLog-minLog)/delta),
                        this._minParallel),
                    perpendicular:Math.max(maxWidth,this._minPerpendicular),
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:true,
                    _gradations:gradations,
                    _logScale:true
                });
            }
            if(!(vertical||forceRotateLabels)){
                var max=0.0,
                    prevW=chart.measureLabel(context.formatAxisValue(gradations[0],!vertical),props).width,
                    prevLogValue=minLog;
                for(var i=1;i<numGradations;++i){
                    var w=chart.measureLabel(context.formatAxisValue(gradations[i],!vertical),props).width,
                        logValue=chart.logValue(gradations[i],null,context),
                        delta=logValue-prevLogValue,
                        m;
                    if(!showInlineLabels){
                        m=Math.ceil(((prevW+w)/2.0+minHorizontalLabelGap)*(maxLog-minLog)/delta);
                    }else if(i!=numGradations-1){
                        m=Math.ceil((w+minHorizontalLabelGap)*(maxLog-minLog)/delta);
                    }
                    if(m>max)max=m;
                    prevW=w;
                    prevLogValue=logValue;
                }
                ret.push({
                    parallel:Math.max(max,this._minParallel),
                    perpendicular:Math.max((showInlineLabels?0:labelHeight),this._minPerpendicular),
                    _rotated:false,
                    _useGradations:true,
                    _gradations:gradations,
                    _logScale:true
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            return measure._rotated?0.5:1.0;
        },
        getLabelDataPairs:function(width,height,measure){
            if(this._isEmptyChart){
                return[];
            }
            var context=this._context;
            return this._gradations.map(function(gradation){
                return{label:context.formatAxisValue(gradation,!vertical),dataValue:gradation};
            });
        }
    };
}
,isc.A._createLabelCollapseModeNoneAxis=function isc_c_FacetChart__createLabelCollapseModeNoneAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._data=chart.getOrderedData();
            this._props=chart.dataLabelProperties;
            this._labelHeight=chart.getDataLabelHeight();
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                data=this._data,
                props=this._props,
                len=data.getLength(),
                maxHeight=this._labelHeight,
                sumHeight=(len-1)*maxHeight,
                maxWidth=0,sumWidth=0;
            for(var i=0;i<len;++i){
                var label=data[i].title;
                var labelWidth=chart.measureLabel(label,props).width;
                if(i==0||i==len-1){
                    sumWidth+=Math.ceil(labelWidth/2);
                }else{
                    sumWidth+=labelWidth;
                }
                if(labelWidth>maxWidth)maxWidth=labelWidth;
            }
            var ret=[],
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                canRotate=!vertical&&tryRotatingLabels&&!showInlineLabels;
            if(vertical||canRotate){
                ret.push({
                    parallel:0,
                    perpendicular:maxWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:false,
                    _totalLabelLength:sumHeight,
                    _totalUnrotatedLabelLength:sumWidth
                });
            }
            if(!(vertical||forceRotateLabels)){
                ret.push({
                    parallel:(canRotate?sumWidth:0),
                    perpendicular:(showInlineLabels?0:maxHeight),
                    _rotated:false,
                    _useGradations:false,
                    _totalLabelLength:sumWidth
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var axisLength=vertical?height:width,
                totalLabelLength=measure._totalLabelLength,
                rotated=measure._rotated,
                totalUnrotatedLabelLength=measure._totalUnrotatedLabelLength,
                forceRotateLabels=(this._chart.rotateLabels=="always"&&!this._chart.showInlineLabels);
            if(rotated&&!forceRotateLabels&&totalUnrotatedLabelLength<axisLength){
                return 0.0;
            }else if(totalLabelLength>axisLength){
                return 0.5*isc.FacetChart._bellCurve(axisLength,0.1*axisLength,totalLabelLength);
            }else{
                return 1.0;
            }
        },
        getLabelDataPairs:function(width,height,measure){
            var data=this._data;
            return data.map(function(d){
                return{label:d.title,dataValue:d.title};
            });
        }
    };
}
,isc.A._createLabelCollapseModeNumericAxis=function isc_c_FacetChart__createLabelCollapseModeNumericAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._data=chart.getOrderedData();
            this._props=chart.gradationLabelProperties;
            this._labelHeight=chart._getGradationLabelHeight();
            var axis=this._gradationsAxis=
                    isc.FacetChart._createLinearGradationsAxis(false,vertical);
            axis.init(chart,context,minAxisWidth);
            while(axis.decreaseScope())
                ;
            this._scope=0;
        },
        increaseScope:function(){
            var axis=this._gradationsAxis;
            var flag=this._scope==0||axis.increaseScope();
            if(flag)++this._scope;
            return flag;
        },
        decreaseScope:function(){
            var axis=this._gradationsAxis;
            var flag=this._scope>0;
            if(flag){
                if(this._scope!=1)axis.decreaseScope();
                --this._scope;
            }
            return flag;
        },
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                props=this._props,
                data=this._data,
                axis=this._gradationsAxis,
                labelHeight=this._labelHeight,
                useGradations=this._scope!=0;
            if(!useGradations){
                var len=data.getLength(),
                    maxHeight=labelHeight,
                    sumHeight=(len-1)*maxHeight,
                    maxWidth=0,
                    sumWidth=0;
                for(var i=0;i<len;++i){
                    var label=chart.formatAxisValue(data[i].title,!vertical),
                        labelWidth=chart.measureLabel(label,props).width;
                    if(!showInlineLabels&&(i==0||i==len-1)){
                        sumWidth+=Math.ceil(labelWidth/2);
                    }else if(!showInlineLabels||(i!=len-1)){
                        sumWidth+=labelWidth;
                    }
                    if(labelWidth>maxWidth)maxWidth=labelWidth;
                }
                var ret=[],
                    forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                    tryRotatingLabels=chart._canRotateLabels();
                if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                    ret.push({
                        parallel:sumHeight,
                        perpendicular:maxWidth,
                        _rotated:!vertical&&tryRotatingLabels,
                        _useGradations:useGradations
                    });
                }
                if(!(vertical||forceRotateLabels)){
                    ret.push({
                        parallel:sumWidth,
                        perpendicular:(showInlineLabels?0:maxHeight),
                        _rotated:false,
                        _useGradations:useGradations
                    });
                }
                return ret;
            }else{
                return axis.measure().map(function(m){
                    m._useGradations=true;
                    return m;
                });
            }
        },
        utility:function(width,height,measure){
            var axis=this._gradationsAxis,useGradations=measure._useGradations;
            return!useGradations?1.0:0.5*axis.utility(width,height,measure);
        },
        getLabelDataPairs:function(width,height,measure){
            var chart=this._chart,
                data=this._data;
                axis=this._gradationsAxis,
                useGradations=measure._useGradations;
            if(!useGradations){
                return data.map(function(d){
                    return{label:chart.formatAxisValue(d.title,!vertical),dataValue:d.title};
                });
            }else{
                return axis.getLabelDataPairs(width,height,measure);
            }
        }
    };
}
,isc.A._createLabelCollapseModeTimeAxis=function isc_c_FacetChart__createLabelCollapseModeTimeAxis(vertical){
    var all=0,
        seconds=1000,
        minutes=60*seconds,
        quarterHours=15*minutes,
        halfHours=2*quarterHours,
        hours=2*halfHours,
        days=24*hours,
        weeks=7*days,
        months=30*days,
        quarters=3*months,
        years=365*days;
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            var data=this._data=chart.getOrderedData();
            var range=this._range=chart._getZoomValueRange();
            var dataBounds=this._dataBounds=chart._getZoomDataBounds();
            this._isEmptyChart=(dataBounds.minDataValue==null&&dataBounds.maxDataValue==null);
            var discrete=this._discrete=(chart.chartType=="Column");
            var props=this._props=chart.gradationLabelProperties;
            this._apr99=chart.measureLabel("Apr 99",props);
            this._apr9999=chart.measureLabel("Apr 9999",props);
            this._9999=chart.measureLabel("9999",props);
            this._2359pm=chart.measureLabel(
                    isc.Time.toShortTime(isc.Time.parseInput("23:59pm")),props);
            this._internationalization=this._detectInternationalization();
            var minDate=dataBounds.minDataValue,
                maxDate=dataBounds.maxDataValue,
                start=range[0].index,
                end=1+range[1].index,
                len=end-start,
                scopes;
            if(len<2){
                scopes=[all];
            }else{
                scopes=[quarterHours,halfHours,hours,days,weeks,months,quarters,years];
                var interval=null;
                if(discrete){
                    var i=start,
                        prevTime=data[i].title.getTime(),
                        time=data[i+1].title.getTime();
                    for(;i<end-1;prevTime=time,time=data[++i].title.getTime()){
                        var diff=time-prevTime;
                        if(diff>0&&(interval==null||diff<interval)){
                            interval=diff;
                        }
                    }
                }else{
                    interval=(maxDate.getTime()-minDate.getTime())/(len-1);
                }
                for(var i=0;i<scopes.length-1;){
                    if(scopes[i]+scopes[i+1]<2*interval){
                        scopes.splice(i,1);
                    }else{
                        ++i;
                    }
                }
                scopes.push(all);
            }
            this._scopes=scopes;
            this._index=scopes.indexOf(all);
        },
        increaseScope:function(){
            if(this._isEmtpyChart)return false;
            var scopes=this._scopes,
                flag=this._index<scopes.getLength()-1;
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        _floor:function(scope,date){
            var year=date.getFullYear(),
                month=date.getMonth(),
                day=date.getDate(),
                hour=date.getHours(),
                minute=date.getMinutes();
            if(scope==quarterHours){
                return new Date(year,month,day,hour,15*Math.floor(minute/15),0,0);
            }else if(scope==halfHours){
                return new Date(year,month,day,hour,30*Math.floor(minute/30),0,0);
            }else if(scope==hours){
                return new Date(year,month,day,hour,0,0,0);
            }else if(scope==days){
                return new Date(year,month,day);
            }else if(scope==weeks){
                var firstDayOfWeek=isc.DateChooser.getPrototype().firstDayOfWeek,
                    floorDay=day-((7+date.getDay()-firstDayOfWeek)%7);
                return new Date(year,month,floorDay);
            }else if(scope==months){
                return new Date(year,month,1);
            }else if(scope==quarters){
                return new Date(year,3*Math.floor(month/3),1);
            }else if(scope==years){
                return new Date(year,0,1);
            }
        },
        _ceil:function(scope,date){
            var year=date.getFullYear(),
                month=date.getMonth(),
                day=date.getDate(),
                hour=date.getHours(),
                minute=date.getMinutes(),
                second=date.getSeconds(),
                millisecond=date.getMilliseconds();
            if(scope==quarterHours){
                if(second+millisecond>0)++minute;
                return new Date(year,month,day,hour,15*Math.ceil(minute/15),0,0);
            }else if(scope==halfHours){
                if(second+millisecond>0)++minute;
                return new Date(year,month,day,hour,30*Math.ceil(minute/30),0,0);
            }else if(scope==hours){
                if(minute+second+millisecond>0)++hour;
                return new Date(year,month,day,hour,0,0,0);
            }else if(scope==days){
                if(hour+minute+second+millisecond>0)++day;
                return new Date(year,month,day);
            }else if(scope==weeks){
                var firstDayOfWeek=isc.DateChooser.getPrototype().firstDayOfWeek,
                    dayOfWeek=date.getDay();
                if(hour+minute+second+millisecond>0){
                    ++day;
                    dayOfWeek=(dayOfWeek+1)%7;
                }
                var ceilDay=day+((7-(dayOfWeek-firstDayOfWeek))%7);
                return new Date(year,month,ceilDay);
            }else if(scope==quarters){
                if(second+millisecond+minute+hour+day-1>0)++month;
                return new Date(year,3*Math.ceil(month/3),1);
            }else{
                var floorDate=this._floor(scope,date);
                if(floorDate.getTime()==date.getTime()){
                    return floorDate;
                }else if(scope==months){
                    return new Date(year,month+1,1);
                }else if(scope==years){
                    return new Date(year+1,0,1);
                }
            }
        },
        _round:function(scope,date){
            var time=date.getTime(),
                floorDate=this._floor(scope,date),
                floorTime=floorDate.getTime(),
                ceilDate=this._ceil(scope,date),
                ceilTime=ceilDate.getTime();
            if(time-floorTime<ceilTime-time){
                return floorDate;
            }else{
                return ceilDate;
            }
        },
        _addScope:function(scope,date,n){
            var year=date.getFullYear(),
                month=date.getMonth(),
                day=date.getDate(),
                hour=date.getHours(),
                minute=date.getMinutes();
            if(scope==quarterHours){
                return new Date(year,month,day,hour,minute+15*n,0,0);
            }else if(scope==halfHours){
                return new Date(year,month,day,hour,minute+30*n,0,0);
            }else if(scope==hours){
                return new Date(year,month,day,hour+n,0,0,0);
            }else if(scope==days){
                return new Date(year,month,day+n);
            }else if(scope==weeks){
                return new Date(year,month,day+7*n);
            }else if(scope==months){
                return new Date(year,month+n,1);
            }else if(scope==quarters){
                return new Date(year,month+3*n,1);
            }else if(scope==years){
                return new Date(year+n,0,1);
            }
        },
        _next:function(scope,date){
            return this._addScope(scope,date,1);
        },
        _prev:function(scope,date){
            return this._addScope(scope,date,-1);
        },
        _detectInternationalization:function(){
            var chart=this._chart,
                shortMonthNames=Date.getShortMonthNames(),
                englishShortMonthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                shortDayNames=Date.getShortDayNames(),
                englishShortDayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for(var i=0,len=shortMonthNames.getLength();i<len;++i){
                if(shortMonthNames[i]!=englishShortMonthNames[i]){
                    return true;
                }
            }
            for(var i=0,len=shortDayNames.getLength();i<len;++i){
                if(shortDayNames[i]!=englishShortDayNames[i]){
                    return true;
                }
            }
            return false;
        },
        _getMaxDiscreteAxisLength:function(chart,data,dataLength,maxLabelSpacing,minBarsBetweenLabels){
            var minAxisLength=0,
                maxAxisLength=Math.max(maxLabelSpacing/minBarsBetweenLabels*dataLength),
                info={},
                epsilon=1;
            for(var i=1000;(maxAxisLength-minAxisLength>epsilon)&&i--;){
                var axisLength=Math.round((minAxisLength+maxAxisLength)/2);
                info=chart._calculateBarLayout(
                        chart,data,dataLength,axisLength+2*chart.dataMargin,0,info);
                var spacing=minBarsBetweenLabels*info.clusterSize+(minBarsBetweenLabels-1)*info.clusterGap;
                if(spacing<=maxLabelSpacing){
                    minAxisLength=axisLength;
                }else{
                    maxAxisLength=axisLength;
                }
            }
            return maxAxisLength;
        },
        measure:function(){
            var chart=this._chart,
                discrete=this._discrete,
                clustered=discrete&&chart.isMultiFacet()&&!chart.isStacked(),
                showInlineLabels=chart.showInlineLabels,
                props=this._props,
                availableSpace=Math.max(chart._getAvailableWidth(),chart._getAvailableHeight()),
                cutoff=1.5*availableSpace,
                minHorizontalLabelGap=chart._getMinLabelGap(false,props),
                minVerticalLabelGap=chart._getMinLabelGap(true,props),
                scopes=this._scopes,
                scope=scopes[this._index],
                useGradations=(!discrete&&scope!=all),
                pairs=[],len,
                forceRotateLabels=(chart.rotateLabels=="always"&&!chart.showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                parallelLengthIsSumHeight=(vertical||(tryRotatingLabels&&!chart.showInlineLabels)),
                parallelLengthIsSumWidth=!(vertical||forceRotateLabels);
            var slack=(this._internationalization?5:0);
            var sumWidth=0,maxWidth,
                sumHeight=0,maxHeight;
            var dataBounds=this._dataBounds,
                data=this._data;
            if(discrete){
                var range=this._range,
                    start=range[0].index,
                    end=1+range[1].index,
                    dataLength=end-start;
                var k=(scope==all?1:null),
                    maxLength=0,
                    maxLengthLabel=null,
                    isFirstLabel=true;
                var labelDate=(scope!=all&&this._round(scope,data[start].title)),
                    i0=start;
                for(var i=start,triedRounding=false;i<end;){
                    var date;
                    if(scope==all){
                        date=labelDate=data[i].title;
                    }else{
                        var j=isc.FacetChart._binarySearch(
                                    data,i,end-1,"title",labelDate,chart._dateComparator);
                        if(j<0){
                            var insertionPoint=-(1+j);
                            if(insertionPoint==i&&!triedRounding){
                                triedRounding=true;
                                labelDate=this._round(scope,data[i].title);
                                continue;
                            }else if(insertionPoint==end){
                                break;
                            }else{
                                var time=labelDate.getTime(),
                                    canUseLeft=(insertionPoint>i),
                                    leftDate=canUseLeft&&data[insertionPoint-1].title,
                                    prevTime=canUseLeft&&this._prev(scope,labelDate).getTime(),
                                    leftLambda=canUseLeft&&((time-leftDate.getTime())/(time-prevTime)),
                                    useLeft=canUseLeft&&(0<=leftLambda&&leftLambda<0.1),
                                    canUseRight=(insertionPoint<end),
                                    rightDate=canUseRight&&data[insertionPoint].title,
                                    nextTime=canUseRight&&this._next(scope,labelDate).getTime(),
                                    rightLambda=canUseRight&&((rightDate.getTime()-time)/(nextTime-time)),
                                    useRight=canUseRight&&(0<=rightLambda&&rightLambda<0.1);
                                if(useLeft&&useRight){
                                    useLeft=(leftLambda<rightLambda);
                                    useRight=!useLeft;
                                }
                                if(useLeft){
                                    i=insertionPoint-1;
                                }else if(useRight){
                                    i=insertionPoint;
                                }else{
                                    if(!triedRounding){
                                        triedRounding=true;
                                        labelDate=this._round(scope,data[i].title);
                                    }else{
                                        triedRounding=false;
                                        ++i;
                                    }
                                    continue;
                                }
                            }
                        }else{
                            i=j;
                        }
                        var numBars=i-i0;
                        if(i0!=start&&(k==null||numBars<k)){
                            k=numBars;
                        }
                        date=data[i].title;
                    }
                    var label=this._getDateLabel(scope,labelDate,isFirstLabel);
                    pairs.push({dataValue:date,label:label});
                    if(scope==all){
                        var length=label.length;
                        if(length>maxLength){
                            maxLength=length;
                            maxLengthLabel=label;
                        }
                    }else{
                        triedRounding=false;
                        labelDate=this._next(scope,labelDate);
                    }
                    isFirstLabel=false;
                    i0=i;
                    ++i;
                }
                var maxWidth,maxHeight;
                if(scope==all){
                    maxHeight=chart.measureLabel("Xy",props).height;
                    maxWidth=chart.measureLabel(maxLengthLabel||"",props).width;
                }else if(scope==quarterHours||scope==halfHours||scope==hours){
                    var rep1=this._apr99,
                        rep2=this._2359pm;
                    maxWidth=Math.max(rep1.width+slack,rep2.width);
                    maxHeight=Math.max(rep1.height,rep2.height);
                }else if(scope==days||scope==weeks){
                    var rep=this._apr99;
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                }else if(scope==months||scope==quarters){
                    var rep=this._apr9999;
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                }else if(scope==years){
                    var rep=this._9999;
                    maxWidth=rep.width;
                    maxHeight=rep.height;
                }
                if(parallelLengthIsSumHeight){
                    if(k!=null&&dataLength>1){
                        sumHeight=this._getMaxDiscreteAxisLength(
                                chart,data,dataLength,maxHeight+minVerticalLabelGap,k);
                    }else{
                        sumHeight=0;
                    }
                }
                if(parallelLengthIsSumWidth){
                    if(k!=null&&dataLength>1){
                        sumWidth=this._getMaxDiscreteAxisLength(
                                chart,data,dataLength,maxWidth+minHorizontalLabelGap,k);
                    }else{
                        sumWidth=0;
                    }
                }
            }else{
                var minDate,minTime,maxDate,maxTime;
                if(scope!=all){
                    var minFacetValue=dataBounds.minDataValue,
                        maxFacetValue=dataBounds.maxDataValue;
                    if(discrete){
                        minDate=minFacetValue;
                        maxDate=maxFacetValue;
                    }else{
                        minDate=this._ceil(scope,minFacetValue);
                        maxDate=this._floor(scope,maxFacetValue);
                        if(Date.compareDates(minDate,maxDate)<=0){
                            minDate=this._floor(scope,minFacetValue);
                            maxDate=this._ceil(scope,maxFacetValue);
                            if(Date.compareDates(minDate,maxDate)<=0){
                                minDate=this._floor(scope,new Date(minDate.getTime()-1));
                                maxDate=this._ceil(scope,new Date(maxDate.getTime()+1));
                            }
                        }
                    }
                    minTime=minDate.getTime();
                    maxTime=maxDate.getTime();
                }
                if(scope==all){
                    var range=this._range,
                        start=range[0].index,
                        end=1+range[1].index;
                    len=end-start;
                    maxHeight=chart.measureLabel("Xy",props).height;
                    sumHeight=(len-1)*(maxHeight+minVerticalLabelGap);
                    sumWidth=(len-1)*minHorizontalLabelGap;
                    var cutoffSumHeight=(parallelLengthIsSumHeight&&sumHeight>cutoff),
                        cutoffSumWidth=false,
                        i=0,
                        sumHeight0=sumHeight,
                        sumWidth0=sumWidth;
                    for(i=start;i<end&&!(cutoffSumWidth||cutoffSumHeight);++i){
                        cutoffSumWidth=(parallelLengthIsSumWidth&&sumWidth>cutoff);
                        var date=data[i].title,
                            label=date.toNormalDatetime();
                        var labelWidth=chart.measureLabel(label,props).width;
                        if(!showInlineLabels&&(i==start||i==end-1)){
                            sumWidth+=Math.ceil(labelWidth/2);
                        }else if(!showInlineLabels||i!=end-1){
                            sumWidth+=labelWidth;
                        }
                        if(maxWidth==null||labelWidth>maxWidth)maxWidth=labelWidth;
                        pairs.push({dataValue:date,label:label});
                    }
                    if(cutoffSumWidth||cutoffSumHeight){
                        if(i==start){
                            i=start+1;
                        }
                        sumHeight=sumHeight0+Math.ceil((sumHeight-sumHeight0)/(i-start)*len);
                        sumWidth=sumWidth0+Math.ceil((sumWidth-sumWidth0)/(i-start)*len);
                        if(maxWidth==null){
                            maxWidth=Math.ceil(sumWidth/(i-start));
                        }
                        pairs=[];
                    }
                }else if(scope==quarterHours||scope==halfHours||scope==hours){
                    var minDayTime=this._floor(days,minDate).getTime();
                    len=1+Math.round((maxTime-minTime)/scope);
                    var rep1=this._apr99,
                        rep2=this._2359pm;
                    maxWidth=Math.max(rep1.width+slack,rep2.width);
                    maxHeight=Math.max(rep1.height,rep2.height);
                    sumWidth=(len-1)*(maxWidth+minHorizontalLabelGap);
                    sumHeight=(len-1)*(maxHeight+minVerticalLabelGap);
                    var cutoffSumHeight=(parallelLengthIsSumHeight&&sumHeight>cutoff),
                        cutoffSumWidth=(parallelLengthIsSumWidth&&sumWidth>cutoff);
                    if(!(cutoffSumHeight||cutoffSumWidth)){
                        for(var i=0;i<len;++i){
                            var time=minTime+i*scope,
                                date=new Date(time),
                                label;
                            if((time-minDayTime)%days==0){
                                label=date.getShortMonthName()+" "+date.getDate();
                            }else{
                                label=isc.Time.toShortTime(date);
                            }
                            pairs.push({dataValue:date,label:label});
                        }
                    }
                }else if(scope==days||scope==weeks){
                    len=1+Math.round((maxTime-minTime)/scope);
                    var rep=this._apr99;
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                    sumWidth=(len-1)*(rep.width+slack+minHorizontalLabelGap);
                    sumHeight=(len-1)*(rep.height+minVerticalLabelGap);
                    var cutoffSumHeight=(parallelLengthIsSumHeight&&sumHeight>cutoff),
                        cutoffSumWidth=(parallelLengthIsSumWidth&&sumWidth>cutoff);
                    if(!(cutoffSumHeight||cutoffSumWidth)){
                        for(var i=0;i<len;++i){
                            var date=new Date(minTime+i*scope),
                                label=date.getShortMonthName()+" "+date.getDate();
                            pairs.push({dataValue:date,label:label});
                        }
                    }
                }else if(scope==months||scope==quarters){
                    var shortMonthNames=isc.Date.getShortMonthNames(),
                        month=minDate.getMonth(),
                        year=minDate.getFullYear();
                    len=1+Math.round((maxTime-minTime)/scope);
                    var rep=this._apr9999;
                    sumWidth=(len-1)*(rep.width+slack+minHorizontalLabelGap);
                    sumHeight=(len-1)*(rep.height+minVerticalLabelGap);
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                    var cutoffSumHeight=(parallelLengthIsSumHeight&&sumHeight>cutoff),
                        cutoffSumWidth=(parallelLengthIsSumWidth&&sumWidth>cutoff);
                    if(!(cutoffSumHeight||cutoffSumWidth)){
                        for(var i=0;i<len;++i){
                            var m=(month+(scope==months?i:3*i))%12;
                            if(i!=0&&m==0)++year;
                            var label=(
                                    ((i==0&&
                                    (len==1||m!=(scope==months?11:9)))||
                                    m==0)
                                        ?""+year:shortMonthNames[m]);
                            pairs.push({
                                dataValue:new Date(minTime+Math.round(i*(maxTime-minTime)/(len-1))),
                                label:label
                            });
                        }
                    }
                }else if(scope==years){
                    var year=minDate.getFullYear();
                    len=maxDate.getFullYear()-minDate.getFullYear()+1;
                    var rep=this._9999;
                    sumWidth=(len-1)*(rep.width+minHorizontalLabelGap);
                    sumHeight=(len-1)*(rep.height+minVerticalLabelGap);
                    maxWidth=rep.width;
                    maxHeight=rep.height;
                    for(var i=0;i<len;++i){
                        pairs.push({
                            dataValue:new Date(minTime+Math.round(i*(maxTime-minTime)/(len-1))),
                            label:""+year
                        });
                        ++year;
                    }
                }
            }
            var ret=[];
            if(parallelLengthIsSumHeight){
                ret.push({
                    parallel:sumHeight,
                    perpendicular:maxWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:useGradations,
                    _logScale:false,
                    _labelDataPairs:pairs
                });
            }
            if(parallelLengthIsSumWidth){
                ret.push({
                    parallel:sumWidth,
                    perpendicular:(showInlineLabels?0:maxHeight),
                    _rotated:false,
                    _useGradations:useGradations,
                    _logScale:false,
                    _labelDataPairs:pairs
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var scopes=this._scopes,
                axisLength=vertical?height:width;
            if(scopes[this._index]==all){
                return 1.0;
            }else{
                return 0.5*(1.0-this._index/scopes.getLength());
            }
        },
        getLabelDataPairs:function(width,height,measure){
            return measure._labelDataPairs;
        },
        _getDateLabel:function(scope,date,isFirst){
            if(scope==all){
                return date.toNormalDatetime();
            }else if(scope==quarterHours||scope==halfHours||scope==hours){
                if(date.getHours()==0&&date.getMinutes()==0){
                    return date.getShortMonthName()+" "+date.getDate();
                }else{
                    return isc.Time.toShortTime(date);
                }
            }else if(scope==days||scope==weeks){
                return date.getShortMonthName()+" "+date.getDate();
            }else if(scope==months||scope==quarters){
                var month=date.getMonth();
                if(isFirst||(month==0)){
                    return""+date.getFullYear();
                }else{
                    return isc.Date.getShortMonthNames()[month];
                }
            }else if(scope==years){
                return""+date.getFullYear();
            }else{
                return"";
            }
        }
    };
}
);
isc.evalBoundary;isc.B.push(isc.A._createLabelCollapseModeSampleAxis=function isc_c_FacetChart__createLabelCollapseModeSampleAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            var data=this._data=chart.getOrderedData(),
                range=chart._getZoomValueRange(),
                start=this._start=range[0].index,
                end=range[1].index,
                len=this._len=end-start+1;
            var repLabel="",repLabelLength=0;
            for(var i=start;i<=end;++i){
                var label=data[i].title.toString();
                if(label.length>repLabelLength){
                    repLabel=label;
                    repLabelLength=label.length;
                }
            }
            this._maxLabelWidth=chart.measureLabel(repLabel,chart.dataLabelProperties).width;
            this._labelHeight=chart.getDataLabelHeight();
            this._minHorizontalLabelGap=chart._getMinLabelGap(false,chart.dataLabelProperties);
            this._minVerticalLabelGap=chart._getMinLabelGap(true,chart.dataLabelProperties);
            var availableAxisLength=vertical?chart._getAvailableHeight():chart._getAvailableWidth();
            this._scopes=len<2?[1]:[];
            for(var i=len-1;i>=1;--i){
                var n=1+Math.floor((len-1)/i);
                if(this._scopes.indexOf(n)==-1){
                    this._scopes.push(n);
                }
            }
            this._idealScopes=this._getIdealScopes(len);
            this._index=this._scopes.length-1;
        },
        _range:function(a,b){
            var len=b-a+1,
                r=new Array(len);
            for(var i=0;i<len;++i){
                r[i]=a+i;
            }
            return r;
        },
        _getIdealScopes:function(n){
            if(n>2){
                return isc.FacetChart._getDivisors(n-1)
                        .sort(function(a,b){return a-b;})
                        .map(function(d){return d+1;});
            }else{
                return[n];
            }
        },
        increaseScope:function(){
            var flag=(this._index<this._scopes.getLength()-1);
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                scope=this._scopes[this._index],
                labelHeight=this._labelHeight,
                minHorizontalLabelGap=this._minHorizontalLabelGap,
                minVerticalLabelGap=this._minVerticalLabelGap,
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                ret=[];
            if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                ret.push({
                    parallel:(scope>2?(scope-1)*(labelHeight+minVerticalLabelGap):0),
                    perpendicular:this._maxLabelWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:false
                });
            }
            if(!(vertical||forceRotateLabels)){
                ret.push({
                    parallel:(scope>2?
                            (scope-1)*(this._maxLabelWidth+minHorizontalLabelGap):0),
                    perpendicular:(showInlineLabels?0:labelHeight),
                    _rotated:false,
                    _useGradations:false
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var j=this._idealScopes.indexOf(this._scopes[this._index]);
            if(j!=-1){
                return j/(this._idealScopes.getLength()+1);
            }else{
                return 0.2*this._index/(this._scopes.getLength()+1);
            }
        },
        getLabelDataPairs:function(width,height,measure){
            var chart=this._chart,
                data=this._data,
                n=this._scopes[this._index],
                start=this._start,
                len=this._len;
            var skip=len>2?Math.floor((len-1)/(n-1)):1,
                labelDataPairs=[];
            for(var i=0;i<n-1;++i){
                var j=start+skip*i;
                labelDataPairs.push({label:data[j].title,dataValue:data[j].title});
            }
            if(len>1){
                labelDataPairs.push({label:data[start+len-1].title,dataValue:data[start+len-1].title});
            }
            return labelDataPairs;
        }
    };
}
,isc.A._getDivisors=function isc_c_FacetChart__getDivisors(n){
    var findFactor=isc.FacetChart._findFactor,
        primeFactors=[],powers=[],divisors=[];
    if(n!=1){
        var stack=[n];
        while(!stack.isEmpty()){
            var m=stack.pop();
            var p=findFactor(m);
            if(p==1){
                primeFactors.push(m);
            }else{
                stack.push(p);
                stack.push(m/p);
            }
        }
    }
    for(var i=0,offset=0,len=primeFactors.getLength();i<len;++i){
        var j=i-offset;
        var prime=primeFactors[j];
        var count=1;
        var offset2=0;
        for(var k=j+1;k<len;++k){
            var l=k-offset-offset2;
            if(primeFactors[l]==prime){
                ++count;
                ++offset2;
                primeFactors.splice(l,1);
            }
        }
        len-=offset2;
        powers[j]=count;
    }
    var combinations=1;
    var bases=[];
    for(var i=0,len=powers.getLength();i<len;++i){
        bases.push(combinations);
        combinations*=(powers[i]+1);
    }
    bases.push(combinations);
    for(var i=0;i<combinations;++i){
        var divisor=1;
        for(var j=0,len=primeFactors.getLength();j<len;++j){
            divisor*=Math.pow(primeFactors[j],Math.floor(i/bases[j])%(powers[j]+1));
        }
        divisors.push(divisor);
    }
    return divisors;
}
,isc.A._findFactor=function isc_c_FacetChart__findFactor(n){
    var factor=isc.FacetChart._pollardRho(1,n);
    if(factor!=null)return factor;
    factor=isc.FacetChart._pollardRho(8,n);
    if(factor!=null)return factor;
    if(n==4){
        return 2;
    }else if(n==5713){
        return 197;
    }else if(n==8927){
        return 113;
    }else if(n==42733){
        return 283;
    }else if(n==51379){
        return 269;
    }
    return 1;
}
,isc.A._gcd=function isc_c_FacetChart__gcd(a,b){
    var r0=a,r1=b,r2;
    while((r2=r0%r1)!=0){
        r0=r1;
        r1=r2;
    }
    return r1;
}
,isc.A._pollardRho=function isc_c_FacetChart__pollardRho(c,n){
    var gcd=isc.FacetChart._gcd,
        x=2,y=2,d=1;
    while(d==1){
        x=(x*x+c)%n;
        var temp=(y*y+c)%n;
        y=(temp*temp+c)%n;
        d=gcd(Math.abs(x-y),n);
    }
    return(d==n?null:d);
}
,isc.A._objective=function isc_c_FacetChart__objective(axisMeasureCaches,utilityCache,axes,horizontalAxis,location,availableWidth,availableHeight,extra){
    var saveExtraInfo=isc.isAn.Object(extra),
        cachedUtility=isc.FacetChart._getCacheByAxes(utilityCache,location);
    if(!saveExtraInfo&&cachedUtility!=null){
        return cachedUtility;
    }
    var numAxes=axes.length;
    for(var i=numAxes;i--;){
        if(axisMeasureCaches[i][location[i]]==null){
            axisMeasureCaches[i][location[i]]=axes[i].measure();
        }
    }
    var maxUtility=null,
        k=axes.indexOf(horizontalAxis);
    var i=1;
    for(var j=numAxes;j--;){i*=axisMeasureCaches[j][location[j]].length;}
    var axisWidths=new Array(numAxes),
        axisHeights=new Array(numAxes),
        digits=new Array(numAxes);
    for(;i--;){
        var flag=false,
            reqWidth=0,
            reqHeight=null;
        for(var j=numAxes,n=i;j--;){
            var m=axisMeasureCaches[j][location[j]],
                d=digits[j]=n%m.length,
                axisWidth,axisHeight;
            if(j==k){
                axisWidth=axisWidths[j]=m[d].parallel;
                axisHeight=axisHeights[j]=m[d].perpendicular;
            }else{
                axisWidth=axisWidths[j]=m[d].perpendicular;
                axisHeight=axisHeights[j]=m[d].parallel;
            }
            reqWidth+=axisWidth;
            reqHeight=(reqHeight==null?axisHeight:Math.max(reqHeight,axisHeight));
            n=(n-d)/m.length;
        }
        if(reqWidth<=availableWidth&&reqHeight<=availableHeight){
            axisWidths[k]+=availableWidth-reqWidth;
            var verticalAxisHeight=availableHeight-axisHeights[k],
                utility=1.0;
            for(var j=numAxes;j--;){
                var m=axisMeasureCaches[j][location[j]];
                if(j!=k){
                    axisHeights[j]=verticalAxisHeight;
                }
                utility*=(1+axes[j].utility(axisWidths[j],axisHeights[j],m[digits[j]]));
            }
            if(maxUtility==null||utility>maxUtility){
                flag=true;
                maxUtility=utility;
            }
        }else{
            var utility=Math.min(
                    (availableWidth-reqWidth)*availableHeight,
                    availableWidth*(availableHeight-reqHeight));
            if(maxUtility==null||utility>maxUtility){
                flag=true;
                maxUtility=utility;
            }
            var horizontalAxisHeight=axisHeights[k]=Math.min(axisHeights[k],availableHeight),
                verticalAxisWidth=0;
            for(var j=numAxes;j--;){
                if(j!=k){
                    if(availableWidth<reqWidth){
                        var w=axisWidths[j]=Math.floor(axisWidths[j]*availableWidth/reqWidth);
                        verticalAxisWidth+=w;
                    }
                    axisHeights[j]=availableHeight-horizontalAxisHeight;
                }
            }
            if(!(availableWidth<reqWidth)){
                verticalAxisWidth=reqWidth-axisWidths[k];
            }
            axisWidths[k]=availableWidth-verticalAxisWidth;
        }
        if(flag&&saveExtraInfo){
            var axisMeasures=new Array(numAxes);
            for(var j=numAxes;j--;){
                axisMeasures[j]=axisMeasureCaches[j][location[j]][digits[j]];
            }
            isc.addProperties(extra,{
                axisMeasures:axisMeasures.duplicate(),
                axisWidths:axisWidths.duplicate(),
                axisHeights:axisHeights.duplicate()
            });
        }
    }
    isc.FacetChart._setCacheByAxes(utilityCache,location,maxUtility);
    return maxUtility;
}
,isc.A._getCacheByAxes=function isc_c_FacetChart__getCacheByAxes(cache,location){
    var numAxes=location.length;
    for(var i=0;i<numAxes-1;++i){
        if(cache[location[i]]==null){
            return null;
        }else{
            cache=cache[location[i]];
        }
    }
    return cache[location[numAxes-1]];
}
,isc.A._setCacheByAxes=function isc_c_FacetChart__setCacheByAxes(cache,location,newValue){
    var numAxes=location.length;
    for(var i=0;i<numAxes-1;++i){
        if(cache[location[i]]==null){
            cache=cache[location[i]]=[];
        }else{
            cache=cache[location[i]];
        }
    }
    cache[location[numAxes-1]]=newValue;
    return newValue;
}
,isc.A._localSearch=function isc_c_FacetChart__localSearch(axes,utilityFn,location){
    var moveFn=isc.FacetChart._move,
        moveToFn=isc.FacetChart._moveTo,
        locationToVertex=isc.FacetChart._locationToVertex,
        binarySearch=isc.FacetChart._binarySearch,
        _this=this,
        numAxes=axes.length;
    var bounds=new Array(2*numAxes);
    for(var i=2*numAxes;i--;)bounds[i]=null;
    var utilityCache=[];
    var bestUtilityLocation=location.duplicate();
    var bestUtility=utilityFn(location);
    isc.FacetChart._setCacheByAxes(utilityCache,location,bestUtility);
    var graph=this._createLocationGraph();
    for(;;){
        var center=location.duplicate(),
            cachedUtility=isc.FacetChart._getCacheByAxes(utilityCache,location),
            utility;
        if(cachedUtility==null){
            utility=isc.FacetChart._setCacheByAxes(utilityCache,location,utilityFn(location));
        }else{
            utility=cachedUtility;
        }
        var maxUtility=null,
            maxUtilityLocation=null,
            locations=[],
            utilities=[],
            move=new Array(numAxes);
        for(var i=numAxes;i--;){
            move[i]=0;
        }
        var maximum=true,minimum=true,partialMaxCount=0,partialMinCount=0;
        for(var i=numAxes;i--;){
            var partialMax=true,partialMin=true;
            for(var step=-1;step<=1;step+=2){
                move[i]=step;
                var moved=moveFn(axes,move,location,bounds);
                if(moved){
                    var u=utilityFn(location);
                    if(u>utility){
                        locations.push(location.duplicate());
                        utilities.push(u);
                    }
                    maximum=maximum&&utility>=u;
                    minimum=minimum&&utility<=u;
                    partialMax=partialMax&&utility>u;
                    partialMin=partialMin&&utility<u;
                    isc.FacetChart._setCacheByAxes(utilityCache,location,u);
                    if(maxUtility==null||u>maxUtility){
                        maxUtility=u;
                        maxUtilityLocation=location.duplicate();
                    }
                }
                moveToFn(axes,location,center,bounds);
            }
            if(!(partialMin&&partialMax)){
                if(partialMin)++partialMinCount;
                if(partialMax)++partialMaxCount;
            }
            move[i]=0;
        }
        var saddle=!maximum&&(numAxes<2||(partialMinCount>1&&partialMaxCount>1));
        minimum=minimum&&!(maximum||saddle);
        if(maxUtility!=null&&maxUtility>bestUtility){
            bestUtility=maxUtility;
            bestUtilityLocation=maxUtilityLocation;
        }
        if(maximum&&utility>=0){
            return location;
        }
        graph.visit(center,utility,maximum,minimum,saddle,
                locations,utilities);
        var newLocation=graph.getNewLead();
        if(newLocation!=null){
            moveToFn(axes,location,newLocation);
        }else{
            var foundNewLocation=false;
            if(numAxes==2){
                this._spiral(axes,bounds,location,null,false,function(curLoc){
                    var u=utilityFn(curLoc),
                        flag=u>bestUtility;
                    isc.FacetChart._setCacheByAxes(utilityCache,curLoc,u);
                    if(flag){
                        bestUtility=u;
                        bestUtilityLocation=curLoc.duplicate();
                        foundNewLocation=true;
                    }
                    return flag;
                });
            }
            if(!foundNewLocation){
                moveToFn(axes,location,bestUtilityLocation);
                return null;
            }
        }
    }
}
,isc.A._spiral=function isc_c_FacetChart__spiral(axes,bounds,location,radius,visitCenter,callback){
    var move=isc.FacetChart._move;
    var exitEarly=true;
    if(bounds==null){
        bounds=[null,null,null,null];
    }
    if(!isc.isA.Number(radius)&&radius!=Number.NEGATIVE_INFINITY){
        radius=Number.POSITIVE_INFINITY;
    }else if(radius<0){
        radius=0;
    }
    if(visitCenter&&callback&&callback(location)==exitEarly){
        return;
    }
    var center=location.duplicate();
    var dimensions=[1,1];
    var radii=[0,0,0,0];
    var steps=[1,1];
    var mv=[0,0];
    var triedSwap=false;
    var triedOtherSide=false;
    var lastResort=false;
    for(var k=0,l;true;k=l){
        l=(k+1)%2;
        var w=dimensions[k],h=dimensions[l];
        var step=steps[k];
        var bound=bounds[step+1+k];
        mv[k]=step;
        mv[l]=0;
        var r;
        var boundCond=(bound==null||step*location[k]<step*bound);
        var cond=!triedOtherSide&&boundCond&&
                (r=radii[step+1+k])<radius&&r<1+radii.min();
        if(cond&&move(axes,mv,location)!=null){
            ++dimensions[k];
            ++radii[step+1+k];
            steps[k]=-steps[k];
            if(callback&&callback(location)==exitEarly){
                return;
            }
            mv[k]=0;
            mv[l]=steps[l];
            for(var i=0,len=h-1;i<len;++i){
                move(axes,mv,location);
                if(callback&&callback(location)==exitEarly){
                    return;
                }
            }
            triedSwap=lastResort=false;
        }else{
            if(cond){
                bounds[step+1+k]=location[k];
            }
            if(!boundCond||cond){
                radii[step+1+k]=radius;
            }
            if(!triedSwap){
                steps[k]=-steps[k];
                steps[l]=-steps[l];
                triedSwap=true;
                continue;
            }
            step=-steps[k];
            bound=bounds[step+1+k];
            boundCond=(bound==null||step*(location[k]+step*w)<=step*bound);
            if(boundCond&&radii[step+1+k]<radius)
            {
                steps[k]=-steps[k];
                mv[k]=(w-1)*step;
                mv[l]=0;
                move(axes,mv,location);
                triedOtherSide=lastResort=false;
                l=k;
            }else{
                if(!boundCond){
                    radii[step+1+k]=radius;
                }
                if(!triedOtherSide){
                    steps[k]=-steps[k];
                    steps[l]=-steps[l];
                    triedOtherSide=true;
                    continue;
                }else{
                    if(!lastResort){
                        triedSwap=triedOtherSide=false;
                        lastResort=true;
                        steps[k]=-steps[k];
                        steps[l]=-steps[l];
                        continue;
                    }
                    return;
                }
            }
        }
    }
}
,isc.A._createLocationGraph=function isc_c_FacetChart__createLocationGraph(){
    return{
        vertices:[],
        leads:[],
        _utilityCmp:function(u1,u2){
            return u1-u2;
        },
        _locationToKey:function(location){
            return location.join(",");
        },
        _keyToLocation:function(key){
            return key.split(",").map(parseInt,10);
        },
        _getVertex:function(location){
            var key=this._locationToKey(location);
            var j=isc.FacetChart._binarySearch(this.vertices,0,this.vertices.length-1,"key",key);
            if(j<0){
                var obj={
                    key:key,
                    forward:[],
                    reverse:[]
                };
                this.vertices.addAt(obj,-(1+j));
                return obj;
            }else{
                return this.vertices[j];
            }
        },
        getNewLead:function(){
            var vertex;
            while(!this.leads.isEmpty()&&!(vertex=this.leads.pop()).visited)
                ;
            return vertex!=null?this._keyToLocation(vertex.key):null;
        },
        visit:function(location,utility,maximum,minimum,saddle,nextLocations,utilities){
            var vertex=this._getVertex(location);
            vertex.visited=true;
            vertex.utility=utility;
            vertex.maximum=maximum;
            vertex.minimum=minimum;
            vertex.saddle=saddle;
            vertex.temporary=!(maximum||minimum||saddle);
            for(var i=0,len=nextLocations.length;i<len;++i){
                var lead=this._getVertex(nextLocations[i]),
                    u=utilities[i];
                if(u>utility){
                    if(!lead.visited){
                        var j=isc.FacetChart._binarySearch(this.leads,0,this.leads.length-1,"utility",u,this._utilityCmp);
                        this.leads.addAt(lead,j<0?-(1+j):j);
                    }
                    this._addEdge(vertex,lead);
                }
            }
        },
        _addEdge:function(vertex1,vertex2){
            if(vertex2.visited){
                while(vertex2.temporary&&!vertex2.forward.isEmpty()){
                    vertex2=vertex2.forward[0];
                }
            }
            var j=isc.FacetChart._binarySearch(vertex1.forward,0,vertex1.forward.length-1,"key",vertex2.key);
            if(j<0){
                vertex1.forward.addAt(vertex2,-(1+j));
            }
            var k=isc.FacetChart._binarySearch(vertex2.reverse,0,vertex2.reverse.length-1,"key",vertex1.key);
            if(k<0){
                vertex2.reverse.addAt(vertex1,-(1+k));
            }
        }
    };
}
,isc.A._move=function isc_c_FacetChart__move(axes,move,location,bounds){
    var numAxes=axes.length,
        success=true;
    if(bounds!=null){
        for(var i=numAxes;success&&i--;){
            var min=bounds[i],
                max=bounds[numAxes+i],
                pos=location[i]+move[i];
            success=(min==null||min<=pos)&&(max==null||pos<=max);
        }
        if(!success){
            return null;
        }
    }
    for(var i=numAxes;success&&i--;){
        var mag=Math.abs(move[i]),
            step=(move[i]>0?1:-1),
            actionObj=axes[i],
            action=move[i]>0?"increaseScope":"decreaseScope";
        for(var j=0;success&&j<mag;++j){
            success=actionObj[action].call(actionObj);
            if(success){
                location[i]+=step;
            }else if(bounds!=null){
                bounds[Math.max(step,0)*numAxes+i]=location[i];
            }
        }
    }
    return success?location:null;
}
,isc.A._moveTo=function isc_c_FacetChart__moveTo(axes,locationA,locationB,bounds){
    var numAxes=axes.length,
        move=new Array(numAxes);
    for(var i=numAxes;i--;){
        move[i]=locationB[i]-locationA[i];
    }
    return isc.FacetChart._move(axes,move,locationA,bounds);
}
,isc.A._binarySearch=function isc_c_FacetChart__binarySearch(arr,i,j,property,value,comparator){
    if(!isc.isA.Function(comparator))comparator=null;
    if(arr.isEmpty())return-1;
    if(comparator!=null&&property!=null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                cmp=comparator(value,arr[k][property]);
            if(cmp<0){
                j=k;
            }else if(cmp>0){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        var cmpI=comparator(value,arr[i][property]);
        if(cmpI<0){
            k=i;
        }else if(!(cmpI>0)){
            return i;
        }else{
            var cmpJ=comparator(value,arr[j][property]);
            if(i!=j&&cmpJ<0){
                k=j;
            }else if(i!=j&&!(cmpJ>0)){
                return j;
            }else{
                k=j+1;
            }
        }
        return-(1+k);
    }else if(comparator==null&&property!=null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                v=arr[k][property];
            if(value<v){
                j=k;
            }else if(value>v){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        if(value<arr[i][property]){
            k=i;
        }else if(!(value>arr[i][property])){
            return i;
        }else if(i!=j&&value<arr[j][property]){
            k=j;
        }else if(i!=j&&!(value>arr[j][property])){
            return j;
        }else{
            k=j+1;
        }
        return-(1+k);
    }else if(comparator==null&&property==null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                v=arr[k];
            if(value<v){
                j=k;
            }else if(value>v){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        if(value<arr[i]){
            k=i;
        }else if(!(value>arr[i])){
            return i;
        }else if(i!=j&&value<arr[j]){
            k=j;
        }else if(i!=j&&!(value>arr[j])){
            return j;
        }else{
            k=j+1;
        }
        return-(1+k);
    }
}
);
isc.evalBoundary;isc.B.push();
isc.B._maxIndex=isc.C+28;

}else{
    isc.defineClass("FacetChart","Canvas","Chart");
    isc.A=isc.FacetChart;
isc.A.invalidClass=true;
isc.A.invalidErrorMessage="FacetChart class requires optional Drawing module which is "+
                "not loaded. Please make sure the Drawing module is included in this page "+
                "before the Charts module."
    ;

    isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_FacetChart_initWidget(){
            this.logWarn(isc.FacetChart.invalidErrorMessage);
            this.Super("initWidget",arguments);
        }
);
isc.B._maxIndex=isc.C+1;

}
isc.A=isc.FacetChart;
isc.A.allChartTypes=["Area","Column","Bar","Line","Pie","Doughnut","Radar"];
isc.A.regressionLinesContextMenuItemTitle="Regression Lines";
isc.A.hideRegressionLinesContextMenuItemTitle="None";
isc.A.linearRegressionLinesContextMenuItemTitle="Straight Line";
isc.A.polynomialRegressionLinesContextMenuItemTitle="Polynomial Curve";
isc.A.polynomialDegreeRegressionLinesContextMenuItemTitle="Polynomial Degree...";
isc.A.polynomialDegreePrompt="Enter a degree for the polynomial regression curve (must be a positive integer):";
isc.A.invalidPolynomialDegreeMessage="The regression polynomial degree must be a positive integer."
;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Charts');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Charts_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Charts module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Charts'.");}

/*

  SmartClient Ajax RIA system
  Version v9.0p_2013-08-08/PowerEdition Deployment (2013-08-08)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

