import React, { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event'


const consumeMessage = await listen('new-incoming-message', (event) => {
    // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
    // event.payload is the payload object
    const eventMessage = new CustomEvent('message', {'detail': event.payload});
    document.dispatchEvent(eventMessage);
  });
  
function MessageDisplayer(props) {
    const [message, setMessage] = useState("")

    useEffect(() => {
        function handleMessage(event) {
            let newMessage = event?.detail?.message;
            if(newMessage) {
                console.log("new message: " + newMessage);
                if(message == "") {
                    console.log("empty")
                    setMessage(JSON.stringify(newMessage));
                }
                else {
                    setMessage(message + "\n" + JSON.stringify(newMessage));
                }
            }
            console.log(message);
        }
        console.log("outside handle message")
        // Bind the event listener
        document.addEventListener("message", handleMessage);

        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("message", handleMessage);
        };
    }, [message]);

    return (
        <textarea readOnly className="display-kafka-consumer" value={message} rows={10} />
    )
}

export default MessageDisplayer;