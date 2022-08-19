<%@ page contentType="text/html; charset=utf-8" %>
<%@ page language="java" import="java.io.*, java.util.*, java.net.*" %>
<%@ page language="java" import="m2soft.ers.invoker.InvokerException" %>
<%@ page language="java" import="m2soft.ers.invoker.http.ReportingServerInvoker" %>

<%    
	  ReportingServerInvoker invoker = new //객체생성
	  ReportingServerInvoker("http://localhost:8081/ReportingServer/service");

	  invoker.setCharacterEncoding("utf-8");   //캐릭터셋
      invoker.setReconnectionCount(4);        //재접속 시도 회수
      invoker.setConnectTimeout(1800);           //커넥션 타임아웃
      invoker.setReadTimeout(60);             //송수신 타임아웃

	  invoker.addParameter("opcode", "500");   //오피코드500
      
	  invoker.addParameter("mrd_path", //mrd경로
	  "sample.mrd");  // sample.mrd 동일
     
	  invoker.addParameter("mrd_param", //db경로
	  "/rfn [sample.txt]");  //파라미터 /rfn [sample.txt]
 
      invoker.addParameter("export_name", "sample.pdf"); //파일명을 다음과같이 저장
	  invoker.addParameter("export_type", "pdf");   //변환할 타입 mrr, pdf, doc, xls, ppt, hwp, png, jpg, html
      invoker.addParameter("protocol", "sync");    //전송방식 sync, async, file

	 try {
	    	
			String responseString = invoker.invoke();
			out.println(responseString);
	    }
	    catch(InvokerException e) {
	         e.printStackTrace();
	    }

%>