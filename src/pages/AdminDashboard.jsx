import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEvents } from '../context/EventContext.jsx';

function AdminDashboard() {
    const [activePage, setActivePage] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [newEvent, setNewEvent] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const { user, registeredUsers, logout } = useAuth();
    const { events, registrations, addEvent, removeEvent } = useEvents();
    const navigate = useNavigate();

    const handleAddEvent = () => {
        if (!newEvent.trim() || !newEventDate) return;
        addEvent(newEvent.trim(), newEventDate);
        setNewEvent(''); setNewEventDate('');
    };
    const handleRemoveEvent = (n) => { removeEvent(n); setConfirmDelete(null); };
    const handleLogout = () => { logout(); navigate('/'); };

    const totalStudents = registeredUsers ? registeredUsers.filter(u => u.role === 'Student').length : 0;
    const uniqueReg = [...new Set(registrations.map(r => r.email))].length;
    const fmt = (d) => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
    const isExpired = (dateStr) => { if (!dateStr) return false; const today = new Date(); today.setHours(0,0,0,0); return new Date(dateStr+'T00:00:00') < today; };

    const sideItems = [
        {id:'overview',label:'Dashboard',icon:'📊'},{id:'add-events',label:'Add Events',icon:'✨'},
        {id:'manage-events',label:'Manage Events',icon:'📅'},{id:'registrations',label:'Registrations',icon:'📋'},
        {id:'settings',label:'Settings',icon:'⚙️'}
    ];
    const stats = [
        {icon:'📅',value:events.length,label:'Total Events',g:'linear-gradient(135deg,#6366f1,#a855f7)'},
        {icon:'📝',value:registrations.length,label:'Total Registrations',g:'linear-gradient(135deg,#a855f7,#ec4899)'},
        {icon:'🎓',value:totalStudents,label:'Registered Students',g:'linear-gradient(135deg,#3b82f6,#6366f1)'},
        {icon:'✅',value:uniqueReg,label:'Active Participants',g:'linear-gradient(135deg,#10b981,#14b8a6)'}
    ];
    const iS={width:'100%',padding:'12px 16px',borderRadius:'12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#fff',fontSize:'0.95rem',outline:'none',fontFamily:'inherit',boxSizing:'border-box'};

    const Sidebar = () => (
        <aside className="glass-strong" style={{width:sidebarOpen?'260px':'0',overflow:sidebarOpen?'visible':'hidden',opacity:sidebarOpen?1:0,display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',flexShrink:0,transition:'all 0.3s',borderRight:sidebarOpen?'1px solid rgba(255,255,255,0.1)':'none'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <span style={{fontSize:'1.8rem'}}>🛡️</span>
                    <div><div style={{fontSize:'1.05rem',fontWeight:800,color:'#fff'}}>EventHub</div><div style={{fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'1.5px',color:'#818cf8'}}>Admin Panel</div></div>
                </div>
                <button onClick={()=>setSidebarOpen(false)} style={{width:'32px',height:'32px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#9ca3af',fontSize:'0.9rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            <nav style={{flex:1,padding:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
                {sideItems.map(i=>(
                    <button key={i.id} onClick={()=>setActivePage(i.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderRadius:'12px',border:'none',fontSize:'0.88rem',fontWeight:activePage===i.id?600:500,fontFamily:'inherit',cursor:'pointer',textAlign:'left',background:activePage===i.id?'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.08))':'transparent',color:activePage===i.id?'#818cf8':'#9ca3af'}}>
                        <span style={{fontSize:'1.1rem',width:'24px',textAlign:'center'}}>{i.icon}</span><span>{i.label}</span>
                    </button>
                ))}
            </nav>
            <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#a855f7)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>{user?.name?.charAt(0)?.toUpperCase()||'A'}</div>
                    <div style={{overflow:'hidden'}}><div style={{fontSize:'0.88rem',fontWeight:600,color:'#fff'}}>{user?.name||'Admin'}</div><div style={{fontSize:'0.72rem',color:'#6b7280'}}>{user?.email||''}</div></div>
                </div>
                <button onClick={handleLogout} style={{width:'100%',padding:'10px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#9ca3af',fontSize:'0.85rem',fontWeight:600,fontFamily:'inherit',cursor:'pointer'}}>Logout</button>
            </div>
        </aside>
    );

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'linear-gradient(135deg,#0f0c29 0%,#1a1145 30%,#302b63 60%,#24243e 100%)'}}>
            <Sidebar/>
            {!sidebarOpen&&<button onClick={()=>setSidebarOpen(true)} className="glass-strong" style={{position:'fixed',top:'16px',left:'16px',zIndex:200,width:'40px',height:'40px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.1)',color:'#9ca3af',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>☰</button>}

            <main style={{flex:1,overflowY:'auto',height:'100vh'}}>
                <div style={{padding:'36px 40px',paddingLeft:sidebarOpen?'40px':'72px',maxWidth:'1100px'}}>

                    {activePage==='overview'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Dashboard Overview</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Welcome back, {user?.name||'Admin'}!</p></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px',marginBottom:'36px'}}>
                            {stats.map((s,i)=>(<div key={i} className="glass" style={{borderRadius:'16px',padding:'24px',display:'flex',alignItems:'center',gap:'16px'}}><div style={{width:'52px',height:'52px',borderRadius:'14px',background:s.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>{s.icon}</div><div><div style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',lineHeight:1}}>{s.value}</div><div style={{fontSize:'0.78rem',color:'#9ca3af',marginTop:'4px'}}>{s.label}</div></div></div>))}
                        </div>
                        <h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>🕐 Recent Registrations</h2>
                        {registrations.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>No registrations yet.</div>:
                        <div className="glass" style={{borderRadius:'16px',overflow:'hidden',marginBottom:'36px'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.9rem'}}><thead><tr style={{background:'rgba(255,255,255,0.05)'}}>
                            {['#','Student','Event','Email'].map(h=><th key={h} style={{padding:'14px 20px',textAlign:'left',fontWeight:600,color:'#9ca3af',fontSize:'0.8rem',textTransform:'uppercase'}}>{h}</th>)}
                        </tr></thead><tbody>{registrations.slice(-5).reverse().map((r,i)=><tr key={i} style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                            <td style={{padding:'14px 20px',color:'#6b7280',fontWeight:600}}>{registrations.length-i}</td>
                            <td style={{padding:'14px 20px',color:'#fff',fontWeight:600}}>{r.studentName}</td>
                            <td style={{padding:'14px 20px'}}><span style={{padding:'3px 12px',borderRadius:'50px',fontSize:'0.8rem',fontWeight:600,background:'rgba(99,102,241,0.15)',color:'#818cf8'}}>{r.eventName}</span></td>
                            <td style={{padding:'14px 20px',color:'#d1d5db'}}>{r.email}</td>
                        </tr>)}</tbody></table></div>}
                        <h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>📅 Events Overview</h2>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{events.map((ev,i)=>{const c=registrations.filter(r=>r.eventName===ev.name).length;return <div key={i} className="glass" style={{padding:'10px 20px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'8px',fontSize:'0.88rem'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#818cf8'}}/><span style={{color:'#fff'}}>{ev.name}</span><span style={{fontSize:'0.72rem',color:'#c084fc',fontWeight:600}}>📆 {fmt(ev.date)}</span><span style={{fontSize:'0.72rem',color:'#6b7280',fontWeight:600}}>{c} reg{c!==1?'s':''}</span></div>})}</div>
                    </div>}

                    {activePage==='add-events'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Add New Event</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Create exciting events for students to discover and join.</p></div>
                        <div className="glass-strong" style={{borderRadius:'16px',padding:'40px',textAlign:'center',marginBottom:'36px'}}>
                            <div style={{fontSize:'3rem',marginBottom:'16px'}}>✨</div>
                            <h3 style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',marginBottom:'8px'}}>Create Event</h3>
                            <p style={{fontSize:'0.9rem',color:'#9ca3af',maxWidth:'450px',margin:'0 auto 24px'}}>Enter the event name and date below.</p>
                            <div style={{maxWidth:'520px',margin:'0 auto'}}>
                                <div style={{display:'flex',gap:'12px',marginBottom:'12px'}}>
                                    <input type="text" placeholder="Event name (e.g., Tech Fest 2026)" value={newEvent} onChange={e=>setNewEvent(e.target.value)} style={{...iS,flex:2}}/>
                                    <input type="date" value={newEventDate} onChange={e=>setNewEventDate(e.target.value)} style={{...iS,flex:1,colorScheme:'dark'}}/>
                                </div>
                                <button onClick={handleAddEvent} style={{width:'100%',padding:'12px',borderRadius:'12px',background:'linear-gradient(to right,#6366f1,#a855f7)',color:'#fff',fontWeight:600,fontSize:'0.9rem',border:'none',cursor:'pointer',fontFamily:'inherit',opacity:(!newEvent.trim()||!newEventDate)?0.5:1}}>+ Add Event</button>
                            </div>
                        </div>
                        <h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>📅 Current Events <span style={{fontSize:'0.75rem',padding:'3px 12px',borderRadius:'50px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#9ca3af',marginLeft:'8px'}}>{events.length}</span></h2>
                        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{events.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>No events yet.</div>:events.map((ev,i)=><div key={i} className="glass" style={{borderRadius:'16px',padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:'12px'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#818cf8'}}/><span style={{color:'#fff',fontWeight:600}}>{ev.name}</span></div><span style={{fontSize:'0.82rem',color:'#c084fc',fontWeight:600}}>📆 {fmt(ev.date)}</span></div>)}</div>
                    </div>}

                    {activePage==='manage-events'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Manage Events</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>View, manage, or remove existing events.</p></div>
                        {events.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>No events to manage.</div>:
                        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{events.map((ev,i)=>{const c=registrations.filter(r=>r.eventName===ev.name).length;return <div key={i} className="glass" style={{borderRadius:'16px',padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'14px'}}><span style={{fontSize:'1.4rem'}}>🎯</span><div><div style={{fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>{ev.name} {isExpired(ev.date)&&<span style={{fontSize:'0.7rem',padding:'2px 8px',borderRadius:'50px',background:'rgba(239,68,68,0.15)',color:'#f87171',fontWeight:700,marginLeft:'6px'}}>Expired</span>}</div><div style={{fontSize:'0.78rem',color:'#6b7280',marginTop:'2px'}}>📆 {fmt(ev.date)} · {c} registration{c!==1?'s':''}</div></div></div>
                            {confirmDelete===ev.name?<div style={{display:'flex',alignItems:'center',gap:'8px'}}><span style={{fontSize:'0.82rem',color:'#f87171',fontWeight:600}}>Delete?</span><button onClick={()=>handleRemoveEvent(ev.name)} style={{padding:'6px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Yes</button><button onClick={()=>setConfirmDelete(null)} style={{padding:'6px 16px',background:'transparent',color:'#9ca3af',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>No</button></div>
                            :<button onClick={()=>setConfirmDelete(ev.name)} style={{padding:'8px 18px',background:'transparent',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'12px',color:'#f87171',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>🗑️ Remove</button>}
                        </div>})}</div>}
                    </div>}

                    {activePage==='registrations'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Student Registrations</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>{registrations.length} total registration{registrations.length!==1?'s':''}.</p></div>
                        {registrations.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>No registrations yet.</div>:
                        <div className="glass" style={{borderRadius:'16px',overflow:'hidden',marginBottom:'36px'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.9rem'}}><thead><tr style={{background:'rgba(255,255,255,0.05)'}}>
                            {['#','Student','Event','Email','Phone'].map(h=><th key={h} style={{padding:'14px 20px',textAlign:'left',fontWeight:600,color:'#9ca3af',fontSize:'0.8rem',textTransform:'uppercase'}}>{h}</th>)}
                        </tr></thead><tbody>{registrations.map((r,i)=><tr key={i} style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                            <td style={{padding:'14px 20px',color:'#6b7280',fontWeight:600}}>{i+1}</td>
                            <td style={{padding:'14px 20px',color:'#fff',fontWeight:600}}>{r.studentName}</td>
                            <td style={{padding:'14px 20px'}}><span style={{padding:'3px 12px',borderRadius:'50px',fontSize:'0.8rem',fontWeight:600,background:'rgba(99,102,241,0.15)',color:'#818cf8'}}>{r.eventName}</span></td>
                            <td style={{padding:'14px 20px',color:'#d1d5db'}}>{r.email}</td>
                            <td style={{padding:'14px 20px',color:'#d1d5db'}}>{r.phone}</td>
                        </tr>)}</tbody></table></div>}
                        {registrations.length>0&&<div><h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>📊 Per-Event Breakdown</h2>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'16px'}}>{events.map((ev,i)=>{const c=registrations.filter(r=>r.eventName===ev.name).length;return <div key={i} className="glass" style={{borderRadius:'16px',padding:'24px 20px',textAlign:'center'}}><div style={{fontSize:'2rem',fontWeight:800,background:'linear-gradient(to right,#818cf8,#c084fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'6px'}}>{c}</div><div style={{fontSize:'0.82rem',color:'#fff',fontWeight:600}}>{ev.name}</div><div style={{fontSize:'0.72rem',color:'#9ca3af',marginTop:'2px'}}>📆 {fmt(ev.date)}</div></div>})}</div></div>}
                    </div>}

                    {activePage==='settings'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Settings</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Platform information and admin details.</p></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
                            {[{t:'📌 Platform Info',r:[['Platform','EventHub v1.0'],['Environment','Frontend Simulation'],['Framework','React 19 + Vite']]},{t:'👤 Admin Profile',r:[['Name',user?.name||'N/A'],['Email',user?.email||'N/A'],['Role',user?.role||'Admin']]},{t:'📈 Quick Stats',r:[['Total Events',events.length],['Total Registrations',registrations.length],['Total Users',registeredUsers?registeredUsers.length:0]]}].map((c,i)=>(
                                <div key={i} className="glass" style={{borderRadius:'16px',padding:'28px'}}><h3 style={{fontSize:'1.05rem',fontWeight:700,color:'#fff',marginBottom:'20px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{c.t}</h3>{c.r.map(([l,v],j)=><div key={j} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderTop:j>0?'1px solid rgba(255,255,255,0.03)':'none'}}><span style={{fontSize:'0.88rem',color:'#9ca3af'}}>{l}</span><span style={{fontSize:'0.88rem',color:'#fff',fontWeight:600}}>{v}</span></div>)}</div>
                            ))}
                        </div>
                    </div>}
                </div>
            </main>
        </div>
    );
}
export default AdminDashboard;
