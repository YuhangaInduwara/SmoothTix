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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

public class BookingController extends HttpServlet {
    // handle get requests
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray bookingDataArray = new JSONArray();

        // get passenger id/booking id/timekeeper id according to the request
        String p_id = request.getParameter("p_id");
        String booking_id = request.getParameter("booking_id");
        String timeKeeper_id = request.getParameter("timeKeeper_id");

        // get start, destination, date, startTime, endTime is included in request parameters
        String start = request.getParameter("start");
        String destination = request.getParameter("destination");
        String date = request.getParameter("date");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");

        try {
            ResultSet rs;
            // if a timekeeper id is sent with the request
            if(p_id == null && booking_id == null){
                // get details from the booking table for a given timekeeper id
                rs = bookingTable.getAllByTKID(timeKeeper_id);
                // if data are exist add to a json object array
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
            }
            // if a passenger id is sent with the request
            else if(booking_id == null){
                // get details from the booking table for a given passenger id
                rs = bookingTable.getByP_id(p_id);
                // if data are exist add to a json object array
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
            // if a booking id is sent with the request
            else if(p_id == null){
                // get details from the booking table for a given booking id
                rs = bookingTable.getByBooking_id(booking_id);
                // if data are exist add to a json object array
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
            // send the json array with the response
            out.println(bookingDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

    }

    // handle post requests
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // parse the json request data to an Booking object
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Booking booking = gson.fromJson(reader, Booking.class);

            // insert the booking details to the booking table
            String jsonResponse = bookingTable.insert(booking);

            if (!jsonResponse.equals("Unsuccessful")) {
                // return the success state with the response
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

    // handle update requests
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        int updateSuccess = 0;

        try {

            // get action/booking_id/status according to the request
            String action = request.getParameter("action");
            String booking_id = request.getHeader("booking_id");
            String status = request.getHeader("status");

            // if the request is for admitting update the status with 1
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

    // handle delete requests
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");

        String action = request.getParameter("action");
        int deleteSuccess1, deleteSuccess2, updateSuccess1, updateSuccess2, updateSuccess3, updateSuccess4, insertSuccess1, insertSuccess2;


        try {
            // parse the json request data to an Booking object
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Booking booking = gson.fromJson(reader, Booking.class);

            // extract the passenger id from the object
            String p_id = booking.getP_id();

            // get the booking details for a given booking id
            ResultSet rs = bookingTable.getByBooking_id(booking.getBooking_id());

            if(rs.next()){
                // extract booking id, schedule id, payment id from the results
                String booking_id = rs.getString("booking_id");
                String schedule_id = rs.getString("schedule_id");
                String payment_id = rs.getString("payment_id");

                // delete the booed seats
                deleteSuccess1 = bookingTable.deleteBookedSeats(booking_id, booking.getSelectedSeats());

                if(deleteSuccess1 > 0){
                    if(action.equals("flag")){
                        // delete booking
                        deleteSuccess2 = bookingTable.delete(booking_id);
                        if(deleteSuccess2 > 0){
                            // change the flag of payment to 1
                            updateSuccess1 = paymentTable.updateFlag(payment_id, true);
                            if(updateSuccess1 > 0){
                                // insert the flagged payment details to the deleted_payment table
                                insertSuccess1 = deletedPaymentsTable.insert(payment_id, p_id);
                                if(insertSuccess1 > 0){
                                    // update seat availability
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
                        // get schedule data for a given schedule id
                        ResultSet rs2 = scheduleTable.getByScheduleId(schedule_id);
                        if(rs2.next()){
                            // extract the price of a booking from the result set
                            double seat_price = rs2.getDouble("price_per_ride");
                            if(seat_price > 0){
                                // calculate the deleted payment amount
                                double priceDeduct = booking.getSelectedSeats().length * seat_price;
                                // deduct the deleted amount from the payment table
                                updateSuccess3 = paymentTable.updateAmount(payment_id, priceDeduct);
                                if(updateSuccess3 > 0){
                                    // insert the deleted amount to the deleted_payment table
                                    insertSuccess2 = deletedPaymentsTable.insertPartially(payment_id, priceDeduct, p_id);
                                    if(insertSuccess2 > 0){
                                        // update seat availability
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

    // filter booking data for given time range
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

