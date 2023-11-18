package com.smoothtix.model;

public class Route {
    private final String route_id;
    private final String route_no;
    private final String start;
    private final String destination;
    private final double distance;
    private final double price_per_ride;

    public Route(String route_id, String route_no, String start, String destination, double distance, double price_per_ride){
        this.route_id = route_id;
        this.route_no = route_no;
        this.start = start;
        this.destination = destination;
        this.distance = distance;
        this.price_per_ride = price_per_ride;
    }

    public String get_route_id(){
        return route_id;
    }
    public String get_route_no(){

        return route_no;
    }
    public String get_start(){
        return start;
    }
    public String get_destination(){
        return destination;
    }
    public double get_distance(){
        return distance;
    }
    public double get_price_per_ride(){
        return price_per_ride;
    }

}
