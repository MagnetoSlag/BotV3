# BotV3
----------------------------- >> March 5 update <<----------------------------
## 1. Replace the ShopOrder.json file content with the following:
```
{
  "OrderNumber": [
    {
      "OrderTag": 13,
      "Particulars": "Banana Cake",
      "Customer": "SlimeF",
      "CustomerID": "1234",
      "FromChannel": "SlimeKingdom",
      "FromServer": "5678",
      "Status": "unclaim"
    }
  ]
}
```
## 2. Replace the ***>chefnew*** command with the following code:
```
if (command === "chefnew") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send(`${TempUser} couldn't be found!`);
                } else if (TargetAccessLevel >= AccessRight) {          
                    return message.channel.send("You don't have permissions to do this!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 150;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send(`${TempUser} has been hired! Congratulations!`);
                }
                
            } else {
                message.channel.send("Please put someone you want to hire!");
            }           
        } else {
            message.channel.send("You aren't an admin! Heck off >:(");
        }
}
```
## 3. Replace the ***>order*** command with the following code:
```
if (command === "order") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 100) {
            if (message.content.includes(" ")) {
                var ShoppingCart = {
                    OrderTag: "",
                    Particulars: "",
                    Customer: "",
                    CustomerID: "",
                    FromChannel: "",
                    FromServer: "",
                    Status: ""
                };

                var HasOrder = 0;
                for (var i = 0; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                        HasOrder = 1;
                        var UPOTag = OrderBook.OrderNumber[i].OrderTag;
                    }
                }

                if (HasOrder) {
                    message.channel.send("Sorry, please wait for your last order, **" + { UPOTag } + "**, to be delivered before you order something else! Check your order status with `>myorder`");
                } else {
                    let ItemPlaced = message.content.replace(">order", "");
                    ItemPlaced.trim();
                    ShoppingCart.OrderTag = GenOrderTag();
                    ShoppingCart.Particulars = ItemPlaced;
                    ShoppingCart.Customer = message.author.username;
                    ShoppingCart.CustomerID = message.author.id;
                    ShoppingCart.FromChannel = message.channel.id;       
                    ShoppingCart.FromServer = message.guild.id;
                    ShoppingCart.Status = "unclaim";

                    OrderBook.OrderNumber.push(ShoppingCart);
                    FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                        if (err) {
                            console.error(err);
                            message.channel.send("Sorry, your order couldn't be placed! Please try again! (This is not a blacklist error.)");
                        }
                    });
                    const kitchen = Bot.channels.find("id", "415980011548573699");
                    const newOrder = new Discord.RichEmbed()
                        .setColor("#ffefbf")
                        .setDescription(`[Order Information](https://google.ie/)`)
                        .addField(`Order`, message.content.replace('>order ', ''), true)
                        .addBlankField()
                        .addField(`Customer`, `${message.author.username} | ${message.author.id}`, true)
                        .addField(`Server`, `${message.guild.name} | ${message.guild.id}`, true)
                        .addField(`Order ID`, `${ShoppingCart.OrderTag}`, true)
                        .setThumbnail(message.author.avatarURL);
                    kitchen.send(newOrder);
                    message.channel.send(`Thank you for ordering **${ItemPlaced}**!`);
                    message.channel.send(`Your order has been placed with ID: **${ShoppingCart.OrderTag}**.`);
                }

            } else {
                message.channel.send("Please order something! You wouldn't like an empty plate, would you?");
            }

        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal, " + message.author + "!");
        }
}
```
