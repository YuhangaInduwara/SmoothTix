package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.bookingTable;
import com.smoothtix.dao.busTable;
import com.smoothtix.model.Booking;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smoothtix.model.Bus;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Objects;

public class BookingController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray bookingDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");
        String booking_id = request.getParameter("booking_id");
        System.out.println("Booking_p_id: " +p_id);

        try {
            ResultSet rs;
            if(p_id == null && booking_id == null){
                rs = bookingTable.getAll();
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("schedule_id", rs.getString("schedule_id"));
                    bookingData.put("route_id", rs.getString("route_id"));
                    bookingData.put("date", rs.getString("date"));
                    bookingData.put("time", rs.getString("time"));
//                    bookingData.put("seat_no", rs.getInt("seat_no"));
                    bookingData.put("price", rs.getString("price"));
                    bookingDataArray.put(bookingData);
                }
            }
            else if(booking_id == null){
                rs = bookingTable.getByP_id(p_id);
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("reg_no", rs.getString("reg_no"));
                    bookingData.put("start", rs.getString("start"));
                    bookingData.put("destination", rs.getString("destination"));
                    bookingData.put("date", rs.getDate("date_time"));
                    bookingData.put("time", rs.getTime("date_time"));
                    bookingData.put("seat_no", rs.getString("booked_seats"));
                    bookingData.put("status", rs.getInt("status"));
                    bookingDataArray.put(bookingData);
                }
            }
            else if(p_id == null){
                rs = bookingTable.getByBooking_id(booking_id);
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("reg_no", rs.getString("reg_no"));
                    bookingData.put("start", rs.getString("start"));
                    bookingData.put("destination", rs.getString("destination"));
                    bookingData.put("date", rs.getDate("date_time"));
                    bookingData.put("time", rs.getTime("date_time"));
//                    bookingData.put("seat_no", rs.getInt("seat_no"));
                    bookingData.put("status", rs.getInt("status"));
                    bookingDataArray.put(bookingData);
                }
            }
            System.out.println(bookingDataArray);
            out.println(bookingDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Booking booking = gson.fromJson(reader, Booking.class);
            System.out.println(booking.getP_id());
            String jsonResponse = bookingTable.insert(booking);


            if (!jsonResponse.equals("Unsuccessful")) {

                out.write(jsonResponse);
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        int updateSuccess = 0;

        try {
            Gson gson = new Gson();

            String action = request.getParameter("action");
            String booking_id = request.getHeader("booking_id");
            String status = request.getHeader("status");

//            BufferedReader reader = request.getReader();
//            Booking booking = gson.fromJson(reader, Booking.class);

            if(Objects.equals(action, "admit")){
                int int_status = Integer.parseInt(status);
                boolean boolValue = (int_status != 0);
                updateSuccess = bookingTable.update_status(booking_id, boolValue);
            }

            if (updateSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            String booking_id = request.getParameter("booking_id");
            int deleteSuccess = busTable.delete(booking_id);

            if (deleteSuccess >= 1) {
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