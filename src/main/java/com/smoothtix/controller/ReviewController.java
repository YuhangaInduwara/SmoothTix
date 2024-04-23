package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.dao.reviewTable;
import com.smoothtix.model.Review;
import org.jetbrains.annotations.NotNull;
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

public class ReviewController extends HttpServlet {

    protected void doGet( HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();


        String conductor_id = request.getParameter("conductor_id");
        String driver_id = request.getParameter("driver_id");

        try {
            JSONArray reviewDataArray = new JSONArray();

            if(driver_id==null){
                ResultSet rs = reviewTable.getByc_Id(conductor_id);

                while (rs.next()) {
                    JSONObject reviewData = new JSONObject();
                    reviewData.put("date_time", rs.getString("date_time"));
                    reviewData.put("route", rs.getString("route") );
                    reviewData.put("reg_no", rs.getString("reg_no"));
                    reviewData.put("conductor_points", rs.getString("conductor_points"));
                    reviewDataArray.put(reviewData);
                }
            }
            else{

                ResultSet rs = reviewTable.getByd_Id(driver_id);

                while (rs.next()) {
                    JSONObject reviewData = new JSONObject();
                    reviewData.put("date_time", rs.getString("date_time"));
                    reviewData.put("route", rs.getString("route"));
                    reviewData.put("reg_no", rs.getString("reg_no"));
                    reviewData.put("conductor_points", rs.getString("conductor_points"));
                    reviewDataArray.put(reviewData);
                }
            }
            out.println(reviewDataArray);
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
            Review review = gson.fromJson(reader, Review.class);
            String jsonResponse = reviewTable.insert(review);


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


}

