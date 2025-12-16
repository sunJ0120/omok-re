<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "Hello World!" %>
</h1>
<br/>
<a href="hello-servlet">Hello dddd Servlet</a>
</body>
<script>
    setTimeout(() => {
        window.location.href = "/login";
    }, 1000); // 1초 딜레이
</script>
</html>