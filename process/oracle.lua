NodeWallet = "_186uLmdemgvCaHJ-eHrdrCSPEOU4AWeLr5sHTd7g7M"
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
        Handlers.utils.reply("Recieved request from" .. from .. " to " .. url)(Msg)
    end
)
Send({
    Target = "-o7N0dtFKGZpnitaM7WpKHo6uwZ8KUarugK7RABQmrM",
    Action = "Get-Real-Data",
    Url = "https://dummyjson.com/products"
})
