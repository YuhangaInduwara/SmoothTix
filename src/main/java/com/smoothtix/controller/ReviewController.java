package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.reviewTable;
import com.smoothtix.model.Review;
import org.json.JSONArray;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class ReviewController extends HttpServlet {

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

