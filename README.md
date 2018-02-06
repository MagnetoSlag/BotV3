# BotV3
Bot version 3 Feb 6, 2018
Bot V3 added new fields to both GuestBook.json and ShopOrder.json, so pls download and put to your local folder thx!
```
    if (command === "orderlist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            var OrderList = "";
            for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                OrderList = OrderList + OrderBook.OrderNumber[i].OrderTag + ", ";
                //message.channel.send("**Orders:** " + OrderBook.OrderNumber[i].OrderTag);
            }
            message.channel.send("**Orders:** " + OrderList);
        } else {
            message.channel.send("You aren't a chef!");
        }
    }
```
# Updated command -> ***'orderremove'*** and ***'ordercancel'*** pls replace them in bot_v3.js
This will correct the wipe out whole ShopOrder.json file issue when deleting last orderentry
```
if (command === "ordercancel") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 100) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();
                if (OrderBook.OrderNumber.length == 1) {
                    //special handle for only 1 order entry in shoporder.json file
                    if (OrderBook.OrderNumber[1].OrderTag == TempTag) {
                        if (OrderBook.OrderNumber[1].CustomerID == message.author.id) {
                            OrderTagFound = 1;
                            OrderBook.OrderNumber.pop();
                            FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("Sorry, your order couldn't be deleted! Please try again.");
                                }
                            });
                            message.channel.send(`Your order ${TempTag} has been canceled!`);
                        } else {
                            message.channel.send("Sorry, you can't cancel an order that isn't yours.");
                        }
                    }
                } else {
                    for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                        if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                            OrderTagFound = 1;
                            if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                                OrderBook.OrderNumber.splice(i, 1);
                                FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                    if (err) {
                                        console.error(err);
                                        message.channel.send("Sorry, your order couldn't be canceled! Please try again.");
                                    }
                                });
                                message.channel.send(`Your order ${TempTag} has been canceled!`);
                            } else {
                                message.channel.send("Sorry, you can't cancel an order that isn't yours.");
                            }
                        }
                    }
                }
                if (OrderTagFound == 0) {
                    message.channel.send("Sorry, we couldn't find an order. Use `>myorder` to check on your order!");
                }
            } else {
                message.channel.send("Please enter the ID of your order to delete, I can't delete nothing!");
            }
        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal.");
        }
}
```
This is command 'orderremove'
```
if (command === "orderremove") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 150) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();

                //this is a kind of patch, should have better method to prevent deleting all order entry in the shoporder.json file
                //just use it from now on
                if (OrderBook.OrderNumber.length == 1) {
                    //special handle for only 1 order entry in shoporder.json file
                    if (OrderBook.OrderNumber[1].OrderTag == TempTag) {
                        OrderTagFound = 1;
                        OrderBook.OrderNumber.pop();
                        FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                            if (err) {
                                console.error(err);
                                message.channel.send("Sorry, your order couldn't be deleted! Please try again.");
                            }
                        });
                        message.channel.send(`Order **${TempTag}** has been deleted.`);  
                        message.lemChannel.send(`Order **${TempTag}** has been deleted.`);
                    }
                } else {
                    for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                        if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                            OrderTagFound = 1;
                            OrderBook.OrderNumber.splice(i, 1);
                            FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("The order couldn't be deleted. Please try again.");
                                }
                            });
                            message.channel.send(`Order **${TempTag}** has been deleted.`);
                            message.lemChannel.send(`Order **${TempTag}** has been deleted.`);
                        }
                    }
                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the id **${TempTag}**!`);
                }
            } else {
                message.channel.send("Please enter an ID to delete, you can't delete nothing!");
            }
        } else {
            message.channel.send("You aren't a pastry chef!");
        }
}
```
