//looks for class XQTable, and populates with content editable cells
var eXQTTable;
var iRows = 100, iCols = 100; /*x:cols, y:rows*/
var iTickWait = 1000;

function makeXQTable(){
    var XQTelement = document.getElementsByClassName("XQTable");
    XQTelement = XQTelement[0];
    XQTelement.appendChild(eDrawEmptyXQTTable(iCols,iRows));
    XQTelement.appendChild(drawXQTConsole());
}



/*initialization functions*/
function eDrawEmptyXQTTable(columns, rows){
    /* draws an empty table, and sets up the html attributes */
    var eXQTTableWrapper = document.createElement('div');
    eXQTTable = document.createElement('table');
    eXQTTableWrapper.appendChild(eXQTTable);
    eXQTTableWrapper.className = "XQTTableWrapper";
    eXQTTable.className = "XQTTable";

    eXQTTable.addEventListener("input", fOnEditTable, false); /*true lets this event fire first, before cellEdit Event*/
    
    for(var iRow = 0; iRow < rows; iRow++){
        var tRowElement = eXQTTable.insertRow();
        for(var iCell = 0; iCell < columns; iCell++){
            var tCellElement = tRowElement.insertCell();
            tCellElement.setAttribute("contenteditable", "true");
            tCellElement.setAttribute("title", "("+iCell+","+iRow+")"); /*hack for mouseover*/
            tCellElement.classList.add("empty");
            tCellElement.addEventListener("input",fOnEditCell.bind(null,tCellElement), true); /*if slow or using memory, switch to no bind, and read caller title*/
            /*tCellElement.classList.remove("empty");*/
        }
    }

    return eXQTTableWrapper;
}

function drawXQTConsole(){
    var eXQTConsole = document.createElement('div');

    function fAddButton(name, func){
        var eButton = document.createElement('button');
        eButton.innerHTML = sReplaceDangerChars(name);
        eButton.addEventListener("click", func, false);
        eXQTConsole.appendChild(eButton);
    }

    var eLoadSelector = document.createElement('select') 
    for (var localStorageKey in localStorage){
        if (localStorageKey.substring(0,8) == "XQTSave-"){
            var option = document.createElement("option")
            option.value = localStorageKey.substring(8)
            option.text = localStorageKey.substring(8)
            eLoadSelector.add(option);
        }
    }

    var eSaveInputbar = document.createElement('input')
    eSaveInputbar.type = "text"
    eSaveInputbar.size = "15"

    var eTickTimeInputbar = document.createElement('input')
    eTickTimeInputbar.type = "text"
    eTickTimeInputbar.size = "3"
    eTickTimeInputbar.value = ""+iTickWait
    eTickTimeInputbar.addEventListener("input", function(){if(parseInt(eTickTimeInputbar.value))iTickWait = parseInt(eTickTimeInputbar.value); console.log(iTickWait)}, false);


    fAddButton("Start", testme)
    eXQTConsole.appendChild( document.createTextNode("Tick Time:"));
    eXQTConsole.appendChild(eTickTimeInputbar);

    fAddButton("Save", function(){fSaveTable(eSaveInputbar.value)})
    eXQTConsole.appendChild(eSaveInputbar)

    fAddButton("Load", function(){
            oDisableOverlay.fApply();
            fLoadTable(eLoadSelector.options[eLoadSelector.selectedIndex].value);
            oDisableOverlay.fRemove();})
    eXQTConsole.appendChild(eLoadSelector);




    return eXQTConsole;
}






/*saveload and friends*/
function fSaveTable(localStorageKey){/*prefixes XQTSave- to key before saving*/
    localStorage.setItem("XQTSave-"+localStorageKey, eXQTTable.outerHTML);
}

