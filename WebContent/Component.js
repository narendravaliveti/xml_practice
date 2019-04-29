sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function (UIComponent, JSONModel, ResourceModel) {
    debugger
    return UIComponent.extend("route.Component",{
        metadata: {
            manifest: "json"
        },
        init() {
            debugger
            // call init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            var oModel = new JSONModel("JSON/model.json");
            this.setModel(oModel);
            var i18nModel = new ResourceModel({
               bundleName : "route.i18n.i18n"
            });
            this.setModel(i18nModel,"i18n");
            this.getRouter().initialize();
        }
    });
});