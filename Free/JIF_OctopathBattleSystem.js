/*:
 * @plugindesc (v. 1.3) Implements the Octopath Traveler battle system.
 * @author Jiffy
 * 
 * @param damageToDecreaseWhenShieldActive
 * @text Damage to Decrease When Has Shield
 * @decimals 4
 * @type number
 * @desc The amount you want damage to decrease by when used on an enemy with a shield active. Ex: 10% decrease is .10
 * @default .20
 * 
 * @param evalOnShieldBreak
 * @text Eval On Shield Break
 * @desc The Eval that is run whenever an enemy shield is broken.
 * @type note
 * @default "//Insert JS code here\n//You can use the variable \n//'enemy' to get a reference to the enemy who's shield\n//was broken\n$gameTemp.reserveCommonEvent(0); //this will run common event 0 whenever a shield is broken."
 * 
 * @param unknownWeaknessIcon
 * @text Unknown Weakness Icon
 * @desc The icon id of a weakness that hasn't been discovered yet.
 * @default 16
 *
 * @param elementIcons
 * @text Element Icons
 * @desc Put element id and icon id with a space between them. Seperate elements with a comma.
 * @default 1 77,2 64,3 65,4 66,5 67,6 68,7 69,8 72,9 71
 * 
 * @param maxBP
 * @text Max BP
 * @desc The max BP an actor can have
 * @default 4
 * 
 * @param shieldBrokenMessage
 * @text Shield Broken Message
 * @desc The message that appears when an enemies shield is broken.
 * @default Shield broken!
 * 
 * @param weaknessFoundMessage
 * @text Weakness Found Message
 * @desc The message that appears when a new weakness is found.
 * @default New Weakness Found!
 * 
 * @param bpGaugeColorOne
 * @text BP Gauge Gradient Color One
 * @desc The first color of the BP Gauge
 * @default 5
 * 
 * @param bpGaugeColorTwo
 * @text BP Gauge Gradient Color Two
 * @desc The second color of the BP Gauge
 * @default 2
 * 
 * @help
 *   Jiffy's Octopath Traveler Battle System
 * ===========================================================================
 * The octopath traveler battle system plugin is a plugin designed to replicate
 * octapath traveler's battle system (obviously). It includes a shield and shield
 * break mechanic and a full BP mechanic.
 * ===========================================================================
 *   Parameter Explanation
 * ===========================================================================
 * unknownWeaknessIcon
 * This is the icon id of that will show when a weakness has not been discovered.
 * 
 * elementIcons
 * This is the parameter that allows you to assign icon ids to element ids. To do
 * so, first put the id of the element, a space, and then the id of the icon
 * followed by a period.
 * 
 * maxBP
 * This is the maximum amount of BP a character can have at one time.
 * 
 * shieldBrokenMessage
 * This is the message that appears in the battle log whenever an enemies shield is
 * broken.
 * 
 * weaknessFoundMessage
 * This is the message that appears in the battle log whenever an enemy weakness is
 * found.
 * ===========================================================================
 * Thanks for reading! If you have any questions regarding this plugin, feel
 * free to DM me on RPGMakerWeb!
 *
 * Thanks again
 * - Jiffy
 */

var JIF = JIF || {};
var Imported = Imported || {};
JIF.Notetags = JIF.Notetags || {};
Imported['JIF_OctopathBattleSystem'] = 1.3;
JIF.OctopathBattleSystem = JIF.OctopathBattleSystem || {};

//-------------------------------------------------------------------------------
//Params and Variables
//-------------------------------------------------------------------------------
JIF.Notetags.enemyNotes = [];

var params = PluginManager.parameters('JIF_OctopathBattleSystem');

JIF.evalOnShieldBreak = String(params['evalOnShieldBreak']);
JIF.evalOnShieldBreak = JIF.evalOnShieldBreak.replace(/(\r\n\t|\n|\r\t)/gm,"");
JIF.evalOnShieldBreak = JIF.evalOnShieldBreak.substring(1, JIF.evalOnShieldBreak.length - 1);
JIF.elementalData = String(params['elementIcons']);
JIF.maxBP = Number(params['maxBP']);
JIF.damageToDecreaseWhenShieldActive = Number(params['damageToDecreaseWhenShieldActive']);
JIF.shieldBrokenMessage = String(params['shieldBrokenMessage']);
JIF.weaknessFoundMessage = String(params['weaknessFoundMessage']);
JIF.unknownWeaknessIcon = Number(params['unknownWeaknessIcon']);
JIF.bpGaugeColorOne = Number(params['bpGaugeColorOne']);
JIF.bpGaugeColorTwo = Number(params['bpGaugeColorTwo']);

