// Test Funcs
// See Inspect Element's Console Log Output
var levelsNum;
var timeCounter;
var counter;
var startFlag ;
var foundedMines ;
var guessedMines;
var cell;
var mineCells;
var wined;
var interval;

/*
 getNewGame(`
 <request>
 <rows>3</rows>
 <cols>3</cols>
 <mines>3</mines>
 </request>
 `);
 */

var modal=document.createElement("div");
modal.id="alert-modal";
modal.className ="modal";

var modal_content=document.createElement("div");
modal_content.className="modal-content";

modal.appendChild(modal_content);

var input = document.createElement("input");
input.type="text";
input.id="name";
input.className="filed";
input.setAttribute("required","");
input.setAttribute('placeholder','Enter your name');
input.setAttribute('pattern','[A-Za-z ]*');
input.title="you just can use A-Z a-z and space!";
modal_content.appendChild(input);

var btn = document.createElement("BUTTON");
btn.id="okbtn";
btn.style.marginLeft="10px";
var t = document.createTextNode("OK");
btn.appendChild(t);
modal_content.appendChild(btn);
document.body.appendChild(modal);

document.getElementById("okbtn").addEventListener("click",validation,false)
function validation() {
    console.log("validation");
    var s=document.getElementById("name");

    if(/^[a-z]+$/i.test(s.value))
        document.getElementById("alert-modal").style.display="none";

}


var win= document.createElement("div");
win.id="win";
win.className="window";

var title_bar = document.createElement("div");
title_bar.id="titlebar";
title_bar.className="title-bar";

win.appendChild(title_bar);

var game_tit= document.createElement("span");
game_tit.id="game-title";
t = document.createTextNode("Minesweeper Online - Beginner!");
game_tit.appendChild(t);
title_bar.appendChild(game_tit);

var d= document.createElement("div");

var s = document.createElement("span");
s.className="btn";
s.id="btn-minimize";
t = document.createTextNode("-");
s.appendChild(t);

var s1 = document.createElement("span");
s1.className="btn";
s1.id="btn-close";
t = document.createTextNode(" x");
s1.appendChild(t);
d.appendChild(s);
d.appendChild(s1);
title_bar.appendChild(d);

var d= document.createElement("div");
d.className="top";

var s = document.createElement("span");
s.className="counter";
t = document.createTextNode("123");
s.appendChild(t);

var s1 = document.createElement("span");
s1.className="smile";
s1.id="smile";
s1.setAttribute("data-value","normal");

var s2 = document.createElement("span");
s2.className="counter";
t = document.createTextNode("321");
s2.appendChild(t);

d.appendChild(s);
d.appendChild(s1);
d.appendChild(s2);

win.appendChild(d);

var grid= document.createElement("div");
grid.className="grid";
grid.id="grid";
win.appendChild(grid);

document.body.appendChild(win);

// ------------------------first step finished!

var xml_str = getGameXML();

parser = new DOMParser();
xmlDoc = parser.parseFromString(xml_str,"text/xml");

// console.log(xml_str);

var game_id=xmlDoc.getElementsByTagName("game")[0].id;
var game_title = xmlDoc.getElementsByTagName("game")[0].attributes[1].value;
validate(xmlDoc);
var levels=[];
levelsNum = xmlDoc.getElementsByTagName("level").length;
for (var i =0 ; i < levelsNum; i++){
    // levels.push([]);
    var level=[];
    level["id"]=xmlDoc.getElementsByTagName("level")[i].id;
    level["title"]=xmlDoc.getElementsByTagName("level")[i].attributes[1].value;
    level["timer"]=xmlDoc.getElementsByTagName("level")[i].attributes[2].value;
    level["rows"]=xmlDoc.getElementsByTagName("level")[i].children[0].textContent;
    level["cols"]=xmlDoc.getElementsByTagName("level")[i].children[1].textContent;
    level["mines"]=xmlDoc.getElementsByTagName("level")[i].children[2].textContent;
    level["time"]=xmlDoc.getElementsByTagName("level")[i].children[3].textContent;

    levels.push(level);
}
// xml validation
function validate(xml) {
    if(game_id != "minesweeper")
        alert("xml id is incorrect");
    if(!game_title)
        alert("xml:game title is required");
    for (var i =0 ; i < levelsNum; i++){
        if(!(levels[i]["id"] && levels[i]["title"] && levels[i]["timer"] && levels[i]["rows"] && levels[i]["cols"] && levels[i]["mines"]))
            alert("there is a problem in xml tags, please fix it before continue");
    }
}

//--------------------second step finished!

var currentLevel;

function makeNewGameXml(){
    var level=currentLevel;
    var xml = "<request>" +
        "<rows>"+levels[level]["rows"]+"</rows>"+
        "<cols>"+levels[level]["cols"]+"</cols>"+
        "<mines>"+levels[level]["mines"]+"</mines>"+
        "</request>";
    return xml;
}

