package com.smoothtix.controller;
import com.smoothtix.dao.busTable;
import com.smoothtix.model.Bus;
import org.json.JSONArray;
import org.json.JSONObject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;

public class BusVerifyController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        JSONArray busDataArray = new JSONArray();
        String p_id = request.getParameter("p_id");

        try {
            if(p_id == null){
                ResultSet rs = busTable.getBusRequest();

                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("nic", rs.getString("nic"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_no", rs.getString("route_no"));
                    busData.put("route", rs.getString("route"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("status", rs.getInt("status"));
                    busDataArray.put(busData);
                }
            }
            else{
                ResultSet rs = busTable.getBusRequestByPID(p_id);
                while (rs.next()) {
                    JSONObject busData = new JSONObject();
                    busData.put("bus_id", rs.getString("bus_id"));
                    busData.put("owner_id", rs.getString("owner_id"));
                    busData.put("nic", rs.getString("nic"));
                    busData.put("reg_no", rs.getString("reg_no"));
                    busData.put("route_no", rs.getString("route_no"));
                    busData.put("route", rs.getString("route"));
                    busData.put("no_of_Seats", rs.getInt("no_of_Seats"));
                    busData.put("status", rs.getInt("status"));
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
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        String bus_id = request.getParameter("bus_id");
        String action = request.getParameter("action");

        try {
            if(action.equals("accept")) {
                ResultSet rs = busTable.getRequestData(bus_id);
                if(rs.next()) {
                    Bus bus = new Bus(rs.getString("bus_id"), rs.getString("owner_id"), rs.getString("reg_no"), rs.getString("route_id"), rs.getInt("no_of_seats"), rs.getDouble("review_points"));
                    int insertSuccess = busTable.insert_bus(bus);
                    if(insertSuccess > 0) {
                        int updateSuccess = busTable.updateRequestStatus(bus_id, 1);
                        if(updateSuccess > 0) {
                            response.setStatus(HttpServletResponse.SC_OK);
                        }
                        else{
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        }
                    }
                    else{
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    }
                }
            }
            else if(action.equals("decline")) {
                int updateSuccess = busTable.updateRequestStatus(bus_id, 2);
                if(updateSuccess > 0) {
                    response.setStatus(HttpServletResponse.SC_OK);
                }
                else{
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            }
            else{
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

        try {
            String bus_id = request.getParameter("bus_id");
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