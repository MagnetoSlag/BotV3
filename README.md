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
