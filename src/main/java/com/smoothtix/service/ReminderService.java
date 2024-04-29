package com.smoothtix.service;

import com.smoothtix.dao.scheduleTable;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ReminderService {
    static final String fromEmail = "smoothtix@gmail.com";
    static final String password = "obzy cvzg dznf llkg";

    public static void main(String[] args) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        scheduler.scheduleAtFixedRate(() -> {
            try {
                sendReminderEmails();
            } catch (SQLException | ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }, 0, 1, TimeUnit.DAYS);
    }

    private static void sendReminderEmails() throws SQLException, ClassNotFoundException {
        ResultSet rs = scheduleTable.getRemainderSchedules();

        while (rs.next()){
            String subject = "Your Booking Details";
            String email = rs.getString("email");
            String passengerName = rs.getString("first_name") + " " + rs.getString("last_name");
            String message = "Dear " + passengerName + ",<br/><br/>" +
                    "We are delighted to inform you that your booking for the upcoming journey has been successfully confirmed. Your travel details are as follows:<br/><br/>" +
                    "Date and time the of Journey: " + rs.getString("date_time") + "<br/>" +
                    "Bus: " + rs.getString("bus_reg_no") + "<br/>" +
                    "Reserved seat/seats: " + rs.getString("seat_no") + "<br/>" +
                    "Please find attached QR code for this booking. This QR code will serve as your electronic ticket, so please ensure that you have it readily available on your mobile device when boarding.<br/><br/>";
            String footer = "We appreciate your trust in our services and wish you a pleasant journey. Thank you for choosing SmoothTix.<br/><br/>" +
                    "Safe travels!<br/><br/>" +
                    "Best regards,<br/><br/>" +
                    "SmoothTix<br/>" +
                    "smoothtix@gmail.com";

            String htmlContent = "<html><body>";
            htmlContent += "<p>" + message + "</p>";
            htmlContent += "<p>" + footer + "</p>";
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
                System.out.println("Remainder Succeed!");

            } catch (MessagingException e) {
                System.out.println("Remainder failed!");
                e.printStackTrace();
            }
        }
    }

}
