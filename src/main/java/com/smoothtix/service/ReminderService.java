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

//        scheduler.scheduleAtFixedRate(() -> {
//            try {
//                sendReminderEmails();
//            } catch (SQLException | ClassNotFoundException e) {
//                throw new RuntimeException(e);
//            }
//        }, 0, 1, TimeUnit.DAYS);
    }

    private static void sendReminderEmails() throws SQLException, ClassNotFoundException {
        ResultSet rs = scheduleTable.getRemainderSchedules();

        while (rs.next()){
            String subject = "Reminder: Your Journey Tomorrow";
            String email = rs.getString("email");
            String passengerName = rs.getString("first_name") + " " + rs.getString("last_name");
            String message = "Dear " + passengerName + ",<br/><br/>" +
                    "This is a friendly reminder that your journey is scheduled for tomorrow. Please review your travel details below:<br/><br/>" +
                    "Date and Time of Journey: " + rs.getString("date_time") + "<br/>" +
                    "Bus: " + rs.getString("bus_reg_no") + "<br/>" +
                    "Reserved Seat/Seats: " + rs.getString("seat_no") + "<br/><br/>" +
                    "For your convenience, we have attached a QR code to this email. This QR code will serve as your electronic ticket. Kindly ensure you have it available on your mobile device for boarding.<br/><br/>";
            String footer = "Thank you for choosing SmoothTix for your travel needs. We look forward to providing you with a pleasant journey.<br/><br/>" +
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

            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

}
