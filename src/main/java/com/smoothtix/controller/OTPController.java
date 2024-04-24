package com.smoothtix.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.smoothtix.dao.conductorTable;
import com.smoothtix.dao.ownerTable;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.OTP;
import com.smoothtix.model.Payment;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Properties;

public class OTPController extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        BufferedReader reader = request.getReader();
        OTP otp = gson.fromJson(reader, OTP.class);
        System.out.println("email : " + otp.getEmail());
        System.out.println("otp : " + otp.getOTP());

//        int sendSuccess = sendEmail(otp.getEmail(), otp.getOTP());
        int sendSuccess = 1;
        if(sendSuccess > 0){
          response.setStatus(HttpServletResponse.SC_OK);
        }
        else{
          response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

}

//    protected static int sendEmail(String email, int otp){
//        final String fromEmail = "smoothtix@gmail.com";
//        final String password = "obzy cvzg dznf llkg";
//
//        String subject = "OTP Verification for SmoothTix";
//        String message = "Hi SmoothTix User" + ",<br/><br/>" +
//                "Your verification code is " + otp + "<br/>" +
//                "Use this 4-digit code to proceed with your verification.<br/><br/>";
//        String footer =
//                "SmoothTix<br/>" +
//                "smoothtix@gmail.com";
//
//        String htmlContent = "<html><body>";
//        htmlContent += "<p>" + message + "</p>";
//        htmlContent += "<p>" + footer + "</p>";
//        htmlContent += "</body></html>";
//
//
//        Properties props = new Properties();
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.starttls.enable", "true");
//        props.put("mail.smtp.host", "smtp.gmail.com");
//        props.put("mail.smtp.port", "587");
//        props.put("mail.debug", "true");
//        props.put("mail.debug.auth", "true");
//        props.put("mail.smtp.socketFactory.port", "465");
//        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
//
//        Session session = Session.getInstance(props, new Authenticator() {
//            protected PasswordAuthentication getPasswordAuthentication() {
//                return new PasswordAuthentication(fromEmail, password);
//            }
//        });
//
//        try {
//            Message mimeMessage = new MimeMessage(session);
//            mimeMessage.setFrom(new InternetAddress(fromEmail));
//            mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
//            mimeMessage.setSubject(subject);
//            mimeMessage.setContent(htmlContent, "text/html");
//            Transport.send(mimeMessage);
//            System.out.println("Remainder Succeed!");
//            return 1;
//
//        } catch (MessagingException e) {
//            System.out.println("Remainder failed!");
//            e.printStackTrace();
//            return 0;
//        }
//    }
}