var elemDat = [];
elemDat = JIF.elementalData.split(",");

//-------------------------------------------------------------------------------
//RegEx/Note Assigning
//-------------------------------------------------------------------------------
JIF.Notetags.loadNotetags = function () {
    var tempArr = [];
    $dataEnemies.slice(1).forEach(function(enemy)
    {
        tempArr.push(enemy.note);
    });
    return tempArr;
};
DataManager.isMapLoaded = function() {
    this.checkError();
    JIF.Notetags.enemyNotes = JIF.Notetags.loadNotetags();
    
    return !!$dataMap;
};
//-------------------------------------------------------------------------------
//Game_Enemy
//-------------------------------------------------------------------------------
Game_Enemy.prototype.shield = function() {
    return this._shield;
}

Game_Enemy.prototype.weakTo = function() {
    this._weakTo = [];
    return this._weakTo;
}

Game_Enemy.prototype.shieldBroken = function () {
    var enemy = this;
    eval(JIF.evalOnShieldBreak);
}

Game_Enemy.prototype.getEnemyShieldValue = function(id) {
    var note = JIF.Notetags.enemyNotes[id - 1];
    let enemyNoteData = /<\s*shield\s*:\s*(\d+\.*\d*)\s*>/ig.exec(note);
    if(enemyNoteData !== null) 
    {
        return enemyNoteData[1];
    }
}

Game_Enemy.prototype.setEnemyWeakness = function(id) {
    this._knownWeakness = [];
    var note = JIF.Notetags.enemyNotes[id - 1];
    let enemyNoteData = /<\s*weak to\s*:\s*(\w+.\w*)\s*>/ig.exec(note);

    if(enemyNoteData !== null) {
        if(typeof enemyNoteData[1] === "string")
        {
            this._weakTo = enemyNoteData[1].toUpperCase().split(",");
        } else {
            console.error("Notetag of weakness for enemy with the id of " + id + " is not a string.");
        }
    }
}

Game_Enemy.prototype.knownWeakness = function(id) {
    this._knownWeakness = [];
    return this._knownWeakness;
}

Game_Enemy.prototype.name = function() {
    return "[" + this._shield + "] " + this.originalName() + (this._plural ? this._letter : '');
};

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
            var value = this.octoMakeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};


Game_Action.prototype.octoMakeDamageValue = function(target, critical) {
    var value = this.makeDamageValue(target, critical);
    var known = false;
    for(var x = 0; x < target._weakTo.length; x++)
    {
        if($dataSystem.elements[this.item().damage.elementId] !== undefined)
        {
            if($dataSystem.elements[this.item().damage.elementId].toUpperCase() === target._weakTo[x])
            {
                for(var i = 0; i < target._knownWeakness.length; i++)
                {
                    if(target._weakTo[x] === target._knownWeakness[i])
                    {
                        known = true;
                    }
                }
                if(!known) { target._knownWeakness.push(target._weakTo[x]); SceneManager._scene._logWindow.clear(); SceneManager._scene._logWindow.addText(JIF.weaknessFoundMessage); };
                known = false;
                if(target._shield > 0) 
                { 
                    target._shield-= 1; 
                    if(target._shield === 0)
                    {
                        target.shieldBroken();
                        SceneManager._scene._logWindow.clear();
                        SceneManager._scene._logWindow.addText(JIF.shieldBrokenMessage);
                    }
                
                };
            }
        }
        
    }
    
    if(target._shield > 0) { value -= Math.floor((value * JIF.damageToDecreaseWhenShieldActive)); };
    return value;
};

var alias_numRepeats = Game_Action.prototype.numRepeats;
Game_Action.prototype.numRepeats = function() {
    var repeats = alias_numRepeats.call(this);
    var subject = this.subject();   
    if(this.item().damage.elementId > 0)
    {
        repeats = subject._Bp;
        subject._Bp = 1;
    }  
    return Math.floor(repeats);
};

//-------------------------------------------------------------------------------
//Enemy Window Setup
//-------------------------------------------------------------------------------
var enemyCount = 0;
var windows = [];
var enemies = [];

