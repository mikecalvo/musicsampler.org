<%@ page import="java.util.*"%><html>

<body bgcolor=#FFFFFF>
<%
Enumeration e;
e = request.getHeaderNames();
String userAgent = request.getHeader("user-agent").toLowerCase();

if (userAgent.contains("mobile")) response.sendRedirect("m.html");
else response.sendRedirect("main.html");
%>
