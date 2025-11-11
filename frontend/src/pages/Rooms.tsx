import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Receipt, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  title: string;
  menu: string[];
}

const API_URL = "https://bill-splitter-backend-9b7b.onrender.com/api";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "Unauthorized", description: "Please log in." });
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch rooms");

        const data = await res.json();
        setRooms(data.rooms);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Could not load rooms." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out", description: "You have been logged out." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Rooms</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="gap-2" size="lg" onClick={() => navigate("/rooms/new")}>
            <Plus className="h-5 w-5" />
            Create Room
          </Button>
          <Button className="gap-2" variant="outline" size="lg" onClick={() => navigate("/rooms/join")}>
            <Users className="h-5 w-5" />
            Join Room
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading rooms...</p>
        ) : rooms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="p-6 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/rooms/${room.id}`)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{room.title}</h3>
                    <Badge variant="default">ACTIVE</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{room.menu.length} menu items</p>
                  <p className="text-xs text-muted-foreground">Room ID: {room.id}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
            <p className="text-muted-foreground mb-4">Create a room to start splitting bills with friends</p>
            <Button onClick={() => navigate("/rooms/new")}>Create Your First Room</Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rooms;