function fLoadTable(localStorageKey){/*prefixes XQTSave- to key before loading*/
    var loaded = localStorage.getItem("XQTSave-"+localStorageKey);
    if (loaded == null){
        alert("no saved table with the name");
    }else{
        var eExtractTable = eHTMLParse(loaded);
        for(var iRow=0, nRow=eExtractTable.rows.length; iRow<nRow; iRow++ ){
            for(var iCol=0, nCol=eExtractTable.rows[iRow].cells.length; iCol<nCol; iCol++){

                fWriteCell(iCol,iRow,eExtractTable.rows[iRow].cells[iCol].innerHTML)
            }
        }
    }
}


function eHTMLParse(HTMLString){/*This is probs XSS vulnerable, but as far as I know, no code is not executed in ff or chrome until added to document*/
    var eParserContainer = document.createElement('TEMPLATE');
    eParserContainer.innerHTML = HTMLString
    if(eParserContainer.content.children[0].tagName == "TABLE"){
        var eTable = eParserContainer.content.children[0];
        var ecScripts = eTable.getElementsByTagName("SCRIPT");
        while (ecScripts.length){ /*add better cleanup code here if I ever learn to do this properly*/
            ecScripts[0].parentNode.removeChild(ecScripts[0]);/*if script was input normally and not inserted into HTML, should not be affected*/
        }
        /*new DOMParser().parseFromString(loaded, "text/html"); is not supported yet, but seems like a safer approach*/ 
        return eTable
    }
    alert("string is not valid HTML table"); 
    return null; 
}

function fWriteCell(x,y,content){
    if (x>=iRows || y>=iCols){
        alert("missing expand chart functions")
    }
    /*TODO: scan for and remove script tags*/
    eXQTTable.rows[y].cells[x].innerHTML = content
    fOnEditCell(eXQTTable.rows[x].cells[y])
}

function fOnEditTable(){
    console.log("edited");
}

function fOnEditCell(tCellElement){
    var content = tCellElement.textContent;
    if (content == ""){ /*I guess this would be most frequent*/
        tCellElement.className = "empty"
        if (tCellElement.className == "button") fRemoveButton();
    } else {
        if (content == "[button]" && tCellElement.className != "button"){ /*generate a pressable button*/
            tCellElement.className = "button";
            if(tCellElement.getElementsByTagName('button').length == 0){
                var XQTTableButton = document.createElement('button');
                /*bind action add this location to execution queue???*/
                tCellElement.appendChild(XQTTableButton);

            }
        } else{
            if (tCellElement.className == "button") fRemoveButton();
            if (content == "[auto]"){
                /*add this location to execution queue???*/
            } else if (bStrIsXQTCommand(content)){
                tCellElement.className = "command"
            } else {
                tCellElement.className = "other"
            }
        } 
    }
    function fRemoveButton(){
        var XQTTableButton = tCellElement.getElementsByTagName('button')[0];
        console.log(XQTTableButton);
        tCellElement.removeChild(XQTTableButton);
    }
}

function testme(){
    alert("allright");
}



/*helper functions*/
function bStrIsXQTCommand(teststring){
    var length = XQTCommands.length;
    for (var i=0, len=XQTCommands.length; i<len; i++){
        if (teststring == XQTCommands[i].name){
            return true;
        }
    }
    return false;
}

function sReplaceDangerChars(inputstring){ /*HTML encode, seen on stackoverflow*/
    return inputstring.replace(/</g,"&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\"/g, "&quot;")
                    .replace(/\'/g, "&#39;")
                    .replace(/\//g, "&#x2F;")
}

var oDisableOverlay = {
    overlay : null,
    flush : null,
    fApply: function(){
        if(this.overlay ==null){
            this.overlay = document.createElement("div");
            this.overlay.id = "DisableOverlay";
            document.body.appendChild(this.overlay);
        }
        
        this.overlay.style.display = "block";
        //console.log(this.overlay.offsetHeight); 
        //this.overlay.style.transform = "translateZ(0)"; 
        /*I've tried getting it to reflow and repaint, but no dice. Maybe because the div is directly under body??*/
    },
    fRemove: function(){
        if(this.overlay != null)this.overlay.style.display = "none";

    },
}
