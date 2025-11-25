import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar as CalendarIcon,
    BarChart3,
    Upload,
    MessageSquare,
    Leaf,
    TrendingUp,
    Users,
    ShoppingBag,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Send,
    AlertCircle,
    Target,
    Loader2,
    Globe,
    ShoppingCart,
    Heart,
    Gift,
    DollarSign,
    Zap
} from 'lucide-react';

// --- Mock Data & Constants ---

const SDG_COLORS = {
    8: 'bg-red-100 text-red-800 border-red-200',
    9: 'bg-orange-100 text-orange-800 border-orange-200',
    11: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    12: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const INITIAL_EVENTS = [
    // Q4 Existing
    { id: 1, title: 'Winter Clearance', date: '2023-11-05', category: 'Promotion', sdg: 12, type: 'campaign' },
    { id: 2, title: 'Diwali Peak Sale', date: '2023-11-12', category: 'High Demand', sdg: 8, type: 'peak' },
    { id: 3, title: 'Eco-Packaging Supplier Meet', date: '2023-11-15', category: 'Supply Chain', sdg: 9, type: 'logistics' },
    { id: 4, title: 'Green Friday (Alt Black Friday)', date: '2023-11-24', category: 'Sustainability', sdg: 12, type: 'campaign' },

    // Q1 Festivals
    { id: 5, title: 'New Year Kickoff', date: '2023-01-01', category: 'Promotion', sdg: 8, type: 'campaign' },
    { id: 6, title: 'Pongal Harvest Festival', date: '2023-01-14', category: 'Cultural', sdg: 12, type: 'peak' },
    { id: 7, title: 'Valentine\'s Day', date: '2023-02-14', category: 'High Demand', sdg: 12, type: 'peak' },

    // Q2 Festivals
    { id: 8, title: 'Easter Special', date: '2023-03-31', category: 'Seasonal', sdg: 12, type: 'campaign' }, // Representative date
    { id: 9, title: 'Earth Day Eco-Drive', date: '2023-04-22', category: 'Sustainability', sdg: 11, type: 'campaign' },
    { id: 10, title: 'Mother\'s Day', date: '2023-05-12', category: 'High Demand', sdg: 8, type: 'peak' },

    // Q3 Festivals
    { id: 11, title: 'Summer Solstice Sale', date: '2023-06-21', category: 'Promotion', sdg: 12, type: 'campaign' },
    { id: 12, title: 'Back to School', date: '2023-08-20', category: 'High Demand', sdg: 4, type: 'peak' },

    // Q4 Additional
    { id: 13, title: 'Halloween Spooktacular', date: '2023-10-31', category: 'Seasonal', sdg: 12, type: 'campaign' },
    { id: 14, title: 'Cyber Monday', date: '2023-11-27', category: 'Promotion', sdg: 8, type: 'campaign' },
    { id: 15, title: 'Christmas Eve', date: '2023-12-24', category: 'High Demand', sdg: 12, type: 'peak' },
    { id: 16, title: 'Christmas Day', date: '2023-12-25', category: 'Holiday', sdg: 12, type: 'peak' },
    { id: 17, title: 'Boxing Day Clearance', date: '2023-12-26', category: 'Promotion', sdg: 8, type: 'campaign' },
];

const INITIAL_STRATEGY = {
    salesBoost: [
        { title: "Flash Bundle", desc: "Pair slow-moving scarves with popular coats.", impact: "High", icon: <Zap size={16} /> },
        { title: "Loyalty Early Access", desc: "Open winter sales 24h early for members.", impact: "Med", icon: <Users size={16} /> }
    ],
    demandPrediction: [
        { item: "Winter Coats", trend: "up", value: "+45%", note: "Cold snap incoming" },
        { item: "Light Jackets", trend: "down", value: "-12%", note: "Season ending" },
        { item: "Thermal Wear", trend: "up", value: "+30%", note: "Holiday travel peak" }
    ],
    marketState: "High Competition - Competitors discounting early. Recommend value-add over price drops.",
    ecoIdeas: [
        { title: "Repair Workshop", desc: "Host event to repair old clothes instead of buying new.", sdg: 12 },
        { title: "Zero-Plastic Shipping", desc: "Switch to honeycomb paper for Q4 orders.", sdg: 12 }
    ]
};

const INITIAL_INVENTORY = [
    { id: 1, name: "Organic Wool Sweater", stock: 450, price: 99.00, status: "Healthy", suggestion: "Promote", ecoScore: "A", demand: "High" },
    { id: 2, name: "Summer Linen Shirt", stock: 800, price: 45.00, status: "Overstock", suggestion: "Bundle/Clearance", ecoScore: "B+", demand: "Low" },
    { id: 3, name: "Recycled Poly Parka", stock: 50, price: 199.00, status: "Low Stock", suggestion: "Restock Urgent", ecoScore: "A+", demand: "Very High" },
    { id: 4, name: "Basic Cotton Tee", stock: 200, price: 25.00, status: "Healthy", suggestion: "Maintain", ecoScore: "B", demand: "Stable" },
];

const SEASONAL_OPPORTUNITIES = [
    { name: "Valentine's Day", date: "Feb 14", icon: <Heart size={20} className="text-red-500" />, focus: "Gifting & Comfort Wear" },
    { name: "Mother's Day", date: "May 12", icon: <Gift size={20} className="text-pink-500" />, focus: "Sustainable Self-Care" },
    { name: "Summer Sale", date: "Jul 1", icon: <Zap size={20} className="text-yellow-500" />, focus: "Lightweight, Travel Gear" },
];

// --- Components ---

const SDGTag = ({ number }) => {
    const descriptions = {
        8: "SDG 8: Decent Work",
        9: "SDG 9: Industry",
        11: "SDG 11: Cities",
        12: "SDG 12: Consumption"
    };

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${SDG_COLORS[number] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {descriptions[number]}
        </span>
    );
};

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [strategy, setStrategy] = useState(INITIAL_STRATEGY);
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false); // New state for button
    const [analysisData, setAnalysisData] = useState(null);
    const [showChat, setShowChat] = useState(false); // Default to closed on mobile
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Default to collapsed

    // --- Calendar State ---
    const [currentDate, setCurrentDate] = useState(new Date(2023, 10, 1));
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventSDG, setNewEventSDG] = useState(12);

    // --- Chat State ---
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am SeasonBot. Use the dedicated "Dynamic Pricing" tab for price optimization, or the "Engagement" tab for customer retention and abandonment strategies.' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null); // Ref for hidden file input

    // --- Handlers ---

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsAnalyzing(true);
        const fileName = file.name;

        event.target.value = null;

        setTimeout(() => {
            setIsAnalyzing(false);
            setFileUploaded(true);

            setAnalysisData({
                topProduct: "Recycled Poly Parka",
                wasteReduction: "18%",
                projectedRevenue: "$142,000",
                nextPeak: "Cyber Monday (Nov 27)"
            });

            setStrategy(prev => ({
                ...prev,
                salesBoost: [...prev.salesBoost, { title: "Clearance Push", desc: "Uploaded data shows excess Linen Shirts.", impact: "High", icon: <TrendingUp size={16} /> }],
                marketState: "Uploaded report indicates a shift towards durable winter wear. Pivot marketing to 'Longevity'."
            }));

            addMessage('ai', `I have analyzed "${fileName}". I detected high demand for Parkas and overstock in Summer items. Check the Inventory and Strategy tabs for updates.`);
        }, 2000);
    };

    const handleGenerateStrategy = () => {
        setIsGeneratingStrategy(true);
        // Simulate AI generation delay
        setTimeout(() => {
            const newStrategy = {
                title: "Influencer Collab",
                desc: "Partner with eco-conscious micro-influencers to promote recycled parka.",
                impact: "High",
                icon: <Users size={16} />
            };

            setStrategy(prev => ({
                ...prev,
                salesBoost: [...prev.salesBoost, newStrategy]
            }));

            setIsGeneratingStrategy(false);
            addMessage('ai', "I've added a new 'Influencer Collab' strategy to your Sales Boosters list based on current engagement trends.");
        }, 1500);
    };

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, text }]);
    };

    const submitChatQuery = async (userText) => {
        if (!userText.trim() || isChatLoading) return;

        addMessage('user', userText);
        setIsChatLoading(true);

        try {
            // Gemini API Call (Retry with Exponential Backoff)
            const apiKey = "";
            const maxRetries = 3;
            let attempt = 0;
            let response;

            while (attempt < maxRetries) {
                try {
                    response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [{
                                        text: `
                  You are SeasonBot, an expert retail AI assistant for "SeasonSphere", specializing in strategy, inventory, customer engagement, and dynamic pricing. You act as a Cart Abandonment Agent (using nudges, offers, and sustainability incentives), a Seasonal Customer Retention Agent, and a Dynamic Pricing Expert (optimizing offers).
                  Current App State:
                  - Tab: ${activeTab}
                  - Uploaded File: ${fileUploaded ? "Yes" : "No"}
                  - Strategy Market State: ${strategy.marketState}
                  - Inventory Issues: ${inventory.filter(i => i.status !== 'Healthy').map(i => i.name + ' (' + i.status + ')').join(', ')}
                  
                  User Query: ${userText}
                  
                  Provide a helpful, concise response (max 3 sentences) based on your role, focusing on retail strategy, customer engagement, sustainability (SDGs), or pricing/offers. If asked to draft a message or recommend a pricing strategy, provide the draft or recommendation clearly.
                ` }]
                                }]
                            })
                        }
                    );
                    if (response.ok) break; // Exit loop if successful
                } catch (e) {
                    // Log error but continue with backoff
                }

                attempt++;
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            if (!response || !response.ok) {
                throw new Error("API call failed after retries.");
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting to the strategy engine right now.";
            addMessage('ai', aiResponse);

        } catch (error) {
            console.error("Chat Error:", error);
            addMessage('ai', "I'm sorry, I can't process that right now. Please try again.");
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        const text = chatInput;
        setChatInput('');
        submitChatQuery(text);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatLoading]);

    // --- Calendar Logic ---

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleAddEvent = () => {
        if (!newEventTitle || !selectedDate) return;
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
        const newEvent = { id: Date.now(), title: newEventTitle, date: dateStr, category: 'Manual', sdg: parseInt(newEventSDG), type: 'campaign' };
        setEvents([...events, newEvent]);
        setSelectedDate(null);
        setNewEventTitle('');
        addMessage('ai', `Added "${newEventTitle}" to calendar.`);
    };

    const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));

    // --- Main Render ---

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 
        ${isSidebarExpanded ? 'w-64' : 'w-20'} 
        lg:sticky lg:h-screen lg:shrink-0
        bg-slate-900 text-white flex flex-col justify-between transition-all duration-300
        ${isSidebarExpanded ? 'shadow-xl' : 'shadow-none'}
      `}>
                {/* Sidebar Header/Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">S</div>
                    {isSidebarExpanded && <span className="font-bold text-lg tracking-tight transition-opacity duration-300">SeasonSphere</span>}
                </div>

                {/* Navigation - Scrollable Section */}
                <div className="flex-1 overflow-y-auto">
                    <nav className="mt-4 flex flex-col gap-2 px-3">
                        {[
                            { id: 'dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
                            { id: 'calendar', icon: <CalendarIcon size={20} />, label: 'Calendar' },
                            { id: 'strategy', icon: <Target size={20} />, label: 'AI Strategy' },
                            { id: 'inventory', icon: <ShoppingBag size={20} />, label: 'Inventory' },
                            { id: 'pricing', icon: <DollarSign size={20} />, label: 'Dynamic Pricing' },
                            { id: 'engagement', icon: <Users size={20} />, label: 'Engagement' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsSidebarExpanded(false); }} // Collapse on mobile click
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                title={item.label}
                            >
                                {item.icon}
                                {isSidebarExpanded && <span className="font-medium">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer (Eco Score and Collapse Button) */}
                <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
                    {isSidebarExpanded && (
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Leaf size={16} /></div>
                            <div>
                                <p className="text-xs text-slate-400">Eco Score</p>
                                <p className="text-sm font-bold text-emerald-400">A+ (92%)</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="w-full p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700 transition-colors flex items-center justify-center"
                        title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
                    >
                        {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-screen overflow-hidden ${isSidebarExpanded ? 'ml-64 lg:ml-20' : 'ml-20'} lg:ml-0 transition-all duration-300`}>
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
                    <h1 className="text-lg md:text-xl font-bold capitalize text-slate-800 truncate max-w-[50%]">
                        {activeTab === 'dashboard' ? 'Seasonal Overview' :
                            activeTab === 'strategy' ? 'Strategic Planning' :
                                activeTab === 'pricing' ? 'Dynamic Pricing & Offers' :
                                    activeTab === 'engagement' ? 'Customer Engagement Agents' :
                                        activeTab}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowChat(!showChat)} className={`p-2 rounded-full transition-colors ${showChat ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><MessageSquare size={20} /></button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300 hidden sm:flex">U</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative">

                    {/* Dashboard View */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 max-w-6xl mx-auto">
                            {/* File Upload Trigger */}
                            <div
                                className="bg-white rounded-2xl p-6 md:p-8 border-2 border-dashed border-slate-300 text-center hover:border-blue-400 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    {isAnalyzing ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">{isAnalyzing ? 'Processing...' : 'Upload Report'}</h3>
                                <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">Upload PDF/CSV to update Strategy and Inventory insights.</p>
                            </div>

                            {(fileUploaded || analysisData) && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                                    <div className="bg-white p-4 rounded-xl border shadow-sm"><p className="text-slate-500 text-xs md:text-sm">Top Selling</p><p className="text-lg md:text-xl font-bold">{analysisData.topProduct}</p></div>
                                    <div className="bg-white p-4 rounded-xl border shadow-sm"><p className="text-slate-500 text-xs md:text-sm">Waste Reduction</p><p className="text-lg md:text-xl font-bold">{analysisData.wasteReduction}</p></div>
                                    <div className="bg-white p-4 rounded-xl border shadow-sm"><p className="text-slate-500 text-xs md:text-sm">Revenue Forecast</p><p className="text-lg md:text-xl font-bold">{analysisData.projectedRevenue}</p></div>
                                    <div className="bg-white p-4 rounded-xl border shadow-sm"><p className="text-slate-500 text-xs md:text-sm">Next Peak</p><p className="text-lg md:text-xl font-bold">{analysisData.nextPeak}</p></div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dynamic Pricing View (NEW TAB) */}
                    {activeTab === 'pricing' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Dynamic Pricing & Offer Optimization</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Dynamic Pricing & Offer Optimization Agent */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-3 mb-4 text-slate-800"><DollarSign className="text-purple-500" size={24} /> Offer Optimization Agent</h3>
                                    <p className="text-slate-600 mb-6 text-sm">Optimize pricing and offers based on real-time market data, inventory, and product sustainability value.</p>

                                    <div className="space-y-4">
                                        <label htmlFor="price-product" className="block text-sm font-medium text-slate-700">Select Product to Optimize</label>
                                        <select id="price-product" className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 text-sm">
                                            {inventory.map(item => (
                                                <option key={item.id} value={item.name}>{item.name} (Current: ${item.price.toFixed(2)})</option>
                                            ))}
                                        </select>

                                        <label htmlFor="price-goal" className="block text-sm font-medium text-slate-700">Optimization Goal</label>
                                        <select id="price-goal" className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 text-sm">
                                            <option value="profit">Maximize Profit Margin</option>
                                            <option value="clearance">Urgent Stock Clearance (Overstock)</option>
                                            <option value="eco_highlight">Highlight Sustainability Value (Green Discount)</option>
                                            <option value="seasonal_bundle">Seasonal Bundle Strategy</option>
                                            <option value="competitor_match">Match Competitor Pricing</option>
                                        </select>

                                        <button
                                            onClick={() => {
                                                const productSelect = document.getElementById('price-product');
                                                const goalSelect = document.getElementById('price-goal');
                                                const selectedProduct = productSelect.value;
                                                const selectedGoal = goalSelect.options[goalSelect.selectedIndex].text;

                                                setShowChat(true);
                                                submitChatQuery(`Act as a Dynamic Pricing Expert. Generate an optimization recommendation for product "${selectedProduct}" with the goal: "${selectedGoal}". Suggest the optimal price change (e.g., +5% or -10%) and the specific offer type (flash sale, bundle, or green discount).`);
                                            }}
                                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm mt-6"
                                        >
                                            <Zap size={18} /> Analyze & Recommend Offer
                                        </button>
                                    </div>
                                </div>

                                {/* Pricing Summary Card */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="text-blue-500" size={20} /> Pricing Insights</h3>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800 mb-1">Current Competitor Index:</p>
                                        <p className="text-2xl font-bold text-blue-900">1.02 <span className="text-base font-normal text-blue-700">(2% Above Average)</span></p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <p className="text-sm font-medium text-emerald-800 mb-1">Eco-Premium Potential:</p>
                                        <p className="text-xl font-bold text-emerald-900">Up to +15%</p>
                                        <p className="text-xs text-emerald-700">For products with A+ Eco Scores (Parka, Sweater).</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                        <p className="text-sm font-medium text-red-800 mb-1">Clearance Urgency:</p>
                                        <p className="text-xl font-bold text-red-900">Summer Linen Shirt</p>
                                        <p className="text-xs text-red-700">Recommend -30% flash sale to reduce holding costs.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}


                    {/* Customer Engagement View */}
                    {activeTab === 'engagement' && (
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* 1. Cart Abandonment Agent */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                                <h3 className="text-xl font-bold flex items-center gap-3 mb-4 text-slate-800"><ShoppingCart className="text-blue-500" size={24} /> Cart Abandonment Nudge</h3>
                                <p className="text-slate-600 mb-6 text-sm">Engage customers who left items in their cart using timely incentives based on their profile or sustainability interest.</p>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
                                    <p className="font-semibold text-blue-800">Identified Dropper:</p>
                                    <p className="text-sm text-blue-700">Jane Doe (Last purchased: Recycled Cotton)</p>
                                </div>

                                <div className="space-y-4">
                                    <select id="nudge-strategy" className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm">
                                        <option value="eco">Offer Free Eco-Shipping (Sustainability Incentive)</option>
                                        <option value="discount">5% Off Item in Cart (Price Nudge)</option>
                                        <option value="scarcity">24h Hold on Item (Scarcity Nudge)</option>
                                    </select>

                                    <button
                                        onClick={() => {
                                            const select = document.getElementById('nudge-strategy');
                                            const selectedStrategy = select.options[select.selectedIndex].text;
                                            setShowChat(true);
                                            submitChatQuery(`Draft a specific cart abandonment chat message for Jane Doe using the strategy: "${selectedStrategy}".`);
                                        }}
                                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Send size={18} /> Trigger Automated Nudge
                                    </button>
                                </div>
                            </div>

                            {/* 2. Seasonal Retention Agent */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                                <h3 className="text-xl font-bold flex items-center gap-3 mb-4 text-slate-800"><CalendarIcon className="text-emerald-500" size={24} /> Seasonal Retention Agent</h3>
                                <p className="text-slate-600 mb-6 text-sm">Prepare outreach strategies for upcoming seasonal and cultural events.</p>

                                <div className="space-y-4">
                                    {SEASONAL_OPPORTUNITIES.map((event, i) => (
                                        <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div className='mb-2 sm:mb-0'>
                                                <div className="flex items-center gap-2 font-bold text-lg text-emerald-800 mb-1">{event.icon} {event.name}</div>
                                                <p className="text-sm text-emerald-700">Focus: {event.focus}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowChat(true);
                                                    submitChatQuery(`Draft a full retention strategy for the upcoming "${event.name}" event. Include 3 suggested email subject lines and a sustainability-themed campaign idea.`);
                                                }}
                                                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 transition-colors"
                                            >
                                                Draft Strategy
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Strategy View */}
                    {activeTab === 'strategy' && (
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Sales Boosters */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Zap className="text-amber-500" size={20} /> Sales Boosters</h3>
                                <div className="space-y-3">
                                    {strategy.salesBoost.map((idea, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-xl flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <div className="mt-1 text-blue-600">{idea.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{idea.title}</p>
                                                    <p className="text-sm text-slate-600">{idea.desc}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded shrink-0">{idea.impact} Impact</span>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleGenerateStrategy}
                                        disabled={isGeneratingStrategy}
                                        className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {isGeneratingStrategy ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                                        {isGeneratingStrategy ? "Generating Strategy..." : "Generate More"}
                                    </button>
                                </div>
                            </div>

                            {/* Demand Prediction */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><TrendingUp className="text-blue-500" size={20} /> Demand Prediction</h3>
                                <div className="space-y-4">
                                    {strategy.demandPrediction.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="w-1/3">
                                                <p className="font-medium text-slate-800">{item.item}</p>
                                                <p className="text-xs text-slate-500 truncate">{item.note}</p>
                                            </div>
                                            <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className={`h-full rounded-full ${item.trend === 'up' ? 'bg-blue-500' : 'bg-red-400'}`} style={{ width: item.trend === 'up' ? '80%' : '30%' }}></div>
                                            </div>
                                            <span className={`text-sm font-bold ${item.trend === 'up' ? 'text-blue-600' : 'text-red-500'} shrink-0`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                {!fileUploaded && <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex gap-2 items-center"><AlertCircle size={16} /> Upload historical data for 98% accuracy.</div>}
                            </div>

                            {/* Market State */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Globe className="text-indigo-500" size={20} /> Market State Analysis</h3>
                                        <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{strategy.marketState}</p>
                                    </div>
                                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 pl-0 md:pl-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Leaf className="text-emerald-500" size={20} /> Eco-Initiatives</h3>
                                        <div className="space-y-3">
                                            {strategy.ecoIdeas.map((idea, i) => (
                                                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-emerald-50 p-2 rounded-lg transition-colors">
                                                    <div>
                                                        <p className="font-medium text-slate-800 group-hover:text-emerald-800">{idea.title}</p>
                                                        <p className="text-xs text-slate-500">{idea.desc}</p>
                                                    </div>
                                                    <SDGTag number={idea.sdg} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory View */}
                    {activeTab === 'inventory' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 sm:mb-0">Smart Inventory Matrix</h2>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-sm bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2 shrink-0"
                                >
                                    <Upload size={14} /> Add Stock File
                                </button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                                <table className="min-w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                            <th className="p-4 font-semibold whitespace-nowrap">Product Name</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">Stock Level</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">Demand</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">Eco Score</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">Price</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">AI Suggestion</th>
                                            <th className="p-4 font-semibold whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {inventory.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 text-sm font-medium text-slate-800 whitespace-nowrap">{item.name}</td>
                                                <td className="p-4 text-sm whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock < 100 ? 'bg-red-100 text-red-700' : item.stock > 600 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                        {item.stock} Units
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{item.demand}</td>
                                                <td className="p-4 text-sm whitespace-nowrap">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${item.ecoScore.includes('A') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                                        {item.ecoScore}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-slate-800 whitespace-nowrap">${item.price.toFixed(2)}</td>
                                                <td className="p-4 text-sm text-blue-600 font-medium whitespace-nowrap">{item.suggestion}</td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <button onClick={() => { setActiveTab('pricing') }} className="text-slate-400 hover:text-purple-600 flex items-center gap-1 text-sm"><DollarSign size={16} /> Price</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Calendar View */}
                    {activeTab === 'calendar' && (
                        <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50">
                                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                    <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                                    <div className="flex items-center bg-white rounded-lg border border-slate-300">
                                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 rounded-l-lg"><ChevronLeft size={18} /></button>
                                        <div className="w-[1px] h-4 bg-slate-300"></div>
                                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 rounded-r-lg"><ChevronRight size={18} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Grid Container with horizontal scroll for mobile */}
                            <div className="flex-1 overflow-x-auto overflow-y-auto">
                                <div className="grid grid-cols-7 min-w-[700px]">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 bg-slate-50">{day}</div>))}

                                    {/* Calendar Days */}
                                    {(() => {
                                        const daysInMonth = getDaysInMonth(currentDate);
                                        const firstDay = getFirstDayOfMonth(currentDate);
                                        const days = [];
                                        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-28 bg-slate-50 border border-slate-100"></div>);
                                        for (let day = 1; day <= daysInMonth; day++) {
                                            // Modified logic to ignore year for recurring events
                                            const currentMonth = currentDate.getMonth();
                                            const dayEvents = events.filter(e => {
                                                const [y, m, d] = e.date.split('-').map(Number);
                                                // Check if day matches AND month matches (m is 1-indexed in date string, so m-1)
                                                return d === day && (m - 1) === currentMonth;
                                            });

                                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                            days.push(
                                                <div key={day} onClick={() => setSelectedDate(day)} className={`h-28 border border-slate-100 p-1 relative hover:bg-slate-50 cursor-pointer transition-colors ${selectedDate === day ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : 'bg-white'}`}>
                                                    <span className="text-xs font-semibold text-slate-500 ml-1">{day}</span>
                                                    <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] no-scrollbar">
                                                        {dayEvents.map(event => (
                                                            <div key={event.id} className="group relative">
                                                                <div className={`text-[10px] p-1 rounded border truncate flex items-center gap-1 ${SDG_COLORS[event.sdg] || 'bg-gray-100'}`}>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>{event.title}
                                                                </div>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} className="absolute top-0 right-0 hidden group-hover:flex bg-red-500 text-white rounded-full p-0.5 w-4 h-4 items-center justify-center text-[10px]"><X size={8} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return days;
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Event Modal */}
                    {selectedDate && activeTab === 'calendar' && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Add Event</h3>
                                    <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                                </div>
                                <input type="text" placeholder="Event Title" className="w-full p-2 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
                                <div className="flex gap-2 mb-6 flex-wrap">{[8, 9, 11, 12].map(num => (<button key={num} onClick={() => setNewEventSDG(num)} className={`px-3 py-1 text-xs rounded-full border ${newEventSDG === num ? 'bg-slate-800 text-white' : 'bg-white border-slate-300 text-slate-600'}`}>SDG {num}</button>))}</div>
                                <button onClick={handleAddEvent} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add to Calendar</button>
                            </div>
                        </div>
                    )}

                    {/* Hidden File Input (Used by Dashboard and Inventory) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv, .pdf, .json"
                        disabled={isAnalyzing}
                    />
                </main>
            </div>

            {/* Chatbot Sidebar/Overlay */}
            <div className={`
        fixed right-0 top-0 bottom-0 z-50 
        ${showChat ? 'translate-x-0' : 'translate-x-full'} 
        w-full lg:w-80
        transition-transform duration-300 
        bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-2xl
      `}>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>SeasonBot <span className="text-[10px] text-blue-500 font-normal bg-blue-50 px-1 rounded">Gemini-Powered</span></h2>
                    <button onClick={() => setShowChat(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {isChatLoading && <div className="flex justify-start"><div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200"><Loader2 size={16} className="animate-spin text-slate-400" /></div></div>}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Ask SeasonBot..." className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isChatLoading} />
                        <button type="submit" disabled={isChatLoading} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"><Send size={16} /></button>
                    </div>
                    <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
                        {['Analyze Market', 'Low Stock?', 'Suggest Promo'].map(quick => (
                            <button key={quick} type="button" onClick={() => { setChatInput(quick); }} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md whitespace-nowrap hover:bg-slate-200">{quick}</button>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
}
