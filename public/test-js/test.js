$(function(){
	test("a basic test example", function() {
	  ok( true, "this test is fine" );
	  var value = "hello";
	  equal( value, "hello", "We expect value to be hello" );
	});

  test("startup", function(){
    startup();
  });
});