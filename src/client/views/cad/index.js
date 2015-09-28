/* G. Hemingway Copyright @2015
 * Context for the visualization of a set of CAD models
 */
"use strict";


var _           = require('lodash'),
    DataLoader  = require('./data_loader'),
    React       = require('react'),
    CADView     = React.createFactory(require('./viewer'));

/*************************************************************************/

class CADjs extends THREE.EventDispatcher {
    constructor(config) {
        super();
        var self = this;
        this._viewContainerId = config.viewContainerId;
        // TODO: Set this to default empty assembly
        this._root3DObject = new THREE.Object3D();
        this.addEventListener("cadViewer::mounted", function() {
            //console.log('I see the CADView got mounted');
            // Once view is in place, bind events
            self.bindEvents();
        });
        this._viewer = CADView({
            app: this,
            viewContainerId: this._viewContainerId
        });
        this._loader = new DataLoader(this._viewer, {
            autorun: false,
            workerPath: "/js/webworker.js"
        });
        React.render(this._viewer, document.getElementById('cadjs-view'));
    }

    load(reqPath, basePath) {
        var self = this;
        // Initialize the assembly
        this._loader.load(reqPath, basePath, "assembly", function(err, part) {
            if (err) {
                console.log('CAD.index Load error: ' + path);
                //// Popup message for user to handle
                //$("#dialog").dialog({
                //    autoOpen: true,
                //    buttons: [ { text: "Ok", click: function() { $(this).dialog("close"); } } ],
                //    modal: true,
                //    title: "CAD.js Load Error - " + err.status
                //});
                //$("#dialog-content").text("Error loading model: " + err.file);
            } else {
                // Add the part to the list
                self._rootAssembly = part;
                // calculate the scene's radius for draw distance calculations
                self._viewer.updateSceneBoundingBox(part.getBoundingBox());
                // center the view
                self._viewer.zoomToFit(part);
                // Update the tree
                self.renderTree();
                // Get the rest of the files
                self._loader.runLoadQueue();
            }
        });
    }

