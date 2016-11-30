// Test Funcs
// See Inspect Element's Console Log Output



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
input.id="name";
input.className="filed";
input.setAttribute('placeholder','Enter your name');
modal_content.appendChild(input);

var btn = document.createElement("BUTTON");
btn.style.marginLeft="10px";
var t = document.createTextNode("OK");
btn.appendChild(t);
modal_content.appendChild(btn);
document.body.appendChild(modal);



var win= document.createElement("div");
win.className="window";

var title_bar = document.createElement("div");
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

var levels=[];
var levelsNum = xmlDoc.getElementsByTagName("level");
for (var i =0 ; i < levelsNum.length; i++){
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


//--------------------second step finished!


function makeNewGameXml(){
    var level=_rand(0,levels.length-1);
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
        // xsltProcessor = new XSLTProcessor();
        // xsltProcessor.importStylesheet(makeXSL());
        // // console.log(makeXSL().children[0].tagName);
        // resultDocument = xsltProcessor.transformToFragment(xmlStr, document);
        //
        // document.getElementById('grid').appendChild(resultDocument);
    });
}
newGame();