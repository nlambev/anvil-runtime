"use strict";

var PyDefUtils = require("PyDefUtils");

/**
id: textarea
docs_url: /docs/client/components/basic#textarea
title: TextArea
tooltip: Learn more about TextArea
description: |
  ```python
  c = TextArea(text="Some editable text\nacross multiple lines")
  ```

  Text areas are text boxes that can contain multiple lines of text

  ![Screenshot](img/screenshots/textarea.png)

  Set a TextArea to have focus by calling its `focus()` method. Select all its text with the `select()` method.

  The `text` property of a TextArea can trigger write-back of data bindings. This occurs before the `lost_focus` event.
*/

module.exports = function(pyModule) {

	pyModule["TextArea"] = Sk.misceval.buildClass(pyModule, function($gbl, $loc) {

        var setHeightToContent = function(self, elt) {
            if (!self._anvil.getPropJS("visible")) { return; }
            var h = self._anvil.taHeight;
            if (typeof(h) == "number") {
                var propHeight = h;
            } else if (typeof(h) == "string" && h.length > 0) {
                var propHeight = parseFloat(h);
            } else {
                var propHeight = 0;
            }
            let tmpelt = $('<textarea class="form-control to-disable anvil-component"></textarea>')
                            .val(elt.val())
                            .css({position: "absolute", width: elt.width(), height: 0, top: "100%", visibility: "hidden"});
            tmpelt[0].style.height = 0;
            $("body").append(tmpelt);
            elt.css("height", Math.max(propHeight, tmpelt[0].scrollHeight + (self._anvil.taHeightDiff || 0)));
            tmpelt.remove();
        };

        var properties = PyDefUtils.assembleGroupProperties(/*!componentProps(TextArea)!2*/["layout", "height", "text", "interaction", "appearance", "tooltip", "user data"], {
          text: {
            get: function get(s,e) { return s._anvil.lastChangeVal; },
            set: function set(s,e,v) { 
                s._anvil.lastChangeVal = v;

                /* OK, this whole business is to work around a bug in IE11:
                "If the value of a textarea is set *before* our sidebar is
                populated, the media-query doesn't work. Wow."" So we do
                the update asynchronously. But we don't want to incur a
                repaint in every other browser, so we only do it in IE.
                AAAAHHHH.
                */

                let doUpdate = ()=> { 
                    e.val(v); 
                    if (s._anvil.taAutoExpand) { 
                        setHeightToContent(s, e);
                    }
                };

                if (/.*(MSIE|Trident).*/.test(window.navigator.userAgent)) {
                    return PyDefUtils.suspensionPromise(resolve => {
                        setTimeout(() => { doUpdate(); resolve(); });
                    })
                } else {
                    doUpdate();
                }
            },
            allowBindingWriteback: true,
            multiline: true,
            suggested: true,
          },
          height: {
            set: function set(s,e,v) {
                s._anvil.taHeight = v;
                if (s._anvil.taAutoExpand) {
                    setHeightToContent(s, e);
                } else {
                    e.css("height", v);
                }
            },
          },
        });

        /*!componentProp(TextArea)!1*/
        properties.push({
            name: "placeholder",
            type: "string",
            description: "The text to be displayed when the component is empty.",
            defaultValue: "",
            exampleValue: "Enter text here",
            set: function(self,e,v) {
              e.attr("placeholder", v);
            },
        });

        /*!componentProp(TextArea)!1*/
        properties.push({
            name: "auto_expand",
            type: "boolean",
            description: "If true, the text area will expand vertically to fit its contents",
            defaultValue: false,
            set: function(self,e,v) {
                self._anvil.taAutoExpand = v && !self._inDesigner;
                if (self._anvil.taAutoExpand) {
                    setHeightToContent(self, e);
                } else {
                    e.css("height", self._anvil.taHeight);
                }
            },
        });

        var events = PyDefUtils.assembleGroupEvents("text area", /*!componentEvents(TextArea)!1*/ ["universal", "focus"]);

        /*!componentEvent(TextArea)!1*/
        events.push({name: "change", description: "When the text in this text area is edited",
                     parameters: [], important: true, defaultEvent: true });

	      $loc["__init__"] = PyDefUtils.mkInit(function init(self) {
            self._anvil.element = $('<textarea class="form-control to-disable"></textarea>')
                .on("propertychange change keyup paste input", function(e) {
                    var elt = self._anvil.element;
                    var lc = elt.val();
                    if (lc != self._anvil.lastChangeVal) {
                        self._anvil.lastChangeVal = elt.val();
                        PyDefUtils.raiseEventAsync({}, self, "change");
                    }

                    if (self._anvil.taAutoExpand) {
                        setHeightToContent(self, elt);
                    }
                }).on("focus", function(e) {
                    PyDefUtils.raiseEventAsync({}, self, "focus");
                }).on("blur", function(e) {
                    setTimeout(
                        () => self._anvil.dataBindingWriteback(self, "text").finally(
                            () => PyDefUtils.raiseEventAsync({}, self, "lost_focus")));
                });
            self._anvil.dataBindingProp = "text";

            self._anvil.pageEvents = {
                add: function() {
                    var elt = self._anvil.element;
                    if(self._anvil.taAutoExpand) {
                        self._anvil.taHeightDiff = elt.outerHeight() - elt.height();
                        setHeightToContent(self, elt);
                    }
                }
            };
        }, pyModule, $loc, properties, events, pyModule["Component"]);

        /*!defMethod(_)!2*/ "Set the keyboard focus to this TextArea"
        $loc["focus"] = new Sk.builtin.func(function(self) {
            self._anvil.element.trigger("focus");
        });

        /*!defMethod(_)!2*/ "Select all the text in this TextArea"
        $loc["select"] = new Sk.builtin.func(function(self, pySelectionStart, pySelectionEnd, pyDirection) {
            if (pySelectionStart && pySelectionEnd) {
                let selectionStart = Sk.ffi.remapToJs(pySelectionStart);
                let selectionEnd = Sk.ffi.remapToJs(pySelectionEnd);
                let direction = pyDirection ? Sk.ffi.remapToJs(pyDirection) : undefined;
                self._anvil.element[0].setSelectionRange(selectionStart, selectionEnd, direction);
            } else {
                self._anvil.element.trigger("select");
            }
        });

    }, /*!defClass(anvil,TextArea,Component)!*/ 'TextArea', [pyModule["Component"]]);
};

/*
 * TO TEST:
 *
 *  - Prop groups: layout, height, interaction, text, appearance
 *  - New props: placeholder
 *  - Override set: text
 *  - Event groups: universal
 *  - New events: change
 *
 */
