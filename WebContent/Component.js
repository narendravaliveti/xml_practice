sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
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
            this._componentDialog = new sap.m.Dialog({
               title: "Dialog",
               content: [
                   new sap.m.Text({
                       text: "ComponentDialog"
                   })
               ]
            });
        },
        callServer:(sAPIName)=>{
            debugger;
            let oConfig = {
                url: `${sAPIName}`,
                // method: "POST",
                // data:JSON.stringify(oOptions) ,
                dataType: "json",
                contentType: "text/plain"

            };

            let oDeferred = jQuery.Deferred();

            jQuery.ajax(oConfig).done(function(response, status, xhr, cfg) {

                oDeferred.resolve(response);
            })
                .fail(function(response, status, xhr, cfg)  {

                    oDeferred.reject(response);
                })
                .always(function(response, status, xhr, cfg) {

                    sap.ui.core.BusyIndicator.hide();
                });

            return oDeferred.promise();
        }
    });
});