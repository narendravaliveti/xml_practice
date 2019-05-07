sap.ui.define([
    "sap/ui/core/mvc/Controller"
],function (oController) {
    return oController.extend("route.controller.View3", {
        navButtonPress(){
            let oRoute = this.getOwnerComponent().getRouter();
            oRoute.navTo("View2");
        }
    })
});