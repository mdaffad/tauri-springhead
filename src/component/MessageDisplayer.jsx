import React, { useEffect, useState } from "react";
import { emit, listen } from '@tauri-apps/api/event'



const consumeMessage = await listen('consume-message', (event) => {
    // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
    // event.payload is the payload object
    const eventMessage = new Event('message', event);
    console.log("asdasd")
    document.dispatchEvent(eventMessage);
    
  })
  
// emit('consume-message', {
//     message: 'Tauri is awesome!',
// })

function MessageDisplayer(props) {
  const message = useState("")

  useEffect(() => {
    function handleMessage(event) {
        console.log(event.payload.message)
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
        asdasd
    </div>
  )
}

export default MessageDisplayer;