var alias_Game_Enemy_prototype_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    alias_Game_Enemy_prototype_setup.call(this, enemyId, x, y);  
    this._shield = this.getEnemyShieldValue(enemyId);  
    windows[enemyCount] = new Battle_EnemyInfoWindow(x, (y - 50), 200, 150, this);
    windows[enemyCount].opacity = 0;
    enemyCount++;
};

var alias_Scene_Battle_prototype_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    alias_Scene_Battle_prototype_start.call(this);
    var scene = SceneManager._scene;
    for(var i = 0; i < enemyCount; i++)
    {
        scene.addChild(windows[i]);
    }
    
    
};

var alias_Scene_Battle_prototype_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    alias_Scene_Battle_prototype_update.call(this);
    for(var i = 0; i < windows.length; i++)
    {
        windows[i].refresh();
    }
};

//-------------------------------------------------------------------------------
//Game Actor
//-------------------------------------------------------------------------------
Game_Actor.prototype.Bp = function() {
    return this._Bp;
}

var alias_Game_Actor_prototype_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    alias_Game_Actor_prototype_initMembers.call(this);
    this._Bp = 1;
};

var alias_Game_Actor_prototype_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    alias_Game_Actor_prototype_setup.call(this, actorId);
    this._Bp = 1;
};

var alias_performAction = Game_Actor.prototype.performAction();
Game_Actor.prototype.performAction = function(action) {
    alias_performAction.call(this, action);
    if (action.isAttack()) {
        if(this._Bp < JIF.maxBP) { this._Bp++; };       
    } else if (action.isGuard()) {
        if(this._Bp < JIF.maxBP) { this._Bp++; };    
    } else if (action.isMagicSkill()) {
    } else if (action.isSkill()) {
    } else if (action.isItem()) {
        if(this._Bp < JIF.maxBP) { this._Bp++; };    
    }
};

//-------------------------------------------------------------------------------
//Window
//-------------------------------------------------------------------------------
Window_Base.prototype.bpColor = function(actor) {
    if (actor._Bp === 0) {
        return this.deathColor();
    } else {
        return this.normalColor();
    }
};
Window_Base.prototype.drawActorBp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.textColor(JIF.bpGaugeColorOne);
    var color2 = this.textColor(JIF.bpGaugeColorTwo);
    //actor._Bp = 0;
    this.drawGauge(x, y, width, actor._Bp / JIF.maxBP, color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText("BP", x, y, 44);
    this.drawCurrentAndMax(actor._Bp, JIF.maxBP, x, y, width, this.bpColor(actor), this.normalColor());
};
Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    this.drawActorBp(actor, rect.x + 234, rect.y, 96)
    this.drawActorHp(actor, rect.x + 0, rect.y, 108);
    this.drawActorMp(actor, rect.x + 123, rect.y, 96); 
};

Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 201);
    this.drawActorMp(actor, rect.x + 216,  rect.y, 114);
};
function Battle_EnemyInfoWindow() {
    this.initialize.apply(this, arguments);
}

Battle_EnemyInfoWindow.prototype = Object.create(Window_Base.prototype);
Battle_EnemyInfoWindow.prototype.constructor = Battle_EnemyInfoWindow;

Battle_EnemyInfoWindow.prototype.initialize = function (x, y, width, height, enemy) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._enemy = enemy;
    enemy.setEnemyWeakness(enemy._enemyId);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
}

Battle_EnemyInfoWindow.prototype.refresh = function() {
    this.contents.clear();
    this.drawText(this._enemy.name(), 0, 0, this._width, 'left');

    
    for(var i = 0; i < this._enemy._weakTo.length; i++)
    {
        for(var x = 0; x < $dataSystem.elements.length; x++)
        {
            if(this._enemy._weakTo[i] === $dataSystem.elements[x].toUpperCase())
            {
                for(var y = 0; y < elemDat.length; y++)
                {
                    var tempDat = elemDat[y].split(" ");
                    if(Number(tempDat[0]) === x)
                    {
                        var known = false;
                        for(var k = 0; k < this._enemy._knownWeakness.length; k++)
                        {
                            if(this._enemy._knownWeakness[k] === this._enemy._weakTo[i])
                            {
                                known = true;
                                break;
                            }
                        }
                        if(known)
                        {
                            this.drawIcon(tempDat[1], (i * 32), 38);
                        } else if (!known) {
                            this.drawIcon(JIF.unknownWeaknessIcon, (i * 32), 38);
                        }
                        known = false;
                    }
                }
                
            }
        }
    }
}

Battle_EnemyInfoWindow.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.refresh();
}