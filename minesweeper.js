// Test Funcs
// See Inspect Element's Console Log Output

// getGameXML();

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

var game_title= document.createElement("span");
game_title.id="game-title";
t = document.createTextNode("Minesweeper Online - Beginner!");
game_title.appendChild(t);
title_bar.appendChild(game_title);

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
document.body.appendChild(win);

// ------------------------first step finished!