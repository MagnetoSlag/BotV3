# BotV3
----> Feb 20, 2018, updated command ***Orderdeliver*** the order delivered will be send to bot as DM, since my avatar not working on my side, so you may change the message to richembed and dm to the customer if you like. ImgLink[0].url contain the URL,link,invite I am not sure what your invite means but that is the link which connect you to the image upload by the chef:
```
if (command === "orderdeliver") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            if (args.length >= 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();
                const lemChannel = Bot.channels.find("id", "403129323483037707");
                const ImgLink = (message.attachments).array();      //any empty link check?
                
                // ImgLink[0].url contain the URL (link) to the picture where the chef attachted to the msg

                //check that this order has been claimed by this chef before delivery
                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if ((OrderBook.OrderNumber[i].OrderTag == TempTag) && (OrderBook.OrderNumber[i].Status == message.author.id)){
                        OrderTagFound = 1;
                        const TempCustomer = OrderBook.OrderNumber[i].CustomerID;       //this contain the customer ID who placed the order, you can use to construct your richembed msg
                        //should check valid deliver before remove order, assume deliver is valid first
                        if (ImgLink.length > 0) {
                            OrderBook.OrderNumber.splice(i, 1);
                            FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("The order couldn't be delivered. Please try again.");
                                }
                            });
                            //message.channel.send(`Order **${TempTag}** has been delivered`);
                            message.author.send(`Order **${TempTag}** has been delivered (link:` + ImgLink[0].url);
                            
                            //send DM to customer, I have some problem with the rich embed msg with avatar, one of my ac can get it one will cause server error
                           
                            //message.lemChannel.send(`Order **${TempTag}** has been delivered.`);
                        } else {
                            message.author.send('Please deliver goods according to our customer ordered!');
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
------------------------------- <<< END if Feb 20, 2018 update >>> -----------

----> Feb 13, 2018, updated command ***OrderCancel*** without asking for Order Tab, Please replace the command with the following code:
```
if (command === "ordercancel") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 100) {           
                var OrderTagFound = 0;
                //var TempTag = args.shift();
                if (OrderBook.OrderNumber.length == 1) {
                    //special handle for only 1 order entry in shoporder.json file                 
                    if (OrderBook.OrderNumber[1].CustomerID == message.author.id) {
                        OrderTagFound = 1;
                        OrderBook.OrderNumber.pop();
                        FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                            if (err) {
                                console.error(err);
                                message.channel.send("Sorry, your order couldn't be deleted! Please try again.");
                            }
                        });
                        message.channel.send(`Your order has been canceled!`);
                    } else {
                                message.channel.send("Sorry, you can't cancel an order that isn't yours.");
                    }                    
                } else {
                    for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                        if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                            OrderTagFound = 1;
                            OrderBook.OrderNumber.splice(i, 1);
                            FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("Sorry, your order couldn't be canceled! Please try again.");
                                }
                            });
                            message.channel.send(`Your order has been canceled!`);
                        } else {
                            message.channel.send("Sorry, you can't cancel an order that isn't yours.");
                        }                       
                    }
                }
                if (OrderTagFound == 0) {
                    message.channel.send("Sorry, we couldn't find an order. Use `>myorder` to check on your order!");
                }            
        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal.");
        }
    }
```
---> command ***myorder*** also updated to display Chef name if claimed by a chef, please replace with the following code:
```
if (command === "myorder") {
        var AccessRight = CheckPermission(message.author.id);
        var i;
        var HasEntry = 1;

        if (AccessRight >= 100) {
            for (i = 0; i < OrderBook.OrderNumber.length; i++) {
                if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                    HasEntry = 0;
                    message.channel.send(" Here's your order information!");
                    if (OrderBook.OrderNumber[i].Status == "unclaim") {       //order unclaimed
                        myOrder = new Discord.RichEmbed()
                            .setColor("#ffefbf")
                            .setDescription('[Order Information](https://google.ie/)')
                            .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                            .addField(`Customer`, `You!`, true)
                            .addField(`ID`, `${OrderBook.OrderNumber[i].OrderTag}`, true)
                            .addField(`Status`, `Awaiting a chef`, true)
                            .setThumbnail(message.author.avatar);
                        message.channel.send(myOrder);
                        
                    } else {                                                    //order unclaimed
                        //lookup chef name
                        var ChefID = OrderBook.OrderNumber[i].Status;
                        var ChefName = "unclaim";
                        for (var j = 0; j < GangList.Guest.length; j++) {
                            if (GangList.Guest[j].UID == ChefID) {
                                ChefName = GangList.Guest[j].Name;
                                myOrder = new Discord.RichEmbed()
                                    .setColor("#ffefbf")
                                    .setDescription('[Order Information](https://google.ie/)')
                                    .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                                    .addField(`Customer`, `You!`, true)
                                    .addField(`ID`, `${OrderBook.OrderNumber[i].OrderTag}`, true)
                                    .addField(`Status`, `Handled by ${ChefName}`, true)
                                    .setThumbnail(message.author.avatar);
                            }
                        }
                        //incase chef name not found
                        if (ChefName == "unclaim") {
                            myOrder = new Discord.RichEmbed()
                                .setColor("#ffefbf")
                                .setDescription('[Order Information](https://google.ie/)')
                                .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                                .addField(`Customer`, `You!`, true)
                                .addField(`ID`, `${OrderBook.OrderNumber[i].OrderTag}`, true)
                                .addField(`Status`, `Handled by Unknown Chef, pls contact admin!`, true)
                                .setThumbnail(message.author.avatar);
                        }
                        message.channel.send(myOrder);
                    }
                }
            }

            if (HasEntry) {
                message.channel.send("I don't think you've ordered anything yet! Order something with `>order`!");
            }

        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal, " + message.author.user + "!");
        }
    }
```
===> end of update Feb 13, 2018


---> Bot version 3 Feb 6, 2018

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
## Major logic error found in all Admin commands, pls replace the following protion of code in ***ALL*** Admin command, for example:
```
if (command === "blacklist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send("");
```
------- Replace the following line of code vvvvvvvvvvv---------- ----------------
```
                } else if (TargetAccessLevel >= 300) {

                    return message.channel.send("This person can't be blacklisted!");

                } else if (TargetAccessLevel >= 200) {
```
----------------------- WITH THESE CODE vvvvv ----------------------------------
```
                } else if (TargetAccessLevel >= AccessRight){       
                //This means the targer user has higher access right then the user trying to modify him/er
```
---------------------- See example below --------------------------------------
```
                    return message.channel.send("This person can't be blacklisted!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 10;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                        console.log("H")
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
```
So, the finished command ***'blacklist'*** should look like these:
```
if (command === "blacklist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);
                if (TargetAccessLevel == 2) {
                    return message.channel.send("");
                } else if (TargetAccessLevel >= AccessRight) {                           
                    return message.channel.send("This person can't be blacklisted!");
                } else {
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 10;
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                        console.log("H")
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
```
