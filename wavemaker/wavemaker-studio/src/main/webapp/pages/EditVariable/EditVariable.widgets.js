/*
 * Copyright (C) 2011-2013 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


EditVariable.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
	    tabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "TransparentTabBar", "NoRightMarginOnTab", "StudioDarkLayers"]}, width: "100%", height: "100%", clientBorder: "1",clientBorderColor: "#959DAB"}, {}, {
		guiLayer: ["wm.Layer", {caption: "Field Editor"}, {onShow: "onGuiShow"}, {
            panel1: ["wm.Panel", {_classes: {domNode: ["StudioToolBar"]}, border: "0,0,1,0", borderColor: "#959DAB", layoutKind: "left-to-right", height: "29px", horizontalAlign: "left", verticalAlgin: "top"}, {}, {

    			AddButton: ["wm.studio.ToolbarButton", {hint: "Add Menu Item", "caption":"",imageList: "smallToolbarImageList", imageIndex: 25}, {"onclick":"addButtonClick"}],
    			DeleteButton: ["wm.studio.ToolbarButton", {hint: "Delete Menu Item", "caption":"", imageList: "smallToolbarImageList", imageIndex: 0}, {"onclick":"deleteButtonClick"}]//,
    			//DefaultItemButton: ["wm.ToolButton", {hint: "Make selected item the initial button value", "caption":"","width":"16px", height: "16px", imageList: "smallToolbarImageList", imageIndex: 2}, {"onclick":"DefaultButtonClick"}]

		    }],
		    panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "10"}, {}, {
			tree: ["wm.Tree", {"border":"0","dropBetweenNodes":true,"height":"100%"}, {"ondblclick":"treeDblclick", ondeselect: "treeSelect", onselect: "treeSelect"}]/*,
																						    sample: ["wm.DojoMenu", {"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}],"onClick":undefined},{"label":"Edit"},{"label":"Zoom"}],"height":"100%","structure":"{\"items\":[{\"label\":\"File\"},{\"label\":\"Edit\"},{\"label\":\"Zoom\"}]}","vertical":true,"width":"115px"}, {}]*/
		    }]
		}],
		textLayer: ["wm.Layer", {caption: "Text Editor"}, {onShow: "updateText"}, {
		    text: ["wm.AceEditor", {syntax: "json", width: "100%", height: "100%"}, {onChange: "onAceChange"}]
		}]
	    }]
	}],
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
	    	invalidLabel: ["wm.Label", {showing: false, caption: "Your json is invalid", width:"100%"}],
			 CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
			 OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}]
		     }]
	}]
}