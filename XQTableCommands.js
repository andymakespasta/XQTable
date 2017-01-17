/*this is global so you can add js files with custom commands*/
var XQTCommands = [];

function populateXQTCommands(){
    /*cell string manipulation*/
    XQTCommands.push({
        name: "copy",
        help: "copy | [locA] | [locB] :will copy contents of [locA] to [locB], overwriting existing contents at [locB]",
        func: function(){
            alert("boop");
        },
    });
    XQTCommands.push({
        name: "append",
        help: "append | [locA/cell] | [locB] :will add contents of [locA] to [locB], overwriting existing contents at [locB]",
        func: function(){
            alert("boop");
        },
    });

    /*math based cell string manipulation*/
    XQTCommands.push({
        name: "increment",
        help: "increment | [loc/cell] :increase contents at loc or cell by 1 if it is valid number",
        func: function(){
            alert("boop");
        },
    });
    XQTCommands.push({
        name: "add",
        help: "add | [loc/cell] :increase contents at loc or cell by 1 if it is valid number",
        func: function(){
            alert("boop");
        },
    });
    /*coordinate based cell string manipulation*/
    XQTCommands.push({
        name: "coordadd",
        help: "coordadd | [loc/cell] :increase contents at loc or cell by 1 if it is valid number",
        func: function(){
            alert("boop");
        },
    });
    /*flow control commands*/
    XQTCommands.push({
        name: "stop",
        help: "stop : terminates execution pointer that runs into this command",

    });
    XQTCommands.push({
        name: "if=",
        help: "if= | [cellA] | [cellB] | [cellC]: if= will move execution pointer to cellC if cellA has the same content as cellB. Else execution pointer is pushed downwards.",

    });
    XQTCommands.push({
        name: "goto",
        help: "goto | [loc] : moves the execution pointer to [loc].",

    });

    XQTCommands.push({
        name: "if",
        help: "if | [cellA/loc] | [cellB] : if= will move execution pointer to cellB if cellA or loc has Yes, True, or a number>0 ",

    });


    /*high level functionality*/
    XQTCommands.push({
        name: "find",
        help: "find | [cellA/loc] | [cellB] | ...: searches for cells exactly matchiing contents at [loc] or of [cell], and prints matching locations into cells to the right, overwriting things. Use Caution",

    });

    /*misc (doesn't do anything)*/
    XQTCommands.push({
        name: "alert",
        help: "alert | [cell/loc] : alert will make a popup with the contents of [cell]",

    });
    XQTCommands.push({
        name: "highlight",
        help: "highlight | [cell/loc] : highlight will change background of [loc] to yellow (class to highlight)",

    });

}


populateXQTCommands();

function addUtilCommands(){
    /*useful (outside interaction)*/
    XQTCommands.push({
        name: "thetime",
        help: "thetime | [cell/loc] : time will write the current time to [loc], if not valid location, overwrites [cell]",

    });
    XQTCommands.push({
        name: "weekday",
        help: "weekday | [cellA/loc] | [cellB] : if CellA is loc, and the contents of cellA or loc is a date/time, prints the day of the week to cellB"
    })
    XQTCommands.push({
        name: "opensite",
        help: "opensite | [cell/loc] : opensite will attempt to load the URL at [loc], if not valid location, the URL in [cell]",
        func: function(){
            Window.open("www.gunnerkrigg.com", '_blank');
        }
    });
}