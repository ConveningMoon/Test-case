import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Post } from '../types';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/pages/Posts.css';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const fetchPosts = async () => {
    try {
      const response = await api.get('posts/');
      setPosts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (post?: Post) => {
    if (post) {
      setCurrentPost(post);
      setTitle(post.title);
      setContent(post.content);
    } else {
      setCurrentPost(null);
      setTitle('');
      setContent('');
    }
    setShow(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost) {
        // Update
        await api.put(`posts/${currentPost.id}/`, { title, content, author_id: currentPost.author.id });
      } else {
        // Create
        // Replace with actual author_id from authenticated user
        const authorId = await getAuthorId();
        await api.post('posts/', { title, content, author_id: authorId });
      }
      handleClose();
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`posts/${id}/`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const getAuthorId = async (): Promise<number> => {
    try {
      const response = await api.get('authors/');
      // Assuming the first author is the current user
      return response.data[0].id;
    } catch (err) {
      console.error(err);
      return 1; // Fallback author ID
    }
  };

  return (
    <div>
      <h2>Posts</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        Create New Post
      </Button>
      <hr />
      <div className="list-group">
        {posts.map((post) => (
          <div key={post.id} className="list-group-item">
            <h5>{post.title}</h5>
            <p>{post.content}</p>
            <small>By {post.author.user.username} on {new Date(post.created_at).toLocaleDateString()}</small>
            <div className="mt-2">
              <Button variant="secondary" size="sm" onClick={() => handleShow(post)}>Edit</Button>{' '}
              <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{currentPost ? 'Edit Post' : 'Create Post'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentPost ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Posts;
