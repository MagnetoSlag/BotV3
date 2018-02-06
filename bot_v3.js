const Discord = require('discord.js');
const Bot = new Discord.Client();
const Config = require('./notebook.js');
const FileHandle = require("fs");
const prefix = ">";
let OrderBook = JSON.parse(FileHandle.readFileSync("./ShopOrder.json", "utf8"));
let GangList = JSON.parse(FileHandle.readFileSync("./GuestBook.json", "utf8"));

function CheckPermission(IDtoLookUp) {
    //performs Access Level Check using ID, will add new user incase no entry found with default Access Level 100

    var ReturnGuest = 0;            //This is a flag indicate rather this is a return guest
    for (var i = 0; i < GangList.Guest.length; i++) {
        if (GangList.Guest[i].UID == IDtoLookUp) {
            //Return guest
            ReturnGuest = 1;
            return GangList.Guest[i].AccessLevel;
        }
    }

    if (!ReturnGuest) {             //Not return guest = new guest :p
        //New Guest, add new profile
        var NewGuestProfile = {
            Name: "",
            UID: "",
            AccessLevel: ""
        };
        //double safty for invalid ID
        var DiskCordUserProfile = Bot.users.get(IDtoLookUp);        //The word Discord is reserved, so I use DiskCord instead, not a typo
        console.log(`This is DiskCordUerProfile: ` + DiskCordUserProfile);
        if (!DiskCordUserProfile) {                                 //Non null return means ID input is a valid Didscord user ID
            console.log(`Invalid Discord ID!! ` + IDtoLookUp);
            return 1;       // Access Level below 10 now use as error code handling. 1 = invalid UID input
        } else {
            //Discord ID number verified by cross checking with valid user name
            NewGuestProfile.Name = DiskCordUserProfile.username;
            NewGuestProfile.UID = DiskCordUserProfile.id;
            NewGuestProfile.AccessLevel = 100;         //init access level for new user is 100

            GangList.Guest.push(NewGuestProfile);
            FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                if (err) console.error(err)
            });
            console.log(`New User added: ` + IDtoLookUp + ` UserName: ` + NewGuestProfile.Name + ` AccessLevel: ` + NewGuestProfile.AccessLevel);
            return NewGuestProfile.AccessLevel;
        }
    }
}

function CheckPermissionbyName(NametoLookUp) {
    //Perform Access Level Check using username, will NOT add new record
    var RecordFound = 0;
    for (var i = 0; i < GangList.Guest.length; i++) {
        if (GangList.Guest[i].Name == NametoLookUp) {
            console.log("Target Permisson lookup: " + NametoLookUp + " AccessLevel: " + GangList.Guest[i].AccessLevel);
            RecordFound = 1;        //found record with input username
            return GangList.Guest[i].AccessLevel;
        } 
    }

    if (!RecordFound) {
        console.log("Traget Permission lookup: " + NametoLookUp + " FAILED!");
        return 2;                   //error code 2 = target permission check failed
    }
}

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

