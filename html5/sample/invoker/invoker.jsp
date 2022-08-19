<%@ page contentType="text/html; charset=euc-kr" %> 

<%@ page language="java" import="java.io.*, java.util.*, java.net.*" %>
<%@ page language="java" import="m2soft.ers.invoker.InvokerException" %>
<%@ page language="java" import="m2soft.ers.invoker.http.ReportingServerInvoker" %>
<%   
	  ReportingServerInvoker invoker = new ReportingServerInvoker("http://localhost:8081/ReportingServer/service");//ReportingServer service 호출
	  invoker.setCharacterEncoding("utf-8");   
	  invoker.setReconnectionCount(5);          
	  invoker.setConnectTimeout(180);               
	  invoker.setReadTimeout(180);                 
	  invoker.addParameter("opcode", "500"); //500
	  invoker.addParameter("mrd_path", "sample7.mrd"); //mrd 경로
	  invoker.addParameter("mrd_param", "/rfn [sample.txt] /rsetpdfsecurity [2222,11 ,0,0,0]"); //파라미터      
	  invoker.addParameter("export_type", "txt"); //pdf
	  invoker.addParameter("protocol", "sync");     

	  try
	  {
		 String responseString = invoker.invoke();   
		 System.out.println(responseString);

		 if(responseString.startsWith("1")){

			 out.println(responseString);
		 }
		 else {
			 out.println("fail");
		 } 

	  }
	  catch(InvokerException e)
	  {
		 e.printStackTrace();
	  
	  }
%>
