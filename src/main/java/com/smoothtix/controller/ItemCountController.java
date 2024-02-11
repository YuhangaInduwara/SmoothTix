package com.smoothtix.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smoothtix.dao.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Objects;

public class ItemCountController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray tableDataArray = new JSONArray();
        String request_table = request.getParameter("request_table");
        ResultSet rs;

        try {
            if(Objects.equals(request_table, "passenger")){
                rs = passengerTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else if(Objects.equals(request_table, "timekeeper")){
                rs = timeKprTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else if(Objects.equals(request_table, "bus")){
                rs = busTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else if(Objects.equals(request_table, "driver")){
                rs = driverTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else if(Objects.equals(request_table, "conductor")){
                rs = conductorTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else if(Objects.equals(request_table, "route")){
                rs = routeTable.counter();
                while (rs.next()) {
                    JSONObject tableData = new JSONObject();
                    tableData.put("record_count", rs.getString("record_count"));
                    tableDataArray.put(tableData);
                }
            }
            else{
                JSONObject tableData = new JSONObject();
                tableData.put("record_count", "NaN");
                tableDataArray.put(tableData);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            out.println(tableDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}