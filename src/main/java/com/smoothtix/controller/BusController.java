package com.smoothtix.controller;
import com.google.gson.Gson;
import com.smoothtix.dao.busTable;
import com.smoothtix.dao.ownerTable;
import com.smoothtix.model.Bus;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class BusController extends HttpServlet {
    // handle get requests
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();

        // get bus id or passenger id from the request header
        String bus_id = request.getHeader("bus_id");
        String p_id = request.getHeader("p_id");

        try {
            ResultSet rs;
            if (bus_id != null) {
                rs = busTable.get(bus_id);
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_no", rs.getString("route_no"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }

            } else if (p_id != null) {
                rs = busTable.getByOwner(p_id);
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_id", rs.getString("route_id"));
                    busData.put("route", rs.getString("start") + " - " + rs.getString("destination"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }
            } else {
                rs = busTable.getAll();
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_id", rs.getString("route_id"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("review_points", rs.getFloat("review_points"));
                    busDataArray.put(busData);
                }
            }

            out.println(busDataArray);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    // handle post requests
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try {

            String p_id = request.getHeader("p_id");
            Gson gson = new Gson();
            BufferedReader reader = request.getReader();
            Bus bus = gson.fromJson(reader, Bus.class);

            boolean busExists = busTable.isBusExists(bus.getReg_no());
            if (busExists) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                out.println("Bus with registration number already exists.");
                return;
            }

            String ownerID = getOwnerID(p_id);
            if (ownerID != null) {
                int registrationSuccess = busTable.insert(bus, ownerID);

                if (registrationSuccess >= 1) {
                    response.setStatus(HttpServletResponse.SC_OK);
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    // generate owner id
    private String getOwnerID(String p_id) {
        try {
            boolean isOwner = ownerTable.isOwner(p_id);

            if (isOwner) {
                // If the passenger is an owner, retrieve their owner ID
                return ownerTable.getOwnerIDByPassengerID(p_id);
            } else {
                // If the passenger is not an owner, insert a new entry into the owner table
                String ownerID = ownerTable.insertOwner(p_id);
                return ownerID;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // handle update requests
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        try {
            Gson gson = new Gson();

            String bus_id = request.getHeader("bus_id");

            BufferedReader reader = request.getReader();
            Bus bus = gson.fromJson(reader, Bus.class);

            int updateSuccess = busTable.update(bus_id, bus);

            if (updateSuccess >= 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    // handle delete requests
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        try {
            String bus_id = request.getHeader("bus_id");
            int deleteSuccess = busTable.delete(bus_id);

            if (deleteSuccess >= 1) {
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