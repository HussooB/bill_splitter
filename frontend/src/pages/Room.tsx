import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Paperclip } from "lucide-react";

const API_URL = "https://bill-splitter-backend-9b7b.onrender.com/api";

interface Message {
  id?: string;
  senderName: string;
  text?: string;
  createdAt: string;
  proofUrl?: string;
}

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [roomTitle, setRoomTitle] = useState("");
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("userName") || "You"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch room info and messages
  useEffect(() => {
    if (!token) {
      toast({ title: "Unauthorized", description: "Please log in." });
      navigate("/login");
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        const room = data.rooms.find((r: any) => r.id === roomId);
        if (!room) throw new Error("Room not found");
        setRoomTitle(room.title);
      } catch (err: any) {
        toast({ title: "Error", description: err.message });
        navigate("/rooms");
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg.id,
            senderName: msg.senderName || msg.sender?.name || "Unknown",
            text: msg.text,
            proofUrl: msg.proofUrl || msg.fileUrl,
            createdAt: msg.createdAt || new Date().toISOString(),
          }))
        );
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchRoom();
    fetchMessages();
  }, [roomId, token, toast, navigate]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!token) return;
    const s = io("https://bill-splitter-backend-9b7b.onrender.com", {
      auth: { token },
    });

    s.on("connect", () => console.log("Socket connected:", s.id));

    s.emit("joinRoom", roomId);

    // Listen for new text messages
    s.on("newMessage", (msg: Message) => {
      if (!msg.createdAt) msg.createdAt = new Date().toISOString();
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev; // prevent duplicates
        return [...prev, msg];
      });
    });

    // Listen for new files/proofs
    s.on("newProof", (proof: any) => {
      const newMsg: Message = {
        id: proof.id,
        senderName: proof.sender?.name || displayName,
        proofUrl: proof.fileUrl,
        createdAt: proof.createdAt || new Date().toISOString(),
      };
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [roomId, token, displayName]);

  // Send text message
  const handleSendMessage = () => {
    if (!input.trim() || !socket) return;

    const msg = {
      roomId,
      senderName: displayName,
      text: input,
    };

    socket.emit("sendMessage", msg);
    setInput(""); // clear input
  };

  // Send file
  const handleSendFile = async () => {
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/proofs/${roomId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload file");
      setFile(null);
      toast({ title: "File sent!" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error sending file", description: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{roomTitle}</h1>
        <Button variant="ghost" onClick={() => navigate("/rooms")}>
          Back to Rooms
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <Card key={idx} className="p-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{msg.senderName}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
            {msg.text && <p className="mt-1">{msg.text}</p>}
            {msg.proofUrl && (
              <img src={msg.proofUrl} alt="proof" className="mt-2 max-h-48" />
            )}
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
        <Input
          type="file"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <Button onClick={handleSendFile} variant="secondary">
          <Paperclip />
        </Button>
      </div>
    </div>
  );
};

export default Room;
