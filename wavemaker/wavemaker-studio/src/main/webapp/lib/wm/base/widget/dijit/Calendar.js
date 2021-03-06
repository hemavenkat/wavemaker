/*
 *  Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.dijit.Calendar");
dojo.require("wm.base.lib.date");
dojo.require("wm.base.widget.dijit.Dijit");
dojo.require("dijit.Calendar");
dojo.require("dojo.date.locale");

dojo.extend(dijit.Calendar, {
    specialDates: null,
    getClassForDate: function(date) {
        if (!this.specialDatesHash) return;
        var classField = this.owner.cssClassField;
        var key = wm.dijit.Calendar.getDateKey(date);
        if (this.specialDatesHash && this.specialDatesHash[key]) {
            var classes = "";
            for (var i = 0; i < this.specialDatesHash[key].length; i++) {
                var newclass = this.specialDatesHash[key][i][classField];
                if (typeof newclass == "number") newclass = "class" + newclass;
                classes += ((classes) ? " " : "") + newclass;
            }
            return classes;
        }
    }
});


dojo.declare("wm.dijit.Calendar", wm.Dijit, {
    minimum: "",
    maximum: "",
    useLocalTime: false,
    displayDate: "",
    dijitClass: dijit.Calendar,
    width: "360px",
    height: "160px",
    mobileHeight: "210px",
    enableTouchHeight: true,
    dialog: null,
    useDialog: true,
    // inDates is expected to be an array; but we'll need to turn it into a hash
    specialDates: null,
    dateField: null,
    startDateField: null,
    endDateField: null,
    cssClassField: null,
    desciptionField: null,
    setSpecialDates: function(inDataSet) {
        if (!inDataSet) {
            this.specialDates = null;
            this.specialDatesHash = {};
            this.refreshCalendar();
            return;
        }
        var dates = {};

        if (this.isDesignLoaded()) {
            if (!(inDataSet instanceof wm.Variable)) {
                var ds = this.getValueById(inDataSet);
                if (ds) {
                    this.components.binding.addWire("", "specialDates", ds.getId());
                    return; // binding will recall setSpecialDates
                }
            }
        }

        if (dojo.isString(inDataSet)) inDataSet = this.owner.getValue(inDataSet);
        this.specialDates = inDataSet;

        if (inDataSet instanceof wm.Variable) inDataSet = inDataSet.getData();
        for (var i = 0; i < inDataSet.length; i++) {
            var data = inDataSet[i];
            if (!data.date && data.dataValue) data = data.dataValue;
            var date = data[this.dateField];
            if (date instanceof Date === false) date = new Date(date);
            var key = wm.dijit.Calendar.getDateKey(date);
            if (!dates[key]) dates[key] = [];
            dates[key].push(data);
        }
        this.specialDatesHash = dates;
        this.refreshCalendar();
    },
    getProperties: function() {
        var result = this.inherited(arguments);
        result.owner = this;
        if (this.dateValue) {
            result.currentFocus = result.value = new Date(this.dateValue);
        }
        return result;
    },
    renderBounds: function() {
        this.inherited(arguments);
        this.dijit._setStyleAttr({
            width: this.bounds.w + "px",
            height: this.bounds.h + "px"
        });
    },
    focus: function() {
        this.dijit.focus();
    },
    refreshCalendar: function() {
        this.dijitProps.specialDatesHash = this.specialDatesHash;
        if (this.dijit) {
            this.dijit.destroy();
            this.initDijit(this.domNode);
            this.dijit._setStyleAttr({
                width: this.bounds.w + "px",
                height: this.bounds.h + "px"
            });
        }
    },
    initDijit: function(inNode) {
        var result = this.inherited(arguments);
        dojo.query(".dijitButtonNode", this.domNode).addClass("wmbutton");
        return result;
    },
    prepare: function() {
        this.inherited(arguments);
        if (this.specialDates) {
            this.setSpecialDates(this.specialDates);

        }

    },
    init: function() {
        this.dijitProps.isDisabledDate = dojo.hitch(this, "isDisabledDate");
        this.setMinimum(this.minimum);
        this.setMaximum(this.maximum);

        this.inherited(arguments);
        if (this.dateValue)
            this.setDateValue(this.dateValue);
            if (this.useDialog) {
                this.dialog = new wm.WidgetsJsDialog({
                    width: 200,
                    height: 160,
                    modal: false,
                    owner: this,
                    corner: "cr",
                    fixPositionNode: this.domNode,
                    widgets_data: {
                        startContainer: ["wm.Panel", {height: "20px", width: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"},{},{
                            startHeading:  ["wm.Label", {width: "40px", height: "100%", caption: "FROM:"}],
                            startDate:  ["wm.Label", {width: "100%", height: "100%"}]
                        }],
                        endContainer: ["wm.Panel", {height: "20px", width: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"},{},{
                            endHeading:  ["wm.Label", {width: "40px", height: "100%", caption: "TO:"}],
                            endDate:  ["wm.Label", {width: "100%", height: "100%"}]
                        }],
                        description: ["wm.Label", {width: "100%", height: "20px", autoSizeHeight: true, singleLine: false}]}
                });
                this.dialog.titleMinify.hide();
                this.dialog.titleMaxify.hide();
        }
    },
    setMinimum: function(inValue) {
        if (this._isDesignLoaded) {
            if (inValue instanceof Date) {
                this.minimum = inValue.getTime();
            } else if (!inValue) {
                this.minimum = "";
            } else {
                this.minimum = inValue;
            }
        } else {
            if (inValue instanceof Date) {
                this.minimum = inValue;
            } else if (!inValue) {
                this.minimum = "";
            } else {
                this.minimum = wm.convertValueToDate(inValue);
            }
            if (this.dijit) {
                var value = this.dijit.value;
                var currentFocus = this.dijit.currentFocus;
                this.dijit.destroy();
                this.initDijit(this.domNode);
                this.renderBounds();
                this.dijit.set("currentFocus", currentFocus);
                this.setDate(value);
            }
        }
    },
    setMaximum: function(inValue) {
        if (this._isDesignLoaded) {
            if (inValue instanceof Date) {
                this.maximum = inValue.getTime();
            } else if (!inValue) {
                this.maximum = "";
            } else {
                this.maximum = inValue;
            }
        } else {
            if (inValue instanceof Date) {
                this.maximum = inValue;
            } else if (!inValue) {
                this.maximum = "";
            } else {
                this.maximum = wm.convertValueToDate(inValue);
            }
            if (this.dijit) {
                var value = this.dijit.value;
                var currentFocus = this.dijit.currentFocus;
                this.dijit.destroy();
                this.initDijit(this.domNode);
                this.renderBounds();
                this.dijit.set("currentFocus", currentFocus);
                this.setDate(value);
            }
        }
    },
    setDomNode: function() {
        this.inherited(arguments);
        var s = this.dijit.domNode.style;
        s.width = s.height = "100%";
    },
    setDate: function(inValue) {
        var d = wm.convertValueToDate(inValue);
        if (d && !this.useLocalTime) {
            /* See WM-4490 to understand this calculation */
            d.setHours(0, 60*d.getHours() + d.getMinutes() + 60*wm.timezoneOffset);
        }
        this.dijit.set("value", d);
    },
    getDisplayDate: function() {
        if (!this.dijit || this.dijit.value instanceof Date == false) return "";
        return dojo.date.locale.format(this.dijit.value, {
            selector: "date"
        });
    },
    setDisplayDate: function(inValue) {
        this.setDate(inValue);
    },
    getDateValue: function() {
        // dijit._Calendar doesn't have a getValue()
        var d = this.dijit.value;
        if (d instanceof Date) {
            /* See WM-4490 to understand this calculation */
            var adjustSixHours = 360;
            if (!this.useLocalTime) d.setHours(0,-60*wm.timezoneOffset + adjustSixHours, 0);
            else d.setHours(0, 0, 0);
            return d.getTime();
        }
        return null;
    },
    setDateValue: function(inValue) {
        this.setDate(inValue);
    },
    _onValueSelected: function(inDate) {
        if (this._cupdating) return;
        this.onValueSelected(inDate);
    },
    onValueSelected: function(inDate) {
        var key = wm.dijit.Calendar.getDateKey(inDate);
        if (this.useDialog && this.specialDatesHash && this.specialDatesHash[key]) {

            // TODO: Handle additional entries for this date
            var data = this.specialDatesHash[key][0];
            this.dialog.setTitle(key);
            this.dialog.show();

            this.dialog.$.startContainer.setShowing(Boolean(data[this.startDateField]));
            this.dialog.$.endContainer.setShowing(Boolean(data[this.endDateField]));
            this.dialog.$.startDate.setCaption(wm.dijit.Calendar.getTime(data[this.startDateField]));
            this.dialog.$.endDate.setCaption(wm.dijit.Calendar.getTime(data[this.endDateField]));
            this.dialog.$.description.setCaption(data[this.descriptionField]);
        } else if (this.useDialog && this.dialog.showing) this.dialog.dismiss();
        this.valueChanged("dateValue", inDate instanceof Date ? inDate.getTime() : null);
    },
    isDisabledDate: function(date) {
        if (this.minimum) {
            if (dojo.date.compare(date, this.minimum, "date") < 0) {
                return true;
            }
        }
        if (this.maximum) {
            if (dojo.date.compare(date, this.maximum, "date") > 0) {
                return true;
            }
        }
        return false;
    }

});


wm.dijit.Calendar.getTime = function(date) {
    if (date instanceof Date === false) date = new Date(date);
    var hour = date.getHours();
    var ampm = "am";
    if (hour == 0) {
        hour = 12;
    } else if (hour == 12)
        ampm = "pm";
    else if (hour > 12) {
        hour = hour % 12;
        ampm = "pm";
    }

    return hour + ":" + date.getMinutes() + " " + ampm;
};

wm.dijit.Calendar.getDateKey = function(date) {
    return (date.getYear() + 1900) + "-" + (date.getMonth()+1) + "-" + date.getDate();
};

wm.dijit.Calendar.description = "A monthly calendar.";
