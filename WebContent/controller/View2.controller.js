sap.ui.define([
    "sap/ui/core/mvc/Controller"
],function (oController) {
        return oController.extend("route.controller.View2", {
            onInit(){
                this.stdModel = this.getOwnerComponent().getModel("StdModel");
                this.oComponent = this.getOwnerComponent();
                this.oModel2 = this.oComponent.oModel2;
                this.oComponent._busyDialog.open();
                this.oRoute = this.getOwnerComponent().getRouter();
                this.oView = this.getView();
                this.oModel2.read("/std_hdrSet",{
                    success: (oData) => {
                        this.stdModel.setProperty("/Students",oData.results);
                        this.oComponent._busyDialog.close();
                        debugger
                    },
                    error: function (oData) {
                    }
                });
                this.stdModel.setProperty("/AddStudent",{"StdId":"ST","StdName":""})
            },
            navButtonPress(){
                this.oRoute.navTo("View1");
            },
            onAddStudentPress(){
                this.oView.byId("AddStudentDialog").open( );
            },
            onAddPress(){

                let oData = stdModel.getProperty("/AddStudent");
                this.oModel2.create("/std_hdrSet",oData);
                this.oModel2.read("/std_hdrSet",{success:(oData)=>{
                        this.stdModel.setProperty("/Students",oData.results);
                    }});
                this.oView.byId("AddStudentDialog").close();
            },
            onIdChange(oEvnt){
                let arStudents = this.stdModel.getProperty("/Students");
                let sStdId = oEvnt.getSource().getProperty("value");
                debugger
                if(sStdId !== ""){
                    if( sStdId.startsWith("ST") === true && sStdId.length === 6 ){
                        let a = true;
                        arStudents.forEach((oStudnet)=>{
                            if(oStudnet.StdId === sStdId) {
                                a = false;
                                oEvnt.getSource().setProperty("valueState","Error");
                                oEvnt.getSource().setProperty("valueStateText","Student is already present");
                            }
                        });
                        if(a){
                            oEvnt.getSource().setProperty("valueState","Success");
                        }
                    }else{
                        oEvnt.getSource().setProperty("valueState","Error");
                        oEvnt.getSource().setProperty("valueStateText","StudentId should be like ST----");
                    }
                }else{
                    oEvnt.getSource().setProperty("valueState","Error");
                    oEvnt.getSource().setProperty("valueStateText","StudentId cannot be empty");
                }
              debugger
            },
            onRejectPress(){
              this.oView.byId("AddStudentDialog").close();
            },
            onDeleteListItem(oEvnt){

                //-----DELETING A SINGLE RECORD-----//
                // let sPath = oEvnt.getParameter("listItem").getBindingContextPath();
                // let oList = oEvnt.getSource();
                // oList.attachEventOnce("updateFinished", oList.focus, oList);
                //
                // let stdId = this.stdModel.getProperty(sPath).StdId;
                // this.oModel2.remove("/std_hdrSet(Client='001',StdId='"+stdId+"')");
                // this.oModel2.read("/std_hdrSet",{success:(oData)=>{
        //                     this.stdModel.setProperty("/Students",oData.results);
        //                 }});

                //-----DELETING MULTIPLE RECORDS-----//
                let arDelStd = this.oView.byId("studentList").getSelectedItems();
                this.oModel2.setUseBatch(true);
                arDelStd.forEach((oStd)=>{
                    let sPath = oStd.getBindingContextPath();
                    let stdId = this.stdModel.getProperty(sPath).StdId;
                    this.oModel2.remove("/std_hdrSet(Client='001',StdId='"+stdId+"')");
                });
                this.oModel2.submitChanges();
                this.oModel2.read("/std_hdrSet",{
                    success:(oData)=>{
                        this.stdModel.setProperty("/Students",oData.results);
                    }
                });
            },
            listNavPress(oEvnt){
                let sPath = oEvnt.getSource().getBindingContextPath();
                let stdId = this.stdModel.getProperty(sPath).StdId;
                let stdName = this.stdModel.getProperty(sPath).StdName;
                let oModel = new sap.ui.model.odata.v2.ODataModel("proxy/sap/opu/odata/sap/Z03_PRACTICE_ASS_SRV");
                oModel.read("/std_hdrSet('"+stdId+"')/HdrToMarksNav",{success:(oData)=>{
                    this.stdModel.setProperty("/StdId",stdId);
                    this.stdModel.setProperty("/StdName",stdName);
                    this.stdModel.setProperty("/StudentMarks",oData.results);
                        this.oRoute.navTo("View3");
                    }});
            }
        });
    });