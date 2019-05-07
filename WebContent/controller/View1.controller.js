sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function (oController, oMessageToast, JSONModel, ResourceModel) {
    debugger
    return oController.extend("route.controller.View1", {
        onInit() {
            debugger
        },
        onBtnPress() {
            let oRoute = this.getOwnerComponent().getRouter();
            oRoute.navTo("View2");
        },
        onBtnPress1(oController) {
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var oName = this.getOwnerComponent().getModel().getProperty("/Students/0").StdName;
            var sMsg = oBundle.getText("msgToastBtnPrsMsg", [oName]);
            oMessageToast.show("Hello "+oName);
        },
        onDialogBtnPress(oController) {
            this.getOwnerComponent()._componentDialog.open()
            debugger
        }
    });
});