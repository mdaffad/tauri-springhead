import React, { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event'


const consumeMessage = await listen('new-incoming-message', (event) => {
    const eventMessage = new CustomEvent('message', {'detail': event.payload});
    document.dispatchEvent(eventMessage);
  });
  
function MessageDisplayer(props) {
    const [message, setMessage] = useState("")

    useEffect(() => {
        function handleMessage(event) {
            let newMessage = event?.detail?.message;
            if(newMessage) {
                if(message == "") {
                    setMessage(JSON.stringify(newMessage));
                }
                else {
                    setMessage(message + "\n" + JSON.stringify(newMessage));
                }
            }
        }
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