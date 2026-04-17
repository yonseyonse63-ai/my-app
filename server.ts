import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock data for initial sync and updates
  let currentRevenue = 12500;
  let transactions = [
    { 
      id: '1', 
      title: 'بيع "Cyberpunk City Kit"', 
      detail: 'منذ ساعتين • معرف الطلب: #19203', 
      amount: 149.00, 
      status: 'completed',
      type: 'sale',
      user: 'Ahmed',
      date: new Date().toISOString(),
    },
  ];

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Initial sync
    socket.emit("initial_data", {
      revenue: currentRevenue,
      transactions: transactions,
    });

    socket.on("deposit", ({ amount }) => {
      const depositAmount = parseFloat(amount);
      if (isNaN(depositAmount) || depositAmount <= 0) return;
      
      currentRevenue += depositAmount;
      const newTx = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'إيداع رصيد',
        detail: 'عملية إيداع يدوية',
        amount: depositAmount,
        status: 'completed',
        type: 'reward', // Using reward color for deposit
        user: 'You',
        date: new Date().toISOString(),
      };
      transactions = [newTx, ...transactions].slice(0, 10);
      io.emit("data_update", { revenue: currentRevenue, transactions });
    });

    socket.on("withdraw", ({ amount }) => {
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > currentRevenue) return;
      
      currentRevenue -= withdrawAmount;
      const newTx = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'سحب رصيد',
        detail: 'عملية سحب يدوية',
        amount: -withdrawAmount,
        status: 'completed',
        type: 'withdrawal',
        user: 'You',
        date: new Date().toISOString(),
      };
      transactions = [newTx, ...transactions].slice(0, 10);
      io.emit("data_update", { revenue: currentRevenue, transactions });
    });

    socket.on("create_transaction", (data) => {
      const amount = parseFloat(data.amount);
      if (isNaN(amount)) return;

      const newTx = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title || 'معاملة جديدة',
        detail: 'سجل يدوي',
        amount: data.type === 'withdrawal' || data.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        status: data.status || 'completed',
        type: data.type || 'sale',
        user: 'You',
        date: new Date().toISOString(),
      };

      currentRevenue += newTx.amount;
      transactions = [newTx, ...transactions].slice(0, 10);
      io.emit("data_update", { revenue: currentRevenue, transactions });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Periodically emit real-time updates to simulate incoming data
  setInterval(() => {
    const rand = Math.random();
    let type: 'sale' | 'withdrawal' | 'reward' | 'refund' | 'expense' = 'sale';
    let title = 'بيع منتج جديد';
    let amount = Math.floor(Math.random() * 500) + 50;

    if (rand < 0.1) {
      type = 'refund';
      title = 'استرداد مالي';
      amount = -Math.floor(Math.random() * 200) - 20;
    } else if (rand < 0.2) {
      type = 'expense';
      title = 'تكاليف تشغيلية';
      amount = -Math.floor(Math.random() * 300) - 30;
    } else if (rand < 0.4) {
      type = 'withdrawal';
      title = 'عملية سحب ناجحة';
      amount = -Math.floor(Math.random() * 500) - 50;
    } else if (rand < 0.5) {
      type = 'reward';
      title = 'مكافأة ولاء';
      amount = Math.floor(Math.random() * 100) + 10;
    }
    
    currentRevenue += amount;

    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      detail: `تحديث مباشر • ${new Date().toLocaleTimeString('ar-EG')}`,
      amount: amount,
      status: 'completed',
      type: type,
      user: ['Yousef', 'Maria', 'Zaid', 'Noor'][Math.floor(Math.random() * 4)],
      date: new Date().toISOString(),
    };

    transactions = [newTx, ...transactions].slice(0, 10);

    io.emit("data_update", {
      revenue: currentRevenue,
      newTransaction: newTx,
      transactions: transactions
    });
  }, 5000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
