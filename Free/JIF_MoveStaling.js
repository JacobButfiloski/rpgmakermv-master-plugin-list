/*:
 * @plugindesc Move Staling
 * @author Jakey
 * 
 * @param damageDecreaseIncrement
 * @desc The increment damage is decreased by (Ex. For a 10% decrease -> .1)| Default:.1
 * @default .1
 *
 * @help
 *   Jakes Move Staling Plugin (Edit of Jiffy's with permission)
 * ===========================================================================
 * Inspired by the mechanic by the same name from the Super Smash Bros. Series,
 * staling will decrease the amount of damage a move does if it is used
 * repeatedly. This will discourage the spamming of the same move and will
 * add another layer of complexity to your combat system.
 * ===========================================================================
 *   Parameter Explanation
 * ===========================================================================
 * damageDecreaseIncrement:
 * This parameter changes the increment of which your damage is decreased by.
 * For example: If I set this to .1, the damage will decrease by 10% each time
 * time it is used in a row.
 * ===========================================================================
 * Thanks for reading! If you have any questions regarding this plugin, feel
 * free to DM me on RPGMakerWeb!
 *
 * Thanks again
 * - Jiffy
*/

//Param Setup
var JKY = JKY || {};
 var params = PluginManager.parameters('JKY_MoveStaling');

 JKY.modifier = String(params['damageDecreaseIncrement']);
//

JKY.arr = []; 
JKY.tempCount = 0;

var alias_Game_Action_prototype_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    alias_Game_Action_prototype_makeDamageValue.call(this);
    var item = this.item();
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
    if(JKY.arr.length > 2)
    {
        if(JKY.arr[JKY.arr.length - 2].item().name !== this.item().name)
        {
            JKY.tempCount = 0;
            for(var i = 0; i < JKY.arr.length; i++)
            {
                if(JKY.arr[i].item().name !== this.item().name) {
                    JKY.arr = JKY.arr.slice(i, 1);
                }
            }
        }
    }
    JKY.tempCount = 0;
    for(var i = 0; i < JKY.arr.length; i++)
    {
        if(JKY.arr[i].item().name === this.item().name)
        {
            JKY.tempCount++;
        }
    }
    //console.log(tempCount);
    //console.log(value - (value * (modifier * tempCount)));
    JKY.arr.push(this);
    return Math.floor(value - (value * (JKY.modifier * JKY.tempCount)));
};
var alias_BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    alias_BattleManager_startAction.call(this);
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    //console.log(action);
    //console.log(subject);
    
    
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};