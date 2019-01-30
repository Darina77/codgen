//--------include section-----------
#include <iostream>
//--------include section end-------


//--------define section-------------
#define Smth 
//--------define section end---------


//--------global vars section-------------
const uint16_t	globalButton1Val = 10; 
//--------global vars section end---------

//--------characteristics table section-------------
const uint16_t	characteristicButton1Pin = 3; //1
const bool 		characteristicButton1ActiveState = 0; //2
const uint16_t 	characteristicButton1ContactDebounceTime = 100; //3
//--------characteristics table section end---------

typedef void (*MyFuncPtrType)(int*, char*);
MyFuncPtrType my_func_ptr;

//---------------
struct elementDescription
{
	unsigned int elementId;								//ID квадрата
	unsigned int elementType; 							//тип элемента
	unsigned int characteristicsNum;					//количество характеристик
	unsigned int outputConnectionsNum;					//количество исходящих соединений
	
    //таблица характеристик
	(struct singleCharacteristic)* characteristicsTable;//указатель на массив структур характеристик, "таблица" 
	
	//таблица исходящих соединений
	(struct outputConnection)* connectionsTable;		//указатель на массив структур исходящих соединений, "таблица"
};

struct singleCharacteristic
{                  
	unsigned int characteristicId;	//ID характеристики
	void * characteristicValuePtr;	//Указатель на значение характеристики (произвольного типа данных)
}; 


struct outputConnection
{                  
    unsigned int outputDotNum;		//Номер выхода в текущем квадрате
    unsigned int targetElementId;	//Номер целевого квадрата
	unsigned int targetInputNum;	//Номер входа в целевом квадрате
}; 


struct packetBetweenElements
{
	unsigned int msgTargetElementId;	//ID целевого элемента
	unsigned int msgTargetInputNum;		//номер входа в целевом элементе
	unsigned int msgDataType;			//Тип данных
	void * msgPayload;					//Указатель на данные
};

//----------------funct section-------------
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
//----------------funct section end---------

void setup ()
{
//--------------setup section----------
pinMode(button1Pin, INPUT);
//--------------setup section end------
}

void loop ()
{
//--------------loop section----------
button1Processing();
//--------------loop section end------
}

int main ()
{
	setup ();
	while (true)
	{
		loop ();
	}
}