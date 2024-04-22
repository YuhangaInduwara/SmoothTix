package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.smoothPointTable;
import com.smoothtix.model.Passenger;
import com.smoothtix.model.SmoothPoint;
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

import static com.smoothtix.controller.PasswordHash.checkPassword;

public class SmoothPointController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray passengerDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");
        double smooth_point;

        try {
            ResultSet rs = smoothPointTable.getBy_p_id(p_id);

            if(rs.next()) {
                smooth_point = rs.getDouble("smooth_points");
                out.println("{\"smooth_points\": " + smooth_point + "}");
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }


        }catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String action = request.getParameter("action");

        try {
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            SmoothPoint smoothPoint = gson.fromJson(reader, SmoothPoint.class);
            int updateSuccess = 0;
            if(action.equals("add")) {
                updateSuccess = smoothPointTable.updateAdd(smoothPoint);
            }
            else if(action.equals("subtract")) {
                updateSuccess = smoothPointTable.updateSubtract(smoothPoint);
            }

            if(updateSuccess > 0) {
                response.setStatus(HttpServletResponse.SC_OK);
            }
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}