    bindEvents() {
        //var self = this,
        //    canvasDOM = $( this._$viewContainer )[0],
        //
        //// Download manager interface
        //    $downloadsUl = this._$downloadsContainer.find( ">ul"),
        //    $downloadsCounter = this._$downloadsContainer.find( ".cadjs-downloads-count"),
        //
        //    progressRing = new NPROGRESSRING({
        //        parentElement: this._$downloadsContainer.find('#cadjs-downloads-progress-bar')[0],
        //        size: 18,
        //        innerRadius: 0.6,
        //        rotationSpeed: -Math.PI
        //    }),
        //    progressIdMap = {},
        //    progressValues = [];
        //
        //this._loader.addEventListener("addRequest", function(event) {
        //    var id = event.file.split(".")[0];
        //    progressIdMap[id] = progressValues.push(0) - 1;
        //    progressRing.update(progressValues);
        //    $downloadsUl.append("<li id='" + id + "'>" + event.file + "</li>");
        //    var count = self._loader.queueLength(false);
        //    $downloadsCounter.text(count);
        //
        //    // Making sure it is visble
        //    self._$downloadsContainer.removeClass( "out" );
        //
        //});
        //this._loader.addEventListener("loadComplete", function(event) {
        //    var id = event.file.split(".")[0];
        //    progressValues[progressIdMap[id]] = 1;
        //    progressRing.update(progressValues);
        //    // Is this the index file
        //    if (id === "index") {
        //        $("li#index").remove();
        //    } else {
        //        // Change the file status to 'parsing'
        //        $("li#" + id).text(event.file + ": Parsing");
        //    }
        //});
        //this._loader.addEventListener("parseComplete", function(event) {
        //    var id = event.file.split(".")[0];
        //    // Change the file status to 'parsing'
        //    $("li#" + id).text(event.file + ": Finishing");
        //});
        //this._loader.addEventListener("shellLoad", function() {
        //    // Make sure to redraw the model
        //    self._viewer.invalidate();
        //});
        //this._loader.addEventListener("workerFinish", function(event) {
        //    var id = event.file.split(".")[0];
        //    // Remove the item from the list
        //    $("li#" + id).remove();
        //    // Update the count
        //    var count = self._loader.queueLength(false);
        //    $downloadsCounter.text(count);
        //
        //    // Hiding when empty
        //    if ( count === 0 ) {
        //        self._$downloadsContainer.addClass( "out" );
        //    }
        //
        //});
        //this._loader.addEventListener("loadProgress", function(event) {
        //    if (event.loaded) {
        //        var id = event.file.split(".")[0];
        //        progressValues[progressIdMap[id]] = event.loaded / 100;
        //        progressRing.update(progressValues);
        //        $("li#" + id).text(event.file + ": " + event.loaded.toFixed(2) + "%");
        //    }
        //});
        //
        //// Need to turn mouse selection on and off to not interfere with click drag view control
        //var _change;
        //this._viewer.controls.addEventListener("change", function() {
        //    _change = true;
        //});
        //this._viewer.controls.addEventListener("start", function() {
        //    _change = false;
        //});
        //canvasDOM.addEventListener("mouseup", function(event) {
        //    if (!_change) {
        //        self.onClick(event);
        //    }
        //    _change = false;
        //}, false);
        //canvasDOM.addEventListener("mousemove", function(event) {
        //    if (!_change) {
        //        self.onMove(event);
        //    }
        //}, false);
        //
        //// Keybased events
        //window.addEventListener("keypress", function(event) {
        //    var node, obj;
        //    switch(event.keyCode || event.charCode || event.which) {
        //        // Explode on 'x' key pressed
        //        case 120:
        //            self.explode(self.getExplodeDistance());
        //            break;
        //        // Unexplode on 's' key pressed
        //        case 115:
        //            self.explode(-self.getExplodeDistance());
        //            break;
        //        // 'q' unselects all tree elements
        //        case 113:
        //            self._parts[0].hideAllBoundingBoxes();
        //            self.tree.deselect_all();
        //            self._viewer.invalidate();
        //            break;
        //        // 'o' to toggle transparency
        //        case 111:
        //            node = self.tree.get_selected(false);
        //            obj = self._parts[0].getByID(node[0]);
        //            if (obj) {
        //                obj.toggleTransparency();
        //            } else {
        //                self._parts[0].toggleTransparency();
        //            }
        //            self._viewer.invalidate();
        //            break;
        //        // 'z' to zoomToFit
        //        case 122:
        //            node = self.tree.get_selected(false);
        //            obj = self._parts[0].getByID(node[0]);
        //            if (!obj) {
        //                obj = self._parts[0];
        //            }
        //            self._viewer.zoomToFit(obj);
        //            break;
        //        // 'j' hide/show element
        //        case 106:
        //            node = self.tree.get_selected(false);
        //            obj = self._parts[0].getByID(node[0]);
        //            if (obj) {
        //                obj.toggleVisibility();
        //                self._viewer.invalidate();
        //            }
        //            break;
        //    }
        //}, true);
    }
}

