#include <SPI.h>
#include <WiFiNINA.h>

char ssid[] = "wifi-sonde";  // your network SSID (name)
char pass[] = "hediezrokdb"; // your network password (use for WPA, or use as key for WEP)
int keyIndex = 0;            // your network key index number (needed only for WEP)
bool isSetup = true;
struct FormData
{
    char wifiSsid[32];        // Adjust the array sizes according to your needs
    char wifiPassword[64];    // Adjust the array sizes according to your needs
    char email[64];           // Adjust the array sizes according to your needs
    char profilePassword[64]; // Adjust the array sizes according to your needs
};
FormData user = {"", "", "", ""};
String token = "";
int serverPort = 3001;
bool gotData = false;
int status = WL_IDLE_STATUS;
int statusWifi = WL_IDLE_STATUS;
WiFiClient client;
IPAddress serverIP(51, 68, 172, 36);
WiFiServer server(80);

void setup()
{
    // Initialize serial and wait for port to open:
    Serial.begin(9600);
    while (!Serial)
    {
        ; // wait for serial port to connect. Needed for native USB port only
    }

    Serial.println("Access Point Web Server");

    // check for the WiFi module:
    if (WiFi.status() == WL_NO_MODULE)
    {
        Serial.println("Communication with WiFi module failed!");
        // don't continue
        while (true)
            ;
    }

    String fv = WiFi.firmwareVersion();
    if (fv < WIFI_FIRMWARE_LATEST_VERSION)
    {
        Serial.println("Please upgrade the firmware");
    }

    // by default the local IP address will be 192.168.4.1
    // you can override it with the following:
    // WiFi.config(IPAddress(10, 0, 0, 1));

    // print the network name (SSID);
    Serial.print("Creating access point named: ");
    Serial.println(ssid);
    if (setup)
    {
        setupUserLink();
    }

    statusWifi = WiFi.begin(user.wifiSsid, user.wifiPassword);
    if (status != WL_CONNECTED)
    {
        Serial.println("Couldn't get a WiFi connection");
        // don't do anything else:
        while (true)
            ;
    }
    else
    {
        sendRequestToServer(user);
    }
}

void loop()
{
}

void setupUserLink()
{
    // Create open network. Change this line if you want to create an WEP network:
    status = WiFi.beginAP(ssid, pass);
    if (status != WL_AP_LISTENING)
    {
        Serial.println("Creating access point failed");
        // don't continue
        while (true)
            ;
    }

    // wait 10 seconds for connection:
    delay(10000);

    // start the web server on port 80
    server.begin();
    // you're connected now, so print out the status
    printWiFiStatus();

    while (gotData)
    {
        // compare the previous status to the current status
        if (status != WiFi.status())
        {
            // it has changed update the variable
            status = WiFi.status();

            if (status == WL_AP_CONNECTED)
            {
                // a device has connected to the AP
                Serial.println("Device connected to AP");
            }
            else
            {
                // a device has disconnected from the AP, and we are back in listening mode
                Serial.println("Device disconnected from AP");
            }
        }

        WiFiClient client = server.available(); // listen for incoming clients

        if (client)
        {                                 // if you get a client,
            Serial.println("new client"); // print a message out the serial port
            String currentLine = "";      // make a String to hold incoming data from the client
            while (client.connected())
            { // loop while the client's connected
                if (client.available())
                {                           // if there's bytes to read from the client,
                    char c = client.read(); // read a byte, then
                    Serial.write(c);        // print it out the serial monitor
                    if (c == '\n')
                    { // if the byte is a newline character

                        // if the current line is blank, you got two newline characters in a row.
                        // that's the end of the client HTTP request, so send a response:
                        if (currentLine.length() == 0)
                        {
                            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
                            // and a content-type so the client knows what's coming, then a blank line:
                            client.println("HTTP/1.1 200 OK");
                            client.println("Content-type:text/html");
                            client.println();

                            // the content of the HTTP response follows the header:
                            client.print("<div>");
                            client.print("<h1>Hello from G-Sonde</h1>");
                            client.print("<h2>Provide your wifi and account credentials</h2>");
                            client.print("<form action='/send' method='post' >");
                            client.print("<input type='email' name='email' placeholder='email' required />");
                            client.print("<input type='password' name='password' placeholder='password' required />");
                            client.print("<input type='text' name='ssid' placeholder='Wifi SSID' required />");
                            client.print("<input type='password' name='wifiPassword' placeholder='Wifi Password' required />");
                            client.print("<button type='submit' value='SendData'>Send data</button>");
                            client.print("</form>");
                            client.print("<p>");
                            client.print("<b>We do not gather any information you provide here.</b> <br />");
                            client.print("We only use it to connect your device to your wifi network and to your account.");
                            client.print("</p></div>");

                            // The HTTP response ends with another blank line:
                            client.println();
                            // break out of the while loop:
                            break;
                        }
                        else
                        { // if you got a newline, then clear currentLine:
                            currentLine = "";
                        }
                    }
                    else if (c != '\r')
                    {                     // if you got anything else but a carriage return character,
                        currentLine += c; // add it to the end of the currentLine
                    }

                    // Check to see if the client request was /X
                    if (currentLine.startsWith("POST /send"))
                    {
                        // Lire les données du formulaire
                        String formData = "";
                        while (client.available())
                        {
                            formData += (char)client.read();
                        }

                        // Les données du formulaire commencent après une ligne vide
                        int formDataIndex = formData.indexOf("\r\n\r\n") + 4;
                        if (formDataIndex != -1)
                        {
                            formData = formData.substring(formDataIndex);

                            // Traiter les données du formulaire
                            gotData = processFormData(formData);
                        }
                    }
                }
            }
            // close the connection:
            client.stop();
            Serial.println("client disconnected");
        }
    }
}

