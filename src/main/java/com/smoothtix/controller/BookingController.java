package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.bookingTable;
import com.smoothtix.dao.busTable;
import com.smoothtix.model.Booking;
import com.smoothtix.model.Bus;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

@WebServlet(name = "bookingController", value = "/bookingController")
public class BookingController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();

//        String bus_id = request.getHeader("bus_id");

        try {
            ResultSet rs = bookingTable.getAll();

            while (rs.next()) {
                JSONObject bookingData = new JSONObject();
                bookingData.put("booking_id", rs.getString("booking_id"));
                bookingData.put("schedule_id", rs.getString("schedule_id"));
                bookingData.put("route_id", rs.getString("route_id"));
                bookingData.put("date", rs.getString("date"));
                bookingData.put("time", rs.getString("time"));
                bookingData.put("seat_no", rs.getInt("seat_no"));
                bookingData.put("price", rs.getString("price"));

                busDataArray.put(bookingData);
            }

            out.println(busDataArray.toString()); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Booking booking = gson.fromJson(reader, Booking.class);
            int registrationSuccess = bookingTable.insert(booking);

            if (registrationSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}