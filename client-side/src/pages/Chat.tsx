
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppProvider';
import styles from "./Chat.module.css";
import { IoSend } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiLogOut, FiPlusCircle } from 'react-icons/fi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { nickName } = useAppContext();
  const [chatHistory, setChatHistory] = useState([] as Message[])
  const [btnEnable, setBtnEnable] = useState(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null)


  useEffect(() => {
    if (nickName.length == 0) {
      navigate('/');
      return;
    }

    // Connect to Socket.IO server
    const socketInstance = io('http://localhost:4000')
    setSocket(socketInstance)

    // Join the chat
    socketInstance.emit('join', nickName)

    // Handle previous messages
    socketInstance.on('previous-messages', (previousMessages: Message[]) => {
      setChatHistory(previousMessages)
    })

    // Handle new messages
    socketInstance.on('new-message', (message: Message) => {
      console.log('new-message', message)
      // debugger
      setChatHistory((chatHistory) => [...chatHistory, message]);
    })

    return () => {
      socketInstance.emit('leave', nickName)
      socketInstance.disconnect()
    }
  }, []);



  const sendMessage: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent) => {
    event.preventDefault()
    const inputText = document.getElementById('inputText') as HTMLInputElement;
    if (inputText.value.length == 0) {
      return;
    }
    if (socket) {
      socket.emit('send-message', inputText.value.trim())
    }
    inputText.value = '';
  }
  function inputChange(event: ChangeEvent<HTMLInputElement>): void {
    setBtnEnable(event.target.value.length > 0);
  }
  const logOut = () => {
    if (confirm('Are you sure you want to leave the chat?')) {
      navigate('/');
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div >
          <FaRegUserCircle size={26} />
          <h1>{nickName}</h1>
        </div>
        <div >
          <button className={styles.logOut} onClick={logOut}>
            <FiLogOut size={22} />
          </button>
          {/* <FaRegBell size={26} />
          <IoSettingsOutline size={26} /> */}
        </div>
      </header>
      <main className={styles.main}>
        <ul>
          {chatHistory.map((chat, index) => {

            const lastChatWasSameNickName = index > 0 && chatHistory[index - 1].sender == chat.sender;
            console.log(lastChatWasSameNickName)
            const isMyMessage = chat.sender == nickName;
            return (
              <li key={chat.id} style={{
                'textAlign': isMyMessage ? 'right' : 'left',
                'alignSelf': isMyMessage ? 'end' : 'start',
                'borderRadius': `${isMyMessage ? '8px' : 0} 8px ${isMyMessage ? 0 : '8px'} 8px`,
                'padding': `0.1em ${isMyMessage ? '0.4em' : '0.2em'}`,
              }}>
                {(!isMyMessage && !lastChatWasSameNickName) && <p className={styles.sender}>{chat.sender}</p>}
                {chat.content}
              </li>
            );
          })}
        </ul>
      </main>
      <footer className={styles.footer}>
        <FiPlusCircle size={26} />
        <HiOutlineEmojiHappy size={26} />
        <form onSubmit={sendMessage}>
          <input autoFocus type="text" id='inputText' onChange={inputChange} />
          <button className={styles.btn} type="submit" disabled={!btnEnable}>
            <IoSend color={btnEnable ? '#13e62a' : 'gray'} size={32} />
          </button>
        </form>
      </footer>
    </div>


  );
};

export default Chat;
