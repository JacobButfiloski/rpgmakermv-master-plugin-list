/*:
 * @plugindesc (v.1) An example extension for Custom Skill Core
 * @author Jiffy
 * 
 * @param staleDamageDecreaseIncrement
 * @desc The increment damage is decreased by (Ex. For a 10% decrease -> .1) for the stale skill| Default: 0.1
 * @default 0.1
 * 
 * @param strengthenDamageIncreaseIncrement
 * @desc The increment damage is increased by (Ex. For a 10% decrease -> .1) for the strengthen skill| Default: 0.1
 * @default 0.1
 *
 * @help
 *   Jiffy's Custom Skill Pack
 * ===========================================================================
 * This plugin comes with a few different example custom skills that make use
 * of JIF_CustomSkillCore. Make sure that custom skill core is over this
 * plugin in the plugin manager.
 * For details on how to add a custom skill, check the help section of the
 * core plugin.
 * ===========================================================================
 *   Skill Explanation
 * ===========================================================================
 * Stale (stale)
 * This skill will decrease the amount of damage the move does if it is used
 * repeatedly.
 * 
 * Strengthen (strengthen)
 * This skill will increase the amount of damage the move does if it is used
 * repeatedly.
 * 
 * Wild Strike (wildStrike)
 * This skill has a random chance of doing either: 1, 100, or 1000 damage.
 * 
 * Insane Strike (insaneStrike)
 * This skill has a random chance of doing either: 1, or 10000 damage.
 * ===========================================================================
 *   Parameter Explanation
 * ===========================================================================
 * staleDamageDecreaseIncrement:
 * This parameter changes the increment of which your damage is decreased by.
 * For example: If I set this to .1, the damage will decrease by 10% each time
 * time it is used in a row.
 * 
 * strengthenDamageIncreaseIncrement:
 * This parameter changes the increment of which your damage is increased by
 * when using the strengthen skill. For example: If I set this to .1, the damage 
 * will increase by 10% each time time it is used in a row.
 * ===========================================================================
 * Thanks for reading! If you have any questions regarding this plugin, feel
 * free to DM me on RPGMakerWeb!
 *
 * Thanks again
 * - Jiffy
*/

var JIF = JIF || {};

var Imported = Imported || {};

var params = PluginManager.parameters('JIF_MoveStaling');

//-------------------------------------------------------------------------------
//Requirements
//-------------------------------------------------------------------------------
JIF.needsCustomSkillCore = function() {
    if(confirm("This plugin requires the core plugin 'JIF_CustomSkillCore'. Would you like to open the download page for this plugin?")) {
        window.open('https://www.dropbox.com/s/ggha7b08mjcncap/JIF_MoveStaling.js?dl=0');
    }
}

if(!Imported["JIF_CustomSkillCore"]) {
    JIF.needsCustomSkillCore();
}

//
//Random Function
//
Math.randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
  }

//-------------------------------------------------------------------------------
//Skills
//-------------------------------------------------------------------------------

//Stale Skill
JIF.arr = []; 
JIF.tempCount = 0;
JIF.modifier = String(params['staleDamageDecreaseIncrement']);;
JIF_Custom_Skill.stale = function(value, action) {
    

    if(JIF.arr.length > 2)
    {
        if(JIF.arr[JIF.arr.length - 2].item().name !== action.item().name)
        {
            JIF.tempCount = 0;
            for(var i = 0; i < JIF.arr.length; i++)
            {
                if(JIF.arr[i].item().name !== action.item().name) {
                    JIF.arr = JIF.arr.slice(i, 1);
                }
            }
        }
    }
    JIF.tempCount = 0;
    for(var i = 0; i < JIF.arr.length; i++)
    {
        if(JIF.arr[i].item().name === action.item().name)
        {
            JIF.tempCount++;
        }
    }
    JIF.arr.push(action);
    return Math.floor(value - (value * (JIF.modifier * JIF.tempCount)));;
}

//Strengthen Skill
JIF.arr2 = []; 
JIF.tempCount2 = 0;
JIF.modifier2 = .1;
JIF_Custom_Skill.strengthen = function(value, action) {
    

    if(JIF.arr2.length > 2)
    {
        if(JIF.arr2[JIF.arr2.length - 2].item().name !== action.item().name)
        {
            JIF.tempCount2 = 0;
            for(var i = 0; i < JIF.arr2.length; i++)
            {
                if(JIF.arr2[i].item().name !== action.item().name) {
                    JIF.arr2 = JIF.arr2.slice(i, 1);
                }
            }
        }
    }
    JIF.tempCount2 = 0;
    for(var i = 0; i < JIF.arr2.length; i++)
    {
        if(JIF.arr2[i].item().name === action.item().name)
        {
            JIF.tempCount2++;
        }
    }
    JIF.arr2.push(action);
    return Math.floor(value + (value * (JIF.modifier2 * JIF.tempCount2)));;
}

//Wild Strike
JIF_Custom_Skill.wildStrike = function(value, action) {
    var temp = Math.randomRange(1, 4);

    switch(temp) {
        case 1: value = 1;
        case 2: value = 100;
        case 3: value = 1000;
    }

    return value;
}

//Insane Strike
JIF_Custom_Skill.insaneStrike = function(value, action) {
    var temp = Math.randomRange(1, 20);

    if(temp < 18)
    {
        value = 1;
    } else {
        value = 10000;
    }

    return value;
}

var a = 20;
JIF_Custom_Skill.testSkill = function(value, action) {
    value = 20;
    return value;
}