bool processFormData(String formData)
{
    // Exemple : imprimer les données dans la console
    Serial.println("Form Data:");
    Serial.println(formData);
    int ssidIndex = formData.indexOf("ssid=");
    int passwordIndex = formData.indexOf("wifiPassword=");
    int emailIndex = formData.indexOf("email=");
    int profilePasswordIndex = formData.indexOf("password=");

    if (ssidIndex != -1 && passwordIndex != -1 && emailIndex != -1 && profilePasswordIndex != -1)
    {
        sscanf(formData.c_str() + ssidIndex, "ssid=%[^&]", user.wifiSsid);
        sscanf(formData.c_str() + passwordIndex, "wifiPassword=%[^&]", user.wifiPassword);
        sscanf(formData.c_str() + emailIndex, "email=%[^&]", user.email);
        sscanf(formData.c_str() + profilePasswordIndex, "password=%s", user.profilePassword);
        return true;
    }
    return false;
}

void printWiFiStatus()
{
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    // print where to go in a browser:
    Serial.print("To see this page in action, open a browser to http://");
    Serial.println(ip);
}

void sendRequestToServer(FormData formData)
{
    Serial.println("Sending request to g-sonde.online");

    if (client.connect(serverIP, serverPort))
    {
        // Form the POST request
        String request = "POST /api/auth/link HTTP/1.1\r\n";
        request += "Host: g-sonde.online:3001\r\n";
        request += "Content-Type: application/x-www-form-urlencoded\r\n";
        request += "Content-Length: " + String(strlen(formData.email) + strlen(formData.profilePassword)) + "\r\n";
        request += "\r\n";
        request += "email=" + String(formData.email) + "&password=" + String(formData.profilePassword);

        // Send the request
        client.print(request);

        // Wait for the server's response
        while (client.connected())
        {
            if (client.available())
            {
                char c = client.read();

                // Print response to serial monitor
                Serial.write(c);

                // Check the response body for token
                if (c == '{')
                {
                    String response = "";
                    while (client.available())
                    {
                        response += (char)client.read();
                    }
                    Serial.println(response);
                    int tokenIndex = response.indexOf("token");
                    if (tokenIndex != -1)
                    {
                        sscanf(response.c_str() + tokenIndex, "token\":\"%[^\"]", token);
                        Serial.println(user.profilePassword);
                        break;
                    }
                }
            }
        }

        // Close the connection
        client.stop();
        Serial.println("Request sent");
    }
    else
    {
        Serial.println("Connection to g-sonde.online failed");
    }
}