//--------include section-----------

//--------include section end-------


//--------define section-------------

//--------define section end---------


//--------global vars section-------------

//--------global vars section end---------

//--------funct section-------------
void test_button(void) {

    button/*--ID--*/Processing();
    TEST_ASSERT_EQUAL(0, 0);
}

void button/*--ID--*/TestProcessing() 
{ 
    RUN_TEST(test_button); 
    delay(200);
}
//--------funct section end---------

//--------setup section----------
TEST_ASSERT_EQUAL(0, 0);
//--------setup section end------

//--------loop section----------
void button/*--ID--*/TestProcessing();
//--------loop section end------
	