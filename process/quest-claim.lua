Claims = Claims or {}
quests = quests or { { Name = "News-Bot" }, { Name = "Price-Bot" } }

function AddClaim(Quest, Address, Owner, User)
    table.insert(Claims, {
        Name = Quest,
        Address = Address,
        Owner = Owner,
        User = User
    })
end

Handlers.add("Claim-Quest", Handlers.utils.hasMatchingTag("Action", "Claim"),
    function(M)
        assert(type(M.Quest) == 'string', 'Quest Name is required!')
        assert(type(M.User) == 'string', 'User Name is required!')
        if Utils.find(function(quest) return quest.Name == M.Quest end, quests) and
            not Utils.find(function(claim) return claim.Address == M.From end, Claims) then
            AddClaim(M.Quest, M.From, M.Owner, M.User)
            print('Claim Added')
            ao.send({ Target = M.From, Data = "Claim received." })
        else
            print('quest not found')
            ao.send({ Target = M.From, Data = Colors.red .. "Claim not found or already claimed!" .. Colors.reset })
        end
    end
)

Send({ Target = "O3SXXYqQCNTbBedJjsW6wkPnrKFZq8DPLkKjO7zhztE", Action = "Claim", Quest = "News-Bot", User = "test" })
