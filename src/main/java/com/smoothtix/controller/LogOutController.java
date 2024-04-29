package com.smoothtix.controller;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LogOutController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        // Attempt to retrieve an existing session without creating a new one
        HttpSession session = request.getSession(false);

        // If a session exists, invalidate it to log out the user
        if (session != null) {
            session.invalidate();
        }
    }
}
