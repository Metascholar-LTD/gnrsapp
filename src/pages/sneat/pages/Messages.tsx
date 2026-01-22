import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  Image as ImageIcon,
  File,
  Reply,
  Forward,
  Copy,
  Trash2,
  Edit3,
  Check,
  CheckCheck,
  Clock,
  Pin,
  Archive,
  VolumeX,
  Flag,
  User,
  ArrowLeft,
  X,
  Plus,
  MessageCircle,
  Filter
} from 'lucide-react';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  reactions?: { emoji: string; userId: string }[];
  type: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  isEdited?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isTyping?: boolean;
  isGroup?: boolean;
  members?: number;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Kwame Asante',
    lastMessage: 'Yes, I can help you with your scholarship application.',
    timestamp: '2m ago',
    unreadCount: 3,
    isOnline: true,
    isPinned: true
  },
  {
    id: '2',
    name: 'Tech Mentors Group',
    lastMessage: 'Sarah: The next session is on Friday',
    timestamp: '15m ago',
    unreadCount: 5,
    isOnline: false,
    isPinned: true,
    isGroup: true,
    members: 12
  },
  {
    id: '3',
    name: 'Ama Mensah',
    lastMessage: 'Thank you for the resources!',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    isTyping: true
  },
  {
    id: '4',
    name: 'Prof. Kofi Adjei',
    lastMessage: 'Please review the attached document',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: false,
    isPinned: false
  },
  {
    id: '5',
    name: 'Career Guidance Team',
    lastMessage: 'Your CV has been reviewed',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isGroup: true,
    members: 5
  },
  {
    id: '6',
    name: 'Scholarship Support',
    lastMessage: 'Application deadline reminder',
    timestamp: '2 days ago',
    unreadCount: 0,
    isOnline: false,
    isPinned: false
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello Dr. Asante, I hope this message finds you well.',
    senderId: 'me',
    timestamp: new Date(Date.now() - 3600000 * 2),
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    content: 'Hello! Yes, I\'m doing well. How can I help you today?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    status: 'read',
    type: 'text'
  },
  {
    id: '3',
    content: 'I need some guidance on my scholarship application for the Mastercard Foundation program.',
    senderId: 'me',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read',
    type: 'text'
  },
  {
    id: '4',
    content: 'That\'s a great scholarship! I\'ve helped several students with this before. What specific areas do you need help with?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 1800000),
    status: 'read',
    type: 'text'
  },
  {
    id: '5',
    content: 'I\'m particularly struggling with the personal statement section. I\'m not sure how to highlight my community impact effectively.',
    senderId: 'me',
    timestamp: new Date(Date.now() - 900000),
    status: 'read',
    type: 'text'
  },
  {
    id: '6',
    content: 'The personal statement is crucial. Focus on specific stories that demonstrate leadership and community impact. Would you like me to review your draft?',
    senderId: 'other',
    timestamp: new Date(Date.now() - 600000),
    status: 'read',
    type: 'text'
  },
  {
    id: '7',
    content: 'Yes, I can help you with your scholarship application.',
    senderId: 'other',
    timestamp: new Date(Date.now() - 120000),
    status: 'delivered',
    type: 'text'
  }
];

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ messageId: string; x: number; y: number } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile && !selectedConversation) {
        setSelectedConversation(conversations[0]);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setShowAttachMenu(false);
      setShowEmojiPicker(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    if (isMobile) setShowChatList(false);
    // Mark as read
    setConversations(conversations.map(c =>
      c.id === conv.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        senderName: replyingTo.senderId === 'me' ? 'You' : selectedConversation?.name || 'Unknown'
      } : undefined
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setReplyingTo(null);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));
    }, 500);
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === message.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const filteredConversations = conversations
    .filter(c => {
      if (activeTab === 'unread') return c.unreadCount > 0;
      if (activeTab === 'groups') return c.isGroup;
      return true;
    })
    .filter(c =>
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock size={12} color="#A8A29E" />;
      case 'sent': return <Check size={12} color="#A8A29E" />;
      case 'delivered': return <CheckCheck size={12} color="#A8A29E" />;
      case 'read': return <CheckCheck size={12} color="#696cff" />;
      default: return null;
    }
  };

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div className="container-fluid p-0" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Chat List Sidebar */}
        <AnimatePresence>
          {(showChatList || !isMobile) && (
            <motion.div
              initial={isMobile ? { x: -300 } : false}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -300 } : undefined}
              style={{
                width: isMobile ? '100%' : '340px',
                borderRight: isMobile ? 'none' : '1px solid #E7E5E4',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
                position: isMobile ? 'absolute' : 'relative',
                zIndex: isMobile ? 10 : 1,
                height: '100%'
              }}
            >
              {/* Sidebar Header */}
              <div style={{ padding: '16px', borderBottom: '1px solid #E7E5E4' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600, margin: 0 }}>Messages</h5>
                  <button
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#696cff',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      border: '1px solid #E7E5E4',
                      borderRadius: '8px',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: '#F9FAFB'
                    }}
                  />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
                  {(['all', 'unread', 'groups'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: activeTab === tab ? '#696cff' : 'transparent',
                        color: activeTab === tab ? '#FFFFFF' : '#78716C',
                        fontFamily: "'Source Sans Pro', sans-serif",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredConversations.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <MessageCircle size={40} color="#A8A29E" style={{ marginBottom: '12px' }} />
                    <p style={{ color: '#78716C', fontSize: '0.875rem' }}>No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: selectedConversation?.id === conv.id ? 'rgba(105, 108, 255, 0.08)' : 'transparent',
                        borderLeft: selectedConversation?.id === conv.id ? '3px solid #696cff' : '3px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Avatar */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: conv.isGroup ? 'rgba(3, 195, 236, 0.1)' : 'rgba(105, 108, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: conv.isGroup ? '#03c3ec' : '#696cff',
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}>
                          {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        {conv.isOnline && !conv.isGroup && (
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#71dd37',
                            borderRadius: '50%',
                            border: '2px solid #FFFFFF'
                          }} />
                        )}
                        {conv.isPinned && (
                          <Pin size={10} style={{ position: 'absolute', top: '-2px', right: '-2px', color: '#696cff' }} />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span style={{
                            fontWeight: conv.unreadCount > 0 ? 600 : 500,
                            color: '#1C1917',
                            fontSize: '0.9375rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {conv.name}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: conv.unreadCount > 0 ? '#696cff' : '#A8A29E',
                            fontWeight: conv.unreadCount > 0 ? 600 : 400,
                            flexShrink: 0,
                            marginLeft: '8px'
                          }}>
                            {conv.timestamp}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          {conv.isTyping ? (
                            <span style={{ fontSize: '0.8125rem', color: '#696cff', fontStyle: 'italic' }}>
                              typing...
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '0.8125rem',
                              color: conv.unreadCount > 0 ? '#1C1917' : '#78716C',
                              fontWeight: conv.unreadCount > 0 ? 500 : 400,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}>
                              {conv.lastMessage}
                            </span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span style={{
                              minWidth: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#696cff',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '0 6px',
                              marginLeft: '8px',
                              flexShrink: 0
                            }}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9FAFB',
          minWidth: 0
        }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div className="d-flex align-items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={() => setShowChatList(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#78716C',
                        marginLeft: '-8px'
                      }}
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: selectedConversation.isGroup ? 'rgba(3, 195, 236, 0.1)' : 'rgba(105, 108, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedConversation.isGroup ? '#03c3ec' : '#696cff',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h6 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>
                      {selectedConversation.name}
                    </h6>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: selectedConversation.isOnline ? '#71dd37' : '#A8A29E' }}>
                      {selectedConversation.isGroup
                        ? `${selectedConversation.members} members`
                        : selectedConversation.isOnline ? 'Online' : 'Offline'
                      }
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', borderRadius: '8px' }}>
                    <Phone size={18} />
                  </button>
                  <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', borderRadius: '8px' }}>
                    <Video size={18} />
                  </button>
                  <button style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', borderRadius: '8px' }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {messages.map((message, index) => {
                  const isMe = message.senderId === 'me';
                  const showDate = index === 0 || new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div style={{
                          textAlign: 'center',
                          margin: '16px 0 8px',
                          position: 'relative'
                        }}>
                          <span style={{
                            backgroundColor: '#E7E5E4',
                            color: '#78716C',
                            fontSize: '0.75rem',
                            padding: '4px 12px',
                            borderRadius: '12px'
                          }}>
                            {new Date(message.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'flex',
                          justifyContent: isMe ? 'flex-end' : 'flex-start'
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({ messageId: message.id, x: e.clientX, y: e.clientY });
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          position: 'relative'
                        }}>
                          {/* Reply Preview */}
                          {message.replyTo && (
                            <div style={{
                              padding: '8px 12px',
                              backgroundColor: isMe ? 'rgba(105, 108, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                              borderLeft: `3px solid ${isMe ? '#696cff' : '#78716C'}`,
                              borderRadius: '4px 8px 8px 4px',
                              marginBottom: '4px',
                              fontSize: '0.75rem'
                            }}>
                              <p style={{ margin: 0, fontWeight: 600, color: isMe ? '#696cff' : '#78716C' }}>
                                {message.replyTo.senderName}
                              </p>
                              <p style={{ margin: 0, color: '#78716C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {message.replyTo.content}
                              </p>
                            </div>
                          )}
                          {/* Message Bubble */}
                          <div style={{
                            padding: '10px 14px',
                            backgroundColor: isMe ? '#696cff' : '#FFFFFF',
                            color: isMe ? '#FFFFFF' : '#1C1917',
                            borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            boxShadow: isMe ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                          }}>
                            <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
                              {message.content}
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              {message.isEdited && (
                                <span style={{ fontSize: '0.625rem', opacity: 0.7 }}>edited</span>
                              )}
                              <span style={{ fontSize: '0.625rem', opacity: 0.7 }}>
                                {formatTime(message.timestamp)}
                              </span>
                              {isMe && getStatusIcon(message.status)}
                            </div>
                          </div>
                          {/* Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div style={{
                              display: 'flex',
                              gap: '4px',
                              marginTop: '4px',
                              justifyContent: isMe ? 'flex-end' : 'flex-start'
                            }}>
                              {message.reactions.map((r, i) => (
                                <span key={i} style={{
                                  padding: '2px 6px',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '10px',
                                  fontSize: '0.75rem',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                  {r.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview Bar */}
              {replyingTo && (
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFFFFF',
                  borderTop: '1px solid #E7E5E4',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Reply size={16} color="#696cff" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#696cff' }}>
                      Replying to {replyingTo.senderId === 'me' ? 'yourself' : selectedConversation.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.8125rem',
                      color: '#78716C',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {replyingTo.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#A8A29E' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #E7E5E4'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '24px',
                  padding: '8px 16px'
                }}>
                  {/* Attachment Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAttachMenu(!showAttachMenu);
                      }}
                      style={{
                        padding: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#78716C'
                      }}
                    >
                      <Paperclip size={20} />
                    </button>
                    {showAttachMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: 0,
                          marginBottom: '8px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          minWidth: '140px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#1C1917', fontSize: '0.875rem' }}>
                          <ImageIcon size={18} color="#71dd37" />
                          Photo
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#1C1917', fontSize: '0.875rem' }}>
                          <File size={18} color="#03c3ec" />
                          Document
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.9375rem',
                      padding: '8px 0'
                    }}
                  />

                  {/* Emoji Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiPicker(!showEmojiPicker);
                      }}
                      style={{
                        padding: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#78716C'
                      }}
                    >
                      <Smile size={20} />
                    </button>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          right: 0,
                          marginBottom: '8px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          padding: '8px',
                          display: 'flex',
                          gap: '4px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setNewMessage(newMessage + emoji);
                              setShowEmojiPicker(false);
                              inputRef.current?.focus();
                            }}
                            style={{
                              padding: '6px 8px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.25rem',
                              borderRadius: '6px',
                              transition: 'background-color 0.15s'
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Send/Voice Button */}
                  {newMessage.trim() ? (
                    <button
                      onClick={handleSendMessage}
                      style={{
                        padding: '8px',
                        backgroundColor: '#696cff',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Send size={18} />
                    </button>
                  ) : (
                    <button
                      style={{
                        padding: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#78716C'
                      }}
                    >
                      <Mic size={20} />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A8A29E'
            }}>
              <MessageCircle size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#78716C' }}>Select a conversation</h5>
              <p style={{ fontSize: '0.875rem', color: '#A8A29E' }}>Choose from your existing chats or start a new one</p>
            </div>
          )}
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: contextMenu.y,
                left: contextMenu.x,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '8px',
                zIndex: 1000,
                minWidth: '160px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  const msg = messages.find(m => m.id === contextMenu.messageId);
                  if (msg) setReplyingTo(msg);
                  setContextMenu(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#1C1917', fontSize: '0.875rem', textAlign: 'left' }}
              >
                <Reply size={16} />
                Reply
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#1C1917', fontSize: '0.875rem', textAlign: 'left' }}>
                <Forward size={16} />
                Forward
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#1C1917', fontSize: '0.875rem', textAlign: 'left' }}>
                <Copy size={16} />
                Copy
              </button>
              <div style={{ height: '1px', backgroundColor: '#E7E5E4', margin: '4px 0' }} />
              <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#ff3e1d', fontSize: '0.875rem', textAlign: 'left' }}>
                <Trash2 size={16} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Messages;
