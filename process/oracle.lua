NodeWallet = "_186uLmdemgvCaHJ-eHrdrCSPEOU4AWeLr5sHTd7g7M"
_VERSION = "0.0.1"
Handlers.add(
    "getData",
    Handlers.utils.hasMatchingTag("Action", "Get-Real-Data"),
    function(Msg)
        if not Log then Log = {} end
        local url = Msg.Tags.Url
        local from = Msg.From
        print(url .. "   from:" .. from .. "   to")
        assert(type(url) == "string", "Url to fetch data is required")
        ao.send({
            Target = NodeWallet,
            Tags = {
                Action = "Get-Data",
                Service = "0rbit",
                Url = url,
                Recipient = from
            }
        })
        table.insert(Log, {
            Message = "Request orbit node to fetch url.",
            Url = url,
            Recipient = from,
            Target = NodeWallet
        })
        Handlers.utils.reply("Recieved get request from" .. from .. " to " .. url)(Msg)
    end
)
Handlers.add(
    "postData",
    Handlers.utils.hasMatchingTag("Action", "Post-Real-Data"),
    function(Msg)
        if not Log then Log = {} end
        local url = Msg.Tags.Url
        local from = Msg.From
        local body = Msg.Body
        print(url .. "   from:" .. from .. "   to")
        assert(type(url) == "string", "Url to fetch data is required")
        ao.send({
            Target = NodeWallet,
            Tags = {
                Action = "Post-Data",
                Service = "0rbit",
                Url = url,
                Recipient = from,
                RequestBody = body
            }
        })
        table.insert(Log, {
            Message = "Request orbit node to post url.",
            Url = url,
            Recipient = from,
            Target = NodeWallet
        })
        Handlers.utils.reply("Recieved post request from" .. from .. " to " .. url)(Msg)
    end
)
Send({
    Target = "WSXUI2JjYUldJ7CKq9wE1MGwXs-ldzlUlHOQszwQe0s",
    Action = "Get-Real-Data",
    Url = "https://dummyjson.com/products"
})
local json = require("json")
Send({
    Target = "WSXUI2JjYUldJ7CKq9wE1MGwXs-ldzlUlHOQszwQe0s",
    Action = "Post-Real-Data",
    Url = "https://dummyjson.com/products/add",
    Body = json.encode({
        title = "BMW Pencil"
    })
})
