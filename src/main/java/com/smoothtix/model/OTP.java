package com.smoothtix.model;

public class OTP {
    int otp;
    String email;
    public OTP( int otp, String email){
        this.otp = otp;
        this.email = email;
    }
    public int getOTP(){ return otp; }

    public String getEmail() {
        return email;
    }

    public void setOTP(int otp){
        this.otp = otp;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

