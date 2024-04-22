package com.smoothtix.model;

public class SmoothPoint {
    private String p_id;
    private double amount;

    public SmoothPoint(String p_id, double amount){
        this.p_id = p_id;
        this.amount = amount;
    }

    public String get_p_id(){
        return p_id;
    }
    public double get_amount(){
        return amount;
    }

    public void set_p_id(String p_id){
        this.p_id = p_id;
    }
    public void set_amount(double amount){
        this.amount = amount;
    }

}
