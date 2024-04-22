package com.smoothtix.model;

public class OTP {
    String email;
    int otp;
    public OTP(String email, int otp){
        this.email = email;
        this.otp = otp;
    }

    public String getEmail(){
        return email;
    }
    public int getOTP(){ return otp; }

    public void setEmail(String email){
        this.email = email;
    }
    public void setOTP(int otp){
        this.otp = otp;
    }


}

