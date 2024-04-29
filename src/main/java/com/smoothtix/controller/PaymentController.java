package com.smoothtix.controller;
import com.google.gson.Gson;
import com.smoothtix.dao.paymentTable;
import com.smoothtix.model.Payment;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class PaymentController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // handle post (insert) requests
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            // parse the json request data to payment object
            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            Payment payment = gson.fromJson(reader, Payment.class);
            String jsonResponse = paymentTable.insert(payment);

            // if passed payment insertion
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