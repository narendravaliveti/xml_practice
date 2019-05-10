sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (oController, oMessageToast) {
    return oController.extend("route.controller.View2", {
        onInit: function () {
            this.stdModel = this.getOwnerComponent().getModel("StdModel");
            this.oComponent = this.getOwnerComponent();
            this.oModel = this.oComponent.oModel2;

            //-----Implementing Deep Entity-----//
            // this.oModel.create("/std_hdrSet", {
            //     Client: "001",
            //     StdId: "ST0013",
            //     StdName: "Narendra",
            //     HdrToMarksNav:[
            //         {
            //             Client: "001",
            //             StdId: "ST0013",
            //             Semester: "1-2",
            //             Subject: "ENGLISH2",
            //             StdMarks: 78
            //         }
            //     ]
            // },{success:()=>{debugger},error:()=>{debugger}});

            this.oRoute = this.getOwnerComponent().getRouter();
            this.oView = this.getView();
            this.oComponent._busyDialog.open();

            //-----Reading EntitySet-----//
            this.oModel.read("/std_hdrSet", {
                success: (oData) => {
                    this.stdModel.setProperty("/Students", oData.results);
                    this.oComponent._busyDialog.close();
                },
                error: () => {
                    this.oComponent._busyDialog.close();
                    oMessageToast.show("Failed to load data");
                }
            });
            //-----To Bind Input Boxes Of Add Student Dialog-----//
            this.stdModel.setProperty("/AddStudent", {"StdId": "ST", "StdName": ""})
        },
        //-----Navigating To Previous View-----//
        navButtonPress() {
            this.oRoute.navTo("View1");
        },
        //-----Filtering Values While Searching From Input Box-----//
        onSearch(oEvnt) {
            debugger
            let vValue = oEvnt.getSource().getValue();
            let oBinding = this.oView.byId("studentList").getBinding("items");
            if (oBinding) {
                oBinding.filter(new sap.ui.model.Filter([
                    new sap.ui.model.Filter(
                        "StdId",
                        sap.ui.model.FilterOperator.Contains,
                        vValue
                    ),
                    new sap.ui.model.Filter(
                        "StdName",
                        sap.ui.model.FilterOperator.Contains,
                        vValue
                    )
                ], false));
            }
            debugger
        },
        //-----Opening Dialog On Clicking Add Button-----//
        onAddStudentPress() {
            this.oView.byId("StudentDialog").setTitle("AddStudent");
            this.oView.byId("StdIdInput").bindProperty("value", "StdModel>/AddStudent/StdId");
            this.oView.byId("StdNameInput").bindProperty("value", "StdModel>/AddStudent/StdName");
            this.oView.byId("StudentDialog").open();
        },
        //-----Opening Dialog On Clicking Update Button-----//
        onUpdateStudentPress() {
            let arStudents = this.oView.byId("studentList").getSelectedItems();
            if (arStudents.length > 1) {
                oMessageToast.show("Please select only one item");
            } else if (arStudents.length === 0) {
                oMessageToast.show("Please select any item");
            } else {
                let sPath = arStudents[0].getBindingContextPath();
                let sStdIdPath = "StdModel>" + sPath + "/StdId";
                let sStdNamePath = "StdModel>" + sPath + "/StdName";
                this.oView.byId("StdIdInput").bindProperty("value", sStdIdPath);
                this.oView.byId("StdNameInput").bindProperty("value", sStdNamePath);
                this.oView.byId("StudentDialog").setTitle("EditStudent");
                this.oView.byId("StudentDialog").open();
            }

        },
        //----Creating Entity Through Odata Call On Clicking Ok Button From Dialog-----//
        onAddPress() {
            let oData = this.stdModel.getProperty("/AddStudent");

            //-----Creating Entity-----//
            this.oModel.create("/std_hdrSet", oData);

            //-----Reading EntitySet-----//
            this.oModel.read("/std_hdrSet", {
                success: (oData) => {
                    this.stdModel.setProperty("/Students", oData.results);
                }
            });
            this.oView.byId("StudentDialog").close();
        },
        //-----Validating StdId Entered In Input Box-----//
        onIdChange(oEvnt) {
            let arStudents = this.stdModel.getProperty("/Students");
            let sStdId = oEvnt.getSource().getProperty("value");
            debugger
            if ( sStdId !== " " ) {
                if (sStdId.startsWith("ST") === true && sStdId.length === 6) {
                    let a = true;
                    arStudents.forEach((oStudnet) => {
                        if (oStudnet.StdId === sStdId) {
                            a = false;
                            oEvnt.getSource().setProperty("valueState", "Error");
                            oEvnt.getSource().setProperty("valueStateText", "Student is already present");
                        }
                    });
                    if (a) {
                        oEvnt.getSource().setProperty("valueState", "Success");
                    }
                } else {
                    oEvnt.getSource().setProperty("valueState", "Error");
                    oEvnt.getSource().setProperty("valueStateText", "StudentId should be like ST----");
                }
            } else {
                oEvnt.getSource().setProperty("valueState", "Error");
                oEvnt.getSource().setProperty("valueStateText", "StudentId cannot be empty");
            }
            debugger
        },
        //-----Closing Dialog On Clicking Cancel Button In Dialog Box-----//
        onRejectPress() {
            this.oView.byId("StudentDialog").close();
        },
        //-----Deleting Entity When Delete Button Is Clicked-----//
        onDeleteListItem(oEvnt) {

            //-----DELETING A SINGLE RECORD-----//
            // let sPath = oEvnt.getParameter("listItem").getBindingContextPath();
            // let oList = oEvnt.getSource();
            // oList.attachEventOnce("updateFinished", oList.focus, oList);
            //
            // let stdId = this.stdModel.getProperty(sPath).StdId;
            // this.oModel.remove("/std_hdrSet(Client='001',StdId='"+stdId+"')");
            // this.oModel.read("/std_hdrSet",{success:(oData)=>{
            //                     this.stdModel.setProperty("/Students",oData.results);
            //                 }});

            //-----DELETING MULTIPLE RECORDS IN LOOP(BATCH)-----//
            let arDelStd = this.oView.byId("studentList").getSelectedItems();
            this.oModel.setUseBatch(true); //Should be used to handle multiple oData requests at a time
            arDelStd.forEach((oStd) => {
                let sPath = oStd.getBindingContextPath();
                let stdId = this.stdModel.getProperty(sPath).StdId;
                this.oModel.remove("/std_hdrSet(Client='001',StdId='" + stdId + "')");
            });
            this.oModel.submitChanges(); // Should be used to handle multiple oData requests at a time

            //-----Reading EntitySet-----//
            this.oModel.read("/std_hdrSet", {
                success: (oData) => {
                    this.stdModel.setProperty("/Students", oData.results);
                }
            });
        },
        //-----Navigating To Other View When A Entity Is Clicked In List Items-----//
        listNavPress(oEvnt) {
            let sPath = oEvnt.getSource().getBindingContextPath();
            let stdId = this.stdModel.getProperty(sPath).StdId;
            let stdName = this.stdModel.getProperty(sPath).StdName;
            this.oComponent._busyDialog.open();

            //-----Reading Association-----//
            this.oModel.read("/std_hdrSet(Client='001',StdId='" + stdId + "')/HdrToMarksNav", {
                success: (oData) => {
                    this.stdModel.setProperty("/StdId", stdId);
                    this.stdModel.setProperty("/StdName", stdName);
                    this.stdModel.setProperty("/StudentMarks", oData.results);
                    this.oComponent._busyDialog.close();
                    this.oRoute.navTo("View3");
                }
            });
        }
    });
});