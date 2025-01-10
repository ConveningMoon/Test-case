export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Author {
    id: number;
    user: User;
    bio: string;
  }
  
  export interface Post {
    id: number;
    author: Author;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }
  