package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.busprofileTable;
import com.smoothtix.dao.reviewTable;
import com.smoothtix.model.Review;
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
        String owner_id = request.getParameter("owner_id");

        try {
            JSONArray reviewDataArray = new JSONArray();

            if(driver_id==null&& owner_id==null){
                ResultSet rs = reviewTable.getByc_Id(conductor_id);

                while (rs.next()) {
                    JSONObject reviewData = new JSONObject();
                    reviewData.put("schedule_date", rs.getString("schedule_date"));
                    reviewData.put("schedule_time", rs.getString("schedule_time"));
                    reviewData.put("route", rs.getString("route") );
                    reviewData.put("reg_no", rs.getString("reg_no"));
                    reviewData.put("conductor_points", rs.getString("conductor_points"));
                    reviewDataArray.put(reviewData);
                }
            }
            else if (conductor_id==null && owner_id==null){

                ResultSet rs = reviewTable.getByd_Id(driver_id);

                while (rs.next()) {
                    JSONObject reviewData = new JSONObject();
                    reviewData.put("schedule_date", rs.getString("schedule_date"));
                    reviewData.put("schedule_time", rs.getString("schedule_time"));
                    reviewData.put("route", rs.getString("route"));
                    reviewData.put("reg_no", rs.getString("reg_no"));
                    reviewData.put("driver_points", rs.getString("driver_points"));
                    reviewDataArray.put(reviewData);
                }
                System.out.println("Test: " + reviewDataArray);
            }
            else {

                ResultSet rs = reviewTable.getByo_Id(owner_id);

                while (rs.next()) {
                    JSONObject reviewData = new JSONObject();
                    reviewData.put("schedule_date", rs.getString("schedule_date"));
                    reviewData.put("schedule_time", rs.getString("schedule_time"));
                    reviewData.put("route", rs.getString("route"));
                    reviewData.put("reg_no", rs.getString("reg_no"));
                    reviewData.put("bus_points", rs.getString("bus_points"));
                    reviewData.put("comments", rs.getString("comments"));
                    reviewDataArray.put(reviewData);
                }
                System.out.println("Test: " + reviewDataArray);
            }
            System.out.println("Test2: " + reviewDataArray);

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

