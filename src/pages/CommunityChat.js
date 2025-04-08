import React, { useState, useRef, useEffect, useMemo } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { ref, onValue, push, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { Chat, ArrowBack, PersonOutline, Send, EmojiEmotions, Image } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [activeUsers, setActiveUsers] = useState(new Map());
    const [stableActiveUsers, setStableActiveUsers] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const prevUsersRef = useRef(new Map());
    const presenceRef = useRef(null);
    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user?.id) {
            navigate('/login');
            return;
        }

        presenceRef.current = ref(db, `activeUsers/${user.id}`);
        const userStatus = {
            id: user.id,
            name: user.name,
            online: true,
            lastSeen: serverTimestamp()
        };

        set(presenceRef.current, userStatus);

        onDisconnect(presenceRef.current).update({
            online: false,
            lastSeen: serverTimestamp()
        });

        const usersRef = ref(db, 'activeUsers');
        const unsubUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const currentUsers = new Map();
                snapshot.forEach((child) => {
                    const userData = child.val();
                    if (userData.online) {
                        currentUsers.set(child.key, userData);
                    }
                });

                if (!mapsAreEqual(prevUsersRef.current, currentUsers)) {
                    prevUsersRef.current = currentUsers;
                    setStableActiveUsers(Array.from(currentUsers.values())
                        .sort((a, b) => a.name.localeCompare(b.name)));
                }
            }
        });

        return () => {
            unsubUsers();
            if (presenceRef.current) {
                set(presenceRef.current, { ...userStatus, online: false });
            }
        };
    }, [user, navigate]);

    useEffect(() => {
        if (!user?.id) return;

        const messagesRef = ref(db, 'messages');
        const unsubMessages = onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messageList = Object.entries(data)
                    .map(([key, value]) => ({
                        id: key,
                        ...value
                    }))
                    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                setMessages(messageList);
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        });

        return () => unsubMessages();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImageSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setSelectedImage(file);
    };

    const uploadImage = async () => {
        if (!selectedImage || !user) return;

        try {
            setUploading(true);
            
            const fileName = `${Date.now()}-${selectedImage.name}`;
            const imageRef = storageRef(storage, `chat-images/${fileName}`);
            
            const snapshot = await uploadBytes(imageRef, selectedImage);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const messagesRef = ref(db, 'messages');
            const newMessageRef = push(messagesRef);
            
            await set(newMessageRef, {
                type: 'image',
                imageUrl: downloadURL,
                sender: user.name,
                senderId: user.id,
                timestamp: serverTimestamp(),
                fileName: selectedImage.name
            });

            setSelectedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedImage) {
            await uploadImage();
            return;
        }

        if (!input.trim() || !user) return;

        try {
            const messagesRef = ref(db, 'messages');
            const newMessageRef = push(messagesRef);
            
            await set(newMessageRef, {
                type: 'text',
                text: input.trim(),
                sender: user.name,
                senderId: user.id,
                timestamp: serverTimestamp()
            });

            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const onEmojiClick = (emojiObject) => {
        const cursor = input.length;
        const text = input.slice(0, cursor) + emojiObject.emoji + input.slice(cursor);
        setInput(text);
    };

    const mapsAreEqual = (map1, map2) => {
        if (map1.size !== map2.size) return false;
        for (const [key, val1] of map1) {
            const val2 = map2.get(key);
            if (!val2 || val1.name !== val2.name || val1.online !== val2.online) {
                return false;
            }
        }
        return true;
    };

    const renderMessage = (msg) => {
        if (msg.type === 'image') {
            return (
                <ImageMessage>
                    <img src={msg.imageUrl} alt="Shared content" />
                </ImageMessage>
            );
        }
        return <MessageText>{msg.text}</MessageText>;
    };

    return (
        <Container>
            <ChatWindow>
                <Header>
                    <BackButton onClick={() => navigate('/dashboard')}>
                        <ArrowBack />
                    </BackButton>
                    <HeaderTitle>
                        <Chat sx={{ color: '#63f5ef', marginRight: '8px' }} />
                        Community Chat
                    </HeaderTitle>
                    <ActiveUsersCount>
                        <PersonOutline sx={{ color: '#63f5ef', marginRight: '4px' }} />
                        {stableActiveUsers.length} online
                    </ActiveUsersCount>
                </Header>

                <ChatLayout>
                    <ActiveUsersList>
                        {stableActiveUsers.map((activeUser) => (
                            <ActiveUser
                                key={activeUser.id}
                                layoutId={activeUser.id}
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <OnlineDot />
                                <UserName>{activeUser.name}</UserName>
                            </ActiveUser>
                        ))}
                    </ActiveUsersList>

                    <ChatContent>
                        <MessagesContainer>
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    $isSender={msg.senderId === user.id}
                                    $type={msg.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <SenderName>{msg.sender}</SenderName>
                                    {renderMessage(msg)}
                                    <TimeStamp>
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </TimeStamp>
                                </MessageBubble>
                            ))}
                            <div ref={messagesEndRef} />
                        </MessagesContainer>

                        <InputForm onSubmit={handleSubmit}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                            <ImageButton
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Image />
                            </ImageButton>
                            
                            <EmojiButton
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <EmojiEmotions />
                            </EmojiButton>
                            
                            {showEmojiPicker && (
                                <EmojiPickerContainer ref={emojiPickerRef}>
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        lazyLoadEmojis={true}
                                        theme="dark"
                                    />
                                </EmojiPickerContainer>
                            )}

                            {selectedImage ? (
                                <SelectedImagePreview>
                                    <span>{selectedImage.name}</span>
                                    <ClearButton onClick={() => {
                                        setSelectedImage(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}>×</ClearButton>
                                </SelectedImagePreview>
                            ) : (
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message... 😊"
                                    disabled={uploading}
                                />
                            )}

                            <SendButton
                                type="submit"
                                disabled={uploading || (!input.trim() && !selectedImage)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {uploading ? <CircularProgress size={24} /> : <Send />}
                            </SendButton>
                        </InputForm>
                    </ChatContent>
                </ChatLayout>
            </ChatWindow>
        </Container>
    );
};

const ChatLayout = styled.div`
    display: flex;
    height: calc(100% - 60px);
    background: rgba(255, 255, 255, 0.03);
`;

const ActiveUsersList = styled.div`
    width: 200px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    overflow-y: auto;
    contain: content;
`;

const ActiveUser = styled(motion.div)`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    contain: layout;
    transform: translateZ(0);
    backface-visibility: hidden;

    &:last-child {
        margin-bottom: 0;
    }
`;

const OnlineDot = styled.div`
    width: 8px;
    height: 8px;
    min-width: 8px;
    border-radius: 50%;
    background: #63f5ef;
    margin-right: 12px;
    box-shadow: 0 0 10px rgba(99, 245, 239, 0.5);
    contain: strict;
`;

const UserName = styled.span`
    color: white;
    font-size: 14px;
    font-family: 'Rajdhani', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActiveUsersCount = styled.div`
    display: flex;
    align-items: center;
    color: white;
    font-size: 14px;
    margin-left: auto;
`;

const ChatContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Container = styled.div`
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatWindow = styled.div`
    width: 100%;
    max-width: 800px;
    height: 80vh;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: #63f5ef;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const HeaderTitle = styled.h2`
    color: #fff;
    font-family: 'Orbitron', sans-serif;
    margin: 0;
    display: flex;
    align-items: center;
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const MessageBubble = styled(motion.div)`
    padding: 12px 16px;
    border-radius: 12px;
    max-width: ${props => props.$type === 'image' ? '320px' : '70%'};
    align-self: ${props => props.$isSender ? 'flex-end' : 'flex-start'};
    background: ${props => props.$isSender ? 
                          'linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%)' : 
                          'rgba(255, 255, 255, 0.1)'};
`;

const SenderName = styled.div`
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
    font-family: 'Rajdhani', sans-serif;
`;

const MessageText = styled.p`
    margin: 0;
    color: ${props => props.$isSender ? 'white' : '#e0e0e0'};
    font-size: 16px;
    line-height: 1.4;
    word-break: break-word;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
`;

const TimeStamp = styled.div`
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4px;
    text-align: right;
    font-family: 'Rajdhani', sans-serif;
`;

const InputForm = styled.form`
    display: flex;
    align-items: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
    gap: 10px;
`;

const Input = styled.input`
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    padding: 12px 16px;
    border-radius: 12px;
    color: white;
    font-family: 'Rajdhani', sans-serif;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #63f5ef;
    }
`;

const SendButton = styled(motion.button)`
    background: linear-gradient(135deg, #4a90e2 0%, #63f5ef 100%);
    border: none;
    border-radius: 12px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
`;

const EmojiButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    color: #63f5ef;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: white;
        transform: scale(1.1);
    }
`;

const ImageButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    color: #63f5ef;
    cursor: pointer;
    opacity: ${props => props.disabled ? 0.5 : 1};
    transition: all 0.2s ease;

    &:hover {
        color: white;
        transform: scale(1.1);
    }
`;

const EmojiPickerContainer = styled.div`
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 10px;
    z-index: 1000;

    .EmojiPickerReact {
        border: none !important;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37) !important;
        backdrop-filter: blur(8px);
        background: rgba(0, 0, 0, 0.8) !important;
    }
`;

const ImageMessage = styled.div`
    margin: 5px 0;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 8px;
    }
`;

const SelectedImagePreview = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(99, 245, 239, 0.1);
    border-radius: 4px;
    margin: 0 8px;
    color: #63f5ef;
`;

const ClearButton = styled.button`
    background: none;
    border: none;
    color: #63f5ef;
    font-size: 20px;
    cursor: pointer;
    padding: 0 4px;
    
    &:hover {
        color: white;
    }
`;

export default CommunityChat;