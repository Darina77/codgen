/* --- GENERATED --- */

/* --- GENERATED END ---*/

/* --- GENERATED --- */

/* --- GENERATED END ---*/


/* --- GENERATED --- */

/* --- GENERATED END ---*/

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

/* --- GENERATED --- */
void test_button(void) {

    button/*--ID--*/Processing();
    TEST_ASSERT_EQUAL(0, 0);
}

void button/*--ID--*/TestProcessing() 
{ 
    RUN_TEST(test_button); 
    delay(200);
}
/* --- GENERATED END ---*/

void setup ()
{
/* --- GENERATED --- */
TEST_ASSERT_EQUAL(0, 0);
/* --- GENERATED END ---*/
}

void loop ()
{
/* --- GENERATED --- */
void button/*--ID--*/TestProcessing();
/* --- GENERATED END ---*/
}

int main ()
{
    UNITY_BEGIN();
    setup ();
	while (true)
	{
		loop ();
	}
    UNITY_END();
}
