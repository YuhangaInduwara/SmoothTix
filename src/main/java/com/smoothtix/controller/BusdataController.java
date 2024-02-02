//
//package com.smoothtix.controller;
//
//import com.smoothtix.dao.busTable;
//import org.json.JSONArray;
//import org.json.JSONObject;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.io.PrintWriter;
//import java.sql.ResultSet;
//
//public class BusdataController extends HttpServlet {
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("application/json");
//        PrintWriter out = response.getWriter();
//        JSONArray busDataArray = new JSONArray();
//
//        try {
//            ResultSet rs = busTable.getAll();
//
//            while (rs.next()) {
//                JSONObject busData = new JSONObject();
//                busData.put("bus_id", rs.getString("bus_id"));
//                // Add other attributes as needed
//                busDataArray.put(busData);
//            }
//
//            out.println(busDataArray.toString()); // Send JSON data as a response
//            response.setStatus(HttpServletResponse.SC_OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//}
