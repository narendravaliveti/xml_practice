sap.ui.define(["sap/ui/core/mvc/Controller"]
    ,function (oController) {
        return oController.extend("route.controller.view1", {
            onBtnPress(){
                let oRoute = this.getOwnerComponent().getRouter();
                oRoute.navTo("View1");
            },
            onDialogPress() {
                this.getView().byId("myDialog").open( );
            }
        });
    });