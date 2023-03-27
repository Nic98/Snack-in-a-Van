**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository
# Deliverable 3 Front-end implementation and login feature

**view the webpage in different perspectives**
We designed the pages in iPhone X view but the features are also accessible in normal browser view. <br />
To view it in the perspective of iphone X, right click anywhere on the web page and select "inspect", <br />
and on the top left of the inpect section, next to the "Elements" bar, there's a tablet icon, click on <br />
it and you can now view the pages in the iPhone x perspective. <br />


**Datebase access** <br />
Since .env file doesn't upload with commits, the mongodb authentification information is provided below: <br />

MONGO_USERNAME=yichao <br />
MONGO_PASSWORD=Yyc741108 <br />

**Customer Login** <br />
We've had a few accounts to try the login feature already, here is one of them: <br />
email: frank08241@gmail.com <br />
password: Yyc741108 <br />
We also implemented the register function, if you want to have your own account, feel free to 
register your own one

**View menu of snacks** <br />
Navigate to Customer page -> menu and you'll see all the items. Alternatively, you can 
also visit this url directly: https://vendorapp-deliverable3.herokuapp.com/customer/menu <br />

**Order three different snacks** <br />
Simply click on the "+" button next to the snacks and click on "add to cart", you will be able to add
your product to the cart. You can see how many items you've added to the cart by checking the number 
next to the cart icon. By clicking the cart icon, you will see your cart details, you will not be able to
delete the items you don't want from cart yet. To confirm your order, click on "PROCEED TO CHECK OUT".<br />

Notice: you may find there's 3 options to choose the size of the product before you click on "add to cart",
this feature is not implemented yet so please ignore it. <br />

**View order details** <br />
After you finish checkout, you will be taken to your order history page where you can view all your orders,
it will show the deatails and status of the orders. <br />

**Alternatively, while you're on "menu" page and logged in, you can navigate to your dashboard by simply clicking 
on the "Hi, xxx" sentence on the top of the "menu" page. On that page, you can navigate to your order history page
as well. You will also be able to log out on your dashboard page. You will have to log out if you want to log onto 
another account, otherwise your browser is going to remember your login status forever, restarting your laptop 
wouldn't work**





