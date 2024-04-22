package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.ownerTable;
import com.smoothtix.model.Bus;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class BusVerifyController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();

        try {
            ResultSet rs = busTable.getBusRequest();

            while (rs.next()) {
                JSONObject busData = new JSONObject();
                busData.put("bus_id", rs.getString("bus_id"));
                busData.put("owner_id", rs.getString("owner_id"));
                busData.put("nic", rs.getString("nic"));
                busData.put("reg_no", rs.getString("reg_no"));
                busData.put("route_no", rs.getString("route_no"));
                busData.put("route", rs.getString("route"));
                busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                busDataArray.put(busData);
            }

            out.println(busDataArray.toString());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String bus_id = request.getParameter("bus_id");
        String action = request.getParameter("action");

        try {
            if(action.equals("accept")) {
                ResultSet rs = busTable.getRequestData(bus_id);
                if(rs.next()) {
                    Bus bus = new Bus(rs.getString("bus_id"), rs.getString("owner_id"), rs.getString("reg_no"), rs.getString("route_id"), rs.getInt("no_of_seats"), rs.getDouble("review_points"));
                    int insertSuccess = busTable.insert_bus(bus);
                    if(insertSuccess > 0) {
                        int deleteSuccess = busTable.deleteBusRequest(bus_id);
                        if(deleteSuccess > 0) {
                            System.out.println(rs.getString("bus_id")+ rs.getString("owner_id")+ rs.getString("reg_no")+ rs.getString("route_id")+ rs.getInt("no_of_seats")+rs.getDouble("review_points"));
                            response.setStatus(HttpServletResponse.SC_OK);
                        }
                        else{
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        }
                    }
                    else{
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    }
                }
            }
            else if(action.equals("decline")) {
                int deleteSuccess = busTable.deleteBusRequest(bus_id);
                if(deleteSuccess > 0) {
                    response.setStatus(HttpServletResponse.SC_OK);
                }
                else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            }
            else{
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
            String bus_id = request.getParameter("bus_id");
            int deleteSuccess = busTable.delete(bus_id);

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