package com.smoothtix.controller;

import com.smoothtix.service.ReminderService;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class MyServletContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ReminderService.main(null);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
