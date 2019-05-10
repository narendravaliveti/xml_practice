sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
], function (UIComponent, JSONModel, ResourceModel) {
    return UIComponent.extend("route.Component", {
        metadata: {
            manifest: "json"
        },
        init() {
            // call init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            //creating JSONModel from model.json file
            var oModel = new JSONModel("JSON/model.json");
            this.setModel(oModel);
            //creating JSONModel from oData call
            var oModel1 = new JSONModel();
            this.setModel(oModel1, "StdModel");
            this.oModel2 = new sap.ui.model.odata.v2.ODataModel("proxy/sap/opu/odata/sap/Z03_PRACTICE_SRV");
            //creating i18n model
            var i18nModel = new ResourceModel({
                bundleName: "route.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
            this.getRouter().initialize();
            //dialog control to use in view
            this._componentDialog = new sap.m.Dialog({
                title: "Dialog",
                content: [
                    new sap.m.Text({
                        text: "ComponentDialog"
                    })
                ]
            });
            this._busyDialog = new sap.m.BusyDialog({});
        }
    });
});