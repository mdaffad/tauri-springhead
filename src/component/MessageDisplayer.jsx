import React, { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event'


const consumeMessage = await listen('new-incoming-message', (event) => {
    // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
    // event.payload is the payload object
    const eventMessage = new Event('message', event);
    console.log("get in consume message");
    document.dispatchEvent(eventMessage);
  });
  
// emit('new-incoming-message', {
//     message: 'Tauri is awesome!',
// })

function MessageDisplayer(props) {
    const [message, setMessage] = useState(props.message)

    useEffect(() => {
        function handleMessage(event) {
            // console.log(message)
            // console.log(event.payload.message)
        }
        
        // Bind the event listener
        document.addEventListener("message", handleMessage);

        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("message", handleMessage);
        };
    }, [message]);

    return (
        <div>
            {message}
        </div>
    )
}

export default MessageDisplayer;