/*
CADjs.prototype.load = function(resourceURL) {
    var self = this;
    // Initialize the assembly
    this._loader.load(resourceURL, "assembly", function(err, part) {
        if (err) {
            console.log('Load error: ' + resourceURL);
            //// Popup message for user to handle
            //$("#dialog").dialog({
            //    autoOpen: true,
            //    buttons: [ { text: "Ok", click: function() { $(this).dialog("close"); } } ],
            //    modal: true,
            //    title: "CAD.js Load Error - " + err.status
            //});
            //$("#dialog-content").text("Error loading model: " + err.file);
        } else {
            // Add the part to the list
            self._rootAssembly = part;
            // calculate the scene's radius for draw distance calculations
            self._viewer.updateSceneBoundingBox(part.getBoundingBox());
            // center the view
            self._viewer.zoomToFit(part);
            // Update the tree
            self.renderTree();
            // Get the rest of the files
            self._loader.runLoadQueue();
        }
    });
};

CADjs.prototype.render = function () {
    this._rootAssembly.render();
};

CADjs.prototype.onClick = function(event) {
    if (!this._rootAssembly) {
        return;
    }

    // Clear selections if meta key not pressed
    if (!event.metaKey) {
        this._rootAssembly.hideAllBoundingBoxes();
        this.tree.deselect_all();
    }
    var obj = this._rootAssembly.select(this._viewer.camera, event.clientX, event.clientY);
    // Did we find an object
    if (obj) {
        obj = obj.getNamedParent();
        // Yes, go highlight it in the tree
        var node = this.tree.get_node(obj.getID());
        this.tree.select_node(node);
    }
    this._viewer.invalidate();
};

CADjs.prototype.onMove = function(event) {
    var obj;
    if (this._rootAssembly) {
        this._rootAssembly.clearHighlights();
        obj = this._rootAssembly.select(this._viewer.camera, event.clientX, event.clientY);
        // Did we find an object
        if (obj) {
            obj = obj.getNamedParent();
            // Yes, go highlight it in the tree
            obj.highlight(0xffff60);
        }
    }
    if (obj != this._lastHovered) {
        this._viewer.invalidate();
    }
    this._lastHovered = obj;
};

CADjs.prototype.explode = function(distance) {
    //console.log(this._viewer.controls.object);
    var node = this.tree.get_selected(false);
    if (node) {
        for (var i = 0; i < node.length; i++) {
            var obj = this._rootAssembly.getByID(node[i]);
            if (obj) {
                obj.explode(distance);
            }
        }
        this._viewer.updateSceneBoundingBox(this._parts[0].getBoundingBox());
        this._viewer.invalidate();
    }
};

CADjs.prototype.getExplodeDistance = function () {
    return this._viewer.sceneRadius * 0.05;
};
/*
 CADjs.prototype.setSelectedOpacity = function(opacity) {
 var node = this.tree.get_selected(false);
 if (node) {
 for (var i = 0; i < node.length; i++) {
 var obj = this._parts[0].getByID(node[i]);
 if (obj) {
 obj.setOpacity(opacity);
 }
 }
 this._viewer.invalidate();
 }
 };
 */
/*
CADjs.prototype.renderTree = function() {
    var self = this;
    var geometryOnly = false;
    var treeData = this._rootAssembly.getTree(geometryOnly);
    if (this.tree) {
        this.tree.destroy();
    }
    this.tree = $.jstree.create(this._treeContainerSelector, {
        plugins : [ 'contextmenu' ],
        core: {
            data: [ treeData ],
            animation: 50,
            themes: {
                icons: false
            }
        },
        contextmenu: {
            items: function(menuItem) {
                var obj = self._rootAssembly.getByID(menuItem.id),
                    menu = {
                        focusOn: {
                            label: "Focus On",
                            action: function() {
                                if (obj) {
                                    self._viewer.zoomToFit(obj);
                                }
                            }
                        }
                    };
                if (obj.getObject3D().visible) {
                    menu.hide = {
                        label: "Hide",
                        action: function() {
                            if (obj) {
                                obj.hide();
                                self._viewer.invalidate();
                            }
                        }
                    };
                } else {
                    menu.show = {
                        label: "Show",
                        action: function() {
                            if (obj) {
                                obj.show();
                                self._viewer.invalidate();
                            }
                        }
                    };
                }
                return menu;
            }
        }
    });

    this._$treeContainer.on("select_node.jstree deselect_node.jstree", function(event, data) {
        self._rootAssembly.hideAllBoundingBoxes();
        //self._parts[0].clearHighlights();
        for (var i = 0; i < data.selected.length; i++) {
            var obj = self._rootAssembly.getByID(data.selected[i]);
            if (obj) {
//              console.log(obj.getID());
                obj.showBoundingBox();
                self._viewer.invalidate();
                //obj.highlight(0xff0000);
            }
        }
    });
};
*/
module.exports = CADjs;