function makeXSL() {
// This XSL Should Convert level.xml to
// appreciate DOM elements for #grid.
    var xml= `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
     <xsl:template match="/">
        <xsl:for-each select="/grid/row">
            <xsl:for-each select="col">
       <xsl:choose>
                    <xsl:when test="@mine ='true'">
                        <span  data-value="mine">
			 <xsl:attribute name="id"><xsl:value-of select="@col"/><xsl:value-of select="../@row"/></xsl:attribute>
			</span>
                    </xsl:when>
                    <xsl:otherwise>
                        <span>
			 <xsl:attribute name="id"><xsl:value-of select="@col"/><xsl:value-of select="../@row"/></xsl:attribute>
			</span>	
                    </xsl:otherwise>
          	  </xsl:choose>

            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>
  </xsl:stylesheet>
    `
;
    return new DOMParser().parseFromString(xml,"text/xml")
}


function newGame() {
    timeCounter=0;
    counter=0;
    startFlag = false;
    foundedMines = 0;
    guessedMines =0;
    cell=[];
    mineCells=[];
    wined=false;



    currentLevel=_rand(0,levels.length-1);



    var requestXML=makeNewGameXml();

    getNewGame(requestXML, function(xmlStr) {
// Process and convert xmlStr to DOM using XSLTProcessor

        var xsl=makeXSL();
        var xml=new  DOMParser().parseFromString(xmlStr,"text/xml");
        // console.log(xml.children[0].tagName);
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById("grid").appendChild(resultDocument);
    });

    for (var n= 1 ; n <=levels[currentLevel]["cols"];n++ )
        for (var m= 1 ; m <=levels[currentLevel]["rows"];m++ ){

            cell.push(document.getElementById(n*10+m));
            if(document.getElementById(n*10+m).getAttribute("data-value")=="mine")
                mineCells.push(document.getElementById(n*10+m));

        }

    for(var i=0 ; i <cell.length;i++){
        cell[i].addEventListener('mousedown', function (e){
            console.log(e.which);
            if(e.which === 1){
                // console.log("hello");
                leftclickedCell(this.id);
            }
            else if(e.which === 3){
                this.setAttribute("oncontextmenu","javascript:return false;");
                rightClickedCell(this.id);

            }
            else if(e.which === 2){
                questionfunc(this.id);
            }
        }, false);

        cell[i].addEventListener('mouseup', function (e){
            console.log("hi");
            if(e.which === 1){
                console.log("left click revealed");
                leftclickRevealedCell(this.id);
            }

        }, false);


    }


    document.getElementById("smile").setAttribute("data-value","normal");
    numberCalc();
    document.getElementsByClassName("counter")[1].textContent=0;
    document.getElementsByClassName("counter")[0].textContent=parseInt(levels[currentLevel]["mines"]);
}

function questionfunc(clicked_id) {

    if(document.getElementById(clicked_id).getAttribute("data-state")!="questioned") {
        document.getElementById(clicked_id).setAttribute("data-state", "questioned");
    }
    else {
        document.getElementById(clicked_id).setAttribute("data-state", "");
    }
}


document.onload=newGame();
document.getElementsByClassName("smile")[0].onclick=function () {
    alert("start new game?");
    if(document.getElementById("grid").childElementCount>0)
    {
        var element=document.getElementById("grid");
        while(element.firstChild)
            element.removeChild(element.firstChild);
    }
    newGame();
};

function leftclickedCell(clicked_id){
    startFlag=true;
    console.log(startFlag);
    counter++;
    if(counter==1)
        startGame();
    if(levels[currentLevel]["timer"] != "true") {
        document.getElementsByClassName("counter")[1].textContent = counter;
    }
    document.getElementById(clicked_id).className = "active";
}

function leftclickRevealedCell(clicked_id){
    if(document.getElementById(clicked_id).getAttribute("data-state")!="mineGuessed") {
        document.getElementById(clicked_id).className = "revealed";
        if (document.getElementById(clicked_id).getAttribute("data-value") == "mine") {
            wined = false;
            finishGame("booombed");
        }
        else {
            revealNeighbours(clicked_id);
            showNeighbours(clicked_id);
        }
    }
    else
        document.getElementById(clicked_id).className=""
}

function rightClickedCell(clicked_id) {
    if(guessedMines< parseInt(levels[currentLevel]["mines"])) {

        for(var m=0 ; m < mineCells.length ; m++)
            if(document.getElementById(clicked_id)==mineCells[m]){
                mineCells.splice(m,1);

            }

        if(document.getElementById(clicked_id).getAttribute("data-state")!="mineGuessed") {
            guessedMines++;
            updateMineCounter();
            document.getElementById(clicked_id).setAttribute("data-state", "mineGuessed");
        }
        else {
            guessedMines--;
            updateMineCounter();
            document.getElementById(clicked_id).setAttribute("data-state", "");
        }
    }
    if(mineCells.length==0){
        wined=true;
        finishGame("win");
    }

}

function startGame(){
    if(levels[currentLevel]["timer"] == "true") {
        if (startFlag == true) { //timer
            interval=setInterval(setTimer, 1000);
        }
    }


}

function updateMineCounter() {
    document.getElementsByClassName("counter")[0].textContent = parseInt(levels[currentLevel]["mines"])-guessedMines;
}

