import { create } from 'zustand';

interface ChatMessage {
    role: 'user' | 'agent' | 'system';
    content: string;
}

interface Viseme {
    time: number;
    value: string;
}

interface AudioPayload {
    audioBase64: string;
    visemes: Viseme[];
}

interface AgentState {
    status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' | 'disconnected';
    messages: ChatMessage[];
    audioQueue: AudioPayload[];
    currentEmotion: string;
    isMicActive: boolean;

    // Actions
    addMessage: (msg: ChatMessage) => void;
    setStatus: (status: AgentState['status']) => void;
    enqueueAudio: (payload: AudioPayload) => void;
    dequeueAudio: () => AudioPayload | undefined;
    clearAudioQueue: () => void;
    setEmotion: (emotion: string) => void;
    toggleMic: () => void;
    clearChat: () => void;
}

export const useStore = create<AgentState>((set, get) => ({
    status: 'disconnected',
    messages: [],
    audioQueue: [],
    currentEmotion: 'neutral',
    isMicActive: false,

    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

    setStatus: (status) => set({ status }),

    enqueueAudio: (payload) => set((state) => ({
        audioQueue: [...state.audioQueue, payload]
    })),

    dequeueAudio: () => {
        const queue = get().audioQueue;
        if (queue.length === 0) return undefined;
        const item = queue[0];
        set({ audioQueue: queue.slice(1) });
        return item;
    },

    clearAudioQueue: () => set({ audioQueue: [] }),

    setEmotion: (currentEmotion) => set({ currentEmotion }),

    toggleMic: () => {
        const current = get().isMicActive;
        set({ isMicActive: !current });
        if (!current) {
            set({ status: 'listening' });
        } else if (get().status === 'listening') {
            set({ status: 'idle' });
        }
    },

    clearChat: () => set({ messages: [], audioQueue: [] })
}));
