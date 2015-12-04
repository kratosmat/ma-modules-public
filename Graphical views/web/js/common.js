/*
 * Modified version of Core common.js to use JQuery
 *   Copyright (C) 2015 Infinite Automation Systems Inc. All rights reserved.
 *   @author Terry Packer
*/

mango = {};
//
//Long poll
//
mango.longPoll = {};
mango.longPoll.pollRequest = {};
mango.longPoll.pollSessionId = Math.round(Math.random() * 1000000000);

mango.longPoll.start = function() {
 MiscDwr.initializeLongPoll(mango.longPoll.pollSessionId, mango.longPoll.pollRequest, mango.longPoll.pollCB);
 $(window).unload(function() { MiscDwr.terminateLongPoll(mango.longPoll.pollSessionId); });
};

mango.longPoll.poll = function() {
 mango.longPoll.lastPoll = new Date().getTime();
 MiscDwr.doLongPoll(mango.longPoll.pollSessionId, mango.longPoll.pollCB);
}

mango.longPoll.handlers = [];
mango.longPoll.addHandler = function(/* string */id, /* function */handler) {
	if (!mango.longPoll.pollRequest.handlers)
		mango.longPoll.pollRequest.handlers = [];
	mango.longPoll.pollRequest.handlers.push(id);
	mango.longPoll.handlers.push(handler);
}

mango.longPoll.pollCB = function(response) {
 if (response.terminated)
     return;
 
 for (var i=0; i<mango.longPoll.handlers.length; i++)
 	mango.longPoll.handlers[i](response);
 
 if (mango.longPoll.lastPoll) {
     var duration = new Date().getTime() - mango.longPoll.lastPoll;
     if (duration < 300) {
         // The response happened too quick. This may indicate a problem, 
         // so just wait a bit before polling again. 
         setTimeout(mango.longPoll.poll, 1000);
         return;
     }
 }
 // Poll again immediately.
 mango.longPoll.poll();
}

//
//String prototypes
//
String.prototype.startsWith = function(str) {
 if (str.length > this.length)
     return false;
 for (var i=0; i<str.length; i++) {
     if (str.charAt(i) != this.charAt(i))
         return false;
 }
 return true;
}

String.prototype.trim = function() {
 return this.replace(/^\s+|\s+$/g,"");
}

//
//Custom exception to string
//
function errorToString(e) {
 try {
     return e.name +": "+ e.message +" ("+ e.fileName +":"+ e.lineNumber +")";
 }
 catch (e2) {
     return e.name +": "+ e.message +" ("+ e.fileName +")";
 }
}

//onmouseover and onmouseout betterment.
function isMouseLeaveOrEnter(e, handler) {
	  if (e.type != 'mouseout' && e.type != 'mouseover')
		  return false;
	  var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
	  while (reltg && reltg != handler)
		  reltg = reltg.parentNode;
	  return (reltg != handler);
}      

//
//Common functions (delegates to Dojo functions)
//
function show(node, styleType) {
 if (!styleType)
     styleType = '';
 try{
     getNodeIfString(node).style.display = styleType;
 }catch (err){
 	if(console != 'undefined'){
 		console.error('show failed for node: ' + node + ", " + err.message );
 	}
 }
}

function hide(node) {
 try {
     getNodeIfString(node).style.display = 'none';
 }
 catch (err) {
 	//Edit by TP Jan 29 2014 - Removed due to crashing of modules when they reference something that
 	// was changed.  Another option would be to check for console and if it DNE create a dummy one
 	// via this: console = { log: function() { }, error: function() };
 	if(console != 'undefined')
 		console.error("hide failed for node: " + node + ", " + err.message);
 	//throw "hide failed for node "+ node +", "+ err.message;
 }
}

function display(node, showNode, styleType) {
 if (showNode)
     show(node, styleType);
 else
     hide(node);
}

function isShowing(node) {
 return getNodeIfString(node).style.display != "none";
}

function showMenu(node, left, top, right, bottom) {
 node = getNodeIfString(node);
 var bounds = $(node.parentNode).position();
 //var bounds = dojo.position(node.parentNode);
 var anc = findRelativeAncestor(node);
 if (anc) {
	 var rbounds = $(anc).position();
     //var rbounds = dojo.position(anc);
     // marginBox
     bounds.x -= rbounds.x;
     bounds.y -= rbounds.y;
 }
 if (typeof(left) == "number")
     node.style.left = (bounds.x + left) +"px";
 else
     node.style.left = null;
 if (typeof(top) == "number")
     node.style.top = (bounds.y + top) +"px";
 else
     node.style.top = null;
 if (typeof(right) == "number")
     node.style.right = right +"px";
 else
     node.style.right = null;
 if (typeof(bottom) == "number")
     node.style.bottom = bottom +"px";
 else
     node.style.bottom = null;
 showLayer(node);
}

