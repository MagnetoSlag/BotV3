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
