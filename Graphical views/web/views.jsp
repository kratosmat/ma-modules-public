<%--
    Copyright (C) 2015 Infinite Automation Systems Inc. All rights reserved.
    @author Matthew Lohbihler
    @author Terry Packer
--%>
<%@ include file="/WEB-INF/jsp/include/tech.jsp" %>
<%@ taglib prefix="views" tagdir="/WEB-INF/tags/graphicalViews" %>

<tag:html5 showHeader="${param.showHeader}" showToolbar="${param.showToolbar}">

  <jsp:attribute name="scripts">
   <!-- <tag:versionedJavascript  src="/resources/common.js" />  -->
   <tag:versionedJavascript  src="/dwr/engine.js" />
   <tag:versionedJavascript  src="/dwr/util.js" />
   <tag:versionedJavascript  src="/dwr/interface/MiscDwr.js" />
   <tag:versionedJavascript  src="/dwr/interface/GraphicalViewDwr.js" />
   <tag:versionedJavascript  src="${modulePath}/web/js/common.js" />
   <tag:versionedJavascript  src="${modulePath}/web/js/view.js" />
   <tag:versionedJavascript  src="${modulePath}/web/js/graphicalViews.js" />
   <tag:versionedJavascript  src="${modulePath}/web/wz_jsgraphics.js" />
   <script type="text/javascript">
    <c:if test="${!empty currentView}">
    require(['jquery'], function($){
    	$(document).ready(function(){
    	      mango.view.initNormalView();
    	      mango.longPoll.start();    		
    	});
    });
    </c:if>
   </script>
  
  </jsp:attribute>
  <jsp:body>
  <c:if test="${empty param.showControls || param.showControls == true}">
  <table class="borderDiv">
    <tr>
      <td class="smallTitle"><fmt:message key="views.title"/> <tag:help id="graphicalViews"/></td>
      <td width="50"></td>
      <td align="right">
        <sst:select value="${currentView.id}" onchange="window.location='?viewId='+ this.value;">
          <c:forEach items="${views}" var="aView">
            <sst:option value="${aView.key}">${sst:escapeLessThan(aView.value)}</sst:option>
          </c:forEach>
        </sst:select>
        <c:if test="${!empty currentView}">
          <c:choose>
            <c:when test="${canEditCurrentView}">
              <a href="view_edit.shtm?viewId=${currentView.id}"><tag:img png="pencil" title="viewEdit.editView"/></a>
            </c:when>
          </c:choose>
          <a href="view_edit.shtm?viewId=${currentView.id}&copy=true"><tag:img png="copy" title="viewEdit.copyView"/></a>
        </c:if>
        <a href="view_edit.shtm"><tag:img png="add" title="views.newView"/></a>
      </td>
    </tr>
  </table>
  </c:if>
  <%-- This table is here so that the styles are the same from the editor to the view --%>
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <views:displayView view="${currentView}" emptyMessageKey="views.noViews"/>
      </td>
    </tr>
  </table>
  </jsp:body>
</tag:html5>