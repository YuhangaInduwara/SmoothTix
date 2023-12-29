package com.smoothtix.controller;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;

public class MailController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        final String fromEmail = "smoothtix@gmail.com";
        final String password = "ikwc nnnq rguk hexc";

        String bookingId = request.getParameter("bookingId");
        String email = request.getParameter("email");

        String subject = "Your Booking Details";
        String apiUrl = "https://chart.googleapis.com/chart";
        String parameters = String.format(
                "cht=qr&chs=300x300&choe=UTF-8&chl=%s",
                java.net.URLEncoder.encode(bookingId, "UTF-8")
        );
        String qrCodeUrl = apiUrl + "?" + parameters;
        String message = "You have placed your booking successfully. Your booking number is " + bookingId + ". Thank you for joining with SmoothTix";

        String htmlContent = "<html><body>";
        htmlContent += "<p>" + message + "</p>";
        htmlContent += "<img src='" + qrCodeUrl + "' alt='QR Code'/>";
        htmlContent += "</body></html>";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.debug", "true");
        props.put("mail.debug.auth", "true");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            Message mimeMessage = new MimeMessage(session);
            mimeMessage.setFrom(new InternetAddress(fromEmail));
            mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            mimeMessage.setSubject(subject);
            mimeMessage.setContent(htmlContent, "text/html");
            Transport.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error sending email");
            System.out.println("Error");
        }
    }
}

