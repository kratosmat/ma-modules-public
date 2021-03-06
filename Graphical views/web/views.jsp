<%--
    Copyright (C) 2014 Infinite Automation Systems Inc. All rights reserved.
    @author Matthew Lohbihler
--%>
<%@ include file="/WEB-INF/jsp/include/tech.jsp" %>
<%@ taglib prefix="views" tagdir="/WEB-INF/tags/graphicalViews" %>

<tag:page dwr="GraphicalViewDwr" js="/resources/view.js,${modulePath}/web/graphicalViews.js,${modulePath}/web/wz_jsgraphics.js">
<jsp:attribute name="styles">
  <link rel="stylesheet" href="/resources/angular-csp.css"></link>
  <script src="/resources/loaderConfig.js" data-loader="Dojo"></script>
</jsp:attribute>
<jsp:body>
  <script type="text/javascript">
    <c:if test="${!empty currentView}">
      mango.view.initNormalView();
    </c:if>
  </script>
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
      <td id="ma-dashboard-app" ng-cloak>
        <views:displayView view="${currentView}" emptyMessageKey="views.noViews"/>
      </td>
    </tr>
  </table>
  <script>require(['mango-3.0/bootstrap']);</script>
</jsp:body>
</tag:page>