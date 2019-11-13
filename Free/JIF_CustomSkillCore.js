/*:
 * @plugindesc (v.1) Core plugin to allow for customized damage formulas
 * @author Jiffy
 * 
 *
 * @help
 *   Jiffy's Custom Skill Core
 * ===========================================================================
 * Custom Skill Core is a plugin that allows you to create much more customized
 * skill formulas with little to no JS knowledge. To do so, create a new blank 
 * JS file and name it what you want. Then create a new function like so:
 * 
 * JIF_Custom_Skill.YOURSKILLNAMEHERE = function(value, action) {
 * 
 * //Mess with the value variable however you want
 * 
 * //Example
 * 
 * value = 10; //The skill will now do a set 10 damage.
 * 
 *  return value; //Returns the amount of damage to do
 * }
 * 
 * To set a skill to use this formula, in your skill notetag in the database
 * create a notetag like so:
 * 
 * <type: YOURSKILLNAMEHERE>
 * 
 * This value in the notetag and the one in the function name must be IDENTICAL!
 * 
 * 
 * This allows for you to use other variables, arrays, and other things to make
 * your formulas much more customizable.
 * 
 * Since this can be kinda confusing at first, I have provided a download link
 * to an example skill pack on the RMW page. This includes a few example skills
 * that you can use in your project.
 * ===========================================================================
 * Thanks for reading! If you have any questions regarding this plugin, feel
 * free to DM me on RPGMakerWeb!
 *
 * Thanks again
 * - Jiffy
*/

var JIF = JIF || {};
var Imported = Imported || {};
Imported["JIF_CustomSkillCore"] = 1.0;
JIF.CustomSkillCore = JIF.CustomSkillCore || {};
JIF.Notetags = JIF.Notetags || {};

//-------------------------------------------------------------------------------
//Params and Variables
//-------------------------------------------------------------------------------
JIF.Notetags.skillNotes = [];

var params = PluginManager.parameters('JIF_CustomSkillCore');

//-------------------------------------------------------------------------------
//RegEx/Note Assigning
//-------------------------------------------------------------------------------
JIF.Notetags.loadNotetags = function () {
    var tempArr = [];
    $dataSkills.slice(1).forEach(function(skill)
    {
        tempArr.push(skill.note);
    });
    return tempArr;
};
DataManager.isMapLoaded = function() {
    this.checkError();
    JIF.Notetags.skillNotes = JIF.Notetags.loadNotetags();
    return !!$dataMap;
};
//-------------------------------------------------------------------------------
//Class
//-------------------------------------------------------------------------------
function JIF_Custom_Skill() {
    this.initialize.apply(this, arguments);
}
    

//-------------------------------------------------------------------------------
//Skill Functions
//-------------------------------------------------------------------------------
Game_Action.prototype.getCustomSkillType = function() {
    var id = this.item().id;
    //console.log(id);
    var note = JIF.Notetags.skillNotes[id - 1];
    //console.log(note);
    let skillTypeNoteData = /<\s*type\s*:\s*(\w+.\w*)\s*>/ig.exec(note);
    //console.log(skillTypeNoteData);
    if(skillTypeNoteData !== null) {
        if(typeof skillTypeNoteData[1] === "string")
        {
            return skillTypeNoteData[1];
        } else {
            console.error("Custom Skill type for skill id " + id + " is not a string.");
        }
    }
    return null;
    
}
//-------------------------------------------------------------------------------
//Battle Manager
//-------------------------------------------------------------------------------
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var customSkillType = this.getCustomSkillType();
    console.log("skill type: " + customSkillType);
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    if(customSkillType !== null)
    {
        value = eval("JIF_Custom_Skill." + customSkillType)(value, this);
    }
    return value;
};