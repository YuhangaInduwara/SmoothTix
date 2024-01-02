package com.smoothtix.model;

public class Payment {
    String payment_id;
    String date_time;
    Double amount;



    public Payment(String payment_id, String date_time, Double amount){
        this.payment_id = payment_id;
        this.date_time = date_time;
        this.amount = amount;
    }

    public String getPayment_id(){
        return payment_id;
    }
    public String getDate_Time(){
        return date_time;
    }
    public Double getAmount(){ return amount; }


    public void setPayment_id(String payment_id){
        this.payment_id = payment_id;
    }
    public void setDate_Time(String date_time){
        this.date_time = date_time;
    }
    public void setAmount(Double amount){
        this.amount = amount;
    }
}

