/*:
 * @plugindesc (v. 1.0) Battle UI Plugin Commission for MustLuvPolarBearDogs.
 * @author Jiffy
 * 
 * @param attackDesc
 * @text Attack Option Description
 * @default Attack An Enemy.
 * 
 * @param skillDesc
 * @text Skill Option Description
 * @default Use a Magic Move on an Enemy.
 * 
 * @param guardDesc
 * @text Guard Option Description
 * @default Guard From An Attack.
 * 
 * @param itemDesc
 * @text Item Option Description
 * @default Use an Item.
 * 
 * @param actorOneStatusWindowX
 * @text Actor One Window X
 * @desc The X position of the actor one window.
 * @default 0
 * 
 * @param actorOneStatusWindowY
 * @text Actor One Window Y
 * @desc The Y position of the actor one window.
 * @default 310
 * 
 * @param actorOneStatusWindowWidth
 * @text Actor One Window Width
 * @desc The with position of the actor one window.
 * @default 250
 * 
 * @param actorOneStatusWindowHeight
 * @text Actor One Window Height
 * @desc The height position of the actor one window.
 * @default 135
 * 
 * 
 * @param actorTwoStatusWindowX
 * @text Actor Two Window X
 * @desc The X position of the actor two window.
 * @default 562
 * 
 * @param actorTwoStatusWindowY
 * @text Actor Two Window Y
 * @desc The Y position of the actor two window.
 * @default 310
 * 
 * @param actorTwoStatusWindowWidth
 * @text Actor Two Window Width
 * @desc The with position of the actor two window.
 * @default 250
 * 
 * @param actorTwoStatusWindowHeight
 * @text Actor Two Window Height
 * @desc The height position of the actor two window.
 * @default 135
 * 
 * @param imageOneName
 * @text Actor Image One Name
 * 
 * @param imageOneX
 * @text Image One X
 * @default 0
 * 
 * @param imageOneY
 * @text Image One Y
 * @default 0
 * 
 * @param imageTwoName
 * @text Actor Image Two Name
 * 
* @param imageTwoX
 * @text Image Two X
 * @default 0
 * 
 * @param imageTwoY
 * @text Image Two Y
 * @desc leave at -10 if you want to use the default settings.
 * @default -10
 * 
 * @param commandListY
 * @Text Command List Y
 */

 var JIF = JIF || {};
 var Imported = Imported || {};
 Imported['JIF_BattleUI'] = 1.0;
 JIF.BattleUI = JIF.BattleUI || {};

//-------------------------------------------------------------------------------
//Params and Variables
//-------------------------------------------------------------------------------
JIF.Notetags = [];

var params = PluginManager.parameters('JIF_BattleUI');

JIF.actorOneStatusWindowX = Number(params['actorOneStatusWindowX']);
JIF.actorOneStatusWindowY = Number(params['actorTwoStatusWindowY']);
JIF.actorOneStatusWindowWidth = Number(params['actorOneStatusWindowWidth']);
JIF.actorOneStatusWindowHeight = Number(params['actorOneStatusWindowHeight']);

JIF.actorTwoStatusWindowX = Number(params['actorTwoStatusWindowX']);
JIF.actorTwoStatusWindowY = Number(params['actorTwoStatusWindowY']);
JIF.actorTwoStatusWindowWidth = Number(params['actorTwoStatusWindowWidth']);
JIF.actorTwoStatusWindowHeight = Number(params['actorTwoStatusWindowHeight']);

JIF.attackDesc = String(params['attackDesc']);
JIF.skillDesc = String(params['skillDesc']);
JIF.guardDesc = String(params['guardDesc']);
JIF.itemDesc = String(params['itemDesc']);

JIF.imageOneName = String(params['imageOneName']);
JIF.imageOneX = Number(params['imageOneX']);
JIF.imageOneY = Number(params['imageOneY']);

JIF.imageTwoName = String(params['imageTwoName']);
JIF.imageTwoX = Number(params['imageTwoX']);
JIF.imageTwoY = Number(params['imageTwoY']);

JIF.commandListY = Number(params['commandListY']);
//-------------------------------------------------------------------------------
//RegEx/Note Assigning
//-------------------------------------------------------------------------------
JIF.Notetags.loadNotetags = function () {
    var tempArr = [];
    $dataEnemies.slice(1).forEach(function(actor)
    {
        tempArr.push(actor.note);
    });
    console.log("Loaded Notetags");
    return tempArr;
};

DataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (var i = 0; i < this._databaseFiles.length; i++) {
        if (!window[this._databaseFiles[i].name]) {
            return false;
        }
    }
    JIF.Notetags.Notetags = JIF.Notetags.loadNotetags();
    return true;
};


//-------------------------------------------------------------------------------
//Game_Actor
//-------------------------------------------------------------------------------
var idCounter = 0;
var actorWindowList = [];

var alias_Game_Battler_initialize = Game_Battler.prototype.initialize;
Game_Battler.prototype.initialize = function() {
    alias_Game_Battler_initialize.call(this);
    if(idCounter = 1)
    {
        idCounter = 0;
    }
    this._batID = idCounter;
    idCounter++;
    
};

Game_Battler.prototype.battlerFilename = function () {
    if(this._batID == null)
    {
        return null;
    }

    if(this._batID == 0)
    {
        return JIF.battlerOneFilename;
    } else if(this._batID == 1) {
        return JIF.battlerTwoFilename;
    }
}

//-------------------------------------------------------------------------------
//Scene Battle
//-------------------------------------------------------------------------------
var windows = [];
JIF.members = [];
JIF.helpWindow = null;
JIF.partyWindowOpen;

function loadActors() {
    $gameParty.members().forEach(function(actor) {
        JIF.members.push(actor);
    }, this);
}

var alias_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
Scene_Battle.prototype.createStatusWindow = function() {
    alias_createStatusWindow.call(this);
    this._statusWindow.visible = false;
};

var alias_scene_battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function() {
    JIF.last = 0;
    JIF.selectedBattleOption = null;
    loadActors();

    

    alias_scene_battle_initialize.call(this);
};


var alias_creatingwindowsorsomething = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    alias_creatingwindowsorsomething.call(this);
    

    
};

var alias_Scene_Battle_prototype_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    alias_Scene_Battle_prototype_start.call(this);
    
};
//var alias_create_display_objects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    console.log("aosjifhiuadfhniuodsawfnsduif");
    this.createSpriteset();
    this.createWindowLayer();
    windows[0] = new ActorBustWindow(JIF.imageOneX, JIF.imageOneY, 0, 0, JIF.imageOneName);
    windows[0].opacity = 0;

    windows[1] = new ActorBustWindow(JIF.imageTwoX, JIF.imageTwoY, 0, 0, JIF.imageTwoName);
    windows[1].opacity = 0;
    windows[2] = new BattlerStatusWindow(JIF.actorOneStatusWindowX, 
                                         JIF.actorOneStatusWindowY - 80, 
                                         JIF.actorOneStatusWindowWidth,
                                         JIF.actorOneStatusWindowHeight,
                                         JIF.members[0], 
                                         this);
    windows[3] = new BattlerStatusWindow(JIF.actorTwoStatusWindowX, 
                                         JIF.actorTwoStatusWindowY - 80, 
                                         JIF.actorTwoStatusWindowWidth, 
                                         JIF.actorTwoStatusWindowHeight,
                                         JIF.members[1],
                                         this);

    windows[4] = new BattlerHelpWindow(0, Graphics.height - 80, Graphics.width, 80);
    for(var i = 0; i < windows.length; i++)
    {
        this.addWindow(windows[i]);
    }
    this.createAllWindows();
    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setStatusWindow(this._statusWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
    

    var scene = SceneManager._scene;
    
};

//var alias_add_window = Scene_Battle.prototype.addWindow(window);
//Scene_Battle.prototype.addWindow = function(window) {
  //  this._windowLayer.addChild(window);
//};

var alias_Scene_Battle_prototype_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    
    

    JIF.selectedBattleOption = this._actorCommandWindow.currentSymbol();
    if(this._actorCommandWindow.x === 0 || this._actorCommandWindow.x === this._enemyWindow.width)
    {
        windows[2].visible = true;
    } else {
        windows[2].visible = false;
    }

    alias_Scene_Battle_prototype_update.call(this);
    if(!this._skillWindow.visible)
    {
        for(var i = 0; i < windows.length; i++)
        {
            if(i != 3 || i != 4)
            {
                windows[i].refresh();
            }
            
        }
    }
};

