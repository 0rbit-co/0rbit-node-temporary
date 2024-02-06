if name ~= "Dummy Orcale" then
    name = "Dummy Oracle"
end

if not rates then
    rates = {}
end

Name = Name or "Dummy Oracle"
Rates = Rates or {}

Handlers.add(
    "getTokenPrice",
    Handlers.utils.hasMatchingTag("Action", "Get-token-price"),
    function(msg)
        assert(type(msg.Tags.TokenName) == "string", "Token Name for fetching price is required")

        -- TODO: Only send the following if the token name array have something new which is not already in the Rates table
        -- else reply with the token price from the current Rates state
        ao.send({
            Target = "DIf3hBBaJEaDlmljqgKue5JfXnySwr2vq0CdPnmMuIU",
            Tags = {
                Action = "Get-Price",
                Token = msg.Tags.TokenName
            }
        })
    end
)

Handlers.add(
    "getData",
    Handlers.utils.hasMatchingTag("Action", "Get-real-data"),
    function(Msg)
        local url = Msg.Tags.Url
        local from = Msg.Tags.From
        print(from)
        assert(type(url) == "string", "Url to fetch data is required")
        ao.send({
            Target = "_186uLmdemgvCaHJ-eHrdrCSPEOU4AWeLr5sHTd7g7M",
            Tags = {
                Action = "Get-Data",
                Url = url,
                RequestedBy = from
            }
        })
        ao.log({
            Message = "Request orbit node to fetch url.",
            Url = url,
            Recipient = from
        })
        Handlers.utils.reply("Recieved request from" .. from .. "to" .. url)(Msg)
    end
)

local json = require("json")
Handlers.add(
    "recieveTokenPrices",
    Handlers.utils.hasMatchingTag("Action", "Recieve-token-prices"),
    function(msg)
        local res = json.decode(msg.Data)
        for key, value in pairs(res) do
            Rates[key] = value
        end
    end
)

assert(type(msg.Tags.TokenPrices[1]) == "string", "At least one Token Price is required")
Handlers.utils.reply(json.encode(msg))(msg)
Rates[msg.Tags.TokenPrices[1]] = msg.Data

local json = require("json")
Send({
    Target = ao.id,
    Tags = { Action = "Get-token-price", TokenName = json.encode({ "AVAX" }) }
})

Send({
    Target = "IgEHdxGWDDGMj7Pp3b4oUaIyWI9yaM5ri_5rXqtA8Gk",
    Action = "Get-real-data", Url = "https://dummyjson.com/products"
})

local json = require("json")
Send({
    Target = ao.id,
    Tags = { Action = "Recieve-token-prices", TokenName = json.encode({ "SOL" }) },
    Data = json.encode({
        Btc = {
            price = "234",
            timestamp = "1343874"
        }
    })
})


Handlers.add(
    "cyclicFunc",
    Handlers.utils.hasMatchingTag("Action", "Cyclic-request"),
    Handlers.utils.reply("Action", "Cyclic-request")),
)

tracing: curl "https://ao-mu-1.onrender.com/?debug=true&process=IgEHdxGWDDGMj7Pp3b4oUaIyWI9yaM5ri_5rXqtA8Gk"