function setTimer(){
    if(timeCounter <= parseInt(levels[currentLevel]["time"])){
        document.getElementsByClassName("counter")[1].textContent = timeCounter;
        timeCounter++;
    }
    else{
        alert("time is up!");
        finishGame("time");
    }

}


function revealNeighbours(clicked_id){
    // console.log(levels[currentLevel]["cols"]);
    for(var i=-1 ; i < 2 ; i++) {
       var colId = Math.floor(parseInt(clicked_id) / 10) + i;
        // console.log("colID1" + colId);

        if( colId > 0 && colId <= levels[currentLevel]["cols"] ){
            // console.log("coldID2" + colId);
            for (var j=-1 ; j< 2 ; j++) {
                rowID=parseInt(clicked_id)%10+j;
                // console.log("rowID"+rowID)
                if(rowID > 0 && rowID <= levels[currentLevel]["rows"] ) {
                    var nid = (colId) * 10 + (rowID);
                    // console.log("nID"+nid);
                    if(document.getElementById(nid).getAttribute("data-check")!= "true"){
                        document.getElementById(nid).setAttribute("data-check","true");
                        if (document.getElementById(nid).getAttribute("data-value") != "mine" && document.getElementById(nid).getAttribute("data-state") != "mineGuessed") {
                            document.getElementById(nid).className = "revealed";
                            revealNeighbours(nid);
                        }

                    }
                }
            }
        }
    }
}

function showNeighbours(clicked_id){
    if(document.getElementById(clicked_id).className == "revealed") {
        var guessCount = 0;
        for (var i = -1; i < 2; i++) {
            var colId = Math.floor(parseInt(clicked_id) / 10) + i;
            if (colId > 0 && colId <= levels[currentLevel]["cols"]) {
                for (var j = -1; j < 2; j++) {
                    rowID = parseInt(clicked_id) % 10 + j;
                    if (rowID > 0 && rowID <= levels[currentLevel]["rows"]) {
                        var nid = (colId) * 10 + (rowID);
                        if (document.getElementById(nid).getAttribute("data-state") != "mineGuessed") {
                            guessCount++;

                        }
                    }
                }
            }
        }
        if (guessCount == document.getElementById(nid).getAttribute("data-value"))
            for (var i = -1; i < 2; i++) {
                var colId = Math.floor(parseInt(clicked_id) / 10) + i;
                if (colId > 0 && colId <= levels[currentLevel]["cols"]) {
                    for (var j = -1; j < 2; j++) {
                        rowID = parseInt(clicked_id) % 10 + j;
                        if (rowID > 0 && rowID <= levels[currentLevel]["rows"]) {
                            var nid = (colId) * 10 + (rowID);
                            document.getElementById(nid).className = "revealed";

                        }
                    }
                }
            }
    }
}


function numberCalc() {

    for (var n= 1 ; n <=levels[currentLevel]["cols"];n++ )
        for (var m= 1 ; m <=levels[currentLevel]["rows"];m++ ) {
            var minecount = 0;
            cid=n*10+m;
            for (var i = -1; i < 2; i++) {
                var colId = Math.floor(parseInt(cid) / 10) + i;
                if (colId > 0 && colId <= levels[currentLevel]["cols"]) {
                    for (var j = -1; j < 2; j++) {
                        if(!(i==0 && j==0)) {
                            rowID = parseInt(cid) % 10 + j;
                            // console.log("rowID"+rowID)
                            if (rowID > 0 && rowID <= levels[currentLevel]["rows"]) {
                                var nid = (colId) * 10 + (rowID);
                                if (document.getElementById(nid).getAttribute("data-value") == "mine")
                                    minecount++;
                            }
                        }
                    }
                }
            }
            if (document.getElementById(cid).getAttribute("data-value") != "mine") {
                document.getElementById(cid).setAttribute("data-value", minecount);
            }
        }
}

function finishGame(reason) {
    document.getElementsByClassName("counter")[1].textContent=0;
    console.log("wined"+wined);
    if (wined == true) {
        document.getElementById("smile").setAttribute("data-value","win");
        alert("you won");
        // v
    } else {
        document.getElementById("smile").setAttribute("data-value","");
        alert("you looose");

    }
    if(document.getElementById("grid").childElementCount>0)
    {
        var element=document.getElementById("grid");
        while(element.firstChild)
            element.removeChild(element.firstChild);
    }
    clearInterval(interval);
    newGame();
}

document.getElementById("smile").addEventListener("mousemove",function () {document.getElementById("smile").setAttribute("data-value","hover");},false);
document.getElementById("smile").addEventListener("mouseout",function () {document.getElementById("smile").setAttribute("data-value","normal");},false);




window.onload = addListeners;
function addListeners(){
    document.getElementById('titlebar').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
    window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    console.log("X"+e.clientX);
    console.log("Y"+e.clientY);

    //
    var div = document.getElementById('win');
    // div.style.position = 'absolute';
    console.log(div.style.top);
    div.style.top = e.clientY+' px';
    div.style.left = e.clientX+' px';
}