function showLayer(node) {
 getNodeIfString(node).style.visibility = "visible";
}

function hideLayer(node) {
 getNodeIfString(node).style.visibility = "hidden";
}

function hideLayersIgnoreMissing() {
 for (var i=0; i<arguments.length; i++) {
     var node = getNodeIfString(arguments[i]);
     if (node)
         node.style.visibility = "hidden";
 }
}

function setZIndex(node, amt) {
 node = getNodeIfString(node);
 node.style.zIndex = amt;
}

function findRelativeAncestor(node) {
 var pos;
 while (node = node.parentNode) {
     if (!node.style)
         continue;
     pos = node.style.position;
     if (pos == "relative" || pos == "absolute")
         return node;
 }
 return null;
}

function ImageFader(/*element*/imgNode, /*milliseconds*/cycleRate, /*0<float<1*/cycleStep) {
    this.im = imgNode;
    this.rate = cycleRate;
    if (!this.rate)
        this.rate = 30;
    this.step = cycleStep;
    if (!this.step)
        this.step = 0.1;
    
    this.increasing = false;
    this.timeoutId;
    this.started = false;
    this.op = parseFloat(dojo.style(this.im, "opacity"));
    
    this.start = function() {
        this.started = true;
        this.timeoutId = null;
        
        if (this.op >= 1)
            this.increasing = false;
        else if (this.op <= 0)
            this.increasing = true;
    
        if (this.increasing)
        	this.op += this.step;
        else
        	this.op -= this.step;
       	dojo.style(this.im, "opacity", this.op);
    
        this.timeoutId = setTimeout(dojo.hitch(this, "start"), this.rate);
    };
    
    this.stop = function() {
        if (this.started) {
            this.started = false;
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        dojo.style(this.im, "opacity", 1);
    };
}

function startImageFader(node, disableOnclick) {
    node = getNodeIfString(node);
    if (disableOnclick)
        this.disableOnclick(node);
    
    var fader = new ImageFader(node);
    if (node.fader)
        stopImageFader(node);
    node.fader = fader;
    fader.start();
}

function hasImageFader(node) {
    node = getNodeIfString(node);
    if (node.fader)
        return true;
    return false;
}

function stopImageFader(node) {
    node = getNodeIfString(node);
    enableOnclick(node);
    var fader = node.fader;
    if (fader) {
        fader.stop();
        node.fader = null;
    }
}

function disableOnclick(node) {
    node.disabledOnclick = node.onclick;
    node.onclick = null;
}

function enableOnclick(node) {
    if (node.disabledOnclick) {
        node.onclick = node.disabledOnclick;
        node.disabledOnclick = null;;
    }
}

function disableButton(node) {
    node = getNodeIfString(node);
    disableOnclick(node);
    setDisabled(node, true);
}

function enableButton(node) {
    node = getNodeIfString(node);
    enableOnclick(node);
    setDisabled(node, false);
}

function updateTemplateNode(elem, replaceText) {
    var i;
    for (i=0; i<elem.attributes.length; i++) {
        if (elem.attributes[i].value && elem.attributes[i].value.indexOf('_TEMPLATE_') != -1)
            elem.attributes[i].value = elem.attributes[i].value.replace(/_TEMPLATE_/, replaceText);
    }
    for (var i=0; i<elem.childNodes.length; i++) {
        if (elem.childNodes[i].attributes)
            updateTemplateNode(elem.childNodes[i], replaceText);
    }
}

function getElementsByMangoName(node, mangoName, result) {
    if (!result)
        result = new Array();
    if (node.mangoName == mangoName)
        result[result.length] = node;
    for (var i=0; i<node.childNodes.length; i++)
        getElementsByMangoName(node.childNodes[i], mangoName, result);
    return result;
}

function createFromTemplate(templateId, id, parentId) {
    var content = $('#' + templateId)[0].cloneNode(true);
    updateTemplateNode(content, id);
    content.mangoId = id;
    $('#' + parentId)[0].appendChild(content);
    show(content);
    return content;
}

function getMangoId(node) {
    while (!(node.mangoId))
        node = node.parentNode;
    return node.mangoId;
}
function updateImg(imgNode, src, text, visible, styleType) {
    if (visible) {
        imgNode = getNodeIfString(imgNode);
        show(imgNode, styleType);
        if (src)
            imgNode.src = src;
        if (text) {
            imgNode.title = text;
            imgNode.alt = text;
        }
    }
    else
        hide(imgNode);
}

// For panels that default as displayed
function togglePanelVisibility(img, panelId, visTitle, invisTitle) {
    var visible = true;
    if (!img.minimized)
        visible = false;
    togglePanelVisibilityImpl(img, panelId, visTitle, invisTitle, visible);
}

// For panels that default as hidden
function togglePanelVisibility2(img, panelId, visTitle, invisTitle) {
    var visible = true;
    if (img.minimized == false)
        visible = false;
    togglePanelVisibilityImpl(img, panelId, visTitle, invisTitle, visible);
}

function togglePanelVisibilityImpl(img, panelId, visTitle, invisTitle, visible) {
    if (!visible) {
        img.src = "/images/arrow_out.png";
        img.alt = invisTitle || mango.i18n["common.maximize"];
        img.title = invisTitle || mango.i18n["common.maximize"];
        hide(panelId);
        img.minimized = true;
    }
    else {
        img.src = "/images/arrow_in.png";
        img.alt = visTitle || mango.i18n["common.minimize"];
        img.title = visTitle || mango.i18n["common.minimize"];
        show(panelId);
        img.minimized = false;
    }
}

function $get(comp) {
    return dwr.util.getValue(comp);
}

function $set(comp, value) {
    return dwr.util.setValue(comp, value);
}

function getSelectionRange(node) {
    node.focus();
    if (typeof node.selectionStart != "undefined")
        // FF
        return { start: node.selectionStart, end: node.selectionEnd };
    if (!document.selection)
        return { start: 0, end: 0 };
    
    // IE
    var range = document.selection.createRange();
    var rangeCopy = range.duplicate();
    rangeCopy.moveToElementText(tt);
    rangeCopy.setEndPoint('EndToEnd', range);
    var start = rangeCopy.text.length - range.text.length;
    return { start: start, end: start + range.text.length };
}

function setSelectionRange(node, start, end) {
    if (node.setSelectionRange) {
        node.setSelectionRange(start, end);
        node.focus();
    }
    else {
        var range = node.createTextRange();
        range.move('character', start);
        range.moveEnd('character', end - start);
        range.select();
    }
}

function insertIntoTextArea(node, text) {
    if (document.selection) {
        // IE
        node.focus();
        document.selection.createRange().text = text;
    }
    else {
        var oldScrollTop = node.scrollTop;
        var range = getSelectionRange(node);
        var value = node.value;
        value = value.substring(0, range.start) + text + value.substring(range.end);
        node.value = value;
        node.setSelectionRange(range.start + text.length, range.start + text.length);
        node.scrollTop = oldScrollTop;
    }
}

// Convenience method. Returns the first element in the given array that has an id property the same as the given id.
function getElement(arr, id, idName) {
    if (!idName)
        idName = "id";

    for (var i=0; i<arr.length; i++) {
        if (arr[i][idName] == id)
            return arr[i];
    }
    return null;
}

function updateElement(arr, id, key, value, dobreak) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i].id == id) {
            arr[i][key] = value;
            if (dobreak)
                return;
        }
    }
}

