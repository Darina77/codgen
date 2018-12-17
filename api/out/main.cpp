//this code add by codgen

//end


//this code add by codgen

//end


//this code add by codgen

//end

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

//this code add by codgen
bool button6565584204532707Processing ()
{
	static bool prevButtonState = !characteristicButton6565584204532707ActiveState;
	bool currentButtonState;
	static uint32_t lastStateChangeTimeMs = 0;
	uint32_t currentTimeMs;
	
	currentTimeMs = millis();
	if ((currentTimeMs - lastStateChangeTimeMs) > characteristicButton6565584204532707ContactDebounceTime)
	{
		currentButtonState = digitalRead (characteristicButton6565584204532707Pin);
		if (currentButtonState != prevButtonState)
		{
			prevButtonState = currentButtonState;
			if (currentButtonState == characteristicButton6565584204532707ActiveState)
			{
				globalEventProcessor (6565584204532707, 0);
			}
			else
			{
				globalEventProcessor (6565584204532707, 1);
			}
		}
	}
}
//end

void setup ()
{
//this code add by codgen
	pinMode (button6565584204532707Pin, INPUT);
//end
}

void loop ()
{
//this code add by codgen
button6565584204532707Processing ();
//end
}

int main ()
{
	setup ();
	while (true)
	{
		loop ();
	}
}