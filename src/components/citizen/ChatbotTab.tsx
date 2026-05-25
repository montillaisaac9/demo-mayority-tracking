"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { faqAnswers } from "@/lib/mockData";
import { cn } from "@/lib/cn";

type Message = { from: "bot" | "user"; text: string; time: string };
type ReportStep = "idle" | "awaiting_type" | "awaiting_location" | "awaiting_photo" | "done";

const now = () => new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });

const initialMessages: Message[] = [
  { from: "bot", text: "¡Hola! Soy Nagua, tu asistente virtual. ¿En qué te puedo ayudar hoy?", time: now() },
];

export default function ChatbotTab() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [reportStep, setReportStep] = useState<ReportStep>("idle");
  const [faqUsed, setFaqUsed] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const botReply = (text: string) => {
    setTimeout(() => addMessage({ from: "bot", text, time: now() }), 500);
  };

  const handleFAQ = (key: "horario" | "fundanagua" | "impuestos") => {
    if (faqUsed.has(key)) return;
    setFaqUsed((prev) => new Set([...prev, key]));
    const labels: Record<string, string> = {
      horario: "¿Horario del Registro Civil?",
      fundanagua: "¿Dónde queda Fundanagua?",
      impuestos: "¿Dónde pago impuestos comerciales?",
    };
    addMessage({ from: "user", text: labels[key], time: now() });
    botReply(faqAnswers[key]);
  };

  const startReport = () => {
    addMessage({ from: "user", text: "Quiero hacer un reporte", time: now() });
    setReportStep("awaiting_type");
    botReply("¡Entendido! Vamos a registrarlo. Selecciona el tipo de problema:");
  };

  const handleReportType = (type: string) => {
    addMessage({ from: "user", text: type, time: now() });
    setReportStep("awaiting_location");
    botReply("Por favor, indícame la dirección exacta o el sector de Naguanagua donde ocurre el problema.");
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ from: "user", text, time: now() });
    setInput("");

    if (text.toLowerCase().includes("reporte") && reportStep === "idle") {
      setReportStep("awaiting_type");
      botReply("¡Entendido! Vamos a registrarlo. Selecciona el tipo de problema:");
      return;
    }
    if (reportStep === "awaiting_location") {
      setReportStep("awaiting_photo");
      botReply("¡Copiado! Para procesarlo más rápido, adjunta una foto de la falla (o presiona 'Omitir').");
      return;
    }
    if (reportStep === "idle") {
      botReply("Entiendo tu consulta. Para más información puedes usar los botones de acceso rápido o escribir 'Quiero hacer un reporte' para registrar una falla.");
    }
  };

  const handleSkipPhoto = () => {
    setReportStep("done");
    addMessage({ from: "user", text: "Omitir foto", time: now() });
    botReply("¡Listo! Reporte recibido con éxito. Nuestra IA lo ha clasificado como Prioridad Alta por la ubicación. Ticket: #NGN-4029. ¡Gracias por ayudarnos! 🎉");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-blue-700">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Nagua</p>
          <p className="text-[10px] text-blue-200">Asistente Virtual · En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2 max-w-[85%]", msg.from === "user" ? "self-end flex-row-reverse" : "self-start")}>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.from === "bot" ? "bg-blue-700" : "bg-gray-300")}>
              {msg.from === "bot"
                ? <Bot className="w-3.5 h-3.5 text-white" />
                : <User className="w-3.5 h-3.5 text-gray-600" />}
            </div>
            <div>
              <div className={cn("rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm",
                msg.from === "bot"
                  ? "bg-white text-gray-800 rounded-tl-none"
                  : "bg-blue-700 text-white rounded-tr-none")}>
                {msg.text}
              </div>
              <p className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {/* FAQ quick buttons (show only at start) */}
        {messages.length <= 2 && (
          <div className="flex flex-col gap-1.5 mt-1">
            {[
              { key: "horario" as const, label: "¿Horario del Registro Civil?" },
              { key: "fundanagua" as const, label: "¿Dónde queda Fundanagua?" },
              { key: "impuestos" as const, label: "¿Dónde pago impuestos?" },
            ].map((faq) => (
              <button
                key={faq.key}
                onClick={() => handleFAQ(faq.key)}
                className="self-start bg-white border border-blue-200 text-blue-700 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition-colors"
              >
                {faq.label}
              </button>
            ))}
            <button
              onClick={startReport}
              className="self-start bg-blue-700 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm hover:bg-blue-800 transition-colors"
            >
              📋 Reportar una falla
            </button>
          </div>
        )}

        {/* Report type selector */}
        {reportStep === "awaiting_type" && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {["Bote de agua", "Falla de luz", "Bache/Hueco"].map((type) => (
              <button
                key={type}
                onClick={() => handleReportType(type)}
                className="bg-white border border-gray-300 text-gray-700 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-sm hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Skip photo button */}
        {reportStep === "awaiting_photo" && (
          <div className="flex gap-2 mt-1">
            <button className="bg-white border border-gray-300 text-gray-700 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <Paperclip className="w-3 h-3" /> Subir Foto
            </button>
            <button
              onClick={handleSkipPhoto}
              className="bg-white border border-blue-200 text-blue-700 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition-colors"
            >
              Omitir
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0 hover:bg-blue-800 transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}
