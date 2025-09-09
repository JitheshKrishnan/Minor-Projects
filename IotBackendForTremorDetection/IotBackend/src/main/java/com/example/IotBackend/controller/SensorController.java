package com.example.IotBackend.controller;

import com.example.IotBackend.model.SensorData;
import com.example.IotBackend.service.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/sensor")
public class SensorController {

    @Autowired
    SensorService sensorService;

    @PostMapping
    public String receive(@RequestBody SensorData body, @RequestHeader(value = "X-API-KEY", required = false) String apiKey) {
        // (optional) simple token check – comment this out if you don’t want it yet
        if (apiKey != null && !apiKey.equals("super-secret-token"))
            throw new RuntimeException("Invalid API key");
        body.setTimeStamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        System.out.println("Received: " + body);
        sensorService.add(body);
        return "ok";
    }

    @GetMapping("/latest")
    public SensorData latest() { return sensorService.latest(); }

    @GetMapping("/history")
    public java.util.List<SensorData> history() { return sensorService.history(); }

    @GetMapping("/ping")
    public String ping() { return "pong"; }
}