#define Usb 1
//#define Wireless 2

#ifdef Wireless
#include <VirtualWire.h>
#endif
#include <RGBLedMatrix.h>

//Pin Declarations
#define Register DDRA
#define Port PORTA
#define LatchPin 0
#define switchModeBt 24
#define playBt 25
#ifdef Wireless
#define RadioRxPin 26
#define RadioTxPin 27
#endif

RGBLedMatrix ledMatrix(&Register, &Port, LatchPin);

byte colors[8][3],
	eqMode = 0;

unsigned long lastColorGen = 0;

void genColors() {
	for(byte x=0; x<8; x++) {
		for(byte c=0; c<3; c++) {
			colors[x][c] = random(0, 64 + (x * 192 / 8)); 
		}
	}
	lastColorGen = millis();
}

#define controlEventPlay 0
#define controlEventPrev 1
#define controlEventNext 2

void sendControlEvent(byte n) {
	#ifdef Usb
	Serial.write(3);
	Serial.write(255);
	Serial.write(2);
	Serial.write(n);
	#endif
	#ifdef Wireless
	uint8_t buf[3] = {255, 2, n};
	vw_send(buf, 3);
	#endif
}

void setup() {
	genColors();
	pinMode(switchModeBt, INPUT_PULLUP);
	pinMode(playBt, INPUT_PULLUP);

	SPI.setBitOrder(MSBFIRST);
    SPI.begin();

    randomSeed(analogRead(A0));

	cli(); //stop interrupts

	TCCR2A = 0;
	TCCR2B = 0;
	TCCR2A |= (1 << WGM21);
	TCCR2B |= (1 << CS11);
	OCR2A = round(((float) F_CPU / 8)/((float) 132*((float) 64)))-1;
	TIMSK2 |= (1 << OCIE2A);

	sei(); //allow interrupts

	#ifdef Usb
	//Serial.begin(115200);
	Serial.begin(19200);

	//EAT Serial crap....
	while(!Serial.available()) {}
	Serial.read();
	#endif

	#ifdef Wireless
	vw_set_rx_pin(RadioRxPin);
	vw_set_tx_pin(RadioTxPin);
	vw_setup(1000);
	vw_rx_start();
	#endif
}

#ifdef Usb
uint8_t serialBuf[10],
	serialBuflen = NULL,
	serialBufindex = 0;
#endif

#ifdef Wireless
uint8_t radioBuf[VW_MAX_MESSAGE_LEN],
	radioBuflen = VW_MAX_MESSAGE_LEN;
#endif

void renderEq(uint8_t * buf, bool leaveBlanks = false) {
	for(byte x=0; x<8; x++) {
		for(byte y=0; y<8; y++) {
			if(round((float) buf[x + 2] * 0.08) > y) ledMatrix.setPixel(x, 7 - y, colors[x][0], colors[x][1], colors[x][2]);
			else if(!leaveBlanks || buf[x + 2] == y) ledMatrix.setPixel(x, 7 - y, 0, 0, 0);		
		}	
	}
}

void processReq(byte type) {
	uint8_t * buf;
	#ifdef Usb
	type == Usb && (buf = serialBuf);
	#endif
	#ifdef Wireless
	type == Wireless && (buf = radioBuf);
	#endif 
	switch(buf[1]) {
		case 1: //EQ
			switch(eqMode) {
				case 0:
					renderEq(buf);
				break;
				case 1:
				case 2:
				case 3:
				case 4:
					byte x = 0,
						y = 0,
						s = 8;

					for(int i=7; i>0; i-=2) {
						const byte v = round(((float) (buf[i + 2] + buf[i + 1]) / 2) * 0.08),
							blank[3] = {0, 0, 0},
							* color = v > random(0, 2) ? colors[v - 1] : blank;

						for(byte xi=0; xi<s; xi++) {
							for(byte yi=0; yi<s; yi++) {
								ledMatrix.setPixel(x + xi, y + yi, color[0], color[1], color[2]);
							}
						}
						x++;
						y++;
						s -= 2;
					}
					if(eqMode == 2 || eqMode == 3) {
						if(eqMode == 3) genColors();
						renderEq(buf, true);
					}
					if(eqMode == 4) genColors();
			}
	}
}

void loop(void) {
	#ifdef Usb
	while(Serial.available()) {
		if(serialBuflen == NULL) {
			serialBuflen = Serial.read();
		} else {
			serialBuf[serialBufindex] = Serial.read();
			serialBufindex++;
			if(serialBufindex == serialBuflen) {
				serialBufindex = 0;
				serialBuflen = NULL;
				processReq(Usb);
			}
		}
	}
	#endif
	#ifdef Wireless
	if(vw_have_message() && vw_get_message(radioBuf, &radioBuflen)) {
		processReq(Wireless);
	}
	#endif
	if(digitalRead(switchModeBt) == LOW) {
		eqMode++;
		eqMode > 4 && (eqMode = 0);
		genColors();
		ledMatrix.clear();
		while(digitalRead(switchModeBt) == LOW) {} //wait until bt release
	}
	if(digitalRead(playBt) == LOW) {
		sendControlEvent(controlEventPlay);
		while(digitalRead(playBt) == LOW) {} //wait until bt release
	}
	if(millis() - lastColorGen > 15000) genColors();
}

//LedMatrix multiplex timer interrupt
ISR(TIMER2_COMPA_vect) {
	ledMatrix.update();
}
