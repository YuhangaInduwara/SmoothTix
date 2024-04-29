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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

public class MailController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Email credentials and sender's address
        final String fromEmail = "smoothtix@gmail.com"; // Sender's email
        final String password = "obzy cvzg dznf llkg"; // Encrypted/app-specific password

        // Fetching booking details from request parameters
        String bookingId = request.getParameter("bookingId");
        String email = request.getParameter("email");
        String bookedSeats = request.getParameter("bookedSeats");
        String price = request.getParameter("price");
        String p_id = request.getParameter("p_id");
        String schedule_id = request.getParameter("schedule_id");

        // Defaults for journey details
        String passengerName = "User";
        String date = "";
        String time = "";
        String start = "";
        String destination = "";
        String busRegNo = "";

        try {
            // Retrieve passenger information from the database
            ResultSet rs1 = passengerTable.getBy_p_id(p_id);
            if (rs1.next()) {
                passengerName = rs1.getString("first_name") + " " + rs1.getString("last_name");
            }

            // Retrieve schedule details from the database
            ResultSet rs2 = scheduleTable.getByScheduleId(schedule_id);
            if (rs2.next()) {
                date = String.valueOf(rs2.getDate("date_time"));
                time = String.valueOf(rs2.getTime("date_time"));
            }

            // Retrieve route details from the database
            ResultSet rs3 = scheduleTable.getByRouteByScheduleId(schedule_id);
            if (rs3.next()) {
                start = rs3.getString("start");
                destination = rs3.getString("destination");
                busRegNo = rs3.getString("reg_no");
            } else {
                System.out.println("No schedule found for schedule_id: " + schedule_id);
            }

            // Constructing the email subject and body
            String subject = "Your Booking Details";
            String apiUrl = "https://quickchart.io/qr"; // API for QR code generation
            String parameters = String.format(
                    "ecLevel=H&size=200&text=%s",
                    java.net.URLEncoder.encode(schedule_id + " " + bookingId, "UTF-8"));
            String qrCodeUrl = apiUrl + "?" + parameters;
            // Email content with booking details and QR code
            String message = "Dear " + passengerName + ",<br/><br/>" +
                    "We are delighted to inform you that your booking for the upcoming journey has been successfully confirmed. Your travel details are as follows:<br/><br/>" +
                    "Date of Journey: " + date + "<br/>" +
                    "Departure Time: " + time + "<br/>" +
                    "Bus: " + busRegNo + "<br/>" +
                    "From: " + start + " <br/>" +
                    "To: " + destination + "<br/>" +
                    "Booking Reference Number: " + bookingId + "<br/>" +
                    "Reserved seat/seats: " + bookedSeats + "<br/>" +
                    "Reservation cost: Rs." + price + ".00<br/>" +
                    "Please find attached QR code for this booking. This QR code will serve as your electronic ticket, so please ensure that you have it readily available on your mobile device when boarding.<br/><br/>";
            String footer = "We appreciate your trust in our services and wish you a pleasant journey. Thank you for choosing SmoothTix.<br/><br/>" +
                    "Safe travels!<br/><br/>" +
                    "Best regards,<br/><br/>" +
                    "SmoothTix<br/>" +
                    "smoothtix@gmail.com";

// Final HTML content for the email
            String htmlContent = "<html><body>";
            htmlContent += "<p>" + message + "</p>";
            htmlContent += "<img src='" + qrCodeUrl + "' alt='QR Code'/><br/><br/>";
            htmlContent += "<p>" + footer + "</p>";
            htmlContent += "</body></html>";

            // SMTP server properties for sending the email
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            props.put("mail.debug", "true");
            props.put("mail.debug.auth", "true");// Optional: For debugging purposes
            props.put("mail.smtp.socketFactory.port", "465");// SSL Port
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            // Create session with authentication
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(fromEmail, password);
                }
            });
            // Create and configure the MIME message
            try {
                Message mimeMessage = new MimeMessage(session);
                mimeMessage.setFrom(new InternetAddress(fromEmail));
                mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
                mimeMessage.setSubject(subject);
                mimeMessage.setContent(htmlContent, "text/html");
                Transport.send(mimeMessage);// Send the email

            } catch (MessagingException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Error sending email");
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

