package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.bookingTable;
import com.smoothtix.dao.paymentTable;
import com.smoothtix.dao.scheduleTable;
import com.smoothtix.dao.deletedPaymentsTable;
import com.smoothtix.dao.seatAvailabilityTable;
import com.smoothtix.model.Booking;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smoothtix.model.Bus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

public class BookingController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray bookingDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");
        String booking_id = request.getParameter("booking_id");
        String timeKeeper_id = request.getParameter("timeKeeper_id");
        System.out.println("Booking_p_id: " + timeKeeper_id);

        String start = request.getParameter("start");
        String destination = request.getParameter("destination");
        String date = request.getParameter("date");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");

        try {
            ResultSet rs;
            if(p_id == null && booking_id == null){
                rs = bookingTable.getAllByTKID(timeKeeper_id);
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("schedule_id", rs.getString("schedule_id"));
                    bookingData.put("reg_no", rs.getString("reg_no"));
                    bookingData.put("route_no", rs.getString("route_no"));
                    bookingData.put("route", rs.getString("route"));
                    bookingData.put("date_time", rs.getString("date_time"));
                    bookingData.put("seat_no", rs.getString("booked_seats"));
                    bookingData.put("status", rs.getString("status"));
                    bookingData.put("nic", rs.getString("nic"));
                    bookingDataArray.put(bookingData);
                }
                System.out.println(bookingDataArray);
            }
            else if(booking_id == null){
                rs = bookingTable.getByP_id(p_id);
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("reg_no", rs.getString("reg_no"));
                    bookingData.put("route_no", rs.getString("route_no"));
                    bookingData.put("start", rs.getString("start"));
                    bookingData.put("destination", rs.getString("destination"));
                    bookingData.put("schedule_id", rs.getString("schedule_id"));
                    bookingData.put("date", rs.getDate("date_time"));
                    bookingData.put("time", rs.getTime("date_time"));
                    bookingData.put("seat_no", rs.getString("booked_seats"));
                    bookingData.put("status", rs.getInt("status"));
                    bookingData.put("schedule_status", rs.getInt("schedule_status"));
                    bookingData.put("amount", rs.getInt("amount"));
                    bookingDataArray.put(bookingData);
                }

                if(start != null || destination != null || date != null || startTime != null || endTime != null){
                    bookingDataArray = filterBookingData(bookingDataArray, start, destination, date, startTime, endTime);
                }
            }
            else if(p_id == null){
                rs = bookingTable.getByBooking_id(booking_id);
                while (rs.next()) {
                    JSONObject bookingData = new JSONObject();
                    bookingData.put("booking_id", rs.getString("booking_id"));
                    bookingData.put("schedule_id", rs.getString("schedule_id"));
                    bookingData.put("reg_no", rs.getString("reg_no"));
                    bookingData.put("start", rs.getString("start"));
                    bookingData.put("destination", rs.getString("destination"));
                    bookingData.put("date", rs.getDate("date_time"));
                    bookingData.put("time", rs.getTime("date_time"));
                    bookingData.put("seat_no", rs.getInt("booked_seats"));
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

        String action = request.getParameter("action");
        System.out.println(action);
        int deleteSuccess1 = 0, deleteSuccess2 = 0, updateSuccess1 = 0, updateSuccess2 = 0, updateSuccess3 = 0, updateSuccess4 = 0, insertSuccess1 = 0, insertSuccess2 = 0;


        try {
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Booking booking = gson.fromJson(reader, Booking.class);

            String p_id = booking.getP_id();

            ResultSet rs = bookingTable.getByBooking_id(booking.getBooking_id());
            System.out.println(Arrays.toString(booking.getSelectedSeats()));

            if(rs.next()){
                String booking_id = rs.getString("booking_id");
                String schedule_id = rs.getString("schedule_id");
                String payment_id = rs.getString("payment_id");

                deleteSuccess1 = bookingTable.deleteBookedSeats(booking_id, booking.getSelectedSeats());

                if(deleteSuccess1 > 0){
                    if(action.equals("flag")){
                        deleteSuccess2 = bookingTable.delete(booking_id);
                        if(deleteSuccess2 > 0){
                            updateSuccess1 = paymentTable.updateFlag(payment_id, true);
                            if(updateSuccess1 > 0){
                                insertSuccess1 = deletedPaymentsTable.insert(payment_id, p_id);
                                if(insertSuccess1 > 0){
                                    updateSuccess2 = seatAvailabilityTable.updateSeatNo(schedule_id, booking.getSelectedSeats());
                                    if(updateSuccess2 > 0){
                                        response.setStatus(HttpServletResponse.SC_OK);
                                    }
                                    else{
                                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                    }
                                }
                                else{
                                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                }
                            }
                            else{
                                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            }
                        }
                        else{
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        }
                    }
                    else if(action.equals("update")){
                        ResultSet rs2 = scheduleTable.getByScheduleId(schedule_id);
                        if(rs2.next()){
                            double seat_price = rs2.getDouble("price_per_ride");
                            if(seat_price > 0){
                                double priceDeduct = booking.getSelectedSeats().length * seat_price;
                                System.out.println(priceDeduct);
                                updateSuccess3 = paymentTable.updateAmount(payment_id, priceDeduct);
                                if(updateSuccess3 > 0){
                                    insertSuccess2 = deletedPaymentsTable.insertPartially(payment_id, priceDeduct, p_id);
                                    if(insertSuccess2 > 0){
                                        updateSuccess4 = seatAvailabilityTable.updateSeatNo(schedule_id, booking.getSelectedSeats());
                                        if(updateSuccess4 > 0){
                                            response.setStatus(HttpServletResponse.SC_OK);
                                        }
                                        else{
                                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                        }
                                    }
                                    else{
                                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                    }
                                }
                                else{
                                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                }
                            }
                            else{
                                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            }
                        }
                        else{
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        }
                    }
                    else{
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    }
                }
                else{
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private JSONArray filterBookingData(JSONArray originalArray, String start, String destination, String date, String startTime, String endTime) throws JSONException, ParseException {
        JSONArray filteredArray = new JSONArray();
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

        for (int i = 0; i < originalArray.length(); i++) {
            JSONObject bookingData = originalArray.getJSONObject(i);

            if (!startTime.isEmpty() && !endTime.isEmpty()) {
                Date parsedStartTime = timeFormat.parse(startTime);
                Date parsedEndTime = timeFormat.parse(endTime);
                String scheduleTimeStr = bookingData.getString("time");
                Date scheduleTime = timeFormat.parse(scheduleTimeStr);

                if (scheduleTime.after(parsedStartTime) && scheduleTime.before(parsedEndTime)) {
                    if ((Objects.equals(start, "") || start.equals(bookingData.getString("start")))
                            && (Objects.equals(destination, "") || destination.equals(bookingData.getString("destination")))
                            && (Objects.equals(date, "") || date.equals(bookingData.getString("date")))) {
                        filteredArray.put(bookingData);
                    }
                }
            } else {
                if ((Objects.equals(start, "") || start.equals(bookingData.getString("start")))
                        && (Objects.equals(destination, "") || destination.equals(bookingData.getString("destination")))
                        && (Objects.equals(date, "") || date.equals(bookingData.getString("date")))) {
                    filteredArray.put(bookingData);
                }
            }
        }
        return filteredArray;
    }

}

