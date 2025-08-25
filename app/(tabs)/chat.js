import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalBackground from '../../components/GlobalBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import NeonInput from '../../components/NeonInput';
import { Send, Bot } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const Message = ({ message, isUser, delay = 0 }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={600}
    delay={delay}
    style={[styles.messageContainer, isUser && styles.userMessageContainer]}
  >
    <GlassmorphicCard style={[styles.messageCard, isUser && styles.userMessageCard]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Bot color="#00ff88" size={16} />
        </View>
      )}
      <Text style={[styles.messageText, isUser && styles.userMessageText]}>
        {message}
      </Text>
    </GlassmorphicCard>
  </Animatable.View>
);

const TypingIndicator = () => (
  <Animatable.View
    animation={{
      0: { opacity: 0.3 },
      0.5: { opacity: 1 },
      1: { opacity: 0.3 },
    }}
    iterationCount="infinite"
    duration={1000}
    style={styles.typingContainer}
  >
    <GlassmorphicCard style={styles.typingCard}>
      <View style={styles.botAvatar}>
        <Bot color="#00ff88" size={16} />
      </View>
      <View style={styles.typingDots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </GlassmorphicCard>
  </Animatable.View>
);

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you identify objects, answer questions, and manage your tasks. What would you like to explore today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Based on my analysis, I can help you with that. Let me provide you with some detailed information...",
        "I understand what you're looking for. Here are some suggestions that might help you accomplish your goal.",
        "Great! I can definitely assist you with that. Would you like me to break this down into actionable steps?",
        "I see what you mean. This is a common query, and I have some excellent recommendations for you.",
        "Fascinating! Let me analyze this for you and provide the most relevant information."
      ];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
    }, 2000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Powered by advanced AI</Text>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                delay={index * 100}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <GlassmorphicCard style={styles.inputCard}>
              <View style={styles.inputRow}>
                <NeonInput
                  placeholder="Ask me anything..."
                  value={inputText}
                  onChangeText={setInputText}
                  style={styles.messageInput}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    inputText.trim() && styles.sendButtonActive
                  ]}
                  onPress={sendMessage}
                  disabled={!inputText.trim()}
                >
                  <Send 
                    color={inputText.trim() ? '#00ff88' : '#666'} 
                    size={20} 
                  />
                </TouchableOpacity>
              </View>
            </GlassmorphicCard>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#00ff88',
    opacity: 0.8,
    marginTop: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageCard: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessageCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  userMessageText: {
    color: '#00ff88',
  },
  typingContainer: {
    marginBottom: 15,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typingCard: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputCard: {
    padding: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  messageInput: {
    flex: 1,
    margin: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 102, 102, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.5)',
  },
});