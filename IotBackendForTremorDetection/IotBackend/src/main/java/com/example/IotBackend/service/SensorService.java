package com.example.IotBackend.service;

import com.example.IotBackend.model.SensorData;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SensorService {

    private SensorData latest;
    private final Deque<SensorData> history = new LinkedList<>();
    private final int MAX_HISTORY = 200;

    public synchronized void add(SensorData sensorData) {
        latest = sensorData;
        history.add(sensorData);
        if (history.size() > MAX_HISTORY) history.removeFirst();
    }

    public synchronized SensorData latest() { return latest; }

    public synchronized List<SensorData> history() {
        return new ArrayList<>(history);
    }
}