var alias_scene_battle_updateWindowPositions = Scene_Battle.prototype.updateWindowPositions;
Scene_Battle.prototype.updateWindowPositions = function() {
    var temp = 0;
    if(windows[2].visible === true)
    {
        if(JIF.commandListY === -10)
        {
            this._actorCommandWindow.y = Graphics.height - windows[2].height - this._partyCommandWindow.height;
            this._partyCommandWindow.y = Graphics.height - windows[2].height - this._partyCommandWindow.height;
        } else {
            this._partyCommandWindow.y = JIF.commandListY;
            this._actorCommandWindow.y = JIF.commandListY;
        }
        
        this._enemyWindow.y = Graphics.height - windows[2].height - this._enemyWindow.height;
        this._actorWindow.y = Graphics.height - windows[2].height - this._enemyWindow.height;
    } else {
        if(JIF.commandListY === -10)
        {
        this._actorCommandWindow.y = Graphics.height -  this._partyCommandWindow.height;
        this._partyCommandWindow.y = Graphics.height -  this._partyCommandWindow.height;
        } else {
            this._actorCommandWindow.y = JIF.commandListY;
            this._partyCommandWindow.y = JIF.commandListY;
        }
        this._enemyWindow.y = Graphics.height -  this._enemyWindow.height;
        this._actorWindow.y = Graphics.height -  this._enemyWindow.height;
    }
    
    if(BattleManager.actor() === JIF.members[0]) {
        this._actorCommandWindow.x = 0;
        this._enemyWindow.x = this._actorCommandWindow.width;
    } else if(BattleManager.actor() == JIF.members[1]) {
        this._actorCommandWindow.x = this._enemyWindow.width;
        this._enemyWindow.x = 0;
    }
    alias_scene_battle_updateWindowPositions.call(this);
};


//-------------------------------------------------------------------------------
//Custom Windows
//-------------------------------------------------------------------------------

function ActorBustWindow() {
    this.initialize.apply(this, arguments);
}

ActorBustWindow.prototype = Object.create(Window_Base.prototype);
ActorBustWindow.prototype.constructor = ActorBustWindow;

ActorBustWindow.prototype.drawPicture = function(filename, x, y) 
{   
    var sprite = new Sprite();
    sprite.bitmap = ImageManager.loadPicture(filename);
    sprite.bitmap.width = 50;
    this.addChild(sprite);
};

ActorBustWindow.prototype.initialize = function(x, y, width, height, image)
{
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._image = image;
    //this._bitmap = ImageManager.loadPicture(image);  
    
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawPicture(this._image, 100, 0);
    //this.refresh();
}

ActorBustWindow.prototype.refresh = function() {
    this.contents.clear();
    //this.drawPicture(this._image, 100, 0);
}

function BattlerStatusWindow() {
    this.initialize.apply(this, arguments);
}

BattlerStatusWindow.prototype = Object.create(Window_Base.prototype);
BattlerStatusWindow.prototype.constructor = BattlerStatusWindow;

BattlerStatusWindow.prototype.initialize = function(x, y, width, height, actor) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._actor = actor;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
}

BattlerStatusWindow.prototype.refresh = function() {
    this.contents.clear();
    this.drawText(this._actor.name(), 0, 0, 168);
    this.drawActorHp(this._actor, 0, 30);
    this.drawActorMp(this._actor, 0, 60);
}

function BattlerHelpWindow() {
    this.initialize.apply(this, arguments);
}

BattlerHelpWindow.prototype = Object.create(Window_Base.prototype);
BattlerHelpWindow.prototype.constructor = BattlerHelpWindow;

BattlerHelpWindow.prototype.initialize = function(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
}

BattlerHelpWindow.prototype.refresh = function() {
    this.contents.clear();
    if(JIF.selectedBattleOption === 'attack' || JIF.selectedBattleOption === 'skill' || JIF.selectedBattleOption === 'guard' || JIF.selectedBattleOption === 'item') {
        eval("this.drawText(JIF." + JIF.selectedBattleOption + "Desc, 0, 0, this._width);");
        this.visible = true;
    } else {
        this.drawText("", 0, 0, this._width);
        this.visible = false;
    }
    
}