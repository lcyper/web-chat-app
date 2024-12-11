export interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
  }
  
  export interface User {
    id: string;
    name: string;
  }