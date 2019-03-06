//---result component---
//main.cpp
//---result component end---

//--------include section-----------
//--------include section end-------


//--------define section-------------
//--------define section end---------


//--------characteristics table section-------------
const int characteristicButton/*--ID--*/Pin = /*--Pin--*/; //1
const bool characteristicButton/*--ID--*/ActiveState = /*--ActiveState--*/; //2
const int characteristicButton/*--ID--*/ContactDebounceTime = /*--ContactDebounceTime--*/; //3
//--------characteristics table section end---------


//--------global vars section-------------
const int globalButton/*--ID--*/Val = /*--Val--*/; 
//--------global vars section end---------


//--------funct section-------------
bool button/*--ID--*/Processing()
{
	static bool prevButtonState = !characteristicButton/*--ID--*/ActiveState;
	bool currentButtonState;
	static int lastStateChangeTimeMs = 0;
	int currentTimeMs;
	
	//currentTimeMs = millis();
	if ((currentTimeMs - lastStateChangeTimeMs) > characteristicButton/*--ID--*/ContactDebounceTime)
	{
		//currentButtonState = digitalRead(characteristicButton/*--ID--*/Pin);
		if (currentButtonState != prevButtonState)
		{
			prevButtonState = currentButtonState;
			if (currentButtonState == characteristicButton/*--ID--*/ActiveState)
			{
				//globalEventProcessor(/*--ID--*/, 0);
			}
			else
			{
				//globalEventProcessor(/*--ID--*/, 1);
			}
		}
	}
}
//--------funct section end---------


//--------setup section---------
//--------setup section end------

	
//--------loop section----------
button/*--ID--*/Processing();
//--------loop section end------