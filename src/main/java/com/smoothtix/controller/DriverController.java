
package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.driverTable;
import com.smoothtix.model.Driver;
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

@WebServlet(name = "driverController", value = "/driverController")
public class DriverController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray driverDataArray = new JSONArray();

        String driver_id = request.getHeader("driver_id");

        try {
            ResultSet rs = null;
            if(driver_id == null){
                rs = driverTable.getAll();
            }
            else{
                rs = driverTable.get(driver_id);
            }

            while (rs.next()) {
                JSONObject driverData = new JSONObject();
                driverData.put("driver_id", rs.getString("driver_id"));
                driverData.put("passenger_id", rs.getString("passenger_id"));
                driverData.put("license_no", rs.getString("license_no"));
                driverData.put("name", rs.getString("name"));
                driverData.put("nic", rs.getString("nic"));
                driverData.put("mobile", rs.getString("mobile"));
                driverData.put("email", rs.getString("email"));
                driverData.put("points", rs.getString("points"));


                driverDataArray.put(driverData);
            }

            out.println(driverDataArray.toString()); // Send JSON data as a response
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
            Driver driver = gson.fromJson(reader, Driver.class);
            int registrationSuccess = driverTable.insert(driver);

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

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();

            String driver_id = request.getHeader("driver_id");

            BufferedReader reader = request.getReader();
            Driver driver = gson.fromJson(reader, Driver.class);


            int updateSuccess = driverTable.update(driver_id, driver);

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
            String driver_id = request.getHeader("driver_id");
            int deleteSuccess = driverTable.delete(driver_id);

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

//package com.smoothtix.controller;
//
//import com.google.gson.Gson;
//import com.smoothtix.dao.driverTable;
//import com.smoothtix.model.Driver;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.json.JSONArray;
//import org.json.JSONObject;
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.PrintWriter;
//import java.sql.ResultSet;
//
//@WebServlet(name = "driverController", value = "/driverController")
//public class DriverController extends HttpServlet {
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//        JSONArray driverDataArray = new JSONArray();
//
//        String driver_id = request.getHeader("driver_id");
//
//        try {
//            ResultSet rs = null;
//            if(driver_id == null){
//                rs = driverTable.getAll();
//            }
//            else{
//                rs = driverTable.get(driver_id);
//            }
//
//            while (rs.next()) {
//                JSONObject driverData = new JSONObject();
//                driverData.put("driver_id", rs.getString("driver_id"));
//                driverData.put("passenger_id", rs.getString("passenger_id"));
//                driverData.put("license_no", rs.getString("license_no"));
//                driverData.put("name", rs.getString("name"));
//                driverData.put("nic", rs.getString("nic"));
//                driverData.put("mobile", rs.getString("mobile"));
//                driverData.put("email", rs.getString("email"));
//                driverData.put("points", rs.getString("points"));
//
//
//                driverDataArray.put(driverData);
//            }
//
//            out.println(driverDataArray.toString()); // Send JSON data as a response
//            response.setStatus(HttpServletResponse.SC_OK);
//        }catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            BufferedReader reader = request.getReader();
//            Driver driver = gson.fromJson(reader, Driver.class);
//            int registrationSuccess = driverTable.insert(driver);
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
//
//    @Override
//    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            Gson gson = new Gson();
//
//            String driver_id = request.getHeader("driver_id");
//
//            BufferedReader reader = request.getReader();
//            Driver driver = gson.fromJson(reader, Driver.class);
//
//
//            int updateSuccess = driverTable.update(driver_id, driver);
//
//            if (updateSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        try {
//            String driver_id = request.getHeader("driver_id");
//            int deleteSuccess = driverTable.delete(driver_id);
//
//            if (deleteSuccess >= 1) {
//                response.setStatus(HttpServletResponse.SC_OK);
//            } else {
//                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//
//}

