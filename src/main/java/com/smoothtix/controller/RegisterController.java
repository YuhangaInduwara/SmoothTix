package com.smoothtix.controller;
import com.google.gson.Gson;
import com.smoothtix.dao.passengerTable;
import com.smoothtix.model.Passenger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

public class RegisterController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // handle post (insert) requests
        response.setContentType("text/html");

        try {
            Gson gson = new Gson();

            // parse the json request data to passenger object
            BufferedReader reader = request.getReader();
            Passenger passenger = gson.fromJson(reader, Passenger.class);
            // hash the user's password and store it
            String hashedPassword = PasswordHash.hashPassword(passenger.get_password());
            passenger.set_password(hashedPassword);
            int registrationSuccess = passengerTable.insert(passenger);

            if (registrationSuccess >= 1) {
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
