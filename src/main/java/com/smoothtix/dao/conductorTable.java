package com.smoothtix.dao;

import com.smoothtix.database.dbConnection;
import com.smoothtix.model.Bus;
import com.smoothtix.model.Conductor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class conductorTable {
    public static int insert(Conductor conductor) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("insert into conductor(conductor_id, nic) values (?,?)");
        pst.setString(1,conductor.getConductor_id());
        pst.setString(2,conductor.getNIC());
        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static ResultSet get(String conductor_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM conductor WHERE conductor_id=?");
        pst.setString(1,conductor_id);
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static ResultSet getAll() throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("SELECT * FROM conductor");
        ResultSet rs = pst.executeQuery();
        return rs;
    }

    public static int update(String conductor_id, Conductor conductor) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("UPDATE conductor SET conductor_id=?, nic=? WHERE conductor_id=?");
        pst.setString(1,conductor.getConductor_id());
        pst.setString(2,conductor.getNIC());
        pst.setString(3,conductor_id);

        int rawCount = pst.executeUpdate();
        return rawCount;
    }

    public static int delete(String conductor_id) throws SQLException, ClassNotFoundException {
        Connection con = dbConnection.initializeDatabase();
        PreparedStatement pst = con.prepareStatement("DELETE FROM conductor WHERE conductor_id = ?");
        pst.setString(1,conductor_id);
        int rawCount = pst.executeUpdate();
        return rawCount;
    }
}
