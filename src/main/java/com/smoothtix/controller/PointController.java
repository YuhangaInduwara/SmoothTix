package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.pointTable;
import com.smoothtix.model.Point;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class PointController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Point point = gson.fromJson(reader, Point.class);
            System.out.println("point1");

            String jsonResponse = pointTable.insert(point);


            if (!jsonResponse.equals("Unsuccessful")) {
                System.out.println("point3");

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
