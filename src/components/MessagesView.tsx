import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Image,
  Video,
  Play,
  CheckCheck,
  Phone,
  Sparkles,
  Paperclip,
  User,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { messages, sendMessage, user, activeRole, language, t } = useApp();
  const isRtl = language === 'ar';

  const [inputMessage, setInputMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<'image' | 'video' | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedMedia) return;

    let mediaUrl: string | undefined = undefined;
    if (selectedMedia === 'image') {
      mediaUrl = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80';
    } else if (selectedMedia === 'video') {
      mediaUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
    }

    sendMessage(inputMessage, mediaUrl, selectedMedia || undefined);
    setInputMessage('');
    setSelectedMedia(null);
  };

  const quickTopics = [
    { key: 'trainingQuestion', label: t('trainingQuestion') },
    { key: 'nutritionUpdate', label: t('nutritionUpdate') },
    { key: 'weeklyCheckin', label: t('weeklyCheckin') },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-4 animate-fade-in h-[calc(100vh-2rem)]">
      {/* Coach Chat Header */}
      <div className="flex items-center justify-between p-3.5 rounded-3xl bg-white border border-[#eceef0] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              alt="Coach Alex"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#ccff00]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#506600] ring-2 ring-white" />
          </div>
          <div className="text-start">
            <h3 className="text-base font-extrabold text-[#191c1e]">
              {t('chatWithTrainer')}
            </h3>
            <span className="text-xs font-semibold text-[#506600]">
              {t('onlineStatus')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#565e74] bg-[#f2f4f6] px-3 py-1 rounded-full">
            VIP 1-on-1
          </span>
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => setInputMessage(`[${topic.label}] `)}
            className="px-3 py-1 rounded-full bg-white border border-[#e0e3e5] hover:border-[#506600] text-xs font-bold text-[#191c1e] whitespace-nowrap shadow-2xs active:scale-95 transition-all shrink-0"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 rounded-3xl bg-white border border-[#eceef0] shadow-sm">
        {messages.map((msg) => {
          const isMe =
            activeRole === 'client'
              ? msg.senderRole === 'client'
              : msg.senderRole === 'trainer';

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                isMe ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed text-start ${
                  isMe
                    ? 'bg-[#191c1e] text-white rounded-br-xs rtl:rounded-bl-xs rtl:rounded-br-2xl'
                    : 'bg-[#f7faf0] text-[#191c1e] border border-[#506600]/25 rounded-bl-xs rtl:rounded-br-xs rtl:rounded-bl-2xl'
                }`}
              >
                {/* Media Attachment (Video/Image) */}
                {msg.mediaUrl && (
                  <div className="relative mb-2 rounded-xl overflow-hidden max-h-48 bg-black/10">
                    <img
                      src={msg.mediaUrl}
                      alt="attachment"
                      className="w-full h-full object-cover"
                    />
                    {msg.mediaType === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    )}
                  </div>
                )}

                <p>{msg.content || (msg as any).text}</p>

                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-bold ${
                    isMe ? 'text-white/60' : 'text-[#565e74]'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#ccff00]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Sender Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-[#e0e3e5] shadow-md focus-within:border-[#506600]"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedMedia(selectedMedia === 'video' ? null : 'video')}
            className={`p-2 rounded-xl text-[#565e74] hover:text-[#506600] transition-colors ${
              selectedMedia === 'video' ? 'bg-[#ccff00] text-[#191c1e]' : ''
            }`}
            title="Attach Workout Form Video"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedMedia(selectedMedia === 'image' ? null : 'image')}
            className={`p-2 rounded-xl text-[#565e74] hover:text-[#506600] transition-colors ${
              selectedMedia === 'image' ? 'bg-[#ccff00] text-[#191c1e]' : ''
            }`}
            title="Attach Meal / Progress Photo"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t('typeMessage')}
          className="flex-1 px-2 py-2 text-xs sm:text-sm font-medium text-[#191c1e] bg-transparent outline-none"
        />

        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0"
        >
          <Send className="w-4 h-4 translate-x-0.5 rtl:-translate-x-0.5" />
        </button>
      </form>
    </div>
  );
};
