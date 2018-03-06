# BotV3
----------------------------- >> March 6 (4th) Patch <<-------------------------
## 1. Add this function after function CheckPermissionbyName():
```
function CheckPermissionbyID(IDtoLookUp) {
    var RecordFound = 0;
    for (var i = 0; i < GangList.Guest.length; i++) {
        if (GangList.Guest[i].UID == IDtoLookUp) {
            console.log("Target Permisson lookup: " + IDtoLookUp + " AccessLevel: " + GangList.Guest[i].AccessLevel);
            RecordFound = 1;
            return GangList.Guest[i].AccessLevel;
        }
    }
    if (!RecordFound) {
        console.log("Target Permission lookup: " + IDtoLookUp + " failed");
        return 2;
    }
}
```
i.e. like this
```
function CheckPermissionbyName(NametoLookUp) {
    var RecordFound = 0;
    for (var i = 0; i < GangList.Guest.length; i++) {
        if (GangList.Guest[i].Name == NametoLookUp) {
            console.log("Target Permisson lookup: " + NametoLookUp + " AccessLevel: " + GangList.Guest[i].AccessLevel);
            RecordFound = 1;
            return GangList.Guest[i].AccessLevel;
        }
    }

    if (!RecordFound) {
        console.log("Target Permission lookup: " + NametoLookUp + " failed");
        return 2;
    }
}

function CheckPermissionbyID(IDtoLookUp) {
    var RecordFound = 0;
    for (var i = 0; i < GangList.Guest.length; i++) {
        if (GangList.Guest[i].UID == IDtoLookUp) {
            console.log("Target Permisson lookup: " + IDtoLookUp + " AccessLevel: " + GangList.Guest[i].AccessLevel);
            RecordFound = 1;
            return GangList.Guest[i].AccessLevel;
        }
    }
    if (!RecordFound) {
        console.log("Target Permission lookup: " + IDtoLookUp + " failed");
        return 2;
    }
}

function GenOrderTag() {
   baba ba ba ba ba..
```
## 2. Updated admin command:
```
 if (command === "blacklist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyID(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send("");
                } else if (TargetAccessLevel >= AccessRight) {
                    return message.channel.send("This person can't be blacklisted!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].UID == TempUser) {
                            GangList.Guest[i].AccessLevel = 10;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                        console.log("H");
                    });
                    message.channel.send("User blacklisted!");
                }
            } else {
                message.channel.send("Please put someone you want to blacklist!");
            }
        } else {
            message.channel.send("You need to be an admin to perform this task!");
        }
    }

    if (command === "unblacklist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyID(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send("");
                } else if (TargetAccessLevel >= AccessRight) {
                    return message.channel.send("This person shouldn't be blacklisted.");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].UID == TempUser) {
                            GangList.Guest[i].AccessLevel = 100;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send("User unblacklisted!");
                }
            } else {
                message.channel.send("Please put someone you want to unblacklist!");
            }
        } else {
            message.channel.send("You need to be an admin to perform this task!");
        }
    }

    if (command === "chefnew") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyID(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send(`${TempUser} couldn't be found!`);
                } else if (TargetAccessLevel >= AccessRight) {          
                    return message.channel.send("You don't have permissions to do this!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].UID == TempUser) {
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

    if (command === "chefdel") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyID(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send(`${TempUser} couldn't be found!`);
                } else if (TargetAccessLevel >= AccessRight) {
                    return message.channel.send("This person can't be deleted!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].UID == TempUser) {
                            GangList.Guest[i].AccessLevel = 100;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send(`${TempUser} has been removed from the chef list!`);
                }
            } else {
                message.channel.send("Please put someone you want to delete!");
            }
        } else {
            message.channel.send("You aren't an admin! Heck off >:(");
        }
    }

    if (command === "chefadmin") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyID(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send(`${TempUser} couldn't be found!`);
                } else if (TargetAccessLevel >= AccessRight) {
                    return message.channel.send("This person is already an admin!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].UID == TempUser) {
                            GangList.Guest[i].AccessLevel = 200;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send(`Administrative permissions given!`);
                }
            } else {
                message.channel.send("Please put someone you want to give admin!");
            }
        } else {
            message.channel.send("You aren't an admin! Heck off! >:(");
        }
}
```
-----------------------------<< End of March 6 (4th) Path >>---------------------------
----------------------------- >> March 6 (3rd) Patch <<-------------------------
## 1. You may want to add this code at the beginning for your code:
```
Bot.on("ready", () => {
    console.log('Bot Ready with ' + Bot.guilds.size + ' servers running');
    console.log('Bot is up and running');
})
```
i.e. place the above code after function GenOrderTag(), like this:
```
function GenOrderTag() {
    //generates random order id and check for consistency
    var TempTag = Math.floor(Math.random() * 999) + 1;
    var i;
    var OKTag = 0;
    var y = OrderBook.OrderNumber.length;
    console.log("Requested GenOrderTag, assigned: " + TempTag);
    console.log('Array Length: ' + y);
    while (OKTag == 0) {
        i = 0;
        while (i < y) {
            OKTag = 1;
            if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                console.log('Order ID already taken' + TempTag);
                //making a new order id if the one it made already exists
                if (TempTag == 999) {       //makes sure order id is below 1000
                    TempTag = 0;
                } else {
                    TempTag++;
                }
                OKTag = 0;                  //makes sure the new value will be tested for duplication again
                i = y;                      //this will exit the while loop asap instead of using return or break
            } else {
                i++;
            }
        }
        //console.log('GenOrderTag duplication scan completed!');
    }
    //console.log("GenOrderTag Function Done with OrderTag: " + TempTag);
    return TempTag;
}

