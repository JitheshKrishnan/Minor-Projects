#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiServer.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <MPU6050_light.h>
#include <math.h>

MPU6050 mpu(Wire);

// Motor pins
#define IN1 D5
#define IN2 D6
#define IN3 D7
#define IN4 D8

// Thresholds
#define NORMAL_THRESHOLD 0.3    // mild movement (g difference)
#define TREMOR_THRESHOLD 1.0    // strong tremor (g difference)

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME"; // Replace with your wifi name
const char* password = "YOUR_WIFI_PASSWORD"; // Replace with your wifi password

// Spring Boot server endpoint
String serverUrl = "http://xxx.xxx.xx.xxx:yyyy/api/sensor"; // Replace "xxx..." with your Wifi IPv4, and "yyyy" with yor port

void setup() {
  Serial.begin(115200);
  Wire.begin(D2, D1); // SDA, SCL

  byte status = mpu.begin();
  Serial.print("MPU6050 status: ");
  Serial.println(status);
  while (status != 0) { } // stop if MPU6050 init failed

  Serial.println("MPU6050 ready!");
  mpu.calcOffsets(); // auto-calibration

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Tremor Detection with MPU6050_light");
  Serial.println("Time(ms)\tax\tay\taz\tAccelMag\tDeltaA\tStatus");
}

void loop() {
  mpu.update();

  // acceleration in g units
  float ax = mpu.getAccX();
  float ay = mpu.getAccY();
  float az = mpu.getAccZ();

  // net acceleration magnitude
  float accelMag = sqrt(ax * ax + ay * ay + az * az);

  // Difference from baseline 1g
  float deltaA = fabs(accelMag - 1.0);

  String status = "Normal";

  if (deltaA > TREMOR_THRESHOLD) {
    status = "Tremor Detected";
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  } else if (deltaA > NORMAL_THRESHOLD) {
    status = "Mild Movement";
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
  } else {
    status = "Normal";
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
  }

  // Print values
  Serial.print(millis()); Serial.print("\t");
  Serial.print(ax, 3); Serial.print("\t");
  Serial.print(ay, 3); Serial.print("\t");
  Serial.print(az, 3); Serial.print("\t");
  Serial.print(accelMag, 3); Serial.print("\t");
  Serial.print(deltaA, 3); Serial.print("\t");
  Serial.println(status);

  // --- Send Data to Spring Boot ---
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-KEY", "super-secret-token");

    String jsonData = "{";
      jsonData += "\"ax\": " + String(ax, 3) + ",";
      jsonData += "\"ay\": " + String(ay, 3) + ",";
      jsonData += "\"az\": " + String(az, 3) + ",";
      jsonData += "\"accelerationMagnitude\": " + String(accelMag, 3) + ",";
      jsonData += "\"deltaA\": " + String(deltaA, 3) + ",";
      jsonData += "\"status\": \"" + status + "\"";
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully! Response: " + http.getString());
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }

  delay(1000);
}