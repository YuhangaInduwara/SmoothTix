package com.smoothtix.controller;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;

public class MailController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Sender's email address
        final String fromEmail = "yuhanga2001@gmail.com";
        // Sender's password
        final String password = "YiAss@2001";
        // Recipient's email address
        String toEmail = request.getParameter("toEmail");
        System.out.println(toEmail);

        // Email subject and message
        String subject = "Test Subject";
        String message = "This is a test message from your Java servlet.";

        // Set the properties
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.debug", "true");
        props.put("mail.debug.auth", "true");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "jakarta.net.ssl.SSLSocketFactory");
        // Create a Session object

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                System.out.println("Hello1");
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            // Create a MimeMessage object
            Message mimeMessage = new MimeMessage(session);
            mimeMessage.setFrom(new InternetAddress(fromEmail));
            mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            mimeMessage.setSubject(subject);
            mimeMessage.setText(message);
            System.out.println("Hello3");
            // Send the email
            Transport.send(mimeMessage);
            System.out.println("Email sent successfully");
        } catch (MessagingException e) {
            // Log the exception (consider using a logging framework)
            e.printStackTrace();

            // Send an error response
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error sending email");
            System.out.println("Error");
        }
    }
}