Bot.on('message', (message) => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    /* test order that checks if user is blacklisted
    if (command === 'prototype') {
        var user = bot.users.get(message.author.id);
        var AccessRight = CheckPermission(user.id);
        if (AccessRight >= 100) {
            message.channel.send("Sorry this command is under construction!");
        } else {    
            message.channel.send(`I'm sorry, you were blacklisted, ${user}!`);
        }
    }
    */

    // ---------------- CUSTOMER COMMANDS ----------------

    if (command === "server") {
        message.channel.send(`${message.author.user} Here's an invite to our server! putinvitelinkhere`);
    }

    if (command === "invite") {
        message.channel.send(`${message.author.user} Here's an invite for the bot! putinvitelinkhere`);
    }

    if (command === "help") {
        message.channel.send(`Help sent to your DMs! :cake:`);
        const help = new Discord.RichEmbed()
            .setColor("#ffefbf")
            .setDescription(`[Commands](https://google.ie/)`)
            .addField(`>order`, "Order some cake! | `>order strawberry cheesecake`", true)
            .addField(`>myorder`, "Check up on how your order is doing! | `>myorder`", true)
            .addField(`>ordercancel`, "Cancel your order, and reorder! | `>ordercancel 517`")
            .addField(`>feedback`, "Leave us some feedback! | `>feedback cake is good. i like cake.`", true)
            .addField(`>server`, "Invite to the bot's server, where all the cake is made! | `>server`", true)
            .addField(`>invite`, "The invite link for this bot! Spread the icing! | `>invite`", true)
            .setThumbnail(Bot.avatarURL);
        message.author.send(help);
    }

    if (command === "chefhelp") {

        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 150) {
            message.channel.send(`Help sent to your DMs! :cake:`);
            const help = new Discord.RichEmbed()
                .setColor("#ffefbf")
                .setDescription(`[Chef Commands](https://google.ie/)`)
                .addField(`>orderclaim`, "Claims an order, no one else can take it afterwards, be sure you have time to do this! | `>orderclaim 517`", true)
                .addField(`>orderremove`, "Removes an order from the list. | `>orderremove 517 Strawberries are not cakes, please order a cake!`", true)
                .addField(`>orderdeliver`, "Delivers an order, you must claim this order before delivering it. Delivering it deletes it from the order list. | `>orderdeliver 517`")
                .addField(`>orderlist`, "Gets all the order IDs. | `>orderlist`", true)
                .addField(`>orderinfo`, "Gets the information of an order. | `>orderinfo 517`", true)
                .setThumbnail(Bot.avatarURL);
            message.author.send(help);
        } else {
            message.channel.send("You aren't a chef!");
        }
    }

    if (command === "adminhelp") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 250) {
            message.channel.send(`Help sent to your DMs! :cake:`);
            const help = new Discord.RichEmbed()
                .setColor("#ffefbf")
                .setDescription(`[Chef Commands](https://google.ie/)`)
                .addField(`>chefnew`, "Claims an order, no one else can take it afterwards, be sure you have time to do this! | `>orderclaim 517`", true)
                .addField(`>chefdel`, "Deletes a chef because fuck them | `>chefdel `", true)
                .addField(`>chefadmin`, "Gives someone administrator permissions. pls no give randomly lol | `>chefadmin 302999514841612299`")
                .addField(`>blacklist`, "Blacklists someone, prevents them from using commands apart from `>server` | `blacklist 160126799777366020 Song blacklisted for not giving me potatoes.`", true)
                .setThumbnail(Bot.avatarURL);
            message.author.send(help);
        } else {
            message.channel.send("You aren't an admin! Heck off >:(");       
        }
    }

    if (command === "feedback") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 100) {
            if (message.content.includes(" ")) {
                const lemChannel = Bot.channels.find("id", "403129323483037707");
                const feedback = new Discord.RichEmbed()
                    .setColor("#ffefbf")
                    .addField(`Someone left some feedback!`, message.content.replace('>feedback ', ''), false)
                    .addBlankField()
                    .addField(`Customer`, `${message.author.username} | ${message.author.id}`, true)
                    .addField(`Server`, `${message.guild.name} | ${message.guild.id}`, true)
                    .setThumbnail(message.author.avatarURL);
                lemChannel.send(feedback);
                message.channel.send("Feedback sent, thank you for leaving some! :cake:");
            } else {
                message.channel.send("Please write your feedback!");
            }
        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal, " + message.author.user + "!");
        }
    }

    if (command === "order") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 100) {
            if (message.content.includes(" ")) {
                var ShoppingCart = {
                    OrderTag: "",
                    Particulars: "",
                    Customer: "",
                    CustomerID: "",
                    FromServer: "",
                    Status: ""
                };

                //Place previous undelivered order check before entering new order below
                var HasOrder = 0;
                for (var i = 0; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                        HasOrder = 1;
                        var UPOTag = OrderBook.OrderNumber[i].OrderTag;
                    }
                }

                if (HasOrder) {
                    message.channel.send("Sorry, please wait for your last order, **" + {UPOTag} + "**, to be delivered before you order something else! Check your order status with `>myorder`");
                } else {
                    let ItemPlaced = message.content.replace(">order", "");
                    ItemPlaced.trim();
                    ShoppingCart.OrderTag = GenOrderTag();
                    ShoppingCart.Particulars = ItemPlaced;
                    ShoppingCart.Customer = message.author.username;
                    ShoppingCart.CustomerID = message.author.id;
                    ShoppingCart.FromServer = message.guild.name;
                    ShoppingCart.Status = "unclaim";

                    OrderBook.OrderNumber.push(ShoppingCart);
                    FileHandle.writeFileSync("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                        if (err) {
                            console.error(err);
                            message.channel.send("Sorry, your order couldn't be placed! Please try again! (This is not a blacklist error.)");
                        }
                    });
                    const lemChannel = Bot.channels.find("id", "403129323483037707");
                    const newOrder = new Discord.RichEmbed()
                        .setColor("#ffefbf")
                        .setDescription(`[Order Information](https://google.ie/)`)
                        .addField(`Order`, message.content.replace('>order ', ''), true)
                        .addField(`Customer`, `"${message.author.username} | ${message.author.id}`, true)
                        .addField(`Server`, `${message.guild.name} | ${message.guild.id}`, true)
                        .addField(`Order ID`, `${ShoppingCart.OrderTag}`, true)
                        .setThumbnail(message.author.avatarURL);
                        lemChannel.send(newOrder);
                        message.channel.send(`Thank you for ordering **${ItemPlaced}**!`);
                        message.channel.send(`Your order has been placed with ID: **${ShoppingCart.OrderTag}**.`);
                }

            } else {
                message.channel.send("Please order something! You wouldn't like an empty plate, would you?");
            }

        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal, " + message.author.user + "!");
        }
    }

    if (command === "myorder") {
        var AccessRight = CheckPermission(message.author.id);
        var i;
        var HasEntry = 1;

        if (AccessRight >= 100) {
            for (i = 0; i < OrderBook.OrderNumber.length; i++) {
                if (OrderBook.OrderNumber[i].CustomerID == message.author.id) {
                    message.channel.send(i + " Here's your order information!")
                    myOrder = new Discord.RichEmbed()
                        .setColor("#ffefbf")
                        .setDescription('[Order Information](https://google.ie/)')
                        .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                        .addField(`Customer`, `You!`, true)
                        .addField(`ID`, `${OrderBook.OrderNumber[i].OrderTag}`, true)
                        .addField(`Status`, `Unclaimed`, true)
                        .setThumbnail(message.author.avatar); //can you set customeravatar too

                    message.channel.send(myOrder);
                    HasEntry = 0;
                }
            }

            if (HasEntry) {
                message.channel.send("I don't think you've ordered anything yet! Order something with `>order`!");
            }

        } else {
            message.channel.send("You were blacklisted, please use the `>server` command to join our server and DM an admin to appeal, " + message.author.user + "!");
        }
    }

    if (command === "ordercancel") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 100) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();

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

    //---------------- CHEF COMMANDS ----------------

    if (command === "orderclaim") {
        var AccessRight = CheckPermission(message.author.id);
         if (AccessRight >= 150) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();

                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                        OrderTagFound = 1;
                        if (OrderBook.OrderNumber[i].Status == "unclaim") {
                            OrderBook.OrderNumber[i].Status = message.author.id;
                            FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                                if (err) {
                                    console.error(err);
                                    message.channel.send("The order couldn't be accepted. Please try again. (If you see this multiple times, delete the order, if that doesn't work, contact an admin.");
                                }
                            });

                            message.channel.send(`Order **${TempTag}** accepted!`);
                        } else {
                            message.channel.send(`**${TempTag}** already been claimed.`);
                        }
                    }
                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the ID **${TempTag}!**`);
                }
            } else {
                message.channel.send(`Please enter an ID to claim!`);
            }
         } else {
            message.channel.send("You aren't a pastry chef!");
         }
    }

    if (command === "orderremove") {
        var AccessRight = CheckPermission(message.author.id);

        if (AccessRight >= 150) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();

                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                        OrderTagFound = 1;
                        OrderBook.OrderNumber.splice(i, 1);
                        FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                            if (err) {
                                console.error(err);
                                message.channel.send("The order couldn't be deleted. Please try again.");
                            }
                        });

                        message.channel.send(`Order **${TempTag}** has been deleted.`);
                        message.lemChannel.send(`Order **${TempTag}** has been deleted.`);
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

    if (command === "orderinfo") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();

                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                        if (OrderBook.OrderNumber[i].Status == "unclaim") {
                            OrderTagFound = 1;                  //this is to prevent a record not found msg trigger below
                            orderInfo = new Discord.RichEmbed()
                                .setColor("#ffefbf")
                                .setDescription('[Order Information](https://google.ie/)')
                                .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                                .addField(`Customer`, `${OrderBook.OrderNumber[i].Customer}`, true)
                                .addField(`Server`, `${OrderBook.OrderNumber[i].FromServer}`, true)
                                .addField(`ID`, `${TempTag}`, true)
                                .addField(`Status`, `Unclaimed`, true)
                                .setThumbnail(message.author.avatarURL);                                //can you set customeravatar

                            message.channel.send(orderInfo);
                        } else {
                            OrderTagFound = 1;                  //this is to prevent a record not found msg trigger below
                            var DiskCordUserProfile = Bot.users.get(OrderBook.OrderNumber[i].Status);        //The word Discord is reserved, so I use DiskCord instead, not a typo
                            if (!DiskCordUserProfile) {         //This means using ID status cannot search for a valid user name, so display userID instead
                                orderInfo = new Discord.RichEmbed()
                                    .setColor("#ffefbf")
                                    .setDescription('[Order Information](https://google.ie/)')
                                    .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                                    .addField(`Customer`, `${OrderBook.OrderNumber[i].Customer}`, true)
                                    .addField(`Server`, `${OrderBook.OrderNumber[i].FromServer}`, true)
                                    .addField(`ID`, `${TempTag}`, true)
                                    .addField(`Status`, `Accepted by ${OrderBook.OrderNumber[i].Status}`, true) //help on StatusUser please, i want this to show customer's username not id (normal is message.author.username)
                                    .setThumbnail(message.author.avatarURL);                                    //help on CustomerAvatar too, i want this to show the customer's avatar (normal is message.author.avatarURL)
                              // no CustomerAvator show because you missed ^ this ; at the end of RichEmbed() statment, remember to add next time
                            } else {
                                orderInfo = new Discord.RichEmbed()
                                    .setColor("#ffefbf")
                                    .setDescription('[Order Information](https://google.ie/)')
                                    .addField(`Order`, `${OrderBook.OrderNumber[i].Particulars}`, true)
                                    .addField(`Customer`, `${OrderBook.OrderNumber[i].Customer}`, true)
                                    .addField(`Server`, `${OrderBook.OrderNumber[i].FromServer}`, true)
                                    .addField(`ID`, `${TempTag}`, true)
                                    .addField(`Status`, `Accepted by ${DiskCordUserProfile.username}`, true) //help on StatusUser please, i want this to show customer's username not id (normal is message.author.username)
                                    .setThumbnail(message.author.avatarURL);                                   
                            }
                            message.channel.send(orderInfo);
                        }

                    }

                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the id **${TempTag}**!`);
                }

            } else {
                message.channel.send("Please enter an ID to see the info for!");
            }
        } else {
            message.channel.send("You aren't a pastry chef!");
        }
    }

    if (command === "orderdeliver") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            if (args.length == 1) {
                var OrderTagFound = 0;
                var TempTag = args.shift();
                for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                    if (OrderBook.OrderNumber[i].OrderTag == TempTag) {
                        OrderTagFound = 1;
                        OrderBook.OrderNumber.splice(i, 1);
                        FileHandle.writeFile("./ShopOrder.json", JSON.stringify(OrderBook), (err) => {
                            if (err) {
                                console.error(err);
                                message.channel.send("The order couldn't be delivered. Please try again.");
                            }
                        });

                        message.channel.send(`Order **${TempTag}** has been deleted.`);
                        message.lemChannel.send(`Order **${TempTag}** has been deleted.`);
                    }
                }

                if (OrderTagFound == 0) {
                    message.channel.send(`There's no order with the id **${TempTag}**!`);
                }

            } else {
                message.channel.send("Please enter an ID to delete, you can't delete nothing!");
            }
        } else {
            message.channel.send("You aren't a chef!");
        }
    }

    if (command === "orderlist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 150) {
            for (var i = 1; i < OrderBook.OrderNumber.length; i++) {
                message.channel.send("**Orders:** " + OrderBook.OrderNumber[i].OrderTag);
            }
        } else {
            message.channel.send("You aren't a chef!");
        }
    }

    //---------------- ADMIN COMMANDS ----------------

    if (command === "blacklist") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            //Author has sufficient right to execute this command, now check for user exist or not
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);        //using a function to check username is valid and return traget access level
                //console.log("Function return target: " + TempUser + " AccessLevel:" + TargetAccessLevel);
                if (TargetAccessLevel == 2) {
                    //No such username found in Guest Book
                    return message.channel.send("Sorry username **" + TempUser + "** Not Found!!");
                } else if (TargetAccessLevel >= 300) {
                    //Cannot blacklist God
                    return message.channel.send("Sorry a God cannot be blacklisted!");
                } else if (TargetAccessLevel >= 200) {
                    //Cannot blacklist God
                    return message.channel.send("Sorry an Admin can only removed by a God!");
                } else {
                    //ok to blacklist
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 10;     //blacklist user to 10
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send("User blacklisted!");
                }
            } else {
                message.channel.send("Please put someone you want to blacklist!");
            }
        } else {
            // insufficent right to execute command
            message.channel.sed("You need to be an admin to perform this task!");
        }
    }

    if (command === "chefnew") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            //Author has sufficient right to execute this command, now check for user exist or not
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);        //using a function to check username is valid and return traget access level
                //console.log("Function return target: " + TempUser + " AccessLevel:" + TargetAccessLevel);
                if (TargetAccessLevel == 2) {
                    //No such username found in Guest Book
                    return message.channel.send("Sorry username **" + TempUser + "** Not Found!!");
                } else if (TargetAccessLevel >= 300) {
                    //Cannot Demote God
                    return message.channel.send("Sorry a God cannot be demoted!");
                } else if (TargetAccessLevel >= 200) {
                    //Cannot demote other admin 
                    return message.channel.send("Sorry an Admin can only removed by a God!");
                } else {
                    //ok to blacklist
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 150;     //chef has access level 150
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send("User: " + TempUser + "hired as new chef!!");
                }
                message.channel.send("Please put someone you want to hire!");
            }
        } else {
            message.channel.send("You aren't an admin! Heck off >:(");
        }
    }

    if (command === "chefdel") {
        var AccessRight = CheckPermission(message.author.id);
        if (AccessRight >= 200) {
            //Author has sufficient right to execute this command, now check for user exist or not
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);        //using a function to check username is valid and return traget access level
                //console.log("Function return target: " + TempUser + " AccessLevel:" + TargetAccessLevel);
                if (TargetAccessLevel == 2) {
                    //No such username found in Guest Book
                    return message.channel.send("Sorry username **" + TempUser + "** Not Found!!");
                } else if (TargetAccessLevel >= 300) {
                    //Cannot delete God
                    return message.channel.send("Sorry a God cannot be deleted!");
                } else if (TargetAccessLevel >= 200) {
                    //Cannot delete admin
                    return message.channel.send("Sorry an Admin can only removed by a God!");
                } else {
                    //ok to delete
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 100;     //normal user access level is 100
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send(`<@${message.content}> has been removed from the chef list!`);
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
            //Author has sufficient right to execute this command, now check for user exist or not
            if (args.length == 1) {
                var TempUser = args.shift();
                var TargetAccessLevel = CheckPermissionbyName(TempUser);        //using a function to check username is valid and return traget access level
                //console.log("Function return target: " + TempUser + " AccessLevel:" + TargetAccessLevel);
                if (TargetAccessLevel == 2) {
                    //No such username found in Guest Book
                    return message.channel.send("Sorry username **" + TempUser + "** Not Found!!");
                } else if (TargetAccessLevel >= 300) {
                    //Cannot demote God
                    return message.channel.send("Sorry a God is already an Admin!");
                } else if (TargetAccessLevel >= 200) {
                    //Cannot resign Admin
                    return message.channel.send("Sorry this user is already an Admin!");
                } else {
                    //ok to blacklist
                    for (var i = 0; i < GangList.Guest.length; i++) {
                        if (GangList.Guest[i].Name == TempUser) {
                            GangList.Guest[i].AccessLevel = 200;     //Admin access level is 200
                        }
                    }
                    FileHandle.writeFileSync("./GuestBook.json", JSON.stringify(GangList), (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send("User: " + TempUser + " Promoted to an Admin!");
                }
            } else {
                message.channel.send("Please put someone you want to give admin!");
            }
        } else {
            message.channel.send("You aren't an admin! Heck off! >:(");
        }
    }
});

Bot.login(Config.my_token);

console.log('Bot is up and running');