function removeElement(arr, id) {
    for (var i=arr.length-1; i>=0; i--) {
        if (arr[i].id == id)
            arr.splice(i, 1);
    }
}

function showMessage(node, msg) {
    node = getNodeIfString(node);
    if (msg) {
        show(node);
        node.innerHTML = msg;
    }
    else
        hide(node);
}
  
function getNodeIfString(node) {
    if (typeof(node) == "string")
        return $('#' + node)[0];
    return node;
}

function escapeQuotes(str) {
    if (!str)
        return "";
    return str.replace(/\'/g,"\\'");
}

function escapeDQuotes(str) {
    if (!str)
        return "";
    return str.replace(/\"/g,"\\\"");
}

function encodeQuotes(str) {
    if (!str)
        return "";
    return str.replace(/\'/g,"%27").replace(/\"/g,"%22");
}

function encodeHtml(str) {
    if (!str)
        return "";
    str = str.replace(/&/g,"&amp;");
    return str.replace(/</g,"&lt;");
}

function appendNewElement(/*string*/type, /*node*/parent) {
    var node = document.createElement(type);
    parent.appendChild(node);
    return node;
}

function writeImage(id, src, png, title, onclick) {
    var result = '<img class="ptr"';
    if (id)
        result += ' id="'+ id +'"';
    if (src)
        result += ' src="'+ src +'"';
    if (png && !src)
        result += ' src="/images/'+ png +'.png"';
    if (title)
        result += ' alt="'+ title +'" title="'+ title +'"';
    result += ' onclick="'+ onclick +'"/>';
    return result;
}

function writeImageSQuote(id, src, png, title, onclick) {
    var result = "<img class='ptr'";
    if (id)
        result += " id='"+ id +"'";
    if (src)
        result += " src='"+ src +"'";
    if (png && !src)
        result += " src='/images/"+ png +".png'";
    if (title)
        result += " alt='"+ title +"' title='"+ title +"'";
    result += " onclick='"+ onclick +"'/>";
    return result;
}

function hideContextualMessages(parent) {
    if (parent)
        parent = getNodeIfString(parent);
    else
        parent = document;
    var nodes = dojo.query(".ctxmsg", parent);
    for (var i=0; i<nodes.length; i++)
        hide(nodes[i]);
}

function hideGenericMessages(genericMessageNode) {
    dwr.util.removeAllRows(genericMessageNode);
}

function createContextualMessageNode(field, fieldId) {
    field = getNodeIfString(field);
    var node = document.createElement("div");
    node.id = fieldId +"Ctxmsg";
    node.className = "ctxmsg formError";
    hide(node);
    
    var next = field.nextSibling;
    if (next)
        next.parentNode.insertBefore(node, next);
    else
        field.parentNode.appendChild(node);
    return node;
}

function showDwrMessages(/*ProcessResult.messages*/messages, /*tbody*/genericMessageNode) {
    var i, m, field, node, next;
    var genericMessages = new Array();
    for (i=0; i<messages.length; i++) {
        m = messages[i];
        if (m.contextKey) {
            node = $('#' + m.contextKey +"Ctxmsg")[0];
            if (!node) {
                field = $('#' + m.contextKey)[0];
                if (field)
                    node = createContextualMessageNode(field, m.contextKey);
                else
                    alert("No contextual field found for key "+ m.contextKey);
            }
            
            if (node) {
                node.innerHTML = m.contextualMessage;
                show(node);
            }
        }
        else
            genericMessages[genericMessages.length] = m;
    }
    
    if (genericMessages.length > 0) {
        if (!genericMessageNode) {
            for (i=0; i<genericMessages.length; i++)
                alert(genericMessages[i].genericMessage);
        }
        else {
            genericMessageNode = getNodeIfString(genericMessageNode);
            if (genericMessageNode.tagName == "TBODY") {
                dwr.util.removeAllRows(genericMessageNode);
                dwr.util.addRows(genericMessageNode, genericMessages,
                    [ function(data) { return data.genericMessage; } ],
                    {
                        cellCreator:function(options) {
                            var td = document.createElement("td");
                            if (options.rowData.level == 'error')
                                td.className = "formError";
                            else if (options.rowData.level == 'warning')
                                td.className = "formWarning";
                            else if (options.rowData.level == 'info')
                                td.className = "formInfo";
                            return td;
                        }
                    });
                show(genericMessageNode);
            }
            else if (genericMessageNode.tagName == "DIV" || genericMessageNode.tagName == "SPAN") {
                var content = "";
                for (var i=0; i<genericMessages.length; i++)
                    content += genericMessages[i].genericMessage + "<br/>";
                genericMessageNode.innerHTML = content;
            }
        }
    }
}

//
///
/// Sharing (views and watch lists)
///
//
mango.share = {};
mango.share.dwr = null;
mango.share.users = [];
mango.share.addUserToShared = function() {
  var userId = $get("allShareUsersList");
  if (userId)
      mango.share.dwr.addUpdateSharedUser(userId, 1/* ShareUser.ACCESS_READ */, mango.share.writeSharedUsers);
}

mango.share.updateUserAccess = function(sel, userId) {
  mango.share.dwr.addUpdateSharedUser(userId, $get(sel), mango.share.writeSharedUsers);
}

mango.share.removeFromSharedUsers = function(userId) {
  mango.share.dwr.removeSharedUser(userId, mango.share.writeSharedUsers);
}

mango.share.writeSharedUsers = function(sharedUsers) {
  dwr.util.removeAllRows("sharedUsersTable");
  if (sharedUsers.length == 0) {
      show("sharedUsersTableEmpty");
      hide("sharedUsersTableHeaders");
  }
  else {
      hide("sharedUsersTableEmpty");
      show("sharedUsersTableHeaders");
      dwr.util.addRows("sharedUsersTable", sharedUsers,
          [
              function(data) { return getElement(mango.share.users, data.userId).username; },
              function(data) {
                  var s = '<select onchange="mango.share.updateUserAccess(this, '+ data.userId +')">';
                  s += '<option value="1"'; // ShareUser.ACCESS_READ
                  if (data.accessType == 1) // ShareUser.ACCESS_READ
                      s += ' selected="selected"';
                  s += '>'+ mango.i18n["common.access.read"] +'</option>';
                  
                  s += '<option value="2"'; // ShareUser.ACCESS_SET
                  if (data.accessType == 2) // ShareUser.ACCESS_SET
                      s += ' selected="selected"';
                  s += '>'+ mango.i18n["common.access.set"] +'</option>';
                  
                  s += '</select>';
                  return s;
              },
              function(data) {
                  return "<img src='/images/bullet_delete.png' class='ptr' "+
                          "onclick='mango.share.removeFromSharedUsers("+ data.userId +")'/>";
              }
          ],
          {
              rowCreator:function(options) {
                  var tr = document.createElement("tr");
                  tr.className = "smRow"+ (options.rowIndex % 2 == 0 ? "" : "Alt");
                  return tr;
              }
          }
      );
  }
  mango.share.updateUserList(sharedUsers);
};

mango.share.updateUserList = function(sharedUsers) {
  dwr.util.removeAllOptions("allShareUsersList");
  var availUsers = [];
  for (var i=0; i<mango.share.users.length; i++) {
      var found = false;
      for (var j=0; j<sharedUsers.length; j++) {
          if (sharedUsers[j].userId == mango.share.users[i].id) {
              found = true;
              break;
          }
      }
      
      if (!found)
          availUsers.push(mango.share.users[i]);
  }
  dwr.util.addOptions("allShareUsersList", availUsers, "id", "username");
};

mango.toggleLabelledSection = function(labelNode) {
	var divNode = labelNode.parentNode;
	if (dojo.hasClass(divNode, "closed"))
      dojo.removeClass(divNode, "closed");
	else
      dojo.addClass(divNode, "closed");
};

mango.closeLabelledSection = function(node) {
  dojo.addClass(node, "closed");
};

mango.pad = function(number, length) {
  var str = '' + number;
  while (str.length < length)
      str = '0' + str;
  return str;
};


//
//User permissions
//
function PermissionUI(dwr) {
	this.dwr = dwr;
	this.myTooltipDialog = null;
	
	this.viewPermissions = function(textNodeId) {
		var self = this;
		this.dwr.getUserPermissionInfo($get(textNodeId), function(result) {
			if (self.myTooltipDialog)
				self.myTooltipDialog.destroy();
          
			// Generate the content
			var content = '<table class="userPerms">';
			for (var i=0; i<result.length; i++) {
				content += '<tr><td>';
				if (result[i].admin)
					content += '<img src="/images/user_suit.png"/> ';
				else if (result[i].access)
					content += '<img src="/images/tick.png"/> ';
				else
					content += '<img src="/images/cross.png"/> ';
				
				content += '</td><td class="permUser">'+ result[i].username +'</td><td>';
				
				for (var j=0; j<result[i].allGroups.length; j++) {
					var p = result[i].allGroups[j];
					var matched = false;
					for (var k=0; k<result[i].matchingGroups.length; k++) {
						if (p == result[i].matchingGroups[k]) {
							matched = true;
							break;
						}
					}
					
					if (j > 0)
						content += ",";
					
					if (matched)
						content += "<b>"+ p +"</b>";
					else
						content += "<a id='perm-"+ textNodeId +"-"+ escapeQuotes(p) +"' class='ptr groupStr'>"+ p +"</a>";
				}
				
				content += "</td></tr>";
			}
			content += "</table>";
			
			// Open the dialog
			require(["dijit/TooltipDialog", "dijit/popup", "dojo/dom" ], function(TooltipDialog, popup, dom) {
				self.myTooltipDialog = new TooltipDialog({
					id: 'myTooltipDialog',
					content: content,
					onMouseLeave: function() { popup.close(self.myTooltipDialog); }
				});
				
				popup.open({
					popup: self.myTooltipDialog,
					around: $('#' + textNodeId)[0]
				});
			});
    
			// Wire up the group strings
			require(["dojo/query"], function(query) {
				query(".groupStr").forEach(function(e) {
					// Curious combination of AMD and non.
					dojo.connect(e, "onclick", function() {
						var g = this.id.substring(5 + textNodeId.length + 1);
						self.addGroup(textNodeId, g);
					});
				})
			});
		});
	}
	
  this.addGroup = function(textNodeId, group) {
      var groups = $get(textNodeId);
      if (groups.length > 0 && groups.substring(groups.length-1) != ",")
          groups += ",";
      groups += group;
      $set(textNodeId, groups);
      this.viewPermissions(textNodeId);
  }
}