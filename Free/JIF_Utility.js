/*:
 * @plugindesc (v1.0) The plugin that a lot of JIF plugins use
 * @author Jiffy
 */

 var JIF = JIF || {};
 var Imported = Imported || {};
 Imported['JIF_Utility'] = 1.0;
 JIF.Utility = JIF.Utility || {};

//-------------------------------------------------------------------------------
//Notetags
//-------------------------------------------------------------------------------
JIF.Utility.loadNotetag = function(data, dataName, param, id)
{
    var noteArr = [];
    eval(
        data + ".slice(1).forEach(function " + dataName + ")"
        + "noteArr.push(" + dataName + ".note);"
        + "});"
    );

    var note = noteArr[id - 1];
    eval("let noteDat = /<\s*" + param + "\s*:\s*(\w+.\w*)\s*>/ig.exec(note);"); 
    if(noteDat !== null)
    {
        return noteDat[1];
    }
}