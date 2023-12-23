const byte OUTPUT_PIN = 3;  
const byte SAMPLES = 1;

int settings[64] = {16633,16607,16584,16563,16544,16527,16512,16499,16487,16476,16467,16458,16450,16443,16437,16431,16426,16422,16418,2296,2270,2247,2226,2208,2191,2176,2163,2151,2140,2130,2122,2114,2107,2101,2095,2090,2086,2082,503,477,454,434,415,398,383,370,358,347,338,329,322,315,308,303,298,293,289,286,283,280,277,275,273,271};
int buffer[SAMPLES];

void setup() 
{
  pinMode (OUTPUT_PIN, OUTPUT);
  Serial.begin(9600);

  TCCR2A = bit (WGM20) | bit (WGM21) | bit (COM2B1); // fast PWM, clear OC2A on compare
}

// the loop routine runs over and over again forever:
void loop() 
{
  // for(byte n=0; n<64; n++)
  for(byte n=0; n<1; n++)
  {
    // if(n!=0)
    // {
    //   Serial.print(",");
    // }
    byte prescaler = settings[n] >> 8;
    byte base = settings[n] & 0xFF;
    if(prescaler == 1)  
    {
      TCCR2B = bit (WGM22) | bit (CS20);
    }
    else if(prescaler == 8)
    {
      TCCR2B = bit (WGM22) | bit (CS21);
    }
    else if(prescaler == 64)
    {
      TCCR2B = bit (WGM22) | bit (CS22);
    }

    OCR2A =  base;                                
    OCR2B = ((base + 1) / 2) - 1;    

    delay(500);
    long sum = 0;
    for(byte i=0; i<SAMPLES; i++)
    {
      buffer[i] = analogRead(A2);  
      sum+=buffer[i];
      delay(100);
    }
    int avg = sum / SAMPLES;

    Serial.print("average : ");
    Serial.print(avg);
    Serial.print(" volt : ");
    Serial.println(avg * 5.0 / 1023);
  }
  Serial.println("EOP");
}
