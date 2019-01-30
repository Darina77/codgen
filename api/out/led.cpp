//--------include section-----------

//--------include section end-------


//--------define section-------------

//--------define section end---------


//--------characteristics table section-------------
const uint16_t	characteristicButton/*--ID--*/Pin = 3/*--Pin--*/; //1
const bool 		characteristicButton/*--ID--*/ActiveState = 0/*--ActiveState--*/; //2
const uint16_t 	characteristicButton/*--ID--*/ContactDebounceTime = 100/*--ContactDebounceTime--*/; //3
//--------characteristics table section end---------


//--------global vars section-------------

//--------global vars section end---------


//--------funct section-------------
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
//---result component---
//led
//main
//---result component end---
bool button1Processing()
{
	static bool prevButtonState = !characteristicButton1ActiveState;
	bool currentButtonState;
	static uint32_t lastStateChangeTimeMs = 0;
	uint32_t currentTimeMs;
	
	currentTimeMs = millis();
	if ((currentTimeMs - lastStateChangeTimeMs) > characteristicButton1ContactDebounceTime)
	{
		currentButtonState = digitalRead(characteristicButton1Pin);
		if (currentButtonState != prevButtonState)
		{
			prevButtonState = currentButtonState;
			if (currentButtonState == characteristicButton1ActiveState)
			{
				globalEventProcessor(1, 0);
			}
			else
			{
				globalEventProcessor(1, 1);
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