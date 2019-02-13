//---result component---
//main
//---result component end---

//--------include section-----------
#include <iostream>
//--------include section end-------


//--------define section-------------
#define Smth 
//--------define section end---------


//--------characteristics table section-------------
const uint16_t	characteristicButton/*--ID--*/Pin = /*--Pin--*/; //1
const bool 		characteristicButton/*--ID--*/ActiveState = /*--ActiveState--*/; //2
const uint16_t 	characteristicButton/*--ID--*/ContactDebounceTime = /*--ContactDebounceTime--*/; //3
//--------characteristics table section end---------


//--------global vars section-------------
const uint16_t	globalButton/*--ID--*/Val = /*--Val--*/; 
//--------global vars section end---------


//--------funct section-------------
//---result component---
//led
//main
//---result component end---
bool button/*--ID--*/Processing()
{
	static bool prevButtonState = !characteristicButton/*--ID--*/ActiveState;
	bool currentButtonState;
	static uint32_t lastStateChangeTimeMs = 0;
	uint32_t currentTimeMs;
	
	currentTimeMs = millis();
	if ((currentTimeMs - lastStateChangeTimeMs) > characteristicButton/*--ID--*/ContactDebounceTime)
	{
		currentButtonState = digitalRead(characteristicButton/*--ID--*/Pin);
		if (currentButtonState != prevButtonState)
		{
			prevButtonState = currentButtonState;
			if (currentButtonState == characteristicButton/*--ID--*/ActiveState)
			{
				globalEventProcessor(/*--ID--*/, 0);
			}
			else
			{
				globalEventProcessor(/*--ID--*/, 1);
			}
		}
	}
}
//--------funct section end---------


//--------setup section----------
pinMode(button/*--ID--*/Pin, INPUT);
//--------setup section end------

	
//--------loop section----------
button/*--ID--*/Processing();
//--------loop section end------