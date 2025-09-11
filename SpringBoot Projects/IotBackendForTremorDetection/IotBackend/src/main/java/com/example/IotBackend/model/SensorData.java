package com.example.IotBackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class SensorData {

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeStamp;
    private double ax;
    private double ay;
    private double az;
    private double accelerationMagnitude;
    private double deltaA;
    private String status;

    public SensorData(){}

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public double getAx() {
        return ax;
    }

    public void setAx(double ax) {
        this.ax = ax;
    }

    public double getAy() {
        return ay;
    }

    public void setAy(double ay) {
        this.ay = ay;
    }

    public double getAz() {
        return az;
    }

    public void setAz(double az) {
        this.az = az;
    }

    public double getAccelerationMagnitude() {
        return accelerationMagnitude;
    }

    public void setAccelerationMagnitude(double accelerationMagnitude) {
        this.accelerationMagnitude = accelerationMagnitude;
    }

    public double getDeltaA() {
        return deltaA;
    }

    public void setDeltaA(double deltaA) {
        this.deltaA = deltaA;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "SensorData{" +
                "timeStamp=" + timeStamp +
                ", ax=" + ax +
                ", ay=" + ay +
                ", az=" + az +
                ", accelerationMagnitude=" + accelerationMagnitude +
                ", deltaA=" + deltaA +
                ", status='" + status + '\'' +
                '}';
    }
}