package com.smoothtix.controller;

import com.smoothtix.dao.passengerTable;
import com.smoothtix.dao.scheduleTable;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.util.Properties;

public class MailController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        final String fromEmail = "smoothtix@gmail.com";
        final String password = "ikwc nnnq rguk hexc";

        String bookingId = request.getParameter("bookingId");
        String email = request.getParameter("email");
        String bookedSeats = request.getParameter("bookedSeats");
        String price = request.getParameter("price");
        String p_id = request.getParameter("p_id");
        String schedule_id = request.getParameter("schedule_id");
        String passengerName = "User";
        String date = "2024/01/04";
        String time = "09:45";

        try {
            ResultSet rs1 = passengerTable.getBy_p_id(p_id);
            if (rs1.next()) {
                passengerName = rs1.getString("first_name") + " " + rs1.getString("last_name");
            } else {
                System.out.println("No passenger found for p_id: " + p_id);
            }

            ResultSet rs2 = scheduleTable.getByScheduleId(schedule_id);
            if (rs2.next()) {
                date = String.valueOf(rs2.getDate("date_time"));
                time = String.valueOf(rs2.getTime("date_time"));
                System.out.println(date);
                System.out.println(time);
            } else {
                System.out.println("No schedule found for schedule_id: " + schedule_id);
            }

            String subject = "Your Booking Details";
            String apiUrl = "https://chart.googleapis.com/chart";
            String parameters = String.format(
                    "cht=qr&chs=300x300&choe=UTF-8&chl=%s",
                    java.net.URLEncoder.encode(bookingId, "UTF-8")
            );
            String qrCodeUrl = apiUrl + "?" + parameters;
            String message = "Dear " + passengerName + ",<br/><br/>" +
                    "We are delighted to inform you that your booking for the upcoming journey has been successfully confirmed. Your travel details are as follows:<br/><br/>" +
                    "Date of Journey: " + date + "<br/>" +
                    "Departure Time: " + time + "<br/>" +
                    "From: [Departure Location]<br/>" +
                    "To: [Destination]<br/>" +
                    "Booking Reference Number: " + bookingId + "<br/>" +
                    "Reserved seat/seats: " + bookedSeats + "<br/>" +
                    "Please find attached your QR code for this booking. This QR code will serve as your electronic ticket, so please ensure that you have it readily available on your mobile device when boarding.<br/><br/>";
            System.out.println(message);
            String footer = "We appreciate your trust in our services and wish you a pleasant journey. Thank you for choosing SmoothTix.<br/><br/>" +
                    "Safe travels!<br/><br/>" +
                    "Best regards,<br/><br/>" +
                    "SmoothTix<br/>" +
                    "smoothtix@gmail.com";

            String htmlContent = "<html><body>";
            htmlContent += "<p>" + message + "</p>";
            htmlContent += "<img src='" + qrCodeUrl + "' alt='QR Code'/><br/><br/>";
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
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Error sending email");
                System.out.println("Error");
            }

        } catch (SQLException e) {
            System.out.println("SQL error: " + e.getMessage());
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            System.out.println("Class not found error: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }
}

