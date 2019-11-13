/*:
 * @plugindesc (v. 1.0) window opacity controller commission for Chobo.
 * @author Jake
 *  
 * @param Scene_Names
 * @text Scene Names
 * @desc Names of the scenes affected.
 * @type text[]
 * @default ["Scene_Title"]
 */

 //
 // Initialization
 //
 var JAKE = JAKE || {};
 var Imported = Imported || {};
 Imported['J_WindowOpacityController'] = 1.0;
 JAKE.WindowOpacityController = JAKE.WindowOpacityController || {};

 JAKE.Notetags = [];

 //
 // Parameters
 //
 var params = PluginManager.parameters('J_WindowOpacityController');
 JAKE.Scene_Names = Array(params['Scene_Names']);
 //Lots of work arounds to get a proper array, can probably be optimized.
 JAKE.pass = JAKE.Scene_Names.toString();
 JAKE.pass = JAKE.pass.slice(1, -1);
 JAKE.pass = JAKE.pass.replace(/['"]+/g, '');
 JAKE.arrayList = JAKE.pass.split(',');

 //
 // Main
 //
 var Scene_Base_create_alias = SceneManager.onSceneStart; //Alias to prevent plugin conflicts
 SceneManager.onSceneStart = function(){
     Scene_Base_create_alias.apply(this, arguments);
     var a = false; //Variable used as reference if scenes match for later use*
     if(this._scene._windowLayer)
     {
        var currentScene; //Current scene check
        JAKE.arrayList.forEach(function(x)
        {
            eval("currentScene = " + x);
            var cur = SceneManager._scene.constructor.name; //Gets the constructor name for later comparisons
            var ref = currentScene.name;
            if(cur === ref) //Compare scene in array with current open scene
            {
                console.log(SceneManager._scene._windowLayer)
                a = true;
            }
        });
        //*
        if(a)
        {
            var children = this._scene._windowLayer.children; //Array of windows
            for(var i = 0, length = children.length; i < length; i++)
            {
                children[i]._windowBackSprite.alpha = 0; //Set the window skins alpha to 0
                children[i]._windowFrameSprite.alpha = 0;
            }
        }
        
    }
    

 };
 
    
 

  