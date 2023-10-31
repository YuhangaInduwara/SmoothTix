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

        String nic = request.getHeader("nic");

        try {
            ResultSet rs = null;
            if(nic == null){
                rs = passengerTable.getAll();
            }
            else{
                rs = passengerTable.get(nic);
            }


            while (rs.next()) {
                JSONObject passengerData = new JSONObject();
                passengerData.put("fname", rs.getString("fname"));
                passengerData.put("lname", rs.getString("lname"));
                passengerData.put("nic", rs.getString("nic"));
                passengerData.put("mobileNo", rs.getString("mobileNo"));
                passengerData.put("email", rs.getString("email"));

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

            String nic = request.getHeader("nic");

            BufferedReader reader = request.getReader();
            Passenger passenger = gson.fromJson(reader, Passenger.class);

            String hashedPassword = PasswordHash.hashPassword(passenger.getpassword());
            passenger.setpassword(hashedPassword);
            int updateSuccess = passengerTable.update(nic, passenger);

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
            System.out.println(nic);
            System.out.println(deleteSuccess);
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