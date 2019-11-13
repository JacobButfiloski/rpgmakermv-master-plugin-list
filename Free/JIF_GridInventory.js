/*:
 * @plugindesc (v.1) Creates a Grid Inventory with the iconset
 * @author Jiffy
 *
 * @param itemListHeight
 * @desc Change Item List Height| Default:64
 * @default 64
 *
 * @param windowWidth
 * @desc Change Window Width| Default:640
 * @default 640
 *
 * @param maxItemCategoryColumns
 * @desc Change Item Category Max Columns| Default:1
 * @default 1
 *
 * @param itemListMaxColumns
 * @desc Change Item List Max Columns| Default:10
 * @default 10
 *
 * @param windowItemListX
 * @desc Change the Item List Window X Value| Default:640
 * @default 640
 *
 * @param windowItemListY
 * @desc Change the Item List Window Y Value| Default:180
 * @default 180
 *
 * @param windowItemListWidth
 * @desc Change the Item List Window Width Value| Default:640
 * @default 640
 *
 * @param windowItemListHeight
 * @desc Change the Item List Window Height Value| Default:540
 * @default 540
 *
 * @param windowItemCategoryX
 * @desc Change the Window Item Category X Value| Default:640
 * @default 640
 *
 * @param windowItemCategoryY
 * @desc Change the Window Item Category Y Value| Default:108
 * @default 108
 *
 * @help
 *   Jiffy's Grid Inventory Plugin
 * ===========================================================================
 * This plugin creates a grid inventory. Where, rather than drawing the name
 * and icon like the default menu, it is changed to a much smaller and 
 * condensed inventory that uses the iconset.
 * ===========================================================================
 *   Parameter Explanation
 * ===========================================================================
 * itemListHeight - The height of the window containing the items.
 * windowWidth - The Width of the Item Category list window (Items, Weapons 
 * etc.)
 * maxItemCategoryColumns - The max columns of the Item Category List window
 * itemListMaxColumns - The max columns of the items (Note: It is not suggested 
 * to change this.)
 * windowItemListX - The X location of the Item List window
 * windowItemListY - The Y location of the Item List window
 * windowItemListWidth - The width of the item list window
 * windowItemListHeight - The height of the item list window
 * windowItemCategoryX - The X value of the Item Category Window
 * windowItemCategoryY - The Y value of the Item Category Window
 * ===========================================================================
 * Thanks for reading! If you have any questions regarding this plugin, feel
 * free to DM me on RPGMakerWeb or comment on my YouTube channel!
 * Youtube.com/Jiffy <- Youtube is having issues at the moment so this may
 * not be right.
 *
 * Thanks again
 * - Jiffy
 */
 

   var params = PluginManager.parameters('JIF_GridInventory')

 var _.itemListHeight = String(params['itemListHeight']);
 _.windowWidth = String(params['windowWidth']);
 _.maxItemCategoryColumns = String(params['maxItemCategoryColumns']);
 _.itemListMaxColumns = String(params['itemListMaxColumns']);
 _.windowItemListX = String(params['windowItemListX']);
 _.windowItemListY = String(params['windowItemListY']);
 _.windowItemListWidth = String(params['windowItemListWidth']);
 _.windowItemListHeight = String(params['windowItemListHeight']);
 _.windowItemCategoryX = String(params['windowItemCategoryX']);
 _.windowItemCategoryY = String(params['windowItemCategoryY']);

 Window_EquipCommand.prototype.maxCols = function() {
    return 10;
};

 Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {}
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
};

    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {}
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
};

Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText();
    }
};

Window_ItemList.prototype.itemHeight = function() {
    return _.itemListHeight;
};

Window_ItemCategory.prototype.windowWidth = function() {
    return _.windowWidth;
};

Window_ItemCategory.prototype.maxCols = function() {
    return _.maxItemCategoryColumns;
};

Window_ItemList.prototype.maxCols = function() {
    return _.itemListMaxColumns;
};

Window_ItemList.prototype.enlargeCurrentIcon = function() {
    this.item[index].height = Window_Base._iconWidth + 10;
    this.item[index].width = Window_Base._iconWidth + 10;
};

Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, _.windowItemListX, _.windowItemListY, _.windowItemListWidth, _.windowItemListHeight);
    this._category = 'none';
    this._data = [];
};

Window_ItemList.prototype.update = function() {
    this.enlargeCurrentIcon();
};

Window_ItemCategory.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, _.windowItemCategoryX, _.windowItemCategoryY);
};