Bot.on("ready", () => {
    console.log('Bot Ready with ' + Bot.guilds.size + ' servers running');
    console.log('Bot is up and running');
})

Bot.on('message', (message) => { ..ba ba ba baba,,
```

----------------------------- >> March 6 (2nd) Patch <<-------------------------
## 1. Replace this code in command **>orderdeliver**:
```
if (command === "orderdeliver") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            if (args.length >= 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();
                const kitchen = Bot.channels.find("id", "415980011548573699");

                //check that this order has been claimed by this chef before delivery
                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if ((OrderBook.OrderNumber[i].OrderTag == TempTag) && (OrderBook.OrderNumber[i].Status == message.author.id)) {
                        OrderTagFound = 1;
                        const TempCustomer = OrderBook.OrderNumber[i].CustomerID;       //this contain the customer ID who placed the order, you can use to construct your richembed msg
                        const CustomerChannel = OrderBook.OrderNumber[i].FromChannel;    //This is the channel ID of where the customer place order
                        const CustomerGuild = OrderBook.OrderNumber[i].FromServer;      //this is the server ID of where the customer place order
                        let TargetGuild = Bot.guilds.get(CustomerGuild);
                        if (TargetGuild.channels.get(TChannleID).permissionsFor(message.member).hasPermission("CREATE_INSTANT_INVITE")) {
                            TargetGuild.channels.get(CustomerChannel).createInvite().then(invite => message.author.send(invite.url)
                            );
                            OrderBook.OrderNumber.splice(i, 1);
                            FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("The order couldn't be delivered. Please try again.");
                                }
                            });
                            message.channel.send(`Order **${TempTag}** has been delivered`);
                        } else {
                            message.channel.send(`I am sorry, I do not have enough permission on customer guild to let you perform the delivery, order remain undelivered`);
                        }                        
                    }
                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the id **${TempTag}** or you didnt claim it before!`);
                }

            } else {
                message.channel.send("Please enter an ID to deliver, you can't deliver nothing!");
            }
        } else {
            message.channel.send("You aren't a chef!");
        }
}
```
I added check bot permission on target guild before sending delivery invite, hope this work out

-----------------------------<< End of March 6 2nd Patch >>--------------------

----------------------------- >> March 6 Patch <<-----------------------------
## 1.Remove the {} in the following line of code in command **>order**:
instead of:
```
message.channel.send("Sorry, please wait for your last order, **" + { UPOTag } + "**, to be delivered before you order something else! Check your order status with `>myorder`");
```
take out the {}:
```
message.channel.send("Sorry, please wait for your last order, **" + UPOTag + "**, to be delivered before you order something else! Check your order status with `>myorder`");
```
## 2. Inside command **>blacklist** you have changed the code from:
```
FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
    if (err) console.error(err)
});
```
to this code -->
```
FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
    if (err) console.error(err)
    console.log("H")        //you added this line without a ; at the end!!!
});
```
which you missed a ; at the end of the console.log("H") this cause the bot didnt update the blacklisted user permission in the Guestook.json file, that is the reason why blacklisted user can still use commands.

----------------------------- << End of March 6 Patch >>----------------------

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
## 4. Replace the ***>orderdeliver*** with the following code:
```
if (command === "orderdeliver") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            if (args.length >= 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();
                const kitchen = Bot.channels.find("id", "415980011548573699");

                //check that this order has been claimed by this chef before delivery
                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if ((OrderBook.OrderNumber[i].OrderTag == TempTag) && (OrderBook.OrderNumber[i].Status == message.author.id)) {
                        OrderTagFound = 1;
                        const TempCustomer = OrderBook.OrderNumber[i].CustomerID;       //this contain the customer ID who placed the order, you can use to construct your richembed msg
                        const CustomerChannel = OrderBook.OrderNumber[i].FromChannel;    //This is the channel ID of where the customer place order
                        const CustomerGuild = OrderBook.OrderNumber[i].FromServer;      //this is the server ID of where the customer place order
                        let TargetGuild = Bot.guilds.get(CustomerGuild);
                        TargetGuild.channels.get(CustomerChannel).createInvite().then(invite => message.author.send(invite.url)
                        );

                        OrderBook.OrderNumber.splice(i, 1);
                        FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                            if (err) {
                                console.error(err);
                                message.channel.send("The order couldn't be delivered. Please try again.");
                            }
                        });
                        message.channel.send(`Order **${TempTag}** has been delivered`);
                    }
                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the id **${TempTag}** or you didnt claim it before!`);
                }

            } else {
                message.channel.send("Please enter an ID to deliver, you can't deliver nothing!");
            }
        } else {
            message.channel.send("You aren't a chef!");
        }
}
```
----------------------<< End of March 5 update >>---------------------
