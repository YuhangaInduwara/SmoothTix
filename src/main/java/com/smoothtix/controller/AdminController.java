package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.adminReportTable;
import com.smoothtix.model.AdminReport;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class AdminController extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        try{
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            AdminReport report_1 = gson.fromJson(reader, AdminReport.class);

            String startDate = report_1.getStartDate();
            String endDate = report_1.getEndDate();
            String routeNo = report_1.getRouteNo();

            System.out.println(routeNo);
            System.out.println(startDate);
            System.out.println(endDate);
            AdminReport report = adminReportTable.generateReport(startDate, endDate, routeNo);

            JSONObject reportData = new JSONObject();
            reportData.put("totalSeatsBooked", report.getTotalSeatsBooked());
            reportData.put("totalBusesScheduled", report.getTotalBusesScheduled());
            reportData.put("TotalAmount", "Rs." + String.format("%.2f", report.getTotalAmount()));
            reportData.put("commission", "Rs." + String.format("%.2f", report.getCommission()));

            out.print(reportData);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
