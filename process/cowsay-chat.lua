Prompt = function() return tostring(#Inbox) .. "> " end

Handlers.add("Post", Handlers.utils.hasMatchingTag("Action", "Post"),
    function(m) print(m.Data) end)

Room = "s3KitQCRKti7aMjncAMB8ninGcOQ5Sdl5ciO0TO6bpY"

if not Registered then Send({ Target = Room, Action = "Register" }) end
Registered = true

Chat = function(txt)
    ao.send({ Target = Room, Action = "Broadcast", Data = txt })
end

return ("Type: Chat('Yo') to send your message.")
