package com.smoothtix.controller;

import com.google.gson.Gson;
import com.smoothtix.dao.reportTable;
import com.smoothtix.model.Report;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;


public class ReportController extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");
            String busRegNo = request.getParameter("busRegNo");
            System.out.println(busRegNo);
            System.out.println(startDate);
            System.out.println(endDate);

            Report report = reportTable.getReportDetails(startDate, endDate, busRegNo);

            Gson gson = new Gson();
            String reportJson = gson.toJson(report);

            response.setContentType("application/json");
            response.getWriter().write(reportJson);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        try{
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Report report_1 = gson.fromJson(reader, Report.class);

            String startDate = report_1.getStartDate();
            String endDate = report_1.getEndDate();
            String busRegNo = report_1.getBusRegNo();
            System.out.println(busRegNo);
            System.out.println(startDate);
            System.out.println(endDate);
            Report report = reportTable.generateReport(startDate, endDate, busRegNo);

            JSONObject reportData = new JSONObject();
            reportData.put("totalSeatsBooked", report.getTotalSeatsBooked());
            reportData.put("totalPaymentsDeleted", report.getTotalPaymentsDeleted());
            reportData.put("finalAmount", report.getFinalAmount());

            out.print(reportData);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}