/*: 
 * @plugindesc (v.1) Utility plugin for JIF battle plugins
 * @author Jiffy
 *
 * 
 * @param battleStatusWidth
 * @text Battle Status Window Width
 * @default Graphics.boxWidth - 192;
 * 
 * @param battleStatusHeight
 * @text Battle Status Window Height
 * @default this.fittingHeight(this.numVisibleRows());
 * 
 * @param battleStatusX
 * @text Battle Status Window X
 * @default Graphics.boxWidth - width;
 * 
 * @param battleStatusY
 * @text Battle Status Window Y
 * @default Graphics.boxHeight - height;
 * 
 * @param makePartyCommandListEval
 * @text Make Party Command List Eval
 * @type note
 * 
 * @param makeActorCommandListEval
 * @text Make Actor Command List Eval
 * @type note
 * 
 * @param addSkillCommandsEval
 * @text Add Skill Commands Eval
 * @type note
 * 
 * @help
 * hi
 */

var JIF = JIF || {};
var Imported = Imported || {};
Imported['JIF_BattleUtilities'] = 1.0;
JIF.BattleUtilities = JIF.BattleUtilities || {};

//-------------------------------------------------------------------------------
//Params and Variables
//-------------------------------------------------------------------------------
var params = PluginManager.parameters('JIF_BattleUtilities');

JIF.BattleUtilities.battleStatusWidth = String(params['battleStatusWidth']);
JIF.BattleUtilities.battleStatusHeight = String(params['battleStatusHeight']);
JIF.BattleUtilities.battleStatusX = String(params['battleStatusX']);
JIF.BattleUtilities.battleStatusY = String(params['battleStatusY']);
JIF.BattleUtilities.makePartyCommandListEval = String(params['makePartyCommandListEval']);
JIF.BattleUtilities.makePartyCommandListEval = JIF.BattleUtilities.makePartyCommandListEval.replace(/(\r\n\t|\n|\r\t)/gm,"");
JIF.BattleUtilities.makePartyCommandListEval = JIF.BattleUtilities.makePartyCommandListEval.substring(1, JIF.BattleUtilities.makePartyCommandListEval.length - 1);
JIF.BattleUtilities.makeActorCommandListEval = String(params['makeActorCommandListEval']);
JIF.BattleUtilities.makeActorCommandListEval = JIF.BattleUtilities.makeActorCommandListEval.replace(/(\r\n\t|\n|\r\t)/gm,"");
JIF.BattleUtilities.makeActorCommandListEval = JIF.BattleUtilities.makeActorCommandListEval.substring(1, JIF.BattleUtilities.makeActorCommandListEval.length - 1);
JIF.BattleUtilities.addSkillCommandsEval = String(params['addSkillCommandsEval']);
JIF.BattleUtilities.addSkillCommandsEval = JIF.BattleUtilities.addSkillCommandsEval.replace(/(\r\n\t|\n|\r\t)/gm,"");
JIF.BattleUtilities.addSkillCommandsEval = JIF.BattleUtilities.addSkillCommandsEval.substring(1, JIF.BattleUtilities.addSkillCommandsEval.length - 1);

JIF.BattleUtilities.commandCount = 0;

JIF.BattleUtilities.addToPartyCommandListEval = function(data)
{
    JIF.BattleUtilities.makePartyCommandListEval += data;
}

JIF.BattleUtilities.addToActorCommandListEval = function(data)
{
    JIF.BattleUtilities.makeActorCommandListEval += data;
}

JIF.BattleUtilities.addToSkillCommandList = function(data)
{
    JIF.BattleUtilities.addSkillCommandsEval += data;
}

//-------------------------------------------------------------------------------
//Notetags
//-------------------------------------------------------------------------------
JIF.BattleUtilities.loadNotetag = function(data, dataName, param, id)
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

//-------------------------------------------------------------------------------
//Game_Action
//-------------------------------------------------------------------------------
Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.jifMakeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

//-------------------------------------------------------------------------------
//Windows
//-------------------------------------------------------------------------------
Window_BattleStatus.prototype.windowWidth = function() {
    return eval(JIF.BattleUtilities.battleStatusWidth);
};

Window_BattleStatus.prototype.windowHeight = function() {
    return eval(JIF.BattleUtilities.battleStatusHeight);
};

Window_BattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = eval(JIF.BattleUtilities.battleStatusX);
    var y = eval(JIF.BattleUtilities.battleStatusY);
    console.log(x);
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
};

var alias_Window_PartyCommand_prototype_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function() {
    alias_Window_PartyCommand_prototype_makeCommandList.call(this);
    eval(JIF.BattleUtilities.makePartyCommandListEval);
};

var alias_Window_ActorCommand_prototype_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
Window_ActorCommand.prototype.makeCommandList = function()
{
    alias_Window_ActorCommand_prototype_makeCommandList.call(this);
    if(this._actor)
    {
        eval(JIF.BattleUtilities.makeActorCommandListEval);
    }
}

var alias_Window_ActorCommmand_prototype_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
Window_ActorCommand.prototype.addSkillCommands = function()
{
    alias_Window_ActorCommmand_prototype_addSkillCommands.call(this);
    eval(JIF.BattleUtilities.addSkillCommandsEval);
}