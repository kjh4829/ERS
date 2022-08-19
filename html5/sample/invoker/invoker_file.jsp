<%@ page contentType="text/html; charset=utf-8" %>
<%@ page language="java" import="java.io.*, java.util.*, java.net.*" %>
<%@ page language="java" import="m2soft.ers.invoker.InvokerException" %>
<%@ page language="java" import="m2soft.ers.invoker.http.ReportingServerInvoker" %>

<%    
	  ReportingServerInvoker invoker = new //��ü����
	  ReportingServerInvoker("http://localhost:8081/ReportingServer/service");

	  invoker.setCharacterEncoding("utf-8");   //ĳ���ͼ�
      invoker.setReconnectionCount(4);        //������ �õ� ȸ��
      invoker.setConnectTimeout(1800);           //Ŀ�ؼ� Ÿ�Ӿƿ�
      invoker.setReadTimeout(60);             //�ۼ��� Ÿ�Ӿƿ�

	  invoker.addParameter("opcode", "500");   //�����ڵ�500
      
	  invoker.addParameter("mrd_path", //mrd���
	  "sample.mrd");  // sample.mrd ����
     
	  invoker.addParameter("mrd_param", //db���
	  "/rfn [sample.txt]");  //�Ķ���� /rfn [sample.txt]
 
      invoker.addParameter("export_name", "sample.pdf"); //���ϸ��� ���������� ����
	  invoker.addParameter("export_type", "pdf");   //��ȯ�� Ÿ�� mrr, pdf, doc, xls, ppt, hwp, png, jpg, html
      invoker.addParameter("protocol", "sync");    //���۹�� sync, async, file

	 try {
	    	
			String responseString = invoker.invoke();
			out.println(responseString);
	    }
	    catch(InvokerException e) {
	         e.printStackTrace();
	    }

%>