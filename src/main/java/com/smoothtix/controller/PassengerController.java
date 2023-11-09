package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Passenger;
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

@WebServlet(name = "passengerController", value = "/passengerController")
public class PassengerController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();
        String p_id = request.getHeader("p_id");

        try {
            ResultSet rs = null;
            if(p_id == null){
                rs = passengerTable.getAll();
            }
            else{
                rs = passengerTable.getBy_p_id(p_id);
            }


            while (rs.next()) {
                JSONObject passengerData = new JSONObject();
                passengerData.put("p_id", rs.getString("p_id"));
                passengerData.put("first_name", rs.getString("first_name"));
                passengerData.put("last_name", rs.getString("last_name"));
                passengerData.put("nic", rs.getString("nic"));
                passengerData.put("email", rs.getString("email"));
                passengerData.put("flag", rs.getBoolean("flag"));
                passengerData.put("privilege_level", rs.getInt("privilege_level"));

                passengerDataArray.put(passengerData);
            }

            out.println(passengerDataArray.toString()); // Send JSON data as a response
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            BufferedReader reader = request.getReader();
//            Passenger passenger = gson.fromJson(reader, Passenger.class);
//            int registrationSuccess = passengerTable.insert(passenger);
//
//            if (registrationSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();
            String p_id = request.getHeader("p_id");

            BufferedReader reader = request.getReader();
            Passenger passenger = gson.fromJson(reader, Passenger.class);
            int updateSuccess = 0;
            if(passenger.get_password() != null && !passenger.get_password().isEmpty()){
                String hashedPassword = PasswordHash.hashPassword(passenger.get_password());
                passenger.set_password(hashedPassword);
                updateSuccess = passengerTable.updatePassword(p_id, passenger);
            }
            else if(passenger.get_flag() != null){
                updateSuccess = passengerTable.updateFlag(p_id, passenger);
            }
            else if(passenger.get_privilege_level() >= 1){
                 updateSuccess = passengerTable.updatePrivilegeLevel(p_id, passenger);
            }
            else{
                updateSuccess = passengerTable.update(p_id, passenger);
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
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            String nic = request.getHeader("nic");
            int deleteSuccess = passengerTable.delete(nic);
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