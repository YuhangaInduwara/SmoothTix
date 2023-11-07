package com.smoothtix.database;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv;

public class dbConnection  {
    private static Connection connection;
    private dbConnection () {}
    public static Connection initializeDatabase() {
        if (connection == null) {
            synchronized (dbConnection .class) {
                if (connection == null) {
                    try {
                        Dotenv dotenv = Dotenv.load();
                        String dbDriver = "com.mysql.cj.jdbc.Driver";
                        String dbURL = dotenv.get("DB_URL");
                        String dbName = dotenv.get("DB_NAME");
                        String dbUsername = dotenv.get("DB_USERNAME");
                        String dbPassword = dotenv.get("DB_PASSWORD");
                        Class.forName(dbDriver);
                        connection = DriverManager.getConnection(dbURL + dbName, dbUsername, dbPassword);
                    } catch (ClassNotFoundException | SQLException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return connection;
    }
}
