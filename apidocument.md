<!-- all theapi in your document -->

//page1

1)List of city
http://localhost:9800/location

2)List of restaurant
http://localhost:9800/restaurants

3)List of Restaurant wrt to City
http://localhost:9800/restaurants?stateId=1

4)List of meal type
http://localhost:9800/mealType


//Page2

1)Restaurant wrt to meal
http://localhost:9800/restaurants?mealId=1

2)Restaurant wrt to meal & cuisine
http://localhost:9800/filter/3?cuisineId=4

3)Restaurant wrt to meal & cost
http://localhost:9800/filter/3?hcost=1500&lcost=200

4)Sort on basis of cost
http://localhost:9800/filter/3?sort=-1

//Page3

1)Details of restaurant
http://localhost:9800/details/9

2)Menu wrt to restaurant
http://localhost:9800/menu/9

//Page4

1)Menu Details (POST)
http://localhost:9800/menuItem body { "id":[ 11,34,23,9 ] }

2)Place Order (POST)
http://localhost:9800/placeOrder body { "orderId": 3, "name": "Amit", "email": "amit@gmail.com", "address": "Hom 35", "phone": 8934645457, "cost": 833, "menuItem": [ 11,34,23 ] }

//Page5

1)List of orders
http://localhost:9800/orders

2)List of orders wrt to email
http://localhost:9800/orders?email=a@a.com

3)Update Payement Details (PUT)
http://localhost:9800/updateOrder/64 body { "status":"TXN_SUCCESS", "bank_name":"HDFC", "date":"10/11/2022" }

4)Delete Order (Delete)
http://localhost:9800/deleteOrder/636f6d0f1fc0c04a